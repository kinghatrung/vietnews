import config from "~/config";

function usePermission(useRole) {
  const hasPermission = (permission) => {
    const allowedPermissions = config.rolePermissions[useRole] || [];
    return allowedPermissions.includes(permission);
  };
  return { hasPermission };
}

export { usePermission };
