import { Helmet } from 'react-helmet-async';
import { Container, Grid } from '@mui/material';
import { useAuthContext } from '../../auth/useAuthContext';
import { useSettingsContext } from '../../components/settings';
import {
  AppWelcome,
  AppDetails
} from '../../sections/@dashboard/general/app';
import { SeoIllustration } from '../../assets/illustrations';


export default function GeneralAppPage() {
  const { user } = useAuthContext();

  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> FYP </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid>
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${user?.name}`}
              description="Let's rock and roll!"
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
            />
          </Grid>
        </Grid>


        <Grid container  style={{marginTop: '20px'}}>
          <Grid item xs={12} sm={6} md={3}>
            <AppDetails
              title="Family"
              content={user.familyName}
              icon={'carbon:pedestrian-family'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} style={{marginLeft: '20px'}}>
            <AppDetails
              title="Family ID"
              content={user.family}
              icon={'mdi:id-card-outline'}
            />
          </Grid>
          
        </Grid>
      </Container>
    </>
  );
}
