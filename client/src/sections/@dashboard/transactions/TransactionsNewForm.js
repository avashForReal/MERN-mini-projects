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
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, InputAdornment } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';


import axios from '../../../utils/axios';

export default function TransactionsNewForm() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewTodoSchema = Yup.object().shape({
    text: Yup.string().required('Title is required'),
    amount: Yup.number().typeError('Amount is required.').required('Amount is required').test(
      'non-zero-test',
      'Amount must be non zero.',
      (val) => {
        if (val !== 0) {
          return true
        }
        return false
      }
    )
  });

  const defaultValues = useMemo(
    () => ({
      text: '',
      amount: ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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

  const onSubmit = async (data) => {
    try {
      await axios.post('/transactions', data);
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_DASHBOARD.transactions.list);
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
            <RHFTextField name="text" label="Title" />

            <RHFTextField
              InputProps={{
                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
              }}
              type="number" name="amount" label="Amount" sx={{ mt: 2 }} />

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Create
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
