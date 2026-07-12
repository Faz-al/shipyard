import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  ClipboardX,
  LoaderCircle,
  RefreshCw,
  Repeat2,
  ShieldAlert,
  WalletCards,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  Badge,
  Card,
  Empty,
} from "../UI";

import {
  adminOperationalAlerts,
} from "../../lib/api";


function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",

      timeStyle:
        String(value).includes("T")
          ? "short"
          : undefined,
    }
  ).format(date);
}


function testerName(tester) {
  return (
    tester?.full_name ||
    tester?.email ||
    "Unknown tester"
  );
}


function projectName(project) {
  return (
    project?.app_name ||
    "Unknown project"
  );
}


function AlertRow({
  icon: Icon,
  tone,
  title,
  description,
  meta,
  to,
  badge,
}) {
  return (
    <Link
      to={to}
      className={`operations-alert-row ${tone}`}
    >
      <span className="operations-alert-icon">
        <Icon size={19} />
      </span>

      <span className="operations-alert-content">
        <span className="operations-alert-title">
          <strong>
            {title}
          </strong>

          {badge && (
            <Badge
              tone={
                tone === "danger"
                  ? "red"
                  : tone === "warning"
                    ? "purple"
                    : "default"
              }
            >
              {badge}
            </Badge>
          )}
        </span>

        <small>
          {description}
        </small>

        {meta && (
          <span className="operations-alert-meta">
            {meta}
          </span>
        )}
      </span>

      <ArrowRight size={17} />
    </Link>
  );
}


