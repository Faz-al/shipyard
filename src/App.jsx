import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  Home,
  Pricing,
  How,
  TesterPage,
  Legal,
  Contact,
} from "./pages/Public";

import {
  AuthPage,
} from "./pages/Auth";

import {
  Dashboard,
  Projects,
  NewProject,
  AvailableTests,
} from "./pages/Dashboard";

import {
  ProjectDetail,
  Assignments,
  AssignmentDetail,
} from "./pages/Details";

import {
  AdminDashboard,
  AdminProjects,
  AdminUsers,
} from "./pages/Admin";

import {
  EnableTesterWorkspace,
  EnableDeveloperWorkspace,
} from "./pages/Workspace";

import {
  Notifications,
} from "./pages/Notifications";


import EditProject
  from "./pages/EditProject";


  import {
  BlogArticle,
  BlogIndex,
} from "./pages/Blogs";



import {
  Protected,
  PublicOnly,
} from "./components/UI";

import {
  useAuth,
} from "./context/AuthContext";





function RoleRedirect() {
  const { profile } =
    useAuth();

  if (
    profile?.preferred_workspace ===
      "admin" &&
    profile?.is_admin
  ) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  return <Dashboard />;
}


export default function App() {
  return (
    <Routes>
      <Route
  path="/"
  element={
    <PublicOnly>
      <Home />
    </PublicOnly>
  }
/>

      <Route
        path="/pricing"
        element={<Pricing />}
      />

      <Route
        path="/how-it-works"
        element={<How />}
      />

      <Route
        path="/become-a-tester"
        element={<TesterPage />}
      />

      <Route
  path="/contact"
  element={<Contact />}
/>

      <Route
        path="/privacy"
        element={
          <Legal type="privacy" />
        }
      />

      <Route
        path="/terms"
        element={
          <Legal type="terms" />
        }
      />

      <Route
  path="/refund"
  element={
    <Legal type="refund" />
  }
/>

<Route
  path="/refund-policy"
  element={
    <Legal type="refund" />
  }
/>



<Route
  path="/blog"
  element={<BlogIndex />}
/>

<Route
  path="/blog/:slug"
  element={<BlogArticle />}
/>





      <Route
  path="/login"
  element={
    <PublicOnly>
      <AuthPage />
    </PublicOnly>
  }
/>

      <Route
  path="/signup"
  element={
    <PublicOnly>
      <AuthPage mode="signup" />
    </PublicOnly>
  }
/>

     <Route
  path="/forgot-password"
  element={
    <PublicOnly>
      <AuthPage mode="forgot" />
    </PublicOnly>
  }
/>

      <Route
        path="/dashboard"
        element={
          <Protected>
            <RoleRedirect />
          </Protected>
        }
      />

      <Route
        path="/notifications"
        element={
          <Protected>
            <Notifications />
          </Protected>
        }
      />

      <Route
        path="/projects"
        element={
          <Protected
            roles={["developer"]}
          >
            <Projects />
          </Protected>
        }
      />

      <Route
        path="/projects/:id"
        element={
          <Protected
            roles={[
              "developer",
              "admin",
            ]}
          >
            <ProjectDetail />
          </Protected>
        }
      />


      <Route
  path="/projects/:id/edit"
  element={
    <Protected
      roles={["developer"]}
    >
      <EditProject />
    </Protected>
  }
/>



      <Route
        path="/new-project"
        element={
          <Protected
            roles={["developer"]}
          >
            <NewProject />
          </Protected>
        }
      />

      <Route
        path="/available-tests"
        element={
          <Protected
            roles={["tester"]}
          >
            <AvailableTests />
          </Protected>
        }
      />

      <Route
        path="/assignments"
        element={
          <Protected
            roles={["tester"]}
          >
            <Assignments />
          </Protected>
        }
      />

      <Route
        path="/assignments/:id"
        element={
          <Protected
            roles={["tester"]}
          >
            <AssignmentDetail />
          </Protected>
        }
      />

      <Route
        path="/enable-tester"
        element={
          <Protected>
            <EnableTesterWorkspace />
          </Protected>
        }
      />

      <Route
        path="/enable-developer"
        element={
          <Protected>
            <EnableDeveloperWorkspace />
          </Protected>
        }
      />

      <Route
        path="/admin"
        element={
          <Protected
            roles={["admin"]}
          >
            <AdminDashboard />
          </Protected>
        }
      />

      <Route
        path="/admin/projects"
        element={
          <Protected
            roles={["admin"]}
          >
            <AdminProjects />
          </Protected>
        }
      />

      <Route
        path="/admin/users"
        element={
          <Protected
            roles={["admin"]}
          >
            <AdminUsers />
          </Protected>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
          />
        }
      />
    </Routes>
  );
}