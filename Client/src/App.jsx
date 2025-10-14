import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Fragment, Suspense } from "react";
import { useSelector } from "react-redux";

import config from "~/config";
import NotFound from "~/pages/PublicPages/NotFound";
import AccessDenied from "~/pages/PublicPages/AccessDenied";
import ScrollToTop from "~/components/ScrollToTop";
import RbacRouter from "~/components/core/RbacRouter";

// Layout
import DefaultLayout from "~/layouts/DefaultLayout";
import AdminLayout from "~/layouts/AdminLayout";
import ReporterLayout from "~/layouts/ReporterLayout";
import EditorLayout from "~/layouts/EditorLayout";
import ModeratorLayout from "~/layouts/ModeratorLayout";

// Import Public Page
import Home from "~/pages/PublicPages/Home";
import NewsContent from "~/pages/PublicPages/NewsContent";
import SearchNews from "~/pages/PublicPages/SearchNews";
import Genre from "~/pages/PublicPages/Genre";
import LatestNews from "~/pages/PublicPages/LatestNews";

// Import Admin Page
import UserMange from "~/pages/PrivatePages/AdminPages/UserMange";
import CategoryMange from "~/pages/PrivatePages/AdminPages/CategoryMange";
import NewsMange from "~/pages/PrivatePages/AdminPages/NewsMange";

// Import Private Page
import Profile from "~/pages/PrivatePages/Profile";
import NewsMangeReporter from "~/pages/PrivatePages/ReporterPages/NewsMangeReporter";
import ArticleCommon from "~/pages/PrivatePages/ArticleCommon";
import CommentMange from "~/pages/PrivatePages/ModeratorPages/CommentMange/CommentMange";
import ProposeMange from "~/pages/PrivatePages/EditorPages/ProposeMange/ProposeMange";

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/" replace />;
  return <Outlet />;
};

const Wrapper = ({ layout }) => {
  const Component = layout || Fragment;
  return (
    <Component>
      <Outlet />
    </Component>
  );
};

function App() {
  const user = useSelector((state) => state.auth.login.currentUser);

  return (
    <div className="App">
      <ScrollToTop />
      <Suspense>
        <Routes>
          {/* Public */}
          <Route element={<Wrapper layout={DefaultLayout} />}>
            <Route path={`/${config.routes.home}`} element={<Home />} />
            <Route path={`/${config.routes.news}`} element={<NewsContent />} />
            <Route path={`/${config.routes.search}`} element={<SearchNews />} />
            <Route path={`/${config.routes.genre}`} element={<Genre />} />
            <Route path={`/${config.routes.latest}`} element={<LatestNews />} />
          </Route>

          {/* Private */}
          <Route element={<ProtectedRoute user={user} />}>
            <Route path={`/${config.routes.profile}`} element={<Profile />} />

            <Route element={<Wrapper layout={ReporterLayout} user={user} />}>
              <Route element={<RbacRouter requiredPermission={config.permissions.VIEW_DASHBOARD_REPORTER} />}>
                <Route path="/reporter/dashboard" element={<ArticleCommon />} />
                <Route path="/reporter/article" element={<NewsMangeReporter />} />
              </Route>
            </Route>

            <Route element={<Wrapper layout={AdminLayout} user={user} />}>
              <Route element={<RbacRouter requiredPermission={config.permissions.VIEW_DASHBOARD_ADMIN} />}>
                <Route path="/admin/dashboard" element={<UserMange />} />
                <Route path="/admin/article" element={<ArticleCommon />} />
                <Route path="/admin/category" element={<CategoryMange />} />
                <Route path="/admin/newsMange" element={<NewsMange />} />
              </Route>
            </Route>

            <Route element={<Wrapper layout={EditorLayout} user={user} />}>
              <Route element={<RbacRouter requiredPermission={config.permissions.VIEW_DASHBOARD_EDITOR} />}>
                <Route path="/editor/propose" element={<ProposeMange />} />
                <Route path="/editor/article" element={<ArticleCommon />} />
              </Route>
            </Route>

            <Route element={<Wrapper layout={ModeratorLayout} user={user} />}>
              <Route element={<RbacRouter requiredPermission={config.permissions.VIEW_DASHBOARD_MODERATOR} />}>
                <Route path="/moderator/comment" element={<CommentMange />} />
              </Route>
            </Route>
          </Route>

          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
