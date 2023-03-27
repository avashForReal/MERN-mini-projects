import { useState, useCallback, memo } from 'react';
import Map from 'react-map-gl';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../../utils/axios';
import { MapMarker, MapControl, MapPopup } from '../../../../components/map';
import { useSnackbar } from '../../../../components/snackbar';
import { PATH_DASHBOARD } from '../../../../routes/paths';

function MapDraggableMarkers({ ...other }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [popup, setPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [marker, setMarker] = useState({
    latitude: 27.69464274813805,
    longitude: 85.32050860450386,
  });

  const onMarkerDrag = useCallback((event) => {
    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
  }, []);

  const handleMapClick = useCallback((e) => {
    setMarker({
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat
    })
  });

  const handleMarkerClick = (e) => {
    e.originalEvent.stopPropagation();
    setPopup(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const address = e.target.address.value;
    try {
      const formData = {
        address,
        lat: marker.latitude,
        long: marker.longitude
      }
      await axios.post('/locations',formData);
      document.getElementById("address-form").reset();
      setSubmitting(false);
      enqueueSnackbar('Create success!');
      navigate(PATH_DASHBOARD.location.list)
    } catch (error) {
      toast.error(error.message || "An error occured", {
        position: toast.POSITION.TOP_RIGHT
      });
      document.getElementById("address-form").reset();
      setSubmitting(false)
    }
  }

  return (
    <>
      <Map initialViewState={{ latitude: marker.latitude, longitude: marker.longitude, zoom: 12 }} onClick={handleMapClick} {...other}>
        <MapControl />
        <MapMarker
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="top"
          draggable
          onDrag={onMarkerDrag}
          onClick={handleMarkerClick}
        />

        {popup && (
          <MapPopup
            latitude={marker.latitude}
            longitude={marker.longitude}
            onClose={() => setPopup(false)}
          >
            <Box sx={{
              color: 'common.white',
              p: '6px',
              width: '240px'
            }}>
              <Typography component="div" variant="caption">
                Lat: {marker.latitude.toFixed(6)}
              </Typography>

              <Typography component="div" variant="caption">
                Lon: {marker.longitude.toFixed(6)}
              </Typography>
              <form id="address-form" onSubmit={handleSave}>
                <input
                  style={{
                    width: '140px',
                    marginTop: '6px',
                  }}
                  type='text'
                  name='address'
                  placeholder='enter address'
                  required
                />
                <br />
                <button
                  type='submit'
                  style={{
                    width: '140px',
                    marginTop: '6px',
                    cursor: 'pointer'
                  }}
                  disabled={submitting}
                >
                  save
                </button>
              </form>
            </Box>
          </MapPopup>
        )}
      </Map>
    </>
  );
}

export default memo(MapDraggableMarkers);
