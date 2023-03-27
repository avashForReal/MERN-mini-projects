import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  CardContent,
  Card,
  Button,
  Container,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';

// components
import { MAPBOX_API } from '../../config';
import { useSettingsContext } from '../../components/settings';
import { PATH_DASHBOARD } from '../../routes/paths';
import axios from '../../utils/axios';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';
import MapMarkersPopups from '../../sections/@dashboard/map/MapMarkersPopups';

const THEMES = {
  light: 'mapbox://styles/mapbox/light-v10',
};

const baseSettings = {
  mapboxAccessToken: MAPBOX_API,
  minZoom: 0,
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

export default function LocationPage() {
  const { themeStretch } = useSettingsContext();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trigg, setTrigg] = useState(false);
  const [popupInfo, setPopupInfo] = useState(null);

  const handleDelete = async (id) => {
    try {
      const d = await axios.delete(`/locations/${id}`);
      setPopupInfo(null);
      setTrigg(!trigg);
      toast.success("Location deleted.", {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (err) {
      toast.error("Error: couldn't delete location.", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  const fetchLocations = async () => {
    try {
      const d = await axios.get('/locations');
      setLocations(d.data);
      setLoading(false);
    } catch (err) {
      toast.error("Error: couldn't fetch locations.", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [trigg])

  return (
    <>
      <Helmet>
        <title> Locations </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Locations"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Locations', href: PATH_DASHBOARD.location.list },
            { name: 'List' },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.location.new}
              component={RouterLink}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Location
            </Button>
          }
        />

        <Card>
          <CardContent>
            <StyledMapContainer>
              {
                loading ? (
                  <Skeleton height={'100%'} />
                ) : (
                  <MapMarkersPopups {...baseSettings} popupInfo={popupInfo} setPopupInfo={setPopupInfo} handleDelete={handleDelete} data={locations} mapStyle={THEMES.light} />
                )
              }
            </StyledMapContainer>
          </CardContent>
        </Card>

      </Container>
    </>
  );
}
