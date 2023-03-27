import { Link as RouterLink } from 'react-router-dom';
import { Stack, Typography, Link } from '@mui/material';
import { PATH_AUTH } from '../../routes/paths';
import LoginLayout from '../../layouts/login';
import AuthLoginForm from './AuthLoginForm';


export default function Login() {
  return (
    <LoginLayout title='Welcome to the family bush.'>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Sign in</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">New user?</Typography>

          <Link to={PATH_AUTH.register} component={RouterLink} variant="subtitle2">
            Create an account
          </Link>
        </Stack>

      </Stack>
      <AuthLoginForm />
    </LoginLayout>
  );
}
