import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import TodoNewEditForm from '../../sections/@dashboard/todos/TodoNewEditForm';
import axios from '../../utils/axios'

// ----------------------------------------------------------------------

export default function TodoEditPage() {
  const { themeStretch } = useSettingsContext();

  const { todo } = useParams();

  const [current,setCurrent] = useState({});

  const getOneTodo = async () => {
    try{
      const d = await axios.get(`/todos/${todo}`)
      setCurrent(d.data)
    }catch(error){
      toast.error(error.message || "An error occured", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  useEffect(() => {
    getOneTodo()
  },[])

  return (
    <>
      <Helmet>
        <title> Todo: Edit </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit todo"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Todo',
              href: PATH_DASHBOARD.todos.list,
            },
            { name: 'Edit' },
          ]}
        />

        <TodoNewEditForm isEdit currentTodo={current} />
      </Container>
    </>
  );
}
