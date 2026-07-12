import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Bug,
  CalendarDays,
  ClipboardCheck,
  IndianRupee,
  Plus,
  ShieldAlert,
  Users,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import {
  Badge,
  Card,
  DashboardLayout,
  Empty,
  PageHead,
} from "../components/UI";


import PayoutMethodCard
  from "../components/tester/PayoutMethodCard";


import {
  acceptProject,
  createProject,
  listAvailableProjects,
  listMyAssignments,
  listPlans,
  listProjects,
} from "../lib/api";

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

function getDuration(project) {
  return (
    project?.duration_days ||
    project?.plans?.duration_days ||
    14
  );
}

function getApprovedCount(checkins = []) {
  return checkins.filter(
    (checkin) =>
      checkin.status === "approved"
  ).length;
}

function getAssignmentSummary(assignment) {
  const checkins =
    assignment.checkins || [];

  const rejected = checkins.find(
    (checkin) =>
      checkin.status === "rejected"
  );

  const pending = checkins.find(
    (checkin) =>
      checkin.status === "pending"
  );

  if (
    assignment.status ===
    "waiting_for_start"
  ) {
    return `Starts ${formatDate(
      assignment.testing_start_date ||
        assignment.project
          ?.scheduled_start_date
    )}`;
  }

  if (assignment.status === "completed") {
    return "All testing days completed";
  }

  if (assignment.status === "failed") {
    return (
      assignment.failure_reason ||
      "Assignment failed"
    );
  }

  if (assignment.status === "removed") {
    return "Removed from this project";
  }

  if (rejected) {
    return `Day ${rejected.day_number} requires resubmission`;
  }

  if (pending) {
    return `Day ${pending.day_number} under review`;
  }

  return `${getApprovedCount(
    checkins
  )}/${getDuration(
    assignment.project
  )} approved days`;
}

function projectStatusTone(status) {
  if (
    ["active", "completed"].includes(
      status
    )
  ) {
    return "green";
  }

  if (
    [
      "scheduled",
      "completion_review",
    ].includes(status)
  ) {
    return "purple";
  }

  if (status === "cancelled") {
    return "red";
  }

  return "default";
}

export function Dashboard() {
  const { profile } = useAuth();

  if (
    profile?.preferred_workspace ===
      "admin" &&
    profile?.is_admin
  ) {
    window.location.replace("/admin");
    return null;
  }

  if (
    profile?.preferred_workspace ===
      "tester" &&
    profile?.is_tester
  ) {
    return <TesterDashboard />;
  }

  return <DeveloperDashboard />;
}

