import { supabase } from "./supabase";

export const assertConfigured = () => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }
};

const unwrap = ({ data, error }) => {
  if (error) {
    throw error;
  }

  return data;
};

async function getCurrentUser() {
  assertConfigured();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("You must be signed in.");
  }

  return user;
}

async function syncProject(projectId) {
  if (!projectId) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "sync_project_lifecycle",
    {
      p_project_id: projectId,
    }
  );

  if (error) {
    console.warn(
      "Project lifecycle sync failed:",
      error.message
    );

    return null;
  }

  const {
    error: replacementError,
  } = await supabase.rpc(
    "recalculate_project_replacement_slots",
    {
      p_project_id: projectId,
    }
  );

  if (replacementError) {
    console.warn(
      "Replacement slot sync failed:",
      replacementError.message
    );
  }

  return data;
}

export async function getMyProfile() {
  assertConfigured();

  return unwrap(
    await supabase
      .from("profiles")
      .select("*")
      .single()
  );
}

export async function listProjects() {
  assertConfigured();

  const projects = unwrap(
    await supabase
      .from("projects")
      .select(`
        *,
        plans(
          id,
          name,
          price_inr,
          tester_count,
          required_completions,
          duration_days,
          replacement_window_days,
          reward_inr,
          reward_requires_feedback
        ),
        assignments(count),
        checkins(count),
        bug_reports(count)
      `)
      .order("created_at", {
        ascending: false,
      })
  );

  await Promise.all(
    projects
      .filter((project) =>
        [
          "recruiting",
          "scheduled",
          "active",
          "completion_review",
        ].includes(project.status)
      )
      .map((project) =>
        syncProject(project.id)
      )
  );

  return unwrap(
    await supabase
      .from("projects")
      .select(`
        *,
        plans(
          id,
          name,
          price_inr,
          tester_count,
          required_completions,
          duration_days,
          replacement_window_days,
          reward_inr,
          reward_requires_feedback
        ),
        assignments(count),
        checkins(count),
        bug_reports(count)
      `)
      .order("created_at", {
        ascending: false,
      })
  );
}

export async function getProject(id) {
  assertConfigured();

  await syncProject(id);

  const project = unwrap(
    await supabase
      .from("projects")
      .select(`
        *,
        plans(*),
        assignments(
          *,
          tester:profiles!assignments_tester_id_fkey(
            id,
            full_name,
            email,
            device_model,
            android_version,
            country,
            reliability_score
          )
        ),
        checkins(*),
        bug_reports(*),
        feedback(*)
      `)
      .eq("id", id)
      .single()
  );

  if (Array.isArray(project.checkins)) {
    project.checkins.sort((first, second) => {
      const dayDifference =
        Number(second.day_number || 0) -
        Number(first.day_number || 0);

      if (dayDifference !== 0) {
        return dayDifference;
      }

      return (
        new Date(second.created_at || 0).getTime() -
        new Date(first.created_at || 0).getTime()
      );
    });
  }

  return project;
}

export async function createProject(payload) {
  const user = await getCurrentUser();

  return unwrap(
    await supabase
      .from("projects")
      .insert({
        ...payload,
        developer_id: user.id,
        status: "pending_payment",
        payment_status: "unpaid",
        current_day: 0,
      })
      .select()
      .single()
  );
}

export async function listPlans() {
  assertConfigured();

  return unwrap(
    await supabase
      .from("plans")
      .select("*")
      .eq("active", true)
      .order("sort_order")
  );
}

export async function listAvailableProjects() {
  assertConfigured();

  return unwrap(
    await supabase.rpc(
      "available_projects_for_tester"
    )
  );
}

export async function acceptProject(projectId) {
  assertConfigured();

  const assignmentId = unwrap(
    await supabase.rpc(
      "accept_testing_assignment",
      {
        p_project_id: projectId,
      }
    )
  );

  await syncProject(projectId);

  return assignmentId;
}

