import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Box, Card, Stack, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
import { MAPBOX_API } from '../../config';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';

import MapDraggableMarkers from '../../sections/@dashboard/map/draggable-markers';

const THEMES = {
  light: 'mapbox://styles/mapbox/light-v10',
};

const baseSettings = {
  mapboxAccessToken: MAPBOX_API,
  minZoom: 1,
};

const StyledMapContainer = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 560,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));


export default function LocationCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Location: Add a new location </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Add a new location"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Locations',
              href: PATH_DASHBOARD.location.list,
            },
            { name: 'Add' },
          ]}
        />
      </Container>
      <Container sx={{ my: 10 }}>
        <Stack spacing={5}>
          <Card>
            <CardContent>
              <StyledMapContainer>
                <MapDraggableMarkers {...baseSettings} mapStyle={THEMES.light} />
              </StyledMapContainer>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