function DeveloperDashboard() {
  const [items, setItems] =
    useState([]);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const data =
          await listProjects();

        if (active) {
          setItems(
            Array.isArray(data)
              ? data
              : []
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Could not load your testing projects."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  const recruitedTesters =
    items.reduce(
      (total, project) =>
        total +
        Number(
          project.recruited_tester_count ||
            project.assignments?.[0]
              ?.count ||
            0
        ),
      0
    );

  const dailyCheckins =
    items.reduce(
      (total, project) =>
        total +
        Number(
          project.checkins?.[0]?.count ||
            0
        ),
      0
    );

  const reportedIssues =
    items.reduce(
      (total, project) =>
        total +
        Number(
          project.bug_reports?.[0]
            ?.count || 0
        ),
      0
    );

  const liveProjects =
    items.filter((project) =>
      [
        "recruiting",
        "scheduled",
        "active",
        "completion_review",
      ].includes(project.status)
    ).length;

  return (
    <DashboardLayout>
      <PageHead
        eyebrow="Developer workspace"
        title="Release command center"
        description="Monitor recruitment, daily evidence and successful tester completions."
        action={
          <Link
            className="button"
            to="/new-project"
          >
            <Plus />
            New test
          </Link>
        }
      />

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      <div className="stats-grid">
        <Card>
          <Users />
          <span>Recruited testers</span>
          <strong>
            {recruitedTesters}
          </strong>
        </Card>

        <Card>
          <ClipboardCheck />
          <span>Daily check-ins</span>
          <strong>{dailyCheckins}</strong>
        </Card>

        <Card>
          <Bug />
          <span>Issues reported</span>
          <strong>{reportedIssues}</strong>
        </Card>

        <Card>
          <CalendarDays />
          <span>Live projects</span>
          <strong>{liveProjects}</strong>
        </Card>
      </div>

      <Card>
        <div className="card-head">
          <div>
            <h2>Your releases</h2>
            <p>
              Recruitment, calendar progress
              and tester completion status.
            </p>
          </div>

          <Link to="/projects">
            View all
            <ArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="full-loader inline-loader">
            Loading projects…
          </div>
        ) : items.length ? (
          <div className="data-list">
            {items
              .slice(0, 6)
              .map((project) => {
                const recruited =
                  Number(
                    project.recruited_tester_count ||
                      0
                  );

                const target =
                  Number(
                    project.recruitment_target ||
                      project.plans
                        ?.tester_count ||
                      0
                  );

                const completed =
                  Number(
                    project.completed_tester_count ||
                      0
                  );

                const required =
                  Number(
                    project.required_completions ||
                      project.plans
                        ?.required_completions ||
                      0
                  );

                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                  >
                    <div className="app-icon">
                      {project.app_name?.[0]?.toUpperCase() ||
                        "A"}
                    </div>

                    <div className="grow">
                      <strong>
                        {project.app_name}
                      </strong>

                      <small>
                        {project.status ===
                        "recruiting"
                          ? `${recruited}/${target} testers recruited`
                          : project.status ===
                              "scheduled"
                            ? `Starts ${formatDate(
                                project.scheduled_start_date
                              )}`
                            : `${completed}/${required} successful testers`}
                      </small>
                    </div>

                    <Badge
                      tone={projectStatusTone(
                        project.status
                      )}
                    >
                      {project.status.replaceAll(
                        "_",
                        " "
                      )}
                    </Badge>

                    <span className="desktop-only">
                      Day{" "}
                      {project.current_day ||
                        0}
                      /
                      {getDuration(project)}
                    </span>

                    <ArrowRight />
                  </Link>
                );
              })}
          </div>
        ) : (
          <Empty
            title="No release tests yet"
            body="Create your first project and submit it for tester recruitment."
            action={
              <Link
                className="button"
                to="/new-project"
              >
                Create a project
              </Link>
            }
          />
        )}
      </Card>
    </DashboardLayout>
  );
}