export async function listMyAssignments() {
  assertConfigured();

  const assignments = unwrap(
    await supabase
      .from("assignments")
      .select(`
  *,
  project:projects(
    *,
    plans(*)
  ),
  checkins(*),
  feedback(*)
`)
      .order("created_at", {
        ascending: false,
      })
  );

  const projectIds = [
    ...new Set(
      assignments
        .map((assignment) =>
          assignment.project?.id
        )
        .filter(Boolean)
    ),
  ];

  await Promise.all(
    projectIds.map(syncProject)
  );

  const refreshedAssignments = unwrap(
    await supabase
      .from("assignments")
      .select(`
  *,
  project:projects(
    *,
    plans(*)
  ),
  checkins(*),
  feedback(*)
`)
      .order("created_at", {
        ascending: false,
      })
  );

  return refreshedAssignments.map(
    (assignment) => ({
      ...assignment,

      checkins: Array.isArray(
        assignment.checkins
      )
        ? [...assignment.checkins].sort(
            (first, second) =>
              Number(
                first.day_number || 0
              ) -
              Number(
                second.day_number || 0
              )
          )
        : [],
    })
  );
}

export async function submitCheckin({
  assignmentId,
  projectId,
  dayNumber,
  notes,
  file,
}) {
  const user = await getCurrentUser();

  if (!file) {
    throw new Error(
      "Please select a screenshot."
    );
  }

  if (!notes?.trim()) {
    throw new Error(
      "Please describe what you tested."
    );
  }

  const safeFilename = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();

  const proofPath = [
    user.id,
    projectId,
    `day-${dayNumber}`,
    `${crypto.randomUUID()}-${safeFilename}`,
  ].join("/");

  const { error: uploadError } =
    await supabase.storage
      .from("testing-proofs")
      .upload(proofPath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType:
          file.type || undefined,
      });

  if (uploadError) {
    throw uploadError;
  }

  try {
    const checkin = unwrap(
      await supabase.rpc(
        "submit_or_resubmit_checkin",
        {
          p_assignment_id: assignmentId,
          p_project_id: projectId,
          p_day_number: dayNumber,
          p_notes: notes.trim(),
          p_proof_path: proofPath,
        }
      )
    );

    await syncProject(projectId);

    return checkin;
  } catch (error) {
    await supabase.storage
      .from("testing-proofs")
      .remove([proofPath]);

    throw error;
  }
}

export async function reportBug(payload) {
  const user = await getCurrentUser();

  return unwrap(
    await supabase
      .from("bug_reports")
      .insert({
        ...payload,
        reporter_id: user.id,
      })
      .select()
      .single()
  );
}

export async function submitFeedback(payload) {
  const user = await getCurrentUser();

  const feedback = unwrap(
    await supabase
      .from("feedback")
      .insert({
        ...payload,
        tester_id: user.id,
      })
      .select()
      .single()
  );

  return feedback;
}

export async function adminStats() {
  assertConfigured();

  return unwrap(
    await supabase.rpc(
      "admin_dashboard_stats"
    )
  );
}

export async function adminProjects() {
  assertConfigured();

  const projects = unwrap(
    await supabase
      .from("projects")
      .select(`
        *,
        developer:profiles!projects_developer_id_fkey(
          id,
          full_name,
          email
        ),
        plans(*),
        assignments(count),
        checkins(count)
      `)
      .order("created_at", {
        ascending: false,
      })
  );

  await Promise.all(
    projects
      .filter((project) =>
        [
          "recruiting",
          "scheduled",
          "active",
          "completion_review",
        ].includes(project.status)
      )
      .map((project) =>
        syncProject(project.id)
      )
  );

  return unwrap(
    await supabase
      .from("projects")
      .select(`
        *,
        developer:profiles!projects_developer_id_fkey(
          id,
          full_name,
          email
        ),
        plans(*),
        assignments(count),
        checkins(count)
      `)
      .order("created_at", {
        ascending: false,
      })
  );
}

export async function adminProjectAssignments(
  projectId
) {
  assertConfigured();

  return unwrap(
    await supabase
      .from("assignments")
      .select(`
        *,
        tester:profiles!assignments_tester_id_fkey(
          id,
          full_name,
          email,
          device_model,
          android_version,
          country,
          reliability_score
        )
      `)
      .eq("project_id", projectId)
      .order("created_at", {
        ascending: true,
      })
  );
}

export async function adminUsers() {
  assertConfigured();

  return unwrap(
    await supabase
      .from("profiles")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
  );
}

export async function updateProject(
  id,
  patch
) {
  assertConfigured();

  const project = unwrap(
    await supabase
      .from("projects")
      .update(patch)
      .eq("id", id)
      .select()
      .single()
  );

  await syncProject(id);

  return project;
}

