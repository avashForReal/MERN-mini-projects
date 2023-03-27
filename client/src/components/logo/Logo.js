import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import Iconify from '../iconify/index';

const Logo = forwardRef(({ disabledLink = false, sx, }) => {
  const logo = (
    <Box
      sx={{
        display: 'inline-flex',
        ...sx,
      }}
    >
      <Iconify 
        icon="material-symbols:family-restroom-rounded"
        sx={{
          width: 60,
          height: 60,
          color: '#00008B'
        }}
      />
    </ Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
