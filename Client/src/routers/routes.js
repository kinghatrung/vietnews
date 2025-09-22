import config from "~/config";

// Import Public Page
import Home from "~/pages/PublicPages/Home";
import NewsContent from "~/pages/PublicPages/NewsContent";
import SearchNews from "~/pages/PublicPages/SearchNews";
import Genre from "~/pages/PublicPages/Genre";
import LatestNews from "~/pages/PublicPages/LatestNews";

// Import Private Page
import Profile from "~/pages/PrivatePages/Profile";
import NewsMangeReporter from "~/pages/PrivatePages/ReporterPages/NewsMangeReporter";
import ArticleCommon from "~/pages/PrivatePages/ArticleCommon";
import CommentMange from "~/pages/PrivatePages/ModeratorPages/CommentMange/CommentMange";
import ProposeMange from "~/pages/PrivatePages/EditorPages/ProposeMange/ProposeMange";

// Import Admin Page
import UserMange from "~/pages/PrivatePages/AdminPages/UserMange";
import CategoryMange from "~/pages/PrivatePages/AdminPages/CategoryMange";
import NewsMange from "~/pages/PrivatePages/AdminPages/NewsMange";

// Public routes
const publicRouters = [
  { path: config.routes.home, component: Home },
  { path: config.routes.search, component: SearchNews },
  { path: config.routes.genre, component: Genre },
  { path: config.routes.news, component: NewsContent },
  { path: config.routes.latest, component: LatestNews },
];

// Private routes
const privateRouters = [{ path: config.routes.profile, component: Profile }];

// Admin routes
const adminRouters = [
  { path: config.routes.home, component: UserMange },
  { path: config.routes.article, component: ArticleCommon },
  { path: config.routes.category, component: CategoryMange },
  { path: config.routes.newsMange, component: NewsMange },
  { path: config.routes.profile, component: Profile },
];

// Reporter routes
const reporterRouters = [
  { path: config.routes.home, component: ArticleCommon },
  { path: config.routes.newsMange, component: NewsMangeReporter },
  { path: config.routes.profile, component: Profile },
];

// Editor routes
const editorRouters = [
  { path: config.routes.home, component: ArticleCommon },
  { path: config.routes.propose, component: ProposeMange },
  { path: config.routes.profile, component: Profile },
];

// Moderator routes
const moderatorRouters = [
  { path: config.routes.home, component: CommentMange },
  { path: config.routes.profile, component: Profile },
];

export {
  publicRouters,
  privateRouters,
  adminRouters,
  reporterRouters,
  editorRouters,
  moderatorRouters,
};
