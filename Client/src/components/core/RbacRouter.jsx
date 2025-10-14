import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { usePermission } from "~/hooks";
import config from "~/config";

function RbacRouter({
  requiredPermission,
  redirectTo = "/access-denied",
  children,
}) {
  // Dùng children nếu phiên bản react-router-dom < 6
  const user = useSelector((state) => state.auth.login.currentUser);

  const userRole = user?.role.role_name || config.roles.USER;
  const { hasPermission } = usePermission(userRole);

  if (!hasPermission(requiredPermission))
    return <Navigate to={redirectTo} replace />;

  return <Outlet />;
}

export default RbacRouter;
