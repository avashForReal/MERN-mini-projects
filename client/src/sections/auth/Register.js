import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Stack, Typography, Link } from '@mui/material';
// layouts
import LoginLayout from '../../layouts/login';
// routes
import { PATH_AUTH } from '../../routes/paths';
//
import AuthRegisterForm from './AuthRegisterForm';

// ----------------------------------------------------------------------

export default function Register() {
  return (
    <LoginLayout title="Register now to join the family bush.">
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Get started.</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Already have an account? </Typography>

          <Link to={PATH_AUTH.login} component={RouterLink} variant="subtitle2">
            Sign in
          </Link>
        </Stack>
      </Stack>

      <AuthRegisterForm />
    </LoginLayout>
  );
}
