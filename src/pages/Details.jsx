import {
  load,
} from "@cashfreepayments/cashfree-js";



import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  Badge,
  Card,
  DashboardLayout,
  Empty,
  PageHead,
} from "../components/UI";

import {
  createCashfreeOrder,
  getProject,
  listMyAssignments,
  reportBug,
  submitCheckin,
  submitFeedback,
  verifyCashfreePayment,
} from "../lib/api";



function getDuration(project) {
  return (
    project?.duration_days ||
    project?.plans?.duration_days ||
    14
  );
}

function formatDate(value) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
    }
  ).format(new Date(`${value}T00:00:00`));
}

function getTodayDateString() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(dateString, days) {
  if (!dateString) {
    return null;
  }

  const date = new Date(
    `${dateString}T00:00:00`
  );

  date.setDate(
    date.getDate() + days
  );

  return date
    .toISOString()
    .slice(0, 10);
}

function getApprovedDays(checkins) {
  return new Set(
    (checkins || [])
      .filter(
        (checkin) =>
          checkin.status ===
          "approved"
      )
      .map((checkin) =>
        Number(
          checkin.day_number || 0
        )
      )
      .filter(
        (dayNumber) =>
          dayNumber > 0
      )
  );
}

function getContiguousApprovedDay(
  checkins,
  durationDays
) {
  const approvedDays =
    getApprovedDays(checkins);

  let day = 0;

  while (
    day < durationDays &&
    approvedDays.has(day + 1)
  ) {
    day += 1;
  }

  return day;
}

function statusTone(status) {
  if (
    ["approved", "active", "completed", "paid"].includes(
      status
    )
  ) {
    return "green";
  }

  if (
    [
      "scheduled",
      "waiting_for_start",
      "eligible",
      "approved_for_payment",
      "completion_review",
    ].includes(status)
  ) {
    return "purple";
  }

  if (
    [
      "rejected",
      "at_risk",
      "failed",
      "removed",
      "cancelled",
    ].includes(status)
  ) {
    return "red";
  }

  return "default";
}



