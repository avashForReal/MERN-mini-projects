import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';


import axios from '../../../utils/axios';



TodoNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTodo: PropTypes.object,
};

export default function TodoNewEditForm({ isEdit, currentTodo }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewTodoSchema = Yup.object().shape({
    title: Yup.string().required('Todo is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentTodo?.title || '',
      id: currentTodo?._id || ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTodo]
  );

  const methods = useForm({
    resolver: yupResolver(NewTodoSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentTodo) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentTodo]);


  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await axios.put(`/todos/${data.id}`, { title: data.title });
      } else {
        await axios.post('/todos', data);
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.todos.list);
    } catch (error) {
      toast.error(error.message || "An error occured", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <RHFTextField name="title" label="Todo" />

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create' : 'Update'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