function TesterDashboard() {
  const [items, setItems] =
    useState([]);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    async function loadAssignments() {
      try {
        setLoading(true);
        setError("");

        const data =
          await listMyAssignments();

        if (active) {
          setItems(
            Array.isArray(data)
              ? data
              : []
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Could not load your assignments."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAssignments();

    return () => {
      active = false;
    };
  }, []);

  const activeAssignments =
    items.filter((assignment) =>
      [
        "active",
        "at_risk",
      ].includes(assignment.status)
    ).length;

  const waitingAssignments =
    items.filter(
      (assignment) =>
        assignment.status ===
        "waiting_for_start"
    ).length;

  const verifiedCheckins =
    items
      .flatMap(
        (assignment) =>
          assignment.checkins || []
      )
      .filter(
        (checkin) =>
          checkin.status ===
          "approved"
      ).length;

  const eligibleRewards =
    items
      .filter((assignment) =>
        [
          "eligible",
          "approved_for_payment",
          "paid",
        ].includes(
          assignment.reward_status
        )
      )
      .reduce(
        (total, assignment) =>
          total +
          Number(
            assignment.reward_inr || 0
          ),
        0
      );

  return (
    <DashboardLayout>
      <PageHead
        eyebrow="Tester workspace"
        title="Your testing deck"
        description="Complete one honest testing day at a time and wait for evidence approval."
        action={
          <Link
            className="button"
            to="/available-tests"
          >
            Find tests
          </Link>
        }
      />

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      <div className="stats-grid">
        <Card>
          <ClipboardCheck />
          <span>Active assignments</span>
          <strong>
            {activeAssignments}
          </strong>
        </Card>

        <Card>
          <CalendarDays />
          <span>Waiting to start</span>
          <strong>
            {waitingAssignments}
          </strong>
        </Card>

        <Card>
          <Users />
          <span>Verified check-ins</span>
          <strong>
            {verifiedCheckins}
          </strong>
        </Card>

                <Card>
          <IndianRupee />
          <span>Eligible rewards</span>
          <strong>
            ₹{eligibleRewards}
          </strong>
        </Card>
      </div>

      <PayoutMethodCard />

      <Card>
        <div className="card-head">
          <div>
            <h2>Your assignments</h2>
            <p>
              Waiting, active, at-risk and
              completed testing work.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="full-loader inline-loader">
            Loading assignments…
          </div>
        ) : items.length ? (
          <div className="data-list">
            {items.map(
              (assignment) => {
                const project =
                  assignment.project;

                return (
                  <Link
                    key={assignment.id}
                    to={`/assignments/${assignment.id}`}
                  >
                    <div className="app-icon">
                      {project?.app_name?.[0]?.toUpperCase() ||
                        "A"}
                    </div>

                    <div className="grow">
                      <strong>
                        {project?.app_name ||
                          "Unknown app"}
                      </strong>

                      <small>
                        {getAssignmentSummary(
                          assignment
                        )}
                      </small>
                    </div>

                    <Badge
                      tone={
                        assignment.status ===
                          "active" ||
                        assignment.status ===
                          "completed"
                          ? "green"
                          : assignment.status ===
                              "at_risk"
                            ? "red"
                            : "default"
                      }
                    >
                      {assignment.status.replaceAll(
                        "_",
                        " "
                      )}
                    </Badge>

                    <ArrowRight />
                  </Link>
                );
              }
            )}
          </div>
        ) : (
          <Empty
            title="Your deck is clear"
            body="Browse available releases and accept one you can test for the full duration."
            action={
              <Link
                className="button"
                to="/available-tests"
              >
                Browse tests
              </Link>
            }
          />
        )}
      </Card>
    </DashboardLayout>
  );
}

