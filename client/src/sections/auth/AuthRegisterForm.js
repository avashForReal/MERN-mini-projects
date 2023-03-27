import { useState } from 'react';
import * as Yup from 'yup';
// form
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField, RHFCheckbox } from '../../components/hook-form';
import axios from '../../utils/axios';
import { PATH_AUTH } from '../../routes/paths'

// ----------------------------------------------------------------------

export default function AuthRegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);
  const [newFamily, setNewFamily] = useState(true);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    newFamily: Yup.boolean().optional(),
    familyName: Yup.string().when(("newFamily"), {
      is: (newFamily) => newFamily === true,
      then: Yup.string().required('Family name is required'),
      otherwise: Yup.string().optional()
    }),
    familyId: Yup.string().when(("newFamily"), {
      is: (newFamily) => newFamily === false,
      then: Yup.string().required('Family ID is required'),
      otherwise: Yup.string().optional()
    })
  });

  const defaultValues = {
    name: '',
    email: '',
    password: '',
    newFamily: true,
    familyName: '',
    familyId: ''
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues
  });

  const {
    reset,
    setError,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      let res;
      const d = data;
      delete d.newFamily
      if (newFamily) {
        delete d.familyId
        res = await axios.post('/families/createFamily', d);
      } else {
        delete d.familyName
        res = await axios.post('/families/joinFamily', d);
      }
      toast.success(res.data.message || "Registered successfully.", {
        position: toast.POSITION.TOP_RIGHT
      });
      reset();
      navigate(PATH_AUTH.login, { replace: true });
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message || "Internal server error",
      });
    }
  };

  const handleCheckbox = () => {
    setNewFamily(!newFamily);
    setValue("familyName", "");
    setValue("familyId", "");
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="name" label="Full name" />

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFCheckbox
          name="newFamily"
          onClick={handleCheckbox}
          label="is a new family?"
        />

        {
          getValues("newFamily") ? (
            <>
              <RHFTextField name="familyName" label="Family name" />
            </>
          ) : (
            <>
              <RHFTextField name="familyId" label="Family ID" />
            </>
          )
        }

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            '&:hover': {
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            },
          }}
        >
          Create account
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
