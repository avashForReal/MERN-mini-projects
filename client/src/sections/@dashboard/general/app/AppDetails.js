import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { bgGradient } from '../../../../utils/cssStyles';
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

AppDetails.propTypes = {
  sx: PropTypes.object,
  icon: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
};

export default function AppDetails({ title,content, icon, color = 'primary', sx, ...other }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 5,
        boxShadow: 0,
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
      <Iconify
        icon={icon}
        sx={{
          mb: 3,
          p: 2.5,
          width: 64,
          height: 64,
          borderRadius: '50%',
          color: (theme) => theme.palette[color].dark,
          ...bgGradient({
            direction: '135deg',
            startColor: `${alpha(theme.palette[color].dark, 0)} 0%`,
            endColor: `${alpha(theme.palette[color].dark, 0.24)} 100%`,
          }),
        }}
      />
      <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
        {title}
      </Typography>

      <Typography variant="h5" sx={{ opacity: 0.64 }}>
        {content}
      </Typography>
    </Card>
  );
}
