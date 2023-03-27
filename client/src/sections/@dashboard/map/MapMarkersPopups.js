import PropTypes from 'prop-types';
import { memo } from 'react';
import Map from 'react-map-gl';
import { formatDistanceToNow } from 'date-fns'
// @mui
import { Box, Typography } from '@mui/material';
import Iconify from '../../../components/iconify';
import { MapPopup, MapMarker, MapControl } from '../../../components/map';

import { useAuthContext } from '../../../auth/useAuthContext';
// ----------------------------------------------------------------------

MapMarkersPopups.propTypes = {
  data: PropTypes.array,
  popupInfo: PropTypes.object,
  setPopupInfo: PropTypes.func,
  handleDelete: PropTypes.func
};

function MapMarkersPopups({ data, popupInfo, setPopupInfo, handleDelete, ...other }) {
  const { user } = useAuthContext();

  const canDelete = ((popupInfo?.createdBy.toString()) === (user._id.toString()));

  return (
    <>
      <Map
        initialViewState={{
          zoom: 2,
        }}
        {...other}
      >
        <MapControl />

        {data.map((d, index) => (
          <MapMarker
            key={`marker-${index}`}
            latitude={d.lat}
            longitude={d.long}
            onClick={(event) => {
              event.originalEvent.stopPropagation();
              setPopupInfo(d);
            }}
          />
        ))}

        {popupInfo && (
          <MapPopup latitude={popupInfo.lat} longitude={popupInfo.long} onClose={() => setPopupInfo(null)}>
            <Box sx={{ color: 'common.white' }}>
              {
                canDelete && (
                  <>
                    <Iconify onClick={() => { handleDelete(popupInfo?.id) }} sx={{
                      width: '15px',
                      height: '15px',
                      cursor: 'pointer'
                    }} icon="material-symbols:delete-rounded" />
                  </>
                )
              }
              <Typography component="div" variant="caption">
                Lat: {parseFloat(popupInfo.lat).toFixed(6)}
              </Typography>

              <Typography component="div" variant="caption">
                Long: {parseFloat(popupInfo.long).toFixed(6)}
              </Typography>


              <Typography component="div" variant="caption">
                Address: {popupInfo.address}
              </Typography>

              <Typography component="div" variant="caption">
                User: {popupInfo.userName}
              </Typography>

              <Typography component="div" variant="caption">
                {formatDistanceToNow(new Date(popupInfo.createdAt))} ago
              </Typography>
            </Box>
          </MapPopup>
        )}
      </Map>
    </>
  );
}

export default memo(MapMarkersPopups);
