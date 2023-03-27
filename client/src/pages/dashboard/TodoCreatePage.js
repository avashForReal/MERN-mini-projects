import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import TodoNewEditForm from '../../sections/@dashboard/todos/TodoNewEditForm';

// ----------------------------------------------------------------------

export default function TodoCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Todo: Create a new todo </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new todo"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Todo',
              href: PATH_DASHBOARD.todos.list,
            },
            { name: 'New todo' },
          ]}
        />
        <TodoNewEditForm />
      </Container>
    </>
  );
}
