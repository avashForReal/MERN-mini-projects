// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  chat: icon('ic_chat'),
  file: icon('ic_file'),
  calendar: icon('ic_calendar'),
  dashboard: icon('ic_dashboard'),
  gallery: icon('ic_gallery'),
  location: icon('ic_location'),
  transaction: icon('ic_cash')
};

const navConfig = [
  {
    subheader: 'general',
    items: [
      { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'gallery', path: PATH_DASHBOARD.general.gallery, icon: ICONS.gallery },
      {
        title: 'todos',
        path: PATH_DASHBOARD.todos.root,
        icon: ICONS.file,
        children: [
          { title: 'list', path: PATH_DASHBOARD.todos.list },
          { title: 'create', path: PATH_DASHBOARD.todos.new },
        ]
      },
      {
        title: 'locations',
        path: PATH_DASHBOARD.location.root,
        icon: ICONS.location,
        children: [
          { title: 'list', path: PATH_DASHBOARD.location.list },
          { title: 'create', path: PATH_DASHBOARD.location.new },
        ]
      },
      {
        title: 'transactions',
        path: PATH_DASHBOARD.transactions.root,
        icon: ICONS.transaction,
        children: [
          { title: 'list', path: PATH_DASHBOARD.transactions.list },
          { title: 'create', path: PATH_DASHBOARD.transactions.new },
        ]
      },
      {
        title: 'chat',
        path: PATH_DASHBOARD.chat.root,
        icon: ICONS.chat,
      },
      {
        title: 'events',
        path: PATH_DASHBOARD.events.root,
        icon: ICONS.calendar,
      },
    ],
  },
];

export default navConfig;
