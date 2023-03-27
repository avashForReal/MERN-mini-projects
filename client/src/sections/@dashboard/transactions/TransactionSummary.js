import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, Typography, Stack, Box } from '@mui/material';
// utils
import { fCurrency, fPercent } from '../../../utils/formatNumber';
// components
import Iconify from '../../../components/iconify';
import Chart, { useChart } from '../../../components/chart';

TransactionSummary.propTypes = {
  sx: PropTypes.object,
  chart: PropTypes.object,
  color: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default function TransactionSummary({ title, total, icon, color = 'primary', chart, sx, ...other }) {
  const theme = useTheme();

  // const { series, options } = chart;

  const chartOptions = useChart({
    colors: [theme.palette[color].main],
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    xaxis: {
      labels: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    stroke: {
      width: 4,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value) => fCurrency(value),
        title: {
          formatter: () => '',
        },
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.56,
        opacityTo: 0.56,
      },
    },
    ...chart?.options,
  });

  return (
    <Card
      sx={{
        width: 1,
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
          p: 1.5,
          top: 24,
          right: 24,
          width: 48,
          height: 48,
          borderRadius: '50%',
          position: 'absolute',
          color: (theme) => theme.palette[color].lighter,
          bgcolor: (theme) => theme.palette[color].dark,
        }}
      />

      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography variant="subtitle2">{title}</Typography>

        <Typography variant="h3">
          {
            total? `Rs. ${fCurrency(total)}` : 'N/A'
          }
          
        </Typography>

      </Stack>
      {
        chart ? (
          <Chart type="area" series={[{ data: chart?.series }]} options={chartOptions} height={120} />
        ) : null
      }
    </Card>
  );
}
