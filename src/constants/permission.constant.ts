export const PERMISSIONS = {
  // Course Management Permissions
  CREATE_COURSE: "create-course",
  VIEW_COURSE: "view-course",
  EDIT_COURSE: "edit-course",
  DELETE_COURSE: "delete-course",
  RESTORE_COURSE: "restore-course",
  UPDATE_COURSE: "update-course",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
