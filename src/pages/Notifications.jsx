import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bell,
  CheckCheck,
  CircleAlert,
  CircleCheck,
  Clock3,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Badge,
  Card,
  DashboardLayout,
  Empty,
  PageHead,
} from "../components/UI";

import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  subscribeToNotifications,
} from "../lib/api";


function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

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
      timeStyle: "short",
    }
  ).format(date);
}


function toneForType(type) {
  if (
    [
      "evidence_rejected",
      "assignment_at_risk",
      "assignment_removed",
      "reward_cancelled",
      "project_cancelled",
    ].includes(type)
  ) {
    return "red";
  }

  if (
    [
      "evidence_approved",
      "assignment_completed",
      "reward_paid",
      "project_completed",
    ].includes(type)
  ) {
    return "green";
  }

  if (
    [
      "reward_eligible",
      "project_completion_review",
      "replacement_required",
    ].includes(type)
  ) {
    return "purple";
  }

  return "default";
}


function iconForType(type) {
  if (
    [
      "evidence_rejected",
      "assignment_at_risk",
      "assignment_removed",
      "reward_cancelled",
      "project_cancelled",
    ].includes(type)
  ) {
    return ShieldAlert;
  }

  if (
    [
      "evidence_approved",
      "assignment_completed",
      "reward_paid",
      "project_completed",
    ].includes(type)
  ) {
    return CircleCheck;
  }

  if (
    type ===
    "project_completion_review"
  ) {
    return Clock3;
  }

  if (
    type ===
    "evidence_pending"
  ) {
    return CircleAlert;
  }

  return Bell;
}


export function Notifications() {
  const navigate =
    useNavigate();

  const [items, setItems] =
    useState([]);

  const [filter, setFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [changing, setChanging] =
    useState(false);

  const [error, setError] =
    useState("");


  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await listNotifications({
          limit: 100,
          unreadOnly: false,
        });

      setItems(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Notifications could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    load();

    const unsubscribe =
      subscribeToNotifications(
        () => {
          load();
        }
      );

    return () => {
      unsubscribe?.();
    };
  }, []);


  const visibleItems =
    useMemo(() => {
      if (filter === "unread") {
        return items.filter(
          (item) =>
            !item.read_at
        );
      }

      if (
        filter === "operations"
      ) {
        return items.filter(
          (item) =>
            item.category ===
            "operations"
        );
      }

      if (filter === "rewards") {
        return items.filter(
          (item) =>
            item.category ===
            "rewards"
        );
      }

      return items;
    }, [
      filter,
      items,
    ]);


  const unreadCount =
    items.filter(
      (item) =>
        !item.read_at
    ).length;


  const openNotification =
    async (notification) => {
      try {
        if (!notification.read_at) {
          await markNotificationRead(
            notification.id
          );

          setItems(
            (current) =>
              current.map(
                (item) =>
                  item.id ===
                  notification.id
                    ? {
                        ...item,

                        read_at:
                          new Date().toISOString(),
                      }
                    : item
              )
          );
        }
      } catch (err) {
        setError(
          err.message ||
            "Notification could not be updated."
        );
      }

      navigate(
        notification.action_url ||
          "/notifications"
      );
    };


  const markAllRead =
    async () => {
      try {
        setChanging(true);
        setError("");

        await markAllNotificationsRead();

        setItems(
          (current) =>
            current.map(
              (item) => ({
                ...item,

                read_at:
                  item.read_at ||
                  new Date().toISOString(),
              })
            )
        );
      } catch (err) {
        setError(
          err.message ||
            "Notifications could not be marked read."
        );
      } finally {
        setChanging(false);
      }
    };


  return (
    <DashboardLayout>
      <PageHead
        eyebrow="Activity center"
        title="Notifications"
        description="Evidence reviews, tester risk, project milestones and reward updates."
        action={
          <div className="notification-page-actions">
            <button
              type="button"
              className="button secondary"
              onClick={load}
              disabled={loading}
            >
              <RefreshCw
                size={17}
              />

              Refresh
            </button>

            <button
              type="button"
              className="button"
              onClick={markAllRead}
              disabled={
                changing ||
                unreadCount === 0
              }
            >
              {changing ? (
                <LoaderCircle
                  className="spin"
                  size={17}
                />
              ) : (
                <CheckCheck
                  size={17}
                />
              )}

              Mark all read
            </button>
          </div>
        }
      />

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      <div className="notification-summary">
        <Card>
          <Bell />

          <span>Total</span>

          <strong>
            {items.length}
          </strong>
        </Card>

        <Card>
          <CircleAlert />

          <span>Unread</span>

          <strong>
            {unreadCount}
          </strong>
        </Card>

        <Card>
          <ShieldAlert />

          <span>
            Operations
          </span>

          <strong>
            {
              items.filter(
                (item) =>
                  item.category ===
                  "operations"
              ).length
            }
          </strong>
        </Card>

        <Card>
          <CircleCheck />

          <span>Rewards</span>

          <strong>
            {
              items.filter(
                (item) =>
                  item.category ===
                  "rewards"
              ).length
            }
          </strong>
        </Card>
      </div>

      <Card>
        <div className="notification-filters">
          {[
            [
              "all",
              "All",
            ],

            [
              "unread",
              `Unread (${unreadCount})`,
            ],

            [
              "operations",
              "Operations",
            ],

            [
              "rewards",
              "Rewards",
            ],
          ].map(
            ([
              value,
              label,
            ]) => (
              <button
                type="button"
                key={value}
                className={
                  filter === value
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(value)
                }
              >
                {label}
              </button>
            )
          )}
        </div>

        {loading ? (
          <div className="full-loader inline-loader">
            <LoaderCircle
              className="spin"
            />

            Loading notifications…
          </div>
        ) : visibleItems.length ? (
          <div className="notification-page-list">
            {visibleItems.map(
              (notification) => {
                const Icon =
                  iconForType(
                    notification.type
                  );

                return (
                  <button
                    type="button"
                    key={
                      notification.id
                    }
                    className={`notification-page-item ${
                      notification.read_at
                        ? ""
                        : "unread"
                    }`}
                    onClick={() =>
                      openNotification(
                        notification
                      )
                    }
                  >
                    <span className="notification-page-icon">
                      <Icon
                        size={20}
                      />
                    </span>

                    <span className="grow">
                      <span className="notification-title-row">
                        <strong>
                          {
                            notification.title
                          }
                        </strong>

                        <Badge
                          tone={toneForType(
                            notification.type
                          )}
                        >
                          {notification.category ||
                            "system"}
                        </Badge>
                      </span>

                      <small>
                        {
                          notification.body
                        }
                      </small>

                      <time>
                        {formatDate(
                          notification.created_at
                        )}
                      </time>
                    </span>

                    {!notification.read_at && (
                      <span className="notification-unread-marker" />
                    )}
                  </button>
                );
              }
            )}
          </div>
        ) : (
          <Empty
            title="No notifications here"
            body={
              filter === "all"
                ? "Operational and account updates will appear here."
                : "There are no notifications matching this filter."
            }
          />
        )}
      </Card>
    </DashboardLayout>
  );
}