export function Projects() {
  const [items, setItems] =
    useState([]);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const data =
          await listProjects();

        if (active) {
          setItems(
            Array.isArray(data)
              ? data
              : []
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Could not load your projects."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <PageHead
        eyebrow="Releases"
        title="All testing projects"
        description="Track recruitment, testing dates and successful completions."
        action={
          <Link
            className="button"
            to="/new-project"
          >
            <Plus />
            New test
          </Link>
        }
      />

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      <Card>
        {loading ? (
          <div className="full-loader inline-loader">
            Loading projects…
          </div>
        ) : items.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>App</th>
                  <th>Status</th>
                  <th>Recruitment</th>
                  <th>Completions</th>
                  <th>Calendar</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {items.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <strong>
                        {project.app_name}
                      </strong>

                      <small>
                        {project.plans?.name ||
                          "—"}
                      </small>
                    </td>

                    <td>
                      <Badge
                        tone={projectStatusTone(
                          project.status
                        )}
                      >
                        {project.status.replaceAll(
                          "_",
                          " "
                        )}
                      </Badge>
                    </td>

                    <td>
                      {project.recruited_tester_count ||
                        0}
                      /
                      {project.recruitment_target ||
                        project.plans
                          ?.tester_count ||
                        0}
                    </td>

                    <td>
                      {project.completed_tester_count ||
                        0}
                      /
                      {project.required_completions ||
                        project.plans
                          ?.required_completions ||
                        0}
                    </td>

                    <td>
                      Day{" "}
                      {project.current_day ||
                        0}
                      /
                      {getDuration(project)}

                      <small>
                        {project.scheduled_start_date
                          ? `Started ${formatDate(
                              project.scheduled_start_date
                            )}`
                          : ""}
                      </small>
                    </td>

                    <td>
                      <Link
                        to={`/projects/${project.id}`}
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title="No projects"
            body="Your testing projects will appear here."
          />
        )}
      </Card>
    </DashboardLayout>
  );
}

export function NewProject() {
  const navigate = useNavigate();

  const [plans, setPlans] =
    useState([]);

  const [error, setError] =
    useState("");

  const [
    loadingPlans,
    setLoadingPlans,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

   const [form, setForm] =
    useState({
      app_name: "",
      package_name: "",
      customer_phone: "",
      description: "",
      platform: "Android",
      google_group_url: "",
      android_opt_in_url: "",
      web_opt_in_url: "",
      plan_id: "",
    });

  useEffect(() => {
    let active = true;

    async function loadPlans() {
      try {
        setLoadingPlans(true);
        setError("");

        const data =
          await listPlans();

        const safePlans =
          Array.isArray(data)
            ? data
            : [];

        if (!active) {
          return;
        }

        setPlans(safePlans);

        if (safePlans[0]) {
          setForm((current) => ({
            ...current,
            plan_id:
              current.plan_id ||
              safePlans[0].id,
          }));
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Could not load testing plans."
          );
        }
      } finally {
        if (active) {
          setLoadingPlans(false);
        }
      }
    }

    loadPlans();

    return () => {
      active = false;
    };
  }, []);

  const selectedPlan =
    plans.find(
      (plan) =>
        plan.id === form.plan_id
    ) || null;

  const updateField = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

   const submit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const cleanPhone =
        form.customer_phone
          .replace(/\D/g, "")
          .replace(/^91(?=\d{10}$)/, "");

      if (
        !/^[6-9]\d{9}$/.test(
          cleanPhone
        )
      ) {
        throw new Error(
          "Please enter a valid 10-digit Indian mobile number."
        );
      }

      const cleanPackageName =
        form.package_name
          .trim()
          .toLowerCase();

      const project =
        await createProject({
          ...form,

          app_name:
            form.app_name.trim(),

          package_name:
            cleanPackageName,

          customer_phone:
            cleanPhone,

          description:
            form.description.trim(),

          google_group_url:
            form.google_group_url.trim(),

          android_opt_in_url:
            form.android_opt_in_url.trim(),

          web_opt_in_url:
            form.web_opt_in_url.trim(),
        });

      navigate(
        `/projects/${project.id}`
      );
    } catch (err) {
      const errorMessage =
        String(
          err?.message || ""
        );

      if (
        errorMessage.includes(
          "projects_active_package_idx"
        )
      ) {
        setError(
          "An active test already exists for this package name. Complete or cancel the existing test before creating another one."
        );
      } else {
        setError(
          errorMessage ||
            "The project could not be created."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <DashboardLayout>
      <PageHead
        eyebrow="New release"
        title="Create a managed test"
        description="Choose how many testers will be recruited and how many must successfully complete."
      />

      <Card className="form-card">
        <form
          onSubmit={submit}
          className="form-grid"
        >
          <label>
            App name

            <input
              required
              value={form.app_name}
              onChange={(event) =>
                updateField(
                  "app_name",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Package name

            <input
              required
              placeholder="com.company.app"
              value={form.package_name}
              onChange={(event) =>
                updateField(
                  "package_name",
                  event.target.value
                )
              }
            />
          </label>


                         <label>
            Mobile number

            <input
              type="tel"
              required
              inputMode="numeric"
              autoComplete="tel"
              maxLength="10"
              placeholder="10-digit mobile number"
              value={
                form.customer_phone
              }
              onChange={(event) =>
                updateField(
                  "customer_phone",
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
            />
          </label>     





          <label className="full">
            Short testing brief

            <textarea
              required
              rows="4"
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Google Group URL

            <input
              type="url"
              required
              value={
                form.google_group_url
              }
              onChange={(event) =>
                updateField(
                  "google_group_url",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            Android opt-in URL

            <input
              type="url"
              required
              value={
                form.android_opt_in_url
              }
              onChange={(event) =>
                updateField(
                  "android_opt_in_url",
                  event.target.value
                )
              }
            />
          </label>

          <label className="full">
            Web opt-in URL

            <input
              type="url"
              required
              value={
                form.web_opt_in_url
              }
              onChange={(event) =>
                updateField(
                  "web_opt_in_url",
                  event.target.value
                )
              }
            />
          </label>

          <label className="full">
            Testing plan

            <select
              value={form.plan_id}
              disabled={loadingPlans}
              onChange={(event) =>
                updateField(
                  "plan_id",
                  event.target.value
                )
              }
            >
              {plans.map((plan) => (
                <option
                  key={plan.id}
                  value={plan.id}
                >
                  {plan.name} — ₹
                  {plan.price_inr}
                </option>
              ))}
            </select>
          </label>

          {selectedPlan && (
            <div className="plan-preview full">
              <div>
                <strong>
                  {
                    selectedPlan.tester_count
                  }
                </strong>
                <span>
                  Testers recruited
                </span>
              </div>

              <div>
                <strong>
                  {
                    selectedPlan.required_completions
                  }
                </strong>
                <span>
                  Successful completions
                </span>
              </div>

              <div>
                <strong>
                  {
                    selectedPlan.duration_days
                  }
                </strong>
                <span>Testing days</span>
              </div>

              <div>
                <strong>
                  ₹
                  {
                    selectedPlan.reward_inr
                  }
                </strong>
                <span>
                  Reward per tester
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert error full">
              {error}
            </div>
          )}

          <div className="full actions">
            <button
              className="button"
              disabled={
                submitting ||
                loadingPlans ||
                !form.plan_id
              }
            >
              {submitting
                ? "Creating project…"
                : "Create project"}
            </button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}

export function AvailableTests() {
  const [items, setItems] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [
    acceptingId,
    setAcceptingId,
  ] = useState(null);

  const loadAvailableTests =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await listAvailableProjects();

        setItems(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        setError(
          err.message ||
            "Could not load available tests."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAvailableTests();
  }, []);

  const accept = async (
    projectId
  ) => {
    try {
      setAcceptingId(projectId);
      setMessage("");
      setError("");

      await acceptProject(projectId);

      setMessage(
        "Assignment accepted. It is now in your testing deck."
      );

      await loadAvailableTests();
    } catch (err) {
      setError(
        err.message ||
          "Could not accept this assignment."
      );
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <DashboardLayout>
      <PageHead
        eyebrow="Marketplace"
        title="Available testing work"
        description="Accept only releases you can test consistently for the full calendar duration."
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

      {loading ? (
        <div className="full-loader inline-loader">
          Loading available tests…
        </div>
      ) : items.length ? (
        <div className="market-grid">
          {items.map((project) => (
            <Card key={project.id}>
              <div className="app-icon large">
                {project.app_name?.[0]?.toUpperCase() ||
                  "A"}
              </div>

              <div className="badge-row">
                <Badge>
                  {project.platform ||
                    "Android"}
                </Badge>

                {project.is_replacement_slot && (
                  <Badge tone="purple">
                    Replacement
                  </Badge>
                )}
              </div>

              <h3>
                {project.app_name}
              </h3>

              <p>
                {project.description ||
                  "No testing brief provided."}
              </p>

              <div className="meta">
                <span>
                  {project.duration_days ||
                    14}{" "}
                  days
                </span>

                <span>
                  {project.slots_left ||
                    0}{" "}
                  slots left
                </span>

                <span>
                  {
                    project.required_completions
                  }{" "}
                  required
                </span>

                <span>
                  ₹
                  {project.reward_inr ||
                    0}
                </span>
              </div>

              {project.scheduled_start_date && (
                <p className="market-date">
                  Scheduled start:{" "}
                  {formatDate(
                    project.scheduled_start_date
                  )}
                </p>
              )}

              <button
                className="button wide"
                type="button"
                disabled={
                  acceptingId ===
                  project.id
                }
                onClick={() =>
                  accept(project.id)
                }
              >
                {acceptingId ===
                project.id
                  ? "Accepting…"
                  : project.is_replacement_slot
                    ? "Accept replacement slot"
                    : "Accept assignment"}
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Empty
            title="No tests are available"
            body="Paid projects with open recruitment or replacement slots will appear here."
          />
        </Card>
      )}
    </DashboardLayout>
  );
}