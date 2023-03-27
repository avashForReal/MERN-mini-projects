import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Container, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { PageNotFoundIllustration } from '../assets/illustrations';

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found | Minimal UI</title>
      </Helmet>

      <Container sx={{ mt: '200px', mx: 'auto', width: '100%'}}>
        <MotionContainer>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph sx={{textAlign: 'center'}}>
              Sorry, page not found!
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your
              spelling.
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <PageNotFoundIllustration
              sx={{
                height: 260,
                my: { xs: 5, sm: 10 },
              }}
            />
          </m.div>
            
          <Button to="/" sx={{margin: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)'}} component={RouterLink} size="large" variant="contained">
            Go to Home
          </Button>
        </MotionContainer>
      </Container>
    </>
  );
}
