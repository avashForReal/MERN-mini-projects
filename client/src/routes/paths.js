function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    gallery: path(ROOTS_DASHBOARD, '/gallery'),
  },
  todos: {
    root: path(ROOTS_DASHBOARD, '/todos'),
    new: path(ROOTS_DASHBOARD, '/todos/new'),
    list: path(ROOTS_DASHBOARD, '/todos/list'),
    edit: (todo) => path(ROOTS_DASHBOARD, `/todos/${todo}/edit`),
  },
  location: {
    root: path(ROOTS_DASHBOARD, '/locations'),
    new: path(ROOTS_DASHBOARD, '/locations/new'),
    list: path(ROOTS_DASHBOARD, '/locations/list'),
  },
  transactions: {
    root: path(ROOTS_DASHBOARD, '/transactions'),
    new: path(ROOTS_DASHBOARD, '/transactions/new'),
    list: path(ROOTS_DASHBOARD, '/transactions/list'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
  },
  events: {
    root: path(ROOTS_DASHBOARD, '/events'),
  }
};