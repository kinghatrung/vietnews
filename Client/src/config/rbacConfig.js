export const roles = {
  USER: "user",
  ADMIN: "admin",
  REPORTER: "reporter",
  EDITOR: "editor",
  MODERATOR: "moderator",
};

export const permissions = {
  // user
  VIEW_HOME: "view_home",
  VIEW_PROFILE: "view_profile",
  // Admin
  VIEW_DASHBOARD_ADMIN: "view_dashboard_admin",
  //  Reporter
  VIEW_DASHBOARD_REPORTER: "view_dashboard_reporter",
  //Editor
  VIEW_DASHBOARD_EDITOR: "view_dashboard_editor",
  // Moderator
  VIEW_DASHBOARD_MODERATOR: "view_dashboard_moderator",
};

export const rolePermissions = {
  [roles.USER]: [permissions.VIEW_HOME],
  [roles.REPORTER]: [permissions.VIEW_DASHBOARD_REPORTER],
  [roles.EDITOR]: [permissions.VIEW_DASHBOARD_EDITOR],
  [roles.MODERATOR]: [permissions.VIEW_DASHBOARD_MODERATOR],
  [roles.ADMIN]: Object.values(permissions),
};
