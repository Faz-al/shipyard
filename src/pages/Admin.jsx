import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  ClipboardCheck,
  Copy,
  ExternalLink,
  FolderKanban,
  IndianRupee,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
  Trash2,
  UserMinus,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import {
  Badge,
  Card,
  DashboardLayout,
  Empty,
  PageHead,
} from "../components/UI";

import OperationsAlertsPanel
  from "../components/admin/OperationsAlertsPanel";

  import TesterPayoutDirectory
  from "../components/admin/TesterPayoutDirectory";

import {
  adminApproveReward,
  adminCancelReward,
  adminCompleteProject,
  adminMarkRewardPaid,
  adminPendingCheckins,
  adminProjectAssignments,
  adminProjects,
  adminRemoveAssignment,
  adminRewardStats,
  adminRewards,
  adminReviewCheckin,
  adminStats,
  adminUsers,
  getProofSignedUrl,
  updateProject,
} from "../lib/api";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
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

function statusLabel(value) {
  return String(value || "unknown")
    .replaceAll("_", " ");
}

function statusTone(status) {
  if (
    [
      "active",
      "approved",
      "completed",
      "paid",
    ].includes(status)
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
      "suspended",
    ].includes(status)
  ) {
    return "red";
  }

  return "default";
}

function PendingEvidenceReview({
  items,
  loading,
  reviewingId,
  onApprove,
  onReject,
  onOpenProof,
  onRefresh,
}) {
  return (
    <Card>
      <div className="card-head">
        <div>
          <h2>Pending evidence</h2>

          <p>
            Review screenshots and tester notes
            before approving daily participation.
          </p>
        </div>

        <button
          type="button"
          className="button secondary"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="full-loader inline-loader">
          <LoaderCircle className="spin" />
          Loading evidence…
        </div>
      ) : items.length ? (
        <div className="evidence-review-list">
          {items.map((checkin) => {
            const testerName =
              checkin.tester?.full_name ||
              checkin.tester?.email ||
              "Unknown tester";

            const isReviewing =
              reviewingId === checkin.id;

            return (
              <article
                className="evidence-review-card"
                key={checkin.id}
              >
                <div className="evidence-review-top">
                  <div className="app-icon">
                    {checkin.project?.app_name?.[0]?.toUpperCase() ||
                      "A"}
                  </div>

                  <div className="grow">
                    <strong>
                      {checkin.project?.app_name ||
                        "Unknown project"}
                    </strong>

                    <small>
                      Day {checkin.day_number} ·{" "}
                      {testerName}
                    </small>
                  </div>

                  <Badge>pending</Badge>
                </div>

                <div className="evidence-review-details">
                  <div>
                    <span>Submitted</span>

                    <strong>
                      {formatDate(
                        checkin.created_at
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Device</span>

                    <strong>
                      {checkin.tester
                        ?.device_model ||
                        "Not added"}
                    </strong>

                    <small>
                      {checkin.tester
                        ?.android_version
                        ? `Android ${checkin.tester.android_version}`
                        : ""}
                    </small>
                  </div>

                  <div>
                    <span>Reliability</span>

                    <strong>
                      {checkin.tester
                        ?.reliability_score ??
                        100}
                      %
                    </strong>
                  </div>
                </div>

                <div className="evidence-note">
                  <span>Tester notes</span>

                  <p>
                    {checkin.notes ||
                      "No session notes were provided."}
                  </p>
                </div>

                <div className="evidence-actions">
                  {checkin.proof_path ? (
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() =>
                        onOpenProof(checkin)
                      }
                      disabled={isReviewing}
                    >
                      <ExternalLink size={17} />
                      Open screenshot
                    </button>
                  ) : (
                    <Badge>
                      No screenshot
                    </Badge>
                  )}

                  <div className="grow" />

                  <button
                    type="button"
                    className="button secondary"
                    disabled={isReviewing}
                    onClick={() =>
                      onReject(checkin)
                    }
                  >
                    <X size={17} />
                    Reject
                  </button>

                  <button
                    type="button"
                    className="button"
                    disabled={isReviewing}
                    onClick={() =>
                      onApprove(checkin)
                    }
                  >
                    {isReviewing ? (
                      <LoaderCircle
                        className="spin"
                        size={17}
                      />
                    ) : (
                      <Check size={17} />
                    )}

                    Approve
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty
          title="No pending evidence"
          body="New daily tester submissions will appear here."
        />
      )}
    </Card>
  );
}

function RewardsPanel({
  items,
  stats,
  loading,
  changingId,
  onApprove,
  onPaid,
  onCancel,
  onRefresh,
}) {
  const visibleItems =
    Array.isArray(items)
      ? items
      : [];

  return (
    <Card>
      <div className="card-head">
        <div>
          <h2>Tester rewards</h2>

          <p>
            Approve completed tester rewards
            and record payments safely.
          </p>
        </div>

        <button
          type="button"
          className="button secondary"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="reward-summary-grid">
        <div>
          <span>Eligible</span>

          <strong>
            {stats.eligible || 0}
          </strong>

          <small>
            ₹
            {stats.eligible_amount_inr ||
              0}
          </small>
        </div>

        <div>
          <span>Approved</span>

          <strong>
            {stats.approved_for_payment ||
              0}
          </strong>

          <small>
            ₹
            {stats.approved_amount_inr ||
              0}
          </small>
        </div>

        <div>
          <span>Paid</span>

          <strong>
            {stats.paid || 0}
          </strong>

          <small>
            ₹
            {stats.paid_amount_inr ||
              0}
          </small>
        </div>
      </div>

      {loading ? (
        <div className="full-loader inline-loader">
          Loading rewards…
        </div>
      ) : visibleItems.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tester</th>
                <th>Project</th>
                <th>Reward</th>
                <th>Status</th>
                <th>Eligible</th>
<th>Payout</th>
<th>Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleItems.map(
                (assignment) => {
                  const busy =
                    changingId ===
                    assignment.id;

                  return (
                    <tr
                      key={assignment.id}
                    >
                      <td>
                        <strong>
                          {assignment.tester
                            ?.full_name ||
                            "Unnamed tester"}
                        </strong>

                        <small>
                          {assignment.tester
                            ?.email || ""}
                        </small>
                      </td>

                      <td>
                        <strong>
                          {assignment.project
                            ?.app_name ||
                            "Unknown project"}
                        </strong>

                        <small>
                          {assignment.project
                            ?.package_name ||
                            ""}
                        </small>
                      </td>

                      <td>
                        ₹
                        {assignment.reward_inr ||
                          0}
                      </td>

                      <td>
                        <Badge
                          tone={statusTone(
                            assignment.reward_status
                          )}
                        >
                          {statusLabel(
                            assignment.reward_status
                          )}
                        </Badge>
                      </td>

                      <td>
  {formatDate(
    assignment.reward_eligible_at
  )}
</td>

<td>
  {assignment.payout_method ? (
    <div className="admin-payout-cell">
      <strong>
        {
          assignment
            .payout_method
            .upi_id
        }
      </strong>

      <small>
        {assignment
          .payout_method
          .account_name ||
          "UPI payout"}
      </small>

      <button
        type="button"
        className="copy-payout-button"
        onClick={() =>
          navigator.clipboard.writeText(
            assignment
              .payout_method
              .upi_id
          )
        }
      >
        <Copy size={14} />
        Copy
      </button>
    </div>
  ) : assignment
      .payout_upi_snapshot ? (
    <div className="admin-payout-cell">
      <strong>
        {
          assignment
            .payout_upi_snapshot
        }
      </strong>

      <small>
        Payment snapshot
      </small>
    </div>
  ) : (
    <Badge tone="red">
      Not added
    </Badge>
  )}
</td>

<td>
  <div className="table-actions">

    
                          {assignment.reward_status ===
                            "eligible" && (
                            <button
                              type="button"
                              className="button small"
                              disabled={busy}
                              onClick={() =>
                                onApprove(
                                  assignment
                                )
                              }
                            >
                              Approve
                            </button>
                          )}

                         {assignment.reward_status ===
  "approved_for_payment" && (
  <button
    type="button"
    className="button small"
    disabled={
      busy ||
      !assignment.payout_method
    }
    title={
      assignment.payout_method
        ? "Record this payment"
        : "Tester must add payout details first"
    }
    onClick={() =>
      onPaid(
        assignment
      )
    }
  >
    Mark paid
  </button>
)}

                          {[
                            "eligible",
                            "approved_for_payment",
                          ].includes(
                            assignment.reward_status
                          ) && (
                            <button
                              type="button"
                              className="icon-button"
                              disabled={busy}
                              title="Cancel reward"
                              onClick={() =>
                                onCancel(
                                  assignment
                                )
                              }
                            >
                              <X size={17} />
                            </button>
                          )}

                          {assignment.reward_status ===
                            "paid" && (
                            <Badge tone="green">
                              Paid{" "}
                              {formatDate(
                                assignment.reward_paid_at
                              )}
                            </Badge>
                          )}

                          {assignment.reward_status ===
                            "cancelled" && (
                            <Badge tone="red">
                              Cancelled
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty
          title="No reward activity"
          body="Completed and reward-eligible tester assignments will appear here."
        />
      )}
    </Card>
  );
}

export function AdminDashboard() {

    const [
  operationsRefreshKey,
  setOperationsRefreshKey,
] = useState(0);


  const [stats, setStats] =
    useState({});

  const [
    rewardStats,
    setRewardStats,
  ] = useState({});

  const [checkins, setCheckins] =
    useState([]);

  const [rewards, setRewards] =
    useState([]);

  const [
    loadingStats,
    setLoadingStats,
  ] = useState(true);

  const [
    loadingCheckins,
    setLoadingCheckins,
  ] = useState(true);

  const [
    loadingRewards,
    setLoadingRewards,
  ] = useState(true);

  const [
    reviewingId,
    setReviewingId,
  ] = useState(null);

  const [
    changingRewardId,
    setChangingRewardId,
  ] = useState(null);

  const [
    rejectingCheckin,
    setRejectingCheckin,
  ] = useState(null);

  const [
    rewardCancellation,
    setRewardCancellation,
  ] = useState(null);


  const [
  paymentAssignment,
  setPaymentAssignment,
] = useState(null);

const [
  paymentReference,
  setPaymentReference,
] = useState("");



  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");

  const [
    cancellationReason,
    setCancellationReason,
  ] = useState("");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const loadStats = async () => {
    try {
      setLoadingStats(true);

      const [platformStats, rewardsData] =
        await Promise.all([
          adminStats(),
          adminRewardStats(),
        ]);

      setStats(platformStats || {});
      setRewardStats(
        rewardsData || {}
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not load admin statistics."
      );
    } finally {
      setLoadingStats(false);
    }
  };

  const loadCheckins = async () => {
    try {
      setLoadingCheckins(true);

      const data =
        await adminPendingCheckins();

      setCheckins(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not load pending evidence."
      );
    } finally {
      setLoadingCheckins(false);
    }
  };

  const loadRewards = async () => {
    try {
      setLoadingRewards(true);

      const data =
        await adminRewards();

      setRewards(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not load tester rewards."
      );
    } finally {
      setLoadingRewards(false);
    }
  };

  const refreshDashboard = async () => {
  setError("");

  await Promise.all([
    loadStats(),
    loadCheckins(),
    loadRewards(),
  ]);

  setOperationsRefreshKey(
    (current) =>
      current + 1
  );
};

  useEffect(() => {
    refreshDashboard();
  }, []);

  const approveCheckin = async (
    checkin
  ) => {
    try {
      setReviewingId(checkin.id);
      setMessage("");
      setError("");

      await adminReviewCheckin({
        checkinId: checkin.id,
        status: "approved",
        reviewNote: "",
      });

      setMessage(
        `Day ${checkin.day_number} evidence for ${
          checkin.project?.app_name ||
          "the project"
        } was approved.`
      );

      await refreshDashboard();
    } catch (err) {
      setError(
        err.message ||
          "The evidence could not be approved."
      );
    } finally {
      setReviewingId(null);
    }
  };

  const confirmRejectCheckin =
    async () => {
      if (
        !rejectingCheckin ||
        !rejectionReason.trim()
      ) {
        return;
      }

      try {
        setReviewingId(
          rejectingCheckin.id
        );

        setMessage("");
        setError("");

        await adminReviewCheckin({
          checkinId:
            rejectingCheckin.id,
          status: "rejected",
          reviewNote:
            rejectionReason.trim(),
        });

        setMessage(
          `Day ${rejectingCheckin.day_number} evidence was rejected.`
        );

        setRejectingCheckin(null);
        setRejectionReason("");

        await refreshDashboard();
      } catch (err) {
        setError(
          err.message ||
            "The evidence could not be rejected."
        );
      } finally {
        setReviewingId(null);
      }
    };

  const openProof = async (
    checkin
  ) => {
    try {
      setError("");

      const signedUrl =
        await getProofSignedUrl(
          checkin.proof_path
        );

      window.open(
        signedUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      setError(
        err.message ||
          "The screenshot could not be opened."
      );
    }
  };

  const approveReward = async (
    assignment
  ) => {
    try {
      setChangingRewardId(
        assignment.id
      );

      setMessage("");
      setError("");

      await adminApproveReward(
        assignment.id
      );

      setMessage(
        `Reward for ${
          assignment.tester?.full_name ||
          "the tester"
        } was approved for payment.`
      );

      await refreshDashboard();
    } catch (err) {
      setError(
        err.message ||
          "The reward could not be approved."
      );
    } finally {
      setChangingRewardId(null);
    }
  };

const markRewardPaid = (
  assignment
) => {
  if (
    !assignment.payout_method
  ) {
    setError(
      "The tester must add payout details before this reward can be paid."
    );

    return;
  }

  setError("");
  setMessage("");

  setPaymentAssignment(
    assignment
  );

  setPaymentReference("");
};


const confirmRewardPaid =
  async () => {
    if (
      !paymentAssignment ||
      !paymentReference.trim()
    ) {
      return;
    }

    try {
      setChangingRewardId(
        paymentAssignment.id
      );

      setMessage("");
      setError("");

      await adminMarkRewardPaid({
        assignmentId:
          paymentAssignment.id,

        paymentReference:
          paymentReference.trim(),
      });

      setMessage(
        `Reward for ${
          paymentAssignment.tester
            ?.full_name ||
          "the tester"
        } was marked paid.`
      );

      setPaymentAssignment(null);
      setPaymentReference("");

      await refreshDashboard();
    } catch (err) {
      setError(
        err.message ||
          "The reward could not be marked paid."
      );
    } finally {
      setChangingRewardId(null);
    }
  };


  return (
    <DashboardLayout>
      <PageHead
        eyebrow="Operations"
        title="Admin command center"
        description="Manage evidence, tester risk, rewards and project completion."
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

      <div className="stats-grid">
        <Card>
          <FolderKanban />
          <span>Total projects</span>

          <strong>
            {loadingStats
              ? "…"
              : stats.projects || 0}
          </strong>
        </Card>

        <Card>
          <Users />
          <span>Tester network</span>

          <strong>
            {loadingStats
              ? "…"
              : stats.testers || 0}
          </strong>
        </Card>

        <Card>
          <ClipboardCheck />
          <span>Pending evidence</span>

          <strong>
            {loadingStats
              ? "…"
              : stats.pending_checkins ||
                0}
          </strong>
        </Card>

        <Card>
          <ShieldAlert />
          <span>At-risk testers</span>

          <strong>
            {loadingStats
              ? "…"
              : stats.at_risk_testers ||
                0}
          </strong>
        </Card>
      </div>

     <OperationsAlertsPanel
  refreshKey={
    operationsRefreshKey
  }
/>

<TesterPayoutDirectory />

<PendingEvidenceReview
        items={checkins}
        loading={loadingCheckins}
        reviewingId={reviewingId}
        onApprove={approveCheckin}
        onReject={(checkin) => {
          setRejectingCheckin(
            checkin
          );

          setRejectionReason("");
        }}
        onOpenProof={openProof}
        onRefresh={refreshDashboard}
      />

      <RewardsPanel
        items={rewards}
        stats={rewardStats}
        loading={loadingRewards}
        changingId={changingRewardId}
        onApprove={approveReward}
        onPaid={markRewardPaid}
        onCancel={(assignment) => {
          setRewardCancellation(
            assignment
          );

          setCancellationReason("");
        }}
        onRefresh={refreshDashboard}
      />



        {paymentAssignment && (
  <div className="modal-backdrop">
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <span className="eyebrow">
            Record tester payment
          </span>

          <h2>
            ₹
            {paymentAssignment
              .reward_inr || 0}
            {" · "}
            {paymentAssignment
              .tester
              ?.full_name ||
              "Tester"}
          </h2>
        </div>

        <button
          type="button"
          className="icon-button"
          disabled={Boolean(
            changingRewardId
          )}
          onClick={() => {
            setPaymentAssignment(
              null
            );

            setPaymentReference(
              ""
            );
          }}
        >
          <X size={20} />
        </button>
      </div>

      <p className="modal-description">
        Send the reward to the
        tester’s saved UPI ID, then
        enter the transaction reference
        below.
      </p>

      <div className="payment-destination">
        <span>
          Pay to
        </span>

        <strong>
          {
            paymentAssignment
              .payout_method
              ?.upi_id
          }
        </strong>

        <small>
          {paymentAssignment
            .payout_method
            ?.account_name ||
            "UPI payout"}
        </small>

        <button
          type="button"
          className="button secondary small"
          onClick={() =>
            navigator.clipboard.writeText(
              paymentAssignment
                .payout_method
                ?.upi_id || ""
            )
          }
        >
          <Copy size={16} />
          Copy UPI ID
        </button>
      </div>

      <label>
        Payment reference

        <input
          type="text"
          autoFocus
          value={paymentReference}
          placeholder="UPI transaction ID or reference"
          onChange={(event) =>
            setPaymentReference(
              event.target.value
            )
          }
        />
      </label>

      <p className="payment-warning">
        Confirm the payment in your
        UPI or banking app before
        marking this reward paid.
      </p>

      <div className="modal-actions">
        <button
          type="button"
          className="button secondary"
          disabled={Boolean(
            changingRewardId
          )}
          onClick={() => {
            setPaymentAssignment(
              null
            );

            setPaymentReference(
              ""
            );
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          className="button"
          disabled={
            Boolean(
              changingRewardId
            ) ||
            !paymentReference.trim()
          }
          onClick={
            confirmRewardPaid
          }
        >
          {changingRewardId ? (
            <LoaderCircle
              className="spin"
              size={17}
            />
          ) : (
            <Check size={17} />
          )}

          Confirm payment
        </button>
      </div>
    </div>
  </div>
)}



      {rejectingCheckin && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-head">
              <div>
                <span className="eyebrow">
                  Reject evidence
                </span>

                <h2>
                  Day{" "}
                  {
                    rejectingCheckin.day_number
                  }{" "}
                  ·{" "}
                  {rejectingCheckin.project
                    ?.app_name ||
                    "Project"}
                </h2>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={() =>
                  setRejectingCheckin(
                    null
                  )
                }
                disabled={Boolean(
                  reviewingId
                )}
              >
                <X size={20} />
              </button>
            </div>

            <p className="modal-description">
              Explain clearly what the
              tester must correct before
              resubmitting.
            </p>

            <label>
              Rejection reason

              <textarea
                rows="5"
                autoFocus
                value={rejectionReason}
                onChange={(event) =>
                  setRejectionReason(
                    event.target.value
                  )
                }
              />
            </label>

            <div className="modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() =>
                  setRejectingCheckin(
                    null
                  )
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="button danger"
                onClick={
                  confirmRejectCheckin
                }
                disabled={
                  Boolean(reviewingId) ||
                  !rejectionReason.trim()
                }
              >
                Reject evidence
              </button>
            </div>
          </div>
        </div>
      )}

      {rewardCancellation && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-head">
              <div>
                <span className="eyebrow">
                  Cancel reward
                </span>

                <h2>
                  {rewardCancellation
                    .tester?.full_name ||
                    "Tester"}
                </h2>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={() =>
                  setRewardCancellation(
                    null
                  )
                }
              >
                <X size={20} />
              </button>
            </div>

            <p className="modal-description">
              This should only be used
              where the tester is no
              longer eligible for payment.
            </p>

            <label>
              Cancellation reason

              <textarea
                rows="5"
                value={cancellationReason}
                onChange={(event) =>
                  setCancellationReason(
                    event.target.value
                  )
                }
              />
            </label>

            <div className="modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() =>
                  setRewardCancellation(
                    null
                  )
                }
              >
                Keep reward
              </button>

              <button
                type="button"
                className="button danger"
                disabled={
                  !cancellationReason.trim()
                }
                onClick={
                  confirmCancelReward
                }
              >
                Cancel reward
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export function AdminProjects() {
  const [items, setItems] =
    useState([]);

  const [
    assignmentsByProject,
    setAssignmentsByProject,
  ] = useState({});

  const [
    expandedProjectId,
    setExpandedProjectId,
  ] = useState(null);

  const [
    loadingProjectId,
    setLoadingProjectId,
  ] = useState(null);

  const [
    changingId,
    setChangingId,
  ] = useState(null);

  const [
    testerAction,
    setTesterAction,
  ] = useState(null);

  const [reason, setReason] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await adminProjects();

      setItems(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not load platform projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const loadAssignments = async (
    projectId
  ) => {
    try {
      setLoadingProjectId(
        projectId
      );

      const data =
        await adminProjectAssignments(
          projectId
        );

      setAssignmentsByProject(
        (current) => ({
          ...current,
          [projectId]:
            Array.isArray(data)
              ? data
              : [],
        })
      );
    } catch (err) {
      setError(
        err.message ||
          "Could not load project testers."
      );
    } finally {
      setLoadingProjectId(null);
    }
  };

  const toggleProject = async (
    projectId
  ) => {
    if (
      expandedProjectId ===
      projectId
    ) {
      setExpandedProjectId(null);
      return;
    }

    setExpandedProjectId(
      projectId
    );

    if (
      !assignmentsByProject[
        projectId
      ]
    ) {
      await loadAssignments(
        projectId
      );
    }
  };

  const change = async (
    id,
    status
  ) => {
    try {
      setChangingId(id);
      setMessage("");
      setError("");

      await updateProject(id, {
        status,
      });

      setMessage(
        "Project status updated."
      );

      await load();
    } catch (err) {
      setError(
        err.message ||
          "Project status could not be changed."
      );
    } finally {
      setChangingId(null);
    }
  };

  const completeProject =
    async (project) => {
      try {
        setChangingId(project.id);
        setMessage("");
        setError("");

        await adminCompleteProject(
          project.id
        );

        setMessage(
          `${project.app_name} was marked completed.`
        );

        await load();
      } catch (err) {
        setError(
          err.message ||
            "The project could not be completed."
        );
      } finally {
        setChangingId(null);
      }
    };

  const confirmTesterAction =
    async () => {
      if (
        !testerAction ||
        !reason.trim()
      ) {
        return;
      }

      try {
        setChangingId(
          testerAction.assignment.id
        );

        setMessage("");
        setError("");

        await adminRemoveAssignment({
          assignmentId:
            testerAction.assignment.id,
          reason: reason.trim(),
          failed:
            testerAction.mode ===
            "failed",
        });

        setMessage(
          testerAction.mode ===
            "failed"
            ? "Tester marked as failed."
            : "Tester removed from the project."
        );

        setTesterAction(null);
        setReason("");

        await Promise.all([
          load(),
          loadAssignments(
            testerAction.projectId
          ),
        ]);
      } catch (err) {
        setError(
          err.message ||
            "The tester could not be updated."
        );
      } finally {
        setChangingId(null);
      }
    };

  return (
    <DashboardLayout>
      <PageHead
        eyebrow="Operations"
        title="All projects"
        description="Manage recruitment, testers, replacements and final project approval."
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

      <Card>
        {loading ? (
          <div className="full-loader inline-loader">
            Loading projects…
          </div>
        ) : items.length ? (
          <div className="admin-project-list">
            {items.map((project) => {
              const expanded =
                expandedProjectId ===
                project.id;

              const assignments =
                assignmentsByProject[
                  project.id
                ] || [];

              return (
                <article
                  key={project.id}
                  className="admin-project-card"
                >
                  <div className="admin-project-main">
                    <div className="app-icon">
                      {project.app_name?.[0]?.toUpperCase() ||
                        "A"}
                    </div>

                    <div className="grow">
                      <strong>
                        {project.app_name}
                      </strong>

                      <small>
                        {project.package_name}
                      </small>

                      <small>
                        {project.developer
                          ?.full_name ||
                          project.developer
                            ?.email ||
                          "Unknown developer"}
                      </small>
                    </div>

                    <div className="project-mini-stat">
                      <span>Recruitment</span>

                      <strong>
                        {project.recruited_tester_count ||
                          0}
                        /
                        {project.recruitment_target ||
                          0}
                      </strong>
                    </div>

                    <div className="project-mini-stat">
                      <span>Completed</span>

                      <strong>
                        {project.completed_tester_count ||
                          0}
                        /
                        {project.required_completions ||
                          0}
                      </strong>
                    </div>

                    <Badge
                      tone={statusTone(
                        project.status
                      )}
                    >
                      {statusLabel(
                        project.status
                      )}
                    </Badge>

                    {project.status ===
                    "completion_review" ? (
                      <button
                        type="button"
                        className="button small"
                        disabled={
                          changingId ===
                          project.id
                        }
                        onClick={() =>
                          completeProject(
                            project
                          )
                        }
                      >
                        Complete project
                      </button>
                    ) : (
                      <select
                        value={project.status}
                        disabled={
                          changingId ===
                          project.id
                        }
                        onChange={(event) =>
                          change(
                            project.id,
                            event.target.value
                          )
                        }
                      >
                        <option value="draft">
                          draft
                        </option>

                        <option value="pending_payment">
                          pending payment
                        </option>

                        <option value="recruiting">
                          recruiting
                        </option>

                        <option value="scheduled">
                          scheduled
                        </option>

                        <option value="active">
                          active
                        </option>

                        <option value="completion_review">
                          completion review
                        </option>

                        <option value="completed">
                          completed
                        </option>

                        <option value="cancelled">
                          cancelled
                        </option>
                      </select>
                    )}

                    <button
                      type="button"
                      className="icon-button"
                      onClick={() =>
                        toggleProject(
                          project.id
                        )
                      }
                    >
                      {expanded ? (
                        <ChevronUp
                          size={18}
                        />
                      ) : (
                        <ChevronDown
                          size={18}
                        />
                      )}
                    </button>
                  </div>

                  {expanded && (
                    <div className="admin-project-expand">
                      <div className="project-operation-grid">
                        <div>
                          <span>
                            Calendar day
                          </span>

                          <strong>
                            {project.current_day ||
                              0}
                            /
                            {project.duration_days ||
                              14}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Replacement slots
                          </span>

                          <strong>
                            {project.replacement_slots_open ||
                              0}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Testing start
                          </span>

                          <strong>
                            {formatDate(
                              project.scheduled_start_date
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Testing end
                          </span>

                          <strong>
                            {formatDate(
                              project.testing_end_date
                            )}
                          </strong>
                        </div>
                      </div>

                      {loadingProjectId ===
                      project.id ? (
                        <div className="full-loader inline-loader">
                          Loading testers…
                        </div>
                      ) : assignments.length ? (
                        <div className="table-wrap">
                          <table>
                            <thead>
                              <tr>
                                <th>Tester</th>
                                <th>Device</th>
                                <th>Status</th>
                                <th>Progress</th>
                                <th>Rejections</th>
                                <th>Reward</th>
                                <th>Action</th>
                              </tr>
                            </thead>

                            <tbody>
                              {assignments.map(
                                (
                                  assignment
                                ) => (
                                  <tr
                                    key={
                                      assignment.id
                                    }
                                  >
                                    <td>
                                      <strong>
                                        {assignment
                                          .tester
                                          ?.full_name ||
                                          "Unnamed tester"}
                                      </strong>

                                      <small>
                                        {assignment
                                          .tester
                                          ?.email ||
                                          ""}
                                      </small>
                                    </td>

                                    <td>
                                      {assignment
                                        .tester
                                        ?.device_model ||
                                        "—"}

                                      <small>
                                        {assignment.tester?.android_version
  ? assignment.tester.android_version
      .toLowerCase()
      .startsWith("android")
    ? assignment.tester.android_version
    : `Android ${assignment.tester.android_version}`
  : ""}
                                      </small>
                                    </td>

                                    <td>
                                      <Badge
                                        tone={statusTone(
                                          assignment.status
                                        )}
                                      >
                                        {statusLabel(
                                          assignment.status
                                        )}
                                      </Badge>
                                    </td>

                                    <td>
                                      Day{" "}
                                      {assignment.last_approved_day ||
                                        0}
                                      /
                                      {project.duration_days ||
                                        14}
                                    </td>

                                    <td>
                                      {assignment.rejection_count ||
                                        0}
                                    </td>

                                    <td>
                                      <Badge
                                        tone={statusTone(
                                          assignment.reward_status
                                        )}
                                      >
                                        {statusLabel(
                                          assignment.reward_status
                                        )}
                                      </Badge>
                                    </td>

                                    <td>
                                      {![
                                        "completed",
                                        "failed",
                                        "removed",
                                      ].includes(
                                        assignment.status
                                      ) ? (
                                        <div className="table-actions">
                                          <button
                                            type="button"
                                            className="icon-button"
                                            title="Mark failed"
                                            onClick={() => {
                                              setTesterAction(
                                                {
                                                  assignment,
                                                  projectId:
                                                    project.id,
                                                  mode: "failed",
                                                }
                                              );

                                              setReason(
                                                ""
                                              );
                                            }}
                                          >
                                            <ShieldAlert
                                              size={
                                                17
                                              }
                                            />
                                          </button>

                                          <button
                                            type="button"
                                            className="icon-button"
                                            title="Remove tester"
                                            onClick={() => {
                                              setTesterAction(
                                                {
                                                  assignment,
                                                  projectId:
                                                    project.id,
                                                  mode: "removed",
                                                }
                                              );

                                              setReason(
                                                ""
                                              );
                                            }}
                                          >
                                            <UserMinus
                                              size={
                                                17
                                              }
                                            />
                                          </button>
                                        </div>
                                      ) : (
                                        <span>—</span>
                                      )}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <Empty
                          title="No testers assigned"
                          body="Accepted testers will appear here."
                        />
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <Empty
            title="No projects"
            body="Developer projects will appear here."
          />
        )}
      </Card>

      {testerAction && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-head">
              <div>
                <span className="eyebrow">
                  {testerAction.mode ===
                  "failed"
                    ? "Fail tester"
                    : "Remove tester"}
                </span>

                <h2>
                  {testerAction.assignment
                    .tester?.full_name ||
                    "Tester"}
                </h2>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={() =>
                  setTesterAction(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <p className="modal-description">
              {testerAction.mode ===
              "failed"
                ? "The tester will become ineligible for the reward. An early replacement slot may reopen automatically."
                : "The tester will be removed without being marked as a failed participant."}
            </p>

            <label>
              Reason

              <textarea
                rows="5"
                value={reason}
                onChange={(event) =>
                  setReason(
                    event.target.value
                  )
                }
              />
            </label>

            <div className="modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() =>
                  setTesterAction(null)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="button danger"
                disabled={
                  !reason.trim() ||
                  Boolean(changingId)
                }
                onClick={
                  confirmTesterAction
                }
              >
                {testerAction.mode ===
                "failed"
                  ? "Mark failed"
                  : "Remove tester"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export function AdminUsers() {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    adminUsers()
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
            "Could not load platform users."
        )
      )
      .finally(() =>
        setLoading(false)
      );
  }, []);

  const workspaceCounts =
    useMemo(() => {
      return {
        developers: items.filter(
          (user) =>
            user.is_developer
        ).length,

        testers: items.filter(
          (user) =>
            user.is_tester
        ).length,

        admins: items.filter(
          (user) =>
            user.is_admin
        ).length,
      };
    }, [items]);

  return (
    <DashboardLayout>
      <PageHead
        eyebrow="Network"
        title="Users and testers"
        description="View account access, tester devices and reliability."
      />

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      <div className="stats-grid">
        <Card>
          <FolderKanban />
          <span>Developers</span>

          <strong>
            {workspaceCounts.developers}
          </strong>
        </Card>

        <Card>
          <Users />
          <span>Testers</span>

          <strong>
            {workspaceCounts.testers}
          </strong>
        </Card>

        <Card>
          <ShieldAlert />
          <span>Administrators</span>

          <strong>
            {workspaceCounts.admins}
          </strong>
        </Card>
      </div>

      <Card>
        {loading ? (
          <div className="full-loader inline-loader">
            Loading users…
          </div>
        ) : items.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Workspaces</th>
                  <th>Device</th>
                  <th>Reliability</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {items.map((user) => {
                  const workspaces = [];

                  if (user.is_developer) {
                    workspaces.push(
                      "Developer"
                    );
                  }

                  if (user.is_tester) {
                    workspaces.push(
                      "Tester"
                    );
                  }

                  if (user.is_admin) {
                    workspaces.push(
                      "Admin"
                    );
                  }

                  return (
                    <tr key={user.id}>
                      <td>
                        <strong>
                          {user.full_name ||
                            "Unnamed user"}
                        </strong>

                        <small>
                          {user.email}
                        </small>
                      </td>

                      <td>
                        <div className="badge-row">
                          {workspaces.map(
                            (workspace) => (
                              <Badge
                                key={
                                  workspace
                                }
                              >
                                {workspace}
                              </Badge>
                            )
                          )}
                        </div>
                      </td>

                      <td>
                        {user.device_model ||
                          "—"}

                        <small>
                          {user.android_version
                            ? `Android ${user.android_version}`
                            : ""}
                        </small>
                      </td>

                      <td>
                        {user.reliability_score ??
                          100}
                        %
                      </td>

                      <td>
                        <Badge
                          tone={statusTone(
                            user.status
                          )}
                        >
                          {user.status}
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
            title="No users"
            body="Registered accounts will appear here."
          />
        )}
      </Card>
    </DashboardLayout>
  );
}