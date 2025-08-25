import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Fragment, lazy, Suspense } from "react";
import { ConfigProvider } from "antd";
import { useSelector } from "react-redux";

import {
  publicRouters,
  privateRouters,
  adminRouters,
  reporterRouters,
  editorRouters,
  moderatorRouters,
} from "~/routers";
import DefaultLayout from "~/layouts/DefaultLayout";
import AdminLayout from "~/layouts/AdminLayout";
import ReporterLayout from "~/layouts/ReporterLayout";
import EditorLayout from "~/layouts/EditorLayout";
import ModeratorLayout from "~/layouts/ModeratorLayout";

const NotFound = lazy(() => import("~/pages/PublicPages/NotFound"));

const ProtectedRoute = () => {
  const user = useSelector((state) => state.auth.login.currentUser);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const RenderRoutes = ({ routes, Layout }) => {
  return routes.map((route, index) => {
    const Page = route.component;
    let LayoutComponent = Layout;

    if (route.layout) {
      LayoutComponent = route.layout;
    } else if (route.layout === null) {
      LayoutComponent = Fragment;
    }

    return (
      <Route
        key={index}
        path={route.path}
        element={
          <LayoutComponent>
            <Page />
          </LayoutComponent>
        }
      />
    );
  });
};

function App() {
  const user = useSelector((state) => state.auth.login.currentUser);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Roboto, sans-serif",
        },
      }}
    >
      <Router>
        <div className="App">
          <Suspense>
            {!user ? (
              <Routes>
                {publicRouters.map((route, index) => {
                  const Page = route.component;
                  let LayoutPublic = DefaultLayout;

                  if (route.layout) {
                    LayoutPublic = route.layout;
                  } else if (route.layout === null) {
                    LayoutPublic = Fragment;
                  }

                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        <LayoutPublic>
                          <Page />
                        </LayoutPublic>
                      }
                    />
                  );
                })}

                <Route element={<ProtectedRoute />}>
                  {privateRouters.map((route, index) => {
                    const Page = route.component;
                    let LayoutPrivate = DefaultLayout;

                    if (route.layout) {
                      LayoutPrivate = route.layout;
                    } else if (route.layout === null) {
                      LayoutPrivate = Fragment;
                    }

                    return (
                      <Route
                        key={index}
                        path={route.path}
                        element={
                          <LayoutPrivate>
                            <Page />
                          </LayoutPrivate>
                        }
                      />
                    );
                  })}
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            ) : (
              <>
                {user.role?.role_name === "admin" && (
                  <Routes element={<ProtectedRoute />}>
                    {RenderRoutes({
                      routes: adminRouters,
                      Layout: AdminLayout,
                    })}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                )}

                {user.role?.role_name === "reporter" && (
                  <>
                    <Routes element={<ProtectedRoute />}>
                      {RenderRoutes({
                        routes: reporterRouters,
                        Layout: ReporterLayout,
                      })}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </>
                )}

                {user.role?.role_name === "editor" && (
                  <Routes element={<ProtectedRoute />}>
                    {RenderRoutes({
                      routes: editorRouters,
                      Layout: EditorLayout,
                    })}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                )}

                {user.role?.role_name === "moderator" && (
                  <Routes element={<ProtectedRoute />}>
                    {RenderRoutes({
                      routes: moderatorRouters,
                      Layout: ModeratorLayout,
                    })}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                )}

                {user.role?.role_name === "user" && (
                  <Routes element={<ProtectedRoute />}>
                    {RenderRoutes({
                      routes: privateRouters,
                      Layout: DefaultLayout,
                    })}
                    {RenderRoutes({
                      routes: publicRouters,
                      Layout: DefaultLayout,
                    })}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                )}
              </>
            )}
          </Suspense>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
