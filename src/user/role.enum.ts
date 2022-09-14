export enum USER_TYPES {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EDITOR = 'EDITOR',
}

export enum ROLES_ACCESS_ACTION {
  USERS_CONTROLLER_CREATE = 'users.controller.create',

  USERS_CONTROLLER_FINDLIST_ADMIN = 'users.controller.findAll_admin',

  USERS_CONTROLLER_FIND_ONE = 'users.controller.findOne',

  USERS_CONTROLLER_USER_UPDATE = 'users.controller.update',

  USERS_CONTROLLER_DELETE = 'users.controller.delete',
}
export enum CrudActions {
  ReadAll = "ReadAll",
  ReadOne = "ReadOne",
  CreateOne = "CreateOne",
  UpdateOne = "UpdateOne",
  ReplaceOne = "ReplaceOne",
  DeleteOne = "DeleteOne",
}
