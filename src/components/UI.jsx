import {
  Link,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";


import {
  Anchor,
  Bell,
  CheckCheck,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Repeat2,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";


import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useAuth,
} from "../context/AuthContext";


import {
  getNotificationSummary,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  subscribeToNotifications,
} from "../lib/api";


export function Logo() {
  const {
    user,
    profile,
  } = useAuth();

  const destination =
    !user
      ? "/"
      : profile?.preferred_workspace ===
            "admin" &&
          profile?.is_admin
        ? "/admin"
        : "/dashboard";

  return (
    <Link
      to={destination}
      className="logo"
    >
      <span>
        <Anchor size={18} />
      </span>

      Shipyard
    </Link>
  );
}
export function PublicNav() {
  const {
    user,
    profile,
  } = useAuth();

  const dashboardDestination =
    profile?.preferred_workspace ===
        "admin" &&
      profile?.is_admin
      ? "/admin"
      : "/dashboard";

  return (
    <header className="public-nav">
      <Logo />

      <nav>
        <NavLink to="/how-it-works">
          How it works
        </NavLink>

        <NavLink to="/pricing">
          Pricing
        </NavLink>

        <NavLink to="/become-a-tester">
          For testers
        </NavLink>
      </nav>

      <div className="nav-actions">
        {user ? (
          <Link
            className="button small"
            to={dashboardDestination}
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login">
              Log in
            </Link>

            <Link
              className="button small"
              to="/signup"
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

const links = {
  developer: [
    [
      "/dashboard",
      "Overview",
      LayoutDashboard,
    ],

    [
      "/projects",
      "Projects",
      FolderKanban,
    ],

    [
      "/new-project",
      "New test",
      ClipboardCheck,
    ],

    [
      "/notifications",
      "Notifications",
      Bell,
    ],
  ],

  tester: [
    [
      "/dashboard",
      "Overview",
      LayoutDashboard,
    ],

    [
      "/available-tests",
      "Available tests",
      FolderKanban,
    ],

    [
      "/assignments",
      "My assignments",
      ClipboardCheck,
    ],

    [
      "/notifications",
      "Notifications",
      Bell,
    ],
  ],

  admin: [
    [
      "/admin",
      "Overview",
      LayoutDashboard,
    ],

    [
      "/admin/projects",
      "Projects",
      FolderKanban,
    ],

    [
      "/admin/users",
      "Users",
      Users,
    ],

    [
      "/notifications",
      "Notifications",
      Bell,
    ],
  ],
};

function timeAgo(value) {
  const date = new Date(value);

  const difference =
    Date.now() -
    date.getTime();

  if (
    Number.isNaN(difference)
  ) {
    return "";
  }

  const minutes =
    Math.max(
      1,
      Math.floor(
        difference / 60000
      )
    );

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
    }
  ).format(date);
}


function notificationTone(type) {
  if (
    [
      "evidence_rejected",
      "assignment_at_risk",
      "assignment_removed",
      "reward_cancelled",
      "project_cancelled",
    ].includes(type)
  ) {
    return "danger";
  }

  if (
    [
      "evidence_approved",
      "assignment_completed",
      "reward_paid",
      "project_completed",
    ].includes(type)
  ) {
    return "success";
  }

  if (
    [
      "reward_eligible",
      "project_completion_review",
      "replacement_required",
    ].includes(type)
  ) {
    return "warning";
  }

  return "info";
}


export function NotificationBell() {
  const navigate =
    useNavigate();

  const wrapperRef =
    useRef(null);

  const [open, setOpen] =
    useState(false);

  const [items, setItems] =
    useState([]);

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [loading, setLoading] =
    useState(true);


  const load = async () => {
    try {
      const [
        notifications,
        summary,
      ] = await Promise.all([
        listNotifications({
          limit: 8,
          unreadOnly: false,
        }),

        getNotificationSummary(),
      ]);

      setItems(
        Array.isArray(
          notifications
        )
          ? notifications
          : []
      );

      setUnreadCount(
        Number(
          summary?.unread_count ||
            0
        )
      );
    } catch (error) {
      console.warn(
        "Notifications could not be loaded:",
        error.message
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

    const closeOnOutsideClick =
      (event) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(
            event.target
          )
        ) {
          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      closeOnOutsideClick
    );

    return () => {
      unsubscribe?.();

      document.removeEventListener(
        "mousedown",
        closeOnOutsideClick
      );
    };
  }, []);


  const openNotification =
    async (notification) => {
      try {
        if (!notification.read_at) {
          await markNotificationRead(
            notification.id
          );

          setUnreadCount(
            (current) =>
              Math.max(
                current - 1,
                0
              )
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
      } catch (error) {
        console.warn(
          "Notification could not be marked read:",
          error.message
        );
      }

      setOpen(false);

      navigate(
        notification.action_url ||
          "/notifications"
      );
    };


  const markEverythingRead =
    async () => {
      try {
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

        setUnreadCount(0);
      } catch (error) {
        console.warn(
          "Notifications could not be marked read:",
          error.message
        );
      }
    };


  return (
    <div
      className="notification-bell"
      ref={wrapperRef}
    >
      <button
        type="button"
        className="notification-trigger"
        aria-label="Open notifications"
        aria-expanded={open}
        onClick={() =>
          setOpen(
            (current) =>
              !current
          )
        }
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-popover">
          <div className="notification-popover-head">
            <div>
              <strong>
                Notifications
              </strong>

              <small>
                {unreadCount
                  ? `${unreadCount} unread`
                  : "You are all caught up"}
              </small>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={
                  markEverythingRead
                }
              >
                <CheckCheck
                  size={16}
                />

                Mark all read
              </button>
            )}
          </div>

          <div className="notification-preview-list">
            {loading ? (
              <div className="notification-empty">
                Loading notifications…
              </div>
            ) : items.length ? (
              items.map(
                (notification) => (
                  <button
                    type="button"
                    className={`notification-preview ${
                      notification.read_at
                        ? ""
                        : "unread"
                    }`}
                    key={
                      notification.id
                    }
                    onClick={() =>
                      openNotification(
                        notification
                      )
                    }
                  >
                    <span
                      className={`notification-dot ${notificationTone(
                        notification.type
                      )}`}
                    />

                    <span className="grow">
                      <strong>
                        {
                          notification.title
                        }
                      </strong>

                      <small>
                        {
                          notification.body
                        }
                      </small>

                      <time>
                        {timeAgo(
                          notification.created_at
                        )}
                      </time>
                    </span>
                  </button>
                )
              )
            ) : (
              <div className="notification-empty">
                <Bell size={22} />

                No notifications yet.
              </div>
            )}
          </div>

          <Link
            className="notification-view-all"
            to="/notifications"
            onClick={() =>
              setOpen(false)
            }
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}

export function Protected({children,roles}){const {user,profile,loading,isConfigured}=useAuth();if(!isConfigured)return <SetupRequired/>;if(loading)return <FullLoader/>;if(!user)return <Navigate to="/login" replace/>;if(!profile)return <FullLoader/>;const access={developer:profile.is_developer||profile.is_admin,tester:profile.is_tester,admin:profile.is_admin};if(roles&&!roles.some(role=>access[role]))return <Navigate to="/dashboard" replace/>;return children;}
export function DashboardLayout({
  children,
}) {
  const {
    profile,
    signOut,
    refreshProfile,
  } = useAuth();

  const [open, setOpen] =
    useState(false);

  const [
    switching,
    setSwitching,
  ] = useState(false);

  const role =
    profile?.preferred_workspace ===
      "admin" &&
    profile?.is_admin
      ? "admin"
      : profile?.preferred_workspace ===
            "tester" &&
          profile?.is_tester
        ? "tester"
        : "developer";


  const switchWorkspace =
    async (workspace) => {
      if (workspace === role) {
        return;
      }

      setSwitching(true);

      try {
        const {
          setPreferredWorkspace,
        } = await import(
          "../lib/api"
        );

        await setPreferredWorkspace(
          workspace
        );

        await refreshProfile();

        location.href =
          workspace === "admin"
            ? "/admin"
            : "/dashboard";
      } finally {
        setSwitching(false);
      }
    };


  return (
    <div className="app-shell">
      <aside
        className={
          open
            ? "sidebar open"
            : "sidebar"
        }
      >
        <div className="side-head">
          <Logo />

          <button
            type="button"
            className="icon-btn mobile"
            onClick={() =>
              setOpen(false)
            }
          >
            <X />
          </button>
        </div>

        <div className="profile-mini">
          <div className="avatar">
            {profile
              ?.full_name?.[0] ||
              "S"}
          </div>

          <div>
            <strong>
              {profile?.full_name ||
                "Shipyard user"}
            </strong>

            <small>
              {profile?.is_developer &&
              profile?.is_tester
                ? "Developer + Tester"
                : role}
            </small>
          </div>
        </div>

        {(profile?.is_developer &&
          profile?.is_tester) ||
        profile?.is_admin ? (
          <div className="workspace-switcher">
            <span>
              <Repeat2
                size={14}
              />

              Workspace
            </span>

            {profile?.is_developer && (
              <button
                type="button"
                className={
                  role ===
                  "developer"
                    ? "active"
                    : ""
                }
                disabled={switching}
                onClick={() =>
                  switchWorkspace(
                    "developer"
                  )
                }
              >
                Developer
              </button>
            )}

            {profile?.is_tester && (
              <button
                type="button"
                className={
                  role === "tester"
                    ? "active"
                    : ""
                }
                disabled={switching}
                onClick={() =>
                  switchWorkspace(
                    "tester"
                  )
                }
              >
                Tester
              </button>
            )}

            {profile?.is_admin && (
              <button
                type="button"
                className={
                  role === "admin"
                    ? "active"
                    : ""
                }
                disabled={switching}
                onClick={() =>
                  switchWorkspace(
                    "admin"
                  )
                }
              >
                Admin
              </button>
            )}
          </div>
        ) : null}

        <nav>
          {(links[role] ||
            links.developer
          ).map(
            ([
              to,
              label,
              Icon,
            ]) => (
              <NavLink
                end={
                  to ===
                    "/dashboard" ||
                  to === "/admin"
                }
                key={to}
                to={to}
                onClick={() =>
                  setOpen(false)
                }
              >
                <Icon size={18} />

                {label}
              </NavLink>
            )
          )}
        </nav>

        {role === "developer" &&
          !profile?.is_tester && (
            <Link
              className="workspace-add"
              to="/enable-tester"
            >
              <UserPlus
                size={17}
              />

              Become a tester
            </Link>
          )}

        {role === "tester" &&
          !profile?.is_developer && (
            <Link
              className="workspace-add"
              to="/enable-developer"
            >
              <UserPlus
                size={17}
              />

              Enable developer tools
            </Link>
          )}

        <button
          type="button"
          className="logout"
          onClick={signOut}
        >
          <LogOut size={18} />

          Sign out
        </button>
      </aside>

      <main className="app-main">
        <header className="mobile-top">
          <button
            type="button"
            className="icon-btn"
            onClick={() =>
              setOpen(true)
            }
          >
            <Menu />
          </button>

          <Logo />

          <NotificationBell />
        </header>

        <div className="desktop-notification-bell">
          <NotificationBell />
        </div>

        {children}
      </main>
    </div>
  );
}
export function PageHead({eyebrow,title,description,action}){return <div className="page-head"><div><small className="eyebrow">{eyebrow}</small><h1>{title}</h1>{description&&<p>{description}</p>}</div>{action}</div>}
export function Card({children,className=''}){return <section className={`card ${className}`}>{children}</section>}
export function Empty({title,body,action}){return <div className="empty"><ShieldCheck/><h3>{title}</h3><p>{body}</p>{action}</div>}
export function FullLoader(){return <div className="full-loader"><div className="spinner"/>Loading Shipyard…</div>}
export function SetupRequired(){return <div className="setup"><Logo/><h1>Connect your backend</h1><p>This production build needs your Supabase environment variables. Copy <code>.env.example</code> to <code>.env.local</code>, add your project URL and anon key, then restart Vite.</p><pre>VITE_SUPABASE_URL=...{`\n`}VITE_SUPABASE_ANON_KEY=...</pre></div>}
export function Badge({children,tone='default'}){return <span className={`badge ${tone}`}>{children}</span>}
