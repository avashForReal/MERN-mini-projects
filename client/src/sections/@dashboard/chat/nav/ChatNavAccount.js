import { useState } from 'react';
// @mui
import { List, Stack, Select, Divider, Tooltip, MenuItem, Typography, IconButton } from '@mui/material';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// components
import Iconify from '../../../../components/iconify';
import { CustomAvatar } from '../../../../components/custom-avatar';
import MenuPopover from '../../../../components/menu-popover';
import BadgeStatus from '../../../../components/badge-status';

export default function ChatNavAccount() {
  const { user } = useAuthContext();

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <CustomAvatar
        src={user?.photoURL}
        alt={user?.name}
        name={user?.name}
        BadgeProps={{
          badgeContent: <BadgeStatus status={'online'} />,
        }}
        onClick={handleOpenPopover}
        sx={{ cursor: 'pointer', width: 48, height: 48 }}
      />

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="top-left" sx={{ p: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2, pr: 1, pl: 2.5 }}>
          <div>
            <Typography noWrap variant="subtitle2">
              {user?.name}
            </Typography>

            <Typography noWrap variant="body2" sx={{ color: 'text.secondary' }}>
              {user?.email}
            </Typography>
          </div>
        </Stack>
      </MenuPopover>
    </>
  );
}