export default function OperationsAlertsPanel({
  refreshKey = 0,
}) {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const result =
        await adminOperationalAlerts();

      setData(result);
    } catch (err) {
      setError(
        err.message ||
          "Could not load operational alerts."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    load();
  }, [refreshKey]);


  const alerts =
    useMemo(() => {
      if (!data) {
        return [];
      }

      const result = [];


      data.atRiskAssignments.forEach(
        (assignment) => {
          result.push({
            id:
              `risk-${assignment.id}`,

            priority: 1,

            icon: ShieldAlert,

            tone: "danger",

            title:
              `${testerName(
                assignment.tester
              )} is at risk`,

            description:
              assignment.failure_reason ||
              `A required testing day may have been missed for ${projectName(
                assignment.project
              )}.`,

            meta:
              `${projectName(
                assignment.project
              )} · Last approved day ${
                assignment.last_approved_day ||
                0
              }`,

            badge: "At risk",

            to: "/admin/projects",
          });
        }
      );


      data.rejectedEvidence.forEach(
        (checkin) => {
          const assignment =
            checkin.assignment;

          result.push({
            id:
              `rejected-${checkin.id}`,

            priority: 2,

            icon: ClipboardX,

            tone: "danger",

            title:
              `Day ${checkin.day_number} needs resubmission`,

            description:
              checkin.review_note ||
              "The tester must correct and resubmit the rejected evidence.",

            meta:
              `${testerName(
                assignment?.tester
              )} · ${projectName(
                assignment?.project
              )} · Rejected ${formatDate(
                checkin.reviewed_at
              )}`,

            badge: "Rejected",

            to: "/admin",
          });
        }
      );


      data.replacementProjects.forEach(
        (project) => {
          const openSlots =
            Number(
              project.replacement_slots_open ||
                0
            );

          result.push({
            id:
              `replacement-${project.id}`,

            priority: 3,

            icon: Repeat2,

            tone: "warning",

            title:
              `${openSlots} replacement ${
                openSlots === 1
                  ? "slot"
                  : "slots"
              } open`,

            description:
              `${project.app_name} needs replacement testers to protect the required completion count.`,

            meta:
              `${project.completed_tester_count ||
                0}/${
                project.required_completions ||
                0
              } successful completions`,

            badge: "Replacement",

            to: "/admin/projects",
          });
        }
      );


      data.completionReviewProjects.forEach(
        (project) => {
          result.push({
            id:
              `completion-${project.id}`,

            priority: 4,

            icon: CheckCircle2,

            tone: "success",

            title:
              `${project.app_name} is ready for final review`,

            description:
              "The required tester completion target has been reached.",

            meta:
              `${project.completed_tester_count ||
                0}/${
                project.required_completions ||
                0
              } successful testers`,

            badge:
              "Final review",

            to: "/admin/projects",
          });
        }
      );


      data.eligibleRewards.forEach(
        (assignment) => {
          result.push({
            id:
              `eligible-${assignment.id}`,

            priority: 5,

            icon: CircleDollarSign,

            tone: "warning",

            title:
              `₹${
                assignment.reward_inr ||
                0
              } reward needs approval`,

            description:
              `${testerName(
                assignment.tester
              )} completed ${projectName(
                assignment.project
              )}.`,

            meta:
              `Eligible ${formatDate(
                assignment.reward_eligible_at
              )}`,

            badge:
              "Approve reward",

            to: "/admin",
          });
        }
      );


      data.approvedRewards.forEach(
        (assignment) => {
          result.push({
            id:
              `payment-${assignment.id}`,

            priority: 6,

            icon: WalletCards,

            tone: "warning",

            title:
              `₹${
                assignment.reward_inr ||
                0
              } reward is awaiting payment`,

            description:
              `${testerName(
                assignment.tester
              )} has an approved reward for ${projectName(
                assignment.project
              )}.`,

            meta: "Approved for payment",

            badge:
              "Pay tester",

            to: "/admin",
          });
        }
      );


      return result.sort(
        (first, second) =>
          first.priority -
          second.priority
      );
    }, [data]);


  const counts =
    data?.counts || {
      atRisk: 0,
      rejected: 0,
      replacement: 0,
      completionReview: 0,
      rewardApproval: 0,
      rewardPayment: 0,
      total: 0,
    };


  return (
    <Card className="operations-alerts-card">
      <div className="card-head">
        <div>
          <h2>
            Operational alerts
          </h2>

          <p>
            Urgent tester, evidence,
            replacement, completion and
            payment actions.
          </p>
        </div>

        <button
          type="button"
          className="button secondary"
          onClick={load}
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle
              className="spin"
              size={17}
            />
          ) : (
            <RefreshCw
              size={17}
            />
          )}

          Refresh
        </button>
      </div>


      {error && (
        <div className="alert error">
          {error}
        </div>
      )}


      <div className="operations-alert-summary">
        <div
          className={
            counts.atRisk
              ? "danger"
              : ""
          }
        >
          <ShieldAlert size={18} />

          <span>
            At risk
          </span>

          <strong>
            {counts.atRisk}
          </strong>
        </div>

        <div
          className={
            counts.rejected
              ? "danger"
              : ""
          }
        >
          <ClipboardX size={18} />

          <span>
            Rejected
          </span>

          <strong>
            {counts.rejected}
          </strong>
        </div>

        <div
          className={
            counts.replacement
              ? "warning"
              : ""
          }
        >
          <Repeat2 size={18} />

          <span>
            Replacements
          </span>

          <strong>
            {counts.replacement}
          </strong>
        </div>

        <div
          className={
            counts.completionReview
              ? "success"
              : ""
          }
        >
          <CheckCircle2 size={18} />

          <span>
            Final review
          </span>

          <strong>
            {
              counts.completionReview
            }
          </strong>
        </div>

        <div
          className={
            counts.rewardApproval
              ? "warning"
              : ""
          }
        >
          <CircleDollarSign
            size={18}
          />

          <span>
            Reward approval
          </span>

          <strong>
            {
              counts.rewardApproval
            }
          </strong>
        </div>

        <div
          className={
            counts.rewardPayment
              ? "warning"
              : ""
          }
        >
          <WalletCards
            size={18}
          />

          <span>
            Payment due
          </span>

          <strong>
            {
              counts.rewardPayment
            }
          </strong>
        </div>
      </div>


      {loading && !data ? (
        <div className="full-loader inline-loader">
          <LoaderCircle
            className="spin"
          />

          Loading operational alerts…
        </div>
      ) : alerts.length ? (
        <div className="operations-alert-list">
          {alerts.map(
            (alert) => (
              <AlertRow
                key={alert.id}
                {...alert}
              />
            )
          )}
        </div>
      ) : (
        <Empty
          title="Operations are clear"
          body="There are no at-risk testers, rejected submissions, replacement needs, final reviews or pending reward actions."
        />
      )}
    </Card>
  );
}