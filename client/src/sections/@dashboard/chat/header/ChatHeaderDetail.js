import PropTypes from 'prop-types';
// @mui
import { Stack, Box, Link, Typography, IconButton } from '@mui/material';
// utils
import { fToNow } from '../../../../utils/formatTime';
// components
import Iconify from '../../../../components/iconify';
import BadgeStatus from '../../../../components/badge-status';
import { CustomAvatar, CustomAvatarGroup } from '../../../../components/custom-avatar';

import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

ChatHeaderDetail.propTypes = {
  participants: PropTypes.array,
};

export default function ChatHeaderDetail({ participants }) {

  const { user } = useAuthContext();

  const participant = participants.find((p) => (p._id.toString()) !== (user._id.toString()))

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(2, 1, 2, 2),
      }}
    >
      <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
        <CustomAvatar
          src={participant?.avatar}
          alt={participant?.name}
          name={participant?.name}
          BadgeProps={{
            badgeContent: <BadgeStatus status={participant?.status} />,
          }}
        />

        <div>
          <Typography variant="subtitle2">{participant?.name}</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {participant?.status === 'offline' ? (
              participant?.lastActivity && fToNow(participant?.lastActivity)
            ) : (
              <Box component="span" sx={{ textTransform: 'capitalize' }}>
                {participant?.status}
              </Box>
            )}
          </Typography>
        </div>
      </Stack>
    </Stack>
  );
}
