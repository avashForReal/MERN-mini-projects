import { PATH_DASHBOARD } from './routes/paths';

export const HOST_API_KEY = process.env.REACT_APP_HOST_API_KEY || '';

export const MAPBOX_API = process.env.REACT_APP_MAPBOX_API;

export const PATH_AFTER_LOGIN = PATH_DASHBOARD.general.app; // as '/dashboard/app'

export const HEADER = {
  H_MOBILE: 64,
  H_MAIN_DESKTOP: 88,
  H_DASHBOARD_DESKTOP: 92,
  H_DASHBOARD_DESKTOP_OFFSET: 92 - 32,
};

export const NAV = {
  W_BASE: 260,
  W_DASHBOARD: 280,
  W_DASHBOARD_MINI: 88,
  //
  H_DASHBOARD_ITEM: 48,
  H_DASHBOARD_ITEM_SUB: 36,
  //
  H_DASHBOARD_ITEM_HORIZONTAL: 32,
};

export const ICON = {
  NAV_ITEM: 24,
  NAV_ITEM_HORIZONTAL: 22,
  NAV_ITEM_MINI: 22,
};