function AppIcon({
  project,
  large = false,
}) {
  const [imageFailed, setImageFailed] =
    useState(false);

  const className =
    large
      ? "app-icon large"
      : "app-icon";

  if (
    project?.app_logo_url &&
    !imageFailed
  ) {
    return (
      <div className={className}>
        <img
          src={project.app_logo_url}
          alt={`${project.app_name || "App"} logo`}
          loading="lazy"
          onError={() =>
            setImageFailed(true)
          }
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {project?.app_name?.[0]
        ?.toUpperCase() ||
        "A"}
    </div>
  );
}




export function ProjectDetail() {
  const { id } = useParams();

  const [project, setProject] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

    const [
  paymentLoading,
  setPaymentLoading,
] = useState(false);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getProject(id);

      setProject(data);
    } catch (err) {
      setError(
        err.message ||
          "Could not load this project."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);


  useEffect(() => {
  let cancelled = false;

  const wait = (milliseconds) =>
    new Promise((resolve) =>
      setTimeout(resolve, milliseconds)
    );

  const verifyCashfreeReturn =
    async () => {
      const params =
        new URLSearchParams(
          window.location.search
        );

      const isCashfreeReturn =
        params.get(
          "cashfree_return"
        ) === "true";

      if (!isCashfreeReturn) {
        return;
      }

      const returnedOrderId =
        params.get("order_id");

      const savedOrderId =
        sessionStorage.getItem(
          `shipyard_cashfree_${id}`
        );

      const orderId =
        returnedOrderId ||
        savedOrderId;

      if (!orderId) {
        setError(
          "Cashfree returned without an order ID. Please refresh the project before attempting another payment."
        );

        return;
      }

      try {
        setPaymentLoading(true);
        setMessage(
          "Confirming your Cashfree payment securely…"
        );
        setError("");

        let verified = false;
        let finalError = null;

        /*
         * Verification is safe to retry because
         * it only checks the existing Cashfree
         * order and does not create a new charge.
         */
        for (
          let attempt = 1;
          attempt <= 3;
          attempt += 1
        ) {
          try {
            const result =
              await verifyCashfreePayment({
                projectId: id,
                orderId,
              });

            if (
              result?.paid ||
              result?.alreadyPaid
            ) {
              verified = true;
              break;
            }
          } catch (error) {
            finalError = error;

            if (attempt < 3) {
              await wait(2000);
            }
          }
        }

        if (!verified) {
          /*
           * The webhook may have completed the
           * payment even when the browser request
           * failed, so reload the project before
           * showing an error.
           */
          const refreshedProject =
            await getProject(id);

          if (cancelled) {
            return;
          }

          setProject(
            refreshedProject
          );

          if (
            refreshedProject
              ?.payment_status ===
            "paid"
          ) {
            verified = true;
          }
        }

        if (verified) {
          sessionStorage.removeItem(
            `shipyard_cashfree_${id}`
          );

          setError("");

          setMessage(
            "Cashfree payment verified successfully. Tester recruitment can now begin."
          );

          await loadProject();

          return;
        }

        throw (
          finalError ||
          new Error(
            "Your payment confirmation is still being processed."
          )
        );
      } catch (error) {
        setMessage("");

        setError(
          "We could not confirm the payment from this browser yet. Do not pay again. Refresh this project after a few seconds while Cashfree's webhook completes verification."
        );
      } finally {
        if (!cancelled) {
          setPaymentLoading(false);
        }

        window.history.replaceState(
          {},
          "",
          `/projects/${id}`
        );
      }
    };

  verifyCashfreeReturn();

  return () => {
    cancelled = true;
  };
}, [id]);





 



const handleCashfreePayment =
  async () => {
    if (paymentLoading) {
      return;
    }

    try {
      setPaymentLoading(true);
      setMessage("");
      setError("");

      /*
       * Never immediately create another
       * Cashfree order when this project
       * already has one awaiting confirmation.
       */
      if (
        project.payment_provider ===
          "cashfree" &&
        project.provider_order_id &&
        project.payment_status ===
          "pending"
      ) {
        setMessage(
          "Checking your previous Cashfree payment before creating another order…"
        );

        try {
          const result =
            await verifyCashfreePayment({
              projectId:
                project.id,

              orderId:
                project.provider_order_id,
            });

          if (
            result?.paid ||
            result?.alreadyPaid
          ) {
            setMessage(
              "Cashfree payment verified successfully. Tester recruitment can now begin."
            );

            await loadProject();
            return;
          }
        } catch {
          /*
           * The previous order is not paid.
           * It is safe to continue with a
           * fresh Cashfree checkout.
           */
        }

        setMessage("");
      }

           const order =
        await createCashfreeOrder(
          project.id
        );

        
      if (
        !order?.paymentSessionId ||
        !order?.orderId
      ) {
        throw new Error(
          "Shipyard could not prepare the Cashfree payment."
        );
      }

      const cashfree =
        await load({
          mode:
            order.environment ===
            "production"
              ? "production"
              : "sandbox",
        });

      if (!cashfree) {
        throw new Error(
          "Cashfree Checkout could not be loaded."
        );
      }

      sessionStorage.setItem(
        `shipyard_cashfree_${project.id}`,
        order.orderId
      );

      await cashfree.checkout({
        paymentSessionId:
          order.paymentSessionId,

        redirectTarget:
          "_self",
      });
    } catch (error) {
      setPaymentLoading(false);

      setError(
        error.message ||
          "Cashfree payment could not be started. Please try again."
      );
    }
  };





  const metrics = useMemo(() => {
    if (!project) {
      return null;
    }

    const assignments =
      Array.isArray(
        project.assignments
      )
        ? project.assignments
        : [];

    const checkins =
      Array.isArray(project.checkins)
        ? project.checkins
        : [];

    const durationDays =
      getDuration(project);

    const testerProgress =
      assignments.map(
        (assignment) => {
          const testerCheckins =
            checkins.filter(
              (checkin) =>
                checkin.assignment_id ===
                assignment.id
            );

          const approvedDays =
            getContiguousApprovedDay(
              testerCheckins,
              durationDays
            );

          return {
            assignment,
            approvedDays,

            percent:
              durationDays > 0
                ? Math.min(
                    100,
                    Math.round(
                      (approvedDays /
                        durationDays) *
                        100
                    )
                  )
                : 0,

            pending:
              testerCheckins.filter(
                (checkin) =>
                  checkin.status ===
                  "pending"
              ).length,

            rejected:
              testerCheckins.filter(
                (checkin) =>
                  checkin.status ===
                  "rejected"
              ).length,
          };
        }
      );

    return {
      assignments,
      checkins,
      durationDays,
      testerProgress,

      recruited:
        Number(
          project.recruited_tester_count
        ) ||
        assignments.filter(
          (assignment) =>
            ![
              "removed",
              "failed",
            ].includes(
              assignment.status
            )
        ).length,

      recruitmentTarget:
        Number(
          project.recruitment_target ||
            project.plans
              ?.tester_count ||
            0
        ),

      completed:
        Number(
          project.completed_tester_count
        ) ||
        assignments.filter(
          (assignment) =>
            assignment.status ===
            "completed"
        ).length,

      required:
        Number(
          project.required_completions ||
            project.plans
              ?.required_completions ||
            0
        ),

      approved:
        checkins.filter(
          (checkin) =>
            checkin.status ===
            "approved"
        ).length,

      pending:
        checkins.filter(
          (checkin) =>
            checkin.status ===
            "pending"
        ).length,

      rejected:
        checkins.filter(
          (checkin) =>
            checkin.status ===
            "rejected"
        ).length,

      atRisk:
        assignments.filter(
          (assignment) =>
            assignment.status ===
            "at_risk"
        ).length,
    };
  }, [project]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="full-loader">
          Loading project…
        </div>
      </DashboardLayout>
    );
  }

  if (!project || !metrics) {
    return (
      <DashboardLayout>
        <PageHead
          eyebrow="Release project"
          title="Project not found"
          description="This project is unavailable."
        />

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}
      </DashboardLayout>
    );
  }

  const plan =
    project.plans || {};

  const recruitmentPercent =
    metrics.recruitmentTarget > 0
      ? Math.min(
          100,
          Math.round(
            (metrics.recruited /
              metrics.recruitmentTarget) *
              100
          )
        )
      : 0;

  const completionPercent =
    metrics.required > 0
      ? Math.min(
          100,
          Math.round(
            (metrics.completed /
              metrics.required) *
              100
          )
        )
      : 0;

  return (
    <DashboardLayout>
      <PageHead
        eyebrow="Release project"
        title={project.app_name}
        description={
          project.package_name
        }
        action={
          <Badge
            tone={statusTone(
              project.status
            )}
          >
            {project.status.replaceAll(
              "_",
              " "
            )}
          </Badge>
        }
      />

      {message && (
        <div className="alert success">
          {message}
        </div>
      )}

      {error && (
  <div className="alert error">
    {error}
  </div>
)}

{project.payment_status !==
  "paid" && (
  <div className="project-payment-callout">
    <div className="project-payment-callout-icon">
      ₹
    </div>

    <div className="grow">
      <strong>
        Payment required to begin recruitment
      </strong>

      <p>
        Complete the secure payment for
        the {plan.name || "selected"}{" "}
        plan. Your project will move to
        recruitment immediately after
        server verification.
      </p>
    </div>

    <button
  type="button"
  className="button"
  disabled={paymentLoading}
  onClick={handleCashfreePayment}
>
  {paymentLoading
    ? "Opening secure checkout…"
    : `Pay ₹${
        plan.price_inr ?? ""
      } securely`}
</button>
  </div>
)}

<div className="detail-grid">

  <Card className="project-payment-card">
  <div className="payment-card-heading">
    <div>
      <small className="eyebrow">
        Selected plan
      </small>

      <h2>
        {plan.name ||
          "Testing plan"}
      </h2>
    </div>

    <Badge
      tone={
        project.payment_status ===
        "paid"
          ? "green"
          : "purple"
      }
    >
      {project.payment_status ===
      "paid"
        ? "Paid"
        : "Payment required"}
    </Badge>
  </div>

  <strong className="money">
    ₹{plan.price_inr ?? "—"}
  </strong>

  <p>
    Managed Android testing with
    verified daily participation.
  </p>

  <div className="schedule-list">
    <div>
      <span>
        Recruitment capacity
      </span>

      <strong>
        {metrics.recruitmentTarget}{" "}
        testers
      </strong>
    </div>

    <div>
      <span>
        Successful testers
      </span>

      <strong>
        {metrics.required}
      </strong>
    </div>

    <div>
      <span>
        Testing duration
      </span>

      <strong>
        {metrics.durationDays} days
      </strong>
    </div>

    <div>
      <span>
        Reward per tester
      </span>

      <strong>
        ₹
        {project.reward_per_tester ||
          plan.reward_inr ||
          0}
      </strong>
    </div>
  </div>

  {project.payment_status !==
  "paid" ? (
    <>
     <button
  type="button"
  className="button wide"
  disabled={paymentLoading}
  onClick={handleCashfreePayment}
>
  {paymentLoading
    ? "Opening secure checkout…"
    : `Pay ₹${
        plan.price_inr ?? ""
      } securely`}
</button>

<small className="payment-security-note">
  Secure payment powered by Cashfree.
  Recruitment begins only after
  secure server verification.
</small>
    </>
  ) : (
    <div className="payment-verified-panel">
      <Badge tone="green">
        Payment verified
      </Badge>

      <span>
        This release is cleared for
        tester recruitment.
      </span>
    </div>
  )}
</Card>

        <Card className="span2">
          <div className="card-head">
            <div>
              <h2>
                Recruitment progress
              </h2>

              <p>
                Testing starts after the
                selected plan reaches its
                recruitment target.
              </p>
            </div>

            <strong>
              {metrics.recruited}/
              {metrics.recruitmentTarget}
            </strong>
          </div>

          <div className="progress big">
            <b
              style={{
                width:
                  `${recruitmentPercent}%`,
              }}
            />
          </div>

          <div className="kpi-row">
            <div>
              <strong>
                {metrics.recruited}
              </strong>
              <span>Recruited</span>
            </div>

            <div>
              <strong>
                {metrics.recruitmentTarget}
              </strong>
              <span>Target</span>
            </div>

            <div>
              <strong>
                {Math.max(
                  metrics.recruitmentTarget -
                    metrics.recruited,
                  0
                )}
              </strong>
              <span>Open slots</span>
            </div>

            <div>
              <strong>
                {project.replacement_slots_open ||
                  0}
              </strong>
              <span>Replacement slots</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2>Schedule</h2>

          <div className="schedule-list">
            <div>
              <span>Testing start</span>
              <strong>
                {formatDate(
                  project.scheduled_start_date
                )}
              </strong>
            </div>

            <div>
              <span>Testing end</span>
              <strong>
                {formatDate(
                  project.testing_end_date
                )}
              </strong>
            </div>

            <div>
              <span>Calendar progress</span>
              <strong>
                Day{" "}
                {project.current_day ||
                  0}
                /{metrics.durationDays}
              </strong>
            </div>
          </div>
        </Card>

       

        <Card className="span2">
          <div className="card-head">
            <div>
              <h2>
                Successful completions
              </h2>

              <p>
                The project enters final
                review when enough testers
                complete every required day.
              </p>
            </div>

            <strong>
              {metrics.completed}/
              {metrics.required}
            </strong>
          </div>

          <div className="progress big">
            <b
              style={{
                width:
                  `${completionPercent}%`,
              }}
            />
          </div>

          <div className="kpi-row">
            <div>
              <strong>
                {metrics.approved}
              </strong>
              <span>Approved evidence</span>
            </div>

            <div>
              <strong>
                {metrics.pending}
              </strong>
              <span>Pending review</span>
            </div>

            <div>
              <strong>
                {metrics.rejected}
              </strong>
              <span>Rejected</span>
            </div>

            <div>
              <strong>
                {metrics.atRisk}
              </strong>
              <span>At risk</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2>Testing links</h2>

          <div className="link-stack">
            <a
              href={
                project.google_group_url
              }
              target="_blank"
              rel="noreferrer"
            >
              Google Group
            </a>

            <a
              href={
                project.android_opt_in_url
              }
              target="_blank"
              rel="noreferrer"
            >
              Android opt-in
            </a>

            <a
              href={
                project.web_opt_in_url
              }
              target="_blank"
              rel="noreferrer"
            >
              Web opt-in
            </a>
          </div>
        </Card>

        <Card className="span3">
          <div className="card-head">
            <div>
              <h2>Tester progress</h2>
              <p>
                Every tester follows their
                own approved calendar-day
                sequence.
              </p>
            </div>
          </div>

          {metrics.testerProgress.length ? (
            <div className="tester-progress-list">
              {metrics.testerProgress.map(
                ({
                  assignment,
                  approvedDays,
                  percent,
                  pending,
                  rejected,
                }) => (
                  <div
                    key={assignment.id}
                    className="tester-progress-row"
                  >
                    <div className="app-icon">
                      {assignment.tester
                        ?.full_name?.[0]
                        ?.toUpperCase() ||
                        "T"}
                    </div>

                    <div className="grow">
                      <strong>
                        {assignment.tester
                          ?.full_name ||
                          assignment.tester
                            ?.email ||
                          "Tester"}
                      </strong>

                      <small>
                        {assignment.tester
                          ?.device_model ||
                          "Device not added"}

                        {assignment.is_replacement
                          ? " · Replacement tester"
                          : ""}
                      </small>

                      <div className="progress compact-progress">
                        <b
                          style={{
                            width:
                              `${percent}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="tester-progress-meta">
                      <strong>
                        {approvedDays}/
                        {metrics.durationDays}
                      </strong>

                      <Badge
                        tone={statusTone(
                          assignment.status
                        )}
                      >
                        {assignment.status.replaceAll(
                          "_",
                          " "
                        )}
                      </Badge>

                      <small>
                        {pending
                          ? `${pending} pending`
                          : rejected
                            ? `${rejected} rejected`
                            : assignment.reward_status?.replaceAll(
                                "_",
                                " "
                              ) ||
                              "pending completion"}
                      </small>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <Empty
              title="No testers assigned"
              body="Tester progress appears after recruitment begins."
            />
          )}
        </Card>

        <Card className="span3">
          <h2>Recent evidence</h2>

          {metrics.checkins.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Tester</th>
                    <th>Notes</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {metrics.checkins
                    .slice(0, 40)
                    .map((checkin) => {
                      const assignment =
                        metrics.assignments.find(
                          (item) =>
                            item.id ===
                            checkin.assignment_id
                        );

                      return (
                        <tr key={checkin.id}>
                          <td>
                            Day{" "}
                            {checkin.day_number}
                          </td>

                          <td>
                            {assignment?.tester
                              ?.full_name ||
                              assignment?.tester
                                ?.email ||
                              "Tester"}
                          </td>

                          <td>
                            {checkin.notes ||
                              "No notes"}

                            {checkin.review_note && (
                              <small className="danger-text">
                                Review:{" "}
                                {
                                  checkin.review_note
                                }
                              </small>
                            )}
                          </td>

                          <td>
                            <Badge
                              tone={statusTone(
                                checkin.status
                              )}
                            >
                              {
                                checkin.status
                              }
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty
              title="No check-ins yet"
              body="Daily evidence will appear after testing starts."
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

export function Assignments() {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    listMyAssignments()
      .then((data) =>
        setItems(
          Array.isArray(data)
            ? data
            : []
        )
      )
      .catch((err) =>
        setError(
          err.message ||
            "Could not load assignments."
        )
      )
      .finally(() =>
        setLoading(false)
      );
  }, []);

  return (
    <DashboardLayout>
      <PageHead
        eyebrow="Testing deck"
        title="My assignments"
        description="Track start dates, daily approvals and reward status."
      />

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      <Card>
        {loading ? (
          <div className="full-loader inline-loader">
            Loading assignments…
          </div>
        ) : items.length ? (
          <div className="data-list">
            {items.map(
              (assignment) => (
                <Link
                  key={assignment.id}
                  to={`/assignments/${assignment.id}`}
                >
                  <AppIcon
  project={
    assignment.project
  }
/>

                  <div className="grow">
                    <strong>
                      {assignment.project
                        ?.app_name ||
                        "Unknown app"}
                    </strong>

                    <small>
                      {assignment.status ===
                      "waiting_for_start"
                        ? `Starts ${formatDate(
                            assignment.testing_start_date
                          )}`
                        : `${assignment.last_approved_day ||
                            0}/${getDuration(
                            assignment.project
                          )} approved days`}
                    </small>
                  </div>

                  <Badge
                    tone={statusTone(
                      assignment.status
                    )}
                  >
                    {assignment.status.replaceAll(
                      "_",
                      " "
                    )}
                  </Badge>
                </Link>
              )
            )}
          </div>
        ) : (
          <Empty
            title="No assignments yet"
            body="Accepted testing projects will appear here."
          />
        )}
      </Card>
    </DashboardLayout>
  );
}

export function AssignmentDetail() {
  const { id } = useParams();

  const [assignment, setAssignment] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [notes, setNotes] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [feedback, setFeedback] =
    useState({
      rating: "5",
      positives: "",
      improvements: "",
    });

  const [bug, setBug] =
    useState({
      title: "",
      severity: "medium",
      steps: "",
      expected: "",
      actual: "",
    });

  const loadAssignment = async () => {
    try {
      setLoading(true);
      setError("");

      const items =
        await listMyAssignments();

      setAssignment(
        items.find(
          (item) =>
            item.id === id
        ) || null
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not load assignment."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignment();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="full-loader">
          Loading assignment…
        </div>
      </DashboardLayout>
    );
  }

  if (!assignment?.project) {
    return (
      <DashboardLayout>
        <PageHead
          eyebrow="Testing assignment"
          title="Assignment not found"
          description="This assignment is unavailable."
        />

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}
      </DashboardLayout>
    );
  }

  const project =
    assignment.project;

  const checkins =
    assignment.checkins || [];

    const submittedFeedback =
  Array.isArray(
    assignment.feedback
  )
    ? assignment.feedback[0] ||
      null
    : assignment.feedback ||
      null;

const hasSubmittedFeedback =
  Boolean(submittedFeedback);

  const durationDays =
    getDuration(project);

  const rejectedCheckin =
    checkins.find(
      (checkin) =>
        checkin.status ===
        "rejected"
    ) || null;

  const pendingCheckin =
    checkins.find(
      (checkin) =>
        checkin.status ===
        "pending"
    ) || null;

  const approvedDays =
    getApprovedDays(checkins);

  let nextDay = 1;

  while (
    nextDay <= durationDays &&
    approvedDays.has(nextDay)
  ) {
    nextDay += 1;
  }

  const day = rejectedCheckin
    ? Number(
        rejectedCheckin.day_number
      )
    : pendingCheckin
      ? Number(
          pendingCheckin.day_number
        )
      : Math.min(
          nextDay,
          durationDays
        );

  const startDate =
    assignment.testing_start_date ||
    project.scheduled_start_date;

  const unlockDate = addDays(
    startDate,
    day - 1
  );

  const today =
    getTodayDateString();

  const isCalendarLocked =
    Boolean(unlockDate) &&
    today < unlockDate;

  const isWaiting =
    [
      "accepted",
      "waiting_for_start",
    ].includes(
      assignment.status
    ) ||
    (startDate && today < startDate);

  const isAwaitingApproval =
    Boolean(pendingCheckin) &&
    !rejectedCheckin;

  const isResubmission =
    Boolean(rejectedCheckin);

  const testingComplete =
    assignment.status ===
      "completed" ||
    nextDay > durationDays;

  const isUnavailable =
    ["failed", "removed"].includes(
      assignment.status
    );

  const handleCheckin = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      await submitCheckin({
        assignmentId: id,
        projectId: project.id,
        dayNumber: day,
        notes,
        file,
      });

      setMessage(
        `Day ${day} evidence was submitted for review.`
      );

      setNotes("");
      setFile(null);

      await loadAssignment();
    } catch (err) {
      setError(
        err.message ||
          "Evidence could not be submitted."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBug = async (
    event
  ) => {
    event.preventDefault();

    try {
      setError("");

      await reportBug({
        ...bug,
        project_id: project.id,
        assignment_id: id,
      });

      setMessage(
        "Bug report submitted."
      );

      setBug({
        title: "",
        severity: "medium",
        steps: "",
        expected: "",
        actual: "",
      });
    } catch (err) {
      setError(
        err.message ||
          "Bug report could not be submitted."
      );
    }
  };

  const handleFeedback = async (
    event
  ) => {
    event.preventDefault();

    try {
      setError("");

      await submitFeedback({
        project_id: project.id,
        assignment_id: id,
        rating: Number(
          feedback.rating
        ),
        positives:
          feedback.positives,
        improvements:
          feedback.improvements,
      });

      setMessage(
        "Final feedback submitted. Your reward eligibility will update automatically."
      );

      await loadAssignment();
    } catch (err) {
      setError(
        err.message ||
          "Feedback could not be submitted."
      );
    }
  };

  return (
    <DashboardLayout>
      <PageHead
        eyebrow={
          isWaiting
            ? "Waiting for start"
            : isUnavailable
              ? "Assignment closed"
              : testingComplete
                ? "Testing complete"
                : isAwaitingApproval
                  ? `Day ${day} under review`
                  : `Day ${day} mission`
        }
        title={project.app_name}
        description={
          isWaiting
            ? `Testing begins ${formatDate(
                startDate
              )}.`
            : isUnavailable
              ? assignment.failure_reason ||
                "This assignment is no longer active."
              : testingComplete
                ? "All required daily evidence has been approved."
                : isAwaitingApproval
                  ? "The next day unlocks only after approval and its calendar date arrives."
                  : "Complete the daily mission honestly and upload fresh evidence."
        }
        action={
          <Badge
            tone={statusTone(
              assignment.status
            )}
          >
            {assignment.status.replaceAll(
              "_",
              " "
            )}
          </Badge>
        }
      />

      {message && (
        <div className="alert success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {rejectedCheckin && (
        <div className="alert error">
          <strong>
            Day{" "}
            {
              rejectedCheckin.day_number
            }{" "}
            evidence was rejected.
          </strong>

          <div className="alert-detail">
            {rejectedCheckin.review_note ||
              "Please correct the evidence and resubmit."}
          </div>
        </div>
      )}

      <div className="detail-grid">
        <Card className="span2">
          {isWaiting ? (
            <div className="waiting-panel">
              <h2>
                Testing has not started
              </h2>

              <p>
                Your shared testing start
                date is:
              </p>

              <strong>
                {formatDate(startDate)}
              </strong>

              <p>
                Day 1 evidence will become
                available on this date.
              </p>
            </div>
          ) : isUnavailable ? (
            <div className="alert error">
              <strong>
                This assignment is closed.
              </strong>

              <div className="alert-detail">
                {assignment.failure_reason ||
                  "Contact support if you believe this is incorrect."}
              </div>
            </div>
          ) : testingComplete ? (
            <div className="completion-panel">
              <h2>
                Daily testing completed
              </h2>

              <p>
                Reward status:
              </p>

              <Badge
                tone={statusTone(
                  assignment.reward_status
                )}
              >
                {assignment.reward_status?.replaceAll(
                  "_",
                  " "
                ) ||
                  "pending completion"}
              </Badge>

              <p>
  {hasSubmittedFeedback
    ? assignment.reward_status ===
      "paid"
      ? "Your final feedback was submitted and your reward has been paid."
      : assignment.reward_status ===
          "approved_for_payment"
        ? "Your final feedback was submitted and your reward is approved for payment."
        : assignment.reward_status ===
            "eligible"
          ? "Your final feedback was submitted and your reward is eligible."
          : "Your final feedback was submitted successfully."
    : "Submit final feedback if required to become reward eligible."}
</p>
            </div>
          ) : isAwaitingApproval ? (
            <div className="alert success">
              <strong>
                Day{" "}
                {
                  pendingCheckin.day_number
                }{" "}
                evidence is under review.
              </strong>

              <div className="alert-detail">
                The next mission will unlock
                after approval and the next
                calendar testing date.
              </div>
            </div>
          ) : isCalendarLocked ? (
            <div className="waiting-panel">
              <h2>
                Day {day} is calendar locked
              </h2>

              <p>
                This mission unlocks on:
              </p>

              <strong>
                {formatDate(unlockDate)}
              </strong>

              <p>
                Approval does not allow
                multiple testing days to be
                completed on the same date.
              </p>
            </div>
          ) : (
            <>
              <h2>
                {isResubmission
                  ? `Resubmit Day ${day}`
                  : `Day ${day} mission`}
              </h2>

              <ol className="mission">
                <li>
                  Open the app through the
                  official testing track.
                </li>

                <li>
                  Use the main feature for at
                  least five minutes.
                </li>

                <li>
                  Test navigation, back
                  behaviour and one invalid
                  input.
                </li>

                <li>
                  Upload a fresh screenshot
                  and describe what you
                  tested.
                </li>
              </ol>

              <form
                onSubmit={handleCheckin}
              >
                <label>
                  Session notes

                  <textarea
                    required
                    rows="4"
                    value={notes}
                    placeholder={
                      isResubmission
                        ? "Explain what you corrected and tested again."
                        : "Describe what you tested today."
                    }
                    onChange={(event) =>
                      setNotes(
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Screenshot proof

                  <input
                    key={`${day}-${
                      file
                        ? "selected"
                        : "empty"
                    }`}
                    type="file"
                    accept="image/*"
                    required
                    onChange={(event) =>
                      setFile(
                        event.target
                          .files?.[0] ||
                          null
                      )
                    }
                  />
                </label>

                <button
                  className="button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Uploading evidence…"
                    : isResubmission
                      ? `Resubmit Day ${day} evidence`
                      : `Submit Day ${day} evidence`}
                </button>
              </form>
            </>
          )}
        </Card>

        <Card>
          <h2>Assignment status</h2>

          <div className="schedule-list">
            <div>
              <span>Start date</span>
              <strong>
                {formatDate(startDate)}
              </strong>
            </div>

            <div>
              <span>End date</span>
              <strong>
                {formatDate(
                  assignment.testing_end_date
                )}
              </strong>
            </div>

            <div>
              <span>Approved through</span>
              <strong>
                Day{" "}
                {assignment.last_approved_day ||
                  0}
                /{durationDays}
              </strong>
            </div>

            <div>
              <span>Reward</span>
              <strong>
                ₹
                {assignment.reward_inr ||
                  0}
              </strong>
            </div>
          </div>
        </Card>

        <Card>
          <h2>Release links</h2>

          <div className="link-stack">
            <a
              target="_blank"
              rel="noreferrer"
              href={
                project.google_group_url
              }
            >
              1. Join Google Group
            </a>

            <a
              target="_blank"
              rel="noreferrer"
              href={
                project.android_opt_in_url
              }
            >
              2. Join Android test
            </a>

            <a
              target="_blank"
              rel="noreferrer"
              href={
                project.web_opt_in_url
              }
            >
              3. Open web opt-in
            </a>
          </div>
        </Card>

        <Card className="span3">
          <h2>Testing history</h2>

          {checkins.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Notes</th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {[...checkins]
                    .sort(
                      (
                        first,
                        second
                      ) =>
                        Number(
                          second.day_number
                        ) -
                        Number(
                          first.day_number
                        )
                    )
                    .map((checkin) => (
                      <tr key={checkin.id}>
                        <td>
                          Day{" "}
                          {
                            checkin.day_number
                          }
                        </td>

                        <td>
                          {checkin.notes ||
                            "No notes"}

                          {checkin.review_note && (
                            <small className="danger-text">
                              Review:{" "}
                              {
                                checkin.review_note
                              }
                            </small>
                          )}
                        </td>

                        <td>
                          {formatDate(
                            checkin.submission_date ||
                              checkin.created_at?.slice(
                                0,
                                10
                              )
                          )}
                        </td>

                        <td>
                          <Badge
                            tone={statusTone(
                              checkin.status
                            )}
                          >
                            {
                              checkin.status
                            }
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty
              title="No evidence submitted"
              body="Your daily testing history will appear here."
            />
          )}
        </Card>

        {testingComplete &&
  hasSubmittedFeedback && (
    <Card className="span3">
      <div className="completion-panel">
        <h2>
          Final feedback submitted
        </h2>

        <p>
          Your feedback has been
          received successfully.
        </p>

        <div className="schedule-list">
          <div>
            <span>Rating</span>

            <strong>
              {submittedFeedback.rating
                ? `${submittedFeedback.rating}/5`
                : "Submitted"}
            </strong>
          </div>

          <div>
            <span>Reward status</span>

            <Badge
              tone={statusTone(
                assignment.reward_status
              )}
            >
              {assignment.reward_status
                ?.replaceAll(
                  "_",
                  " "
                ) ||
                "pending completion"}
            </Badge>
          </div>
        </div>

        {submittedFeedback.positives && (
          <div className="evidence-note">
            <span>
              What worked well
            </span>

            <p>
              {
                submittedFeedback
                  .positives
              }
            </p>
          </div>
        )}

        {submittedFeedback.improvements && (
          <div className="evidence-note">
            <span>
              What could improve
            </span>

            <p>
              {
                submittedFeedback
                  .improvements
              }
            </p>
          </div>
        )}
      </div>
    </Card>
  )}

        {testingComplete &&
  !hasSubmittedFeedback && (
          <Card className="span3">
            <h2>Final feedback</h2>

            <form
              className="form-grid"
              onSubmit={handleFeedback}
            >
              <label>
                Rating

                <select
                  value={
                    feedback.rating
                  }
                  onChange={(event) =>
                    setFeedback({
                      ...feedback,
                      rating:
                        event.target.value,
                    })
                  }
                >
                  <option value="5">
                    5 — Excellent
                  </option>

                  <option value="4">
                    4 — Good
                  </option>

                  <option value="3">
                    3 — Average
                  </option>

                  <option value="2">
                    2 — Poor
                  </option>

                  <option value="1">
                    1 — Very poor
                  </option>
                </select>
              </label>

              <label>
                What worked well?

                <textarea
                  value={
                    feedback.positives
                  }
                  onChange={(event) =>
                    setFeedback({
                      ...feedback,
                      positives:
                        event.target.value,
                    })
                  }
                />
              </label>

              <label className="full">
                What could improve?

                <textarea
                  value={
                    feedback.improvements
                  }
                  onChange={(event) =>
                    setFeedback({
                      ...feedback,
                      improvements:
                        event.target.value,
                    })
                  }
                />
              </label>

              <button className="button">
                Submit final feedback
              </button>
            </form>
          </Card>
        )}

        {!isUnavailable && (
          <Card className="span3">
            <h2>
              Report a reproducible bug
            </h2>

            <form
              className="form-grid"
              onSubmit={handleBug}
            >
              <label>
                Bug title

                <input
                  required
                  value={bug.title}
                  onChange={(event) =>
                    setBug({
                      ...bug,
                      title:
                        event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Severity

                <select
                  value={bug.severity}
                  onChange={(event) =>
                    setBug({
                      ...bug,
                      severity:
                        event.target.value,
                    })
                  }
                >
                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>

                  <option value="critical">
                    Critical
                  </option>
                </select>
              </label>

              <label className="full">
                Steps to reproduce

                <textarea
                  required
                  value={bug.steps}
                  onChange={(event) =>
                    setBug({
                      ...bug,
                      steps:
                        event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Expected result

                <textarea
                  value={bug.expected}
                  onChange={(event) =>
                    setBug({
                      ...bug,
                      expected:
                        event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Actual result

                <textarea
                  value={bug.actual}
                  onChange={(event) =>
                    setBug({
                      ...bug,
                      actual:
                        event.target.value,
                    })
                  }
                />
              </label>

              <button className="button">
                Submit bug
              </button>
            </form>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}