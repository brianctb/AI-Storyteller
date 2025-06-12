const BASE = "/api/v1";

const ROUTES = {
  AI: {
    GENERATE: "/generate",
    HAIKU: "/generate-haiku",
    JOKE: "/generate-joke",
  },
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    CHECKUSER: "/checkUser",
  },
  USER: {
    UPDATE: "/update",
    GETAPICALLS: "/getApiCalls",
  },
  ADMIN: {
    USERSDATA: "/admin/data",
    DELETEUSER: "/admin/delete",
    GETRESOURCE: "/admin/resource",
  },
};

module.exports = { ROUTES, BASE };