export async function assignTester(
  projectId,
  testerId
) {
  assertConfigured();

  const assignment = unwrap(
    await supabase
      .from("assignments")
      .insert({
        project_id: projectId,
        tester_id: testerId,
        status: "waiting_for_start",
      })
      .select()
      .single()
  );

  await syncProject(projectId);

  return assignment;
}

export async function adminPendingCheckins() {
  assertConfigured();

  const checkins = unwrap(
    await supabase
      .from("checkins")
      .select(`
        id,
        assignment_id,
        project_id,
        tester_id,
        day_number,
        notes,
        proof_path,
        status,
        created_at,
        submission_date,
        rejection_count,
        review_note,
        reviewed_at
      `)
      .eq("status", "pending")
      .order("created_at", {
        ascending: true,
      })
  );

  if (!checkins.length) {
    return [];
  }

  const projectIds = [
    ...new Set(
      checkins
        .map((checkin) =>
          checkin.project_id
        )
        .filter(Boolean)
    ),
  ];

  const testerIds = [
    ...new Set(
      checkins
        .map((checkin) =>
          checkin.tester_id
        )
        .filter(Boolean)
    ),
  ];

  let projects = [];
  let testers = [];

  if (projectIds.length) {
    projects = unwrap(
      await supabase
        .from("projects")
        .select(`
          id,
          app_name,
          package_name,
          developer_id,
          current_day,
          duration_days,
          status,
          scheduled_start_date,
          testing_end_date,
          recruitment_target,
          required_completions,
          recruited_tester_count,
          completed_tester_count
        `)
        .in("id", projectIds)
    );
  }

  if (testerIds.length) {
    testers = unwrap(
      await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          device_model,
          android_version,
          country,
          reliability_score
        `)
        .in("id", testerIds)
    );
  }

  const projectMap = new Map(
    projects.map((project) => [
      project.id,
      project,
    ])
  );

  const testerMap = new Map(
    testers.map((tester) => [
      tester.id,
      tester,
    ])
  );

  return checkins.map((checkin) => ({
    ...checkin,

    project:
      projectMap.get(
        checkin.project_id
      ) || null,

    tester:
      testerMap.get(
        checkin.tester_id
      ) || null,
  }));
}

export async function adminReviewCheckin({
  checkinId,
  status,
  reviewNote = "",
}) {
  assertConfigured();

  if (
    !["approved", "rejected"].includes(
      status
    )
  ) {
    throw new Error(
      "Invalid review status."
    );
  }

  const checkin = unwrap(
    await supabase.rpc(
      "admin_review_checkin",
      {
        p_checkin_id: checkinId,
        p_status: status,
        p_review_note: reviewNote,
      }
    )
  );

  if (checkin?.project_id) {
    await syncProject(
      checkin.project_id
    );
  }

  return checkin;
}

export async function adminRemoveAssignment({
  assignmentId,
  reason,
  failed = true,
}) {
  assertConfigured();

  if (!reason?.trim()) {
    throw new Error(
      "Please enter a reason."
    );
  }

  const assignment = unwrap(
    await supabase.rpc(
      "admin_remove_assignment",
      {
        p_assignment_id:
          assignmentId,
        p_reason: reason.trim(),
        p_failed: failed,
      }
    )
  );

  if (assignment?.project_id) {
    await syncProject(
      assignment.project_id
    );
  }

  return assignment;
}

export async function adminCompleteProject(
  projectId
) {
  assertConfigured();

  return unwrap(
    await supabase.rpc(
      "admin_complete_project",
      {
        p_project_id: projectId,
      }
    )
  );
}


export async function adminRewards() {
  assertConfigured();

  const assignments = unwrap(
    await supabase
      .from("assignments")
      .select(`
        *,
        tester:profiles!assignments_tester_id_fkey(
          id,
          full_name,
          email,
          device_model,
          android_version,
          country,
          reliability_score
        ),
        project:projects(
          id,
          app_name,
          package_name,
          status,
          duration_days,
          required_completions,
          completed_tester_count
        )
      `)
      .in("reward_status", [
        "eligible",
        "approved_for_payment",
        "paid",
        "cancelled",
      ])
      .order("reward_eligible_at", {
        ascending: false,
        nullsFirst: false,
      })
  );

  const testerIds = [
    ...new Set(
      assignments
        .map(
          (assignment) =>
            assignment.tester_id
        )
        .filter(Boolean)
    ),
  ];

  let payoutMethods = [];

  if (testerIds.length) {
    payoutMethods = unwrap(
      await supabase
        .from(
          "tester_payout_methods"
        )
        .select(`
          user_id,
          payout_type,
          upi_id,
          account_name,
          updated_at
        `)
        .in("user_id", testerIds)
    );
  }

  const payoutMap =
    new Map(
      payoutMethods.map(
        (payout) => [
          payout.user_id,
          payout,
        ]
      )
    );

  return assignments.map(
    (assignment) => ({
      ...assignment,

      payout_method:
        payoutMap.get(
          assignment.tester_id
        ) || null,
    })
  );
}

export async function adminRewardStats() {
  assertConfigured();

  return unwrap(
    await supabase.rpc(
      "admin_reward_stats"
    )
  );
}

export async function adminApproveReward(
  assignmentId
) {
  assertConfigured();

  return unwrap(
    await supabase.rpc(
      "admin_approve_reward",
      {
        p_assignment_id:
          assignmentId,
      }
    )
  );
}

export async function adminMarkRewardPaid({
  assignmentId,
  paymentReference,
}) {
  assertConfigured();

  if (!paymentReference?.trim()) {
    throw new Error(
      "Please enter the payment reference."
    );
  }

  return unwrap(
    await supabase.rpc(
      "admin_mark_reward_paid",
      {
        p_assignment_id:
          assignmentId,

        p_payment_reference:
          paymentReference.trim(),
      }
    )
  );
}

export async function adminCancelReward({
  assignmentId,
  reason,
}) {
  assertConfigured();

  if (!reason?.trim()) {
    throw new Error(
      "Please enter a cancellation reason."
    );
  }

  return unwrap(
    await supabase.rpc(
      "admin_cancel_reward",
      {
        p_assignment_id:
          assignmentId,
        p_reason: reason.trim(),
      }
    )
  );
}



export async function getProofSignedUrl(
  proofPath
) {
  assertConfigured();

  if (!proofPath) {
    throw new Error(
      "This check-in does not contain screenshot proof."
    );
  }

  const { data, error } =
    await supabase.storage
      .from("testing-proofs")
      .createSignedUrl(
        proofPath,
        600
      );

  if (error) {
    throw error;
  }

  if (!data?.signedUrl) {
    throw new Error(
      "Could not create a secure proof link."
    );
  }

  return data.signedUrl;
}

// =========================================================
// PAYMENT GATEWAYS
// =========================================================

async function invokeEdgeFunction(
  functionName,
  body
) {
  assertConfigured();

  const maximumAttempts = 3;

  const wait = (milliseconds) =>
    new Promise((resolve) =>
      setTimeout(resolve, milliseconds)
    );

  const isTemporaryConnectionError = ({
    error,
    status,
  }) => {
        const errorMessage =
      String(
        error?.message || ""
      ).toLowerCase();

    /*
     * Supabase can occasionally return this
     * temporary gateway response even though
     * the deployed function exists. It is safe
     * to retry this exact connection error.
     */
    if (
      errorMessage.includes(
        "requested function was not found"
      )
    ) {
      return true;
    }

    /*
     * Other HTTP validation and authentication
     * errors are real server responses.
     * They must not be retried.
     */
    if (
      Number.isFinite(status) &&
      status >= 400 &&
      status < 500
    ) {
      return false;
    }
    /*
     * Temporary server or gateway failures
     * may succeed on another attempt.
     */
    if (
      [502, 503, 504].includes(status)
    ) {
      return true;
    }

    const errorName =
      String(
        error?.name || ""
      ).toLowerCase();

    

    return (
      errorName.includes(
        "functionsfetcherror"
      ) ||
      errorName.includes(
        "aborterror"
      ) ||
      errorMessage.includes(
        "failed to send a request to the edge function"
      ) ||
      errorMessage.includes(
        "failed to fetch"
      ) ||
      errorMessage.includes(
        "fetch failed"
      ) ||
      errorMessage.includes(
        "networkerror"
      ) ||
      errorMessage.includes(
        "network error"
      ) ||
      errorMessage.includes(
        "load failed"
      ) ||
      errorMessage.includes(
        "connection"
      ) ||
      errorMessage.includes(
        "timeout"
      ) ||
      errorMessage.includes(
        "timed out"
      )
    );
  };

  let lastTemporaryError = null;

  for (
    let attempt = 1;
    attempt <= maximumAttempts;
    attempt += 1
  ) {
    const {
      data,
      error,
    } =
      await supabase.functions.invoke(
        functionName,
        {
          body,
        }
      );

    if (!error) {
      /*
       * An error returned inside valid
       * function data is a real application
       * or validation error. Do not retry it.
       */
      if (data?.error) {
        throw new Error(
          data.error
        );
      }

      return data;
    }

    let message =
      error.message ||
      "The payment request failed.";

    let status =
      error.context?.status ||
      error.status ||
      null;

    try {
      const errorBody =
        await error.context?.json();

      if (errorBody?.error) {
        message =
          errorBody.error;
      } else if (
        errorBody?.message
      ) {
        message =
          errorBody.message;
      }

      status =
        error.context?.status ||
        errorBody?.status ||
        status;
    } catch {
      /*
       * Connection failures often do not
       * contain a readable JSON response.
       */
    }

    const shouldRetry =
      isTemporaryConnectionError({
        error,
        status:
          status === null
            ? null
            : Number(status),
      });

    /*
     * Unauthorized, invalid project,
     * already-paid, amount mismatch and
     * other real Edge Function responses
     * reach this branch without retrying.
     */
    if (!shouldRetry) {
      throw new Error(message);
    }

    lastTemporaryError =
      error;

    if (
      attempt < maximumAttempts
    ) {
      const retryDelay =
        attempt === 1
          ? 800
          : 1600;

      await wait(retryDelay);
    }
  }

  console.error(
    `Edge Function "${functionName}" could not be reached after ${maximumAttempts} attempts.`,
    lastTemporaryError
  );

  throw new Error(
    "We could not connect to the secure payment service. Please check your connection and try again."
  );
}


// =========================================================
// RAZORPAY
// =========================================================

export async function invokePayment(
  projectId,
  planId
) {
  return invokeEdgeFunction(
    "create-razorpay-order",
    {
      projectId,
      planId,
    }
  );
}


export async function verifyPayment(
  body
) {
  return invokeEdgeFunction(
    "verify-razorpay-payment",
    body
  );
}


// =========================================================
// CASHFREE
// =========================================================

export async function createCashfreeOrder(
  projectId
) {
  if (!projectId) {
    throw new Error(
      "Project ID is required."
    );
  }

  return invokeEdgeFunction(
    "create-cashfree-order",
    {
      projectId,
    }
  );
}


export async function verifyCashfreePayment({
  projectId,
  orderId,
}) {
  if (!projectId) {
    throw new Error(
      "Project ID is required."
    );
  }

  if (!orderId) {
    throw new Error(
      "Cashfree order ID is required."
    );
  }

  return invokeEdgeFunction(
    "verify-cashfree-payment",
    {
      projectId,
      orderId,
    }
  );
}

export async function enableTesterWorkspace({
  deviceModel,
  androidVersion,
  country,
}) {
  assertConfigured();

  return unwrap(
    await supabase.rpc(
      "enable_tester_workspace",
      {
        p_device_model:
          deviceModel,
        p_android_version:
          androidVersion,
        p_country: country,
      }
    )
  );
}

export async function enableDeveloperWorkspace() {
  assertConfigured();

  return unwrap(
    await supabase.rpc(
      "enable_developer_workspace"
    )
  );
}

export async function setPreferredWorkspace(
  workspace
) {
  assertConfigured();

  return unwrap(
    await supabase.rpc(
      "set_preferred_workspace",
      {
        p_workspace: workspace,
      }
    )
  );
}

// =========================================================
// SHIPYARD NOTIFICATIONS
// =========================================================

export async function listNotifications({
  limit = 50,
  unreadOnly = false,
} = {}) {
  assertConfigured();

  let query = supabase
    .from("notifications")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);

  if (unreadOnly) {
    query = query.is(
      "read_at",
      null
    );
  }

  return unwrap(
    await query
  );
}


export async function getNotificationSummary() {
  assertConfigured();

  return unwrap(
    await supabase.rpc(
      "notification_summary"
    )
  );
}


export async function markNotificationRead(
  notificationId
) {
  assertConfigured();

  return unwrap(
    await supabase.rpc(
      "mark_notification_read",
      {
        p_notification_id:
          notificationId,
      }
    )
  );
}


export async function markAllNotificationsRead() {
  assertConfigured();

  return unwrap(
    await supabase.rpc(
      "mark_all_notifications_read"
    )
  );
}


export function subscribeToNotifications(
  onChange
) {
  assertConfigured();

  const channel = supabase
    .channel(
      `shipyard-notifications-${crypto.randomUUID()}`
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
      },
      (payload) => {
        onChange?.(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(
      channel
    );
  };
}


// =========================================================
// ADMIN OPERATIONAL ALERTS
// =========================================================

export async function adminOperationalAlerts() {
  assertConfigured();

  const [
    atRiskResult,
    rejectedResult,
    projectsResult,
    rewardsResult,
  ] = await Promise.all([
    // -----------------------------------------------------
    // AT-RISK TESTERS
    // assignments does not contain updated_at,
    // so created_at is used for ordering.
    // -----------------------------------------------------
    supabase
      .from("assignments")
      .select(`
        id,
        project_id,
        tester_id,
        status,
        failure_reason,
        last_approved_day,
        testing_start_date,
        testing_end_date,
        created_at,
        tester:profiles!assignments_tester_id_fkey(
          id,
          full_name,
          email,
          device_model,
          reliability_score
        ),
        project:projects(
          id,
          app_name,
          package_name,
          current_day,
          duration_days,
          scheduled_start_date,
          testing_end_date,
          status
        )
      `)
      .eq("status", "at_risk")
      .order("created_at", {
        ascending: false,
      }),

    // -----------------------------------------------------
    // REJECTED EVIDENCE WAITING FOR RESUBMISSION
    // -----------------------------------------------------
    supabase
      .from("checkins")
      .select(`
        id,
        assignment_id,
        project_id,
        tester_id,
        day_number,
        status,
        review_note,
        rejection_count,
        reviewed_at,
        created_at
      `)
      .eq("status", "rejected")
      .order("reviewed_at", {
        ascending: true,
        nullsFirst: false,
      }),

    // -----------------------------------------------------
    // REPLACEMENT AND COMPLETION-REVIEW PROJECTS
    // -----------------------------------------------------
    supabase
      .from("projects")
      .select(`
        id,
        app_name,
        package_name,
        status,
        current_day,
        duration_days,
        replacement_slots_open,
        completed_tester_count,
        required_completions,
        testing_end_date,
        updated_at,
        developer:profiles!projects_developer_id_fkey(
          id,
          full_name,
          email
        )
      `)
      .or(
        "status.eq.completion_review,replacement_slots_open.gt.0"
      )
      .order("updated_at", {
        ascending: false,
      }),

    // -----------------------------------------------------
    // REWARDS THAT NEED APPROVAL OR PAYMENT
    // -----------------------------------------------------
    supabase
  .from("assignments")
  .select(`
    id,
    reward_inr,
    reward_status,
    reward_eligible_at,
    created_at,
    tester:profiles!assignments_tester_id_fkey(
      id,
      full_name,
      email
    ),
    project:projects(
      id,
      app_name,
      package_name
    )
  `)
  .in("reward_status", [
    "eligible",
    "approved_for_payment",
  ])
  .order("reward_eligible_at", {
    ascending: true,
    nullsFirst: false,
  }),
  ]);

  const results = [
    atRiskResult,
    rejectedResult,
    projectsResult,
    rewardsResult,
  ];

  const failedResult =
    results.find(
      (result) => result.error
    );

  if (failedResult?.error) {
    throw failedResult.error;
  }

  const atRiskAssignments =
    Array.isArray(
      atRiskResult.data
    )
      ? atRiskResult.data
      : [];

  const rejectedCheckins =
    Array.isArray(
      rejectedResult.data
    )
      ? rejectedResult.data
      : [];

  const projects =
    Array.isArray(
      projectsResult.data
    )
      ? projectsResult.data
      : [];

  const rewardAssignments =
    Array.isArray(
      rewardsResult.data
    )
      ? rewardsResult.data
      : [];

  const rejectedAssignmentIds = [
    ...new Set(
      rejectedCheckins
        .map(
          (checkin) =>
            checkin.assignment_id
        )
        .filter(Boolean)
    ),
  ];

  let rejectedAssignments = [];

  if (
    rejectedAssignmentIds.length
  ) {
    rejectedAssignments = unwrap(
      await supabase
        .from("assignments")
        .select(`
          id,
          project_id,
          tester_id,
          status,
          tester:profiles!assignments_tester_id_fkey(
            id,
            full_name,
            email,
            device_model,
            reliability_score
          ),
          project:projects(
            id,
            app_name,
            package_name,
            status
          )
        `)
        .in(
          "id",
          rejectedAssignmentIds
        )
    );
  }

  const assignmentMap =
    new Map(
      rejectedAssignments.map(
        (assignment) => [
          assignment.id,
          assignment,
        ]
      )
    );

  const rejectedEvidence =
    rejectedCheckins.map(
      (checkin) => ({
        ...checkin,

        assignment:
          assignmentMap.get(
            checkin.assignment_id
          ) || null,
      })
    );

  const replacementProjects =
    projects.filter(
      (project) =>
        Number(
          project.replacement_slots_open ||
            0
        ) > 0
    );

  const completionReviewProjects =
    projects.filter(
      (project) =>
        project.status ===
        "completion_review"
    );

  const eligibleRewards =
    rewardAssignments.filter(
      (assignment) =>
        assignment.reward_status ===
        "eligible"
    );

  const approvedRewards =
    rewardAssignments.filter(
      (assignment) =>
        assignment.reward_status ===
        "approved_for_payment"
    );

  return {
    atRiskAssignments,
    rejectedEvidence,
    replacementProjects,
    completionReviewProjects,
    eligibleRewards,
    approvedRewards,

    counts: {
      atRisk:
        atRiskAssignments.length,

      rejected:
        rejectedEvidence.length,

      replacement:
        replacementProjects.length,

      completionReview:
        completionReviewProjects.length,

      rewardApproval:
        eligibleRewards.length,

      rewardPayment:
        approvedRewards.length,

      total:
        atRiskAssignments.length +
        rejectedEvidence.length +
        replacementProjects.length +
        completionReviewProjects.length +
        eligibleRewards.length +
        approvedRewards.length,
    },
  };
}






// =========================================================
// TESTER PAYOUT DETAILS
// =========================================================

export async function getMyPayoutMethod() {
  assertConfigured();

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_my_payout_method"
  );

  if (error) {
    throw error;
  }

  return data || null;
}


export async function saveMyPayoutMethod({
  upiId,
  accountName,
}) {
  assertConfigured();

  return unwrap(
    await supabase.rpc(
      "save_my_payout_method",
      {
        p_upi_id:
          upiId?.trim() || "",

        p_account_name:
          accountName?.trim() ||
          null,
      }
    )
  );
}


export async function deleteMyPayoutMethod() {
  assertConfigured();

  return unwrap(
    await supabase.rpc(
      "delete_my_payout_method"
    )
  );
}



// =========================================================
// ADMIN TESTER PAYOUT DIRECTORY
// =========================================================

export async function adminPayoutDirectory() {
  assertConfigured();

  const payoutMethods = unwrap(
    await supabase
      .from(
        "tester_payout_methods"
      )
      .select(`
        user_id,
        payout_type,
        upi_id,
        account_name,
        created_at,
        updated_at
      `)
      .order("updated_at", {
        ascending: false,
      })
  );

  if (!payoutMethods.length) {
    return [];
  }

  const testerIds = [
    ...new Set(
      payoutMethods
        .map(
          (payout) =>
            payout.user_id
        )
        .filter(Boolean)
    ),
  ];

  let testers = [];

  if (testerIds.length) {
    testers = unwrap(
      await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          device_model,
          android_version,
          country,
          reliability_score,
          is_tester
        `)
        .in("id", testerIds)
    );
  }

  const testerMap =
    new Map(
      testers.map(
        (tester) => [
          tester.id,
          tester,
        ]
      )
    );

  return payoutMethods.map(
    (payout) => ({
      ...payout,

      tester:
        testerMap.get(
          payout.user_id
        ) || null,
    })
  );
}