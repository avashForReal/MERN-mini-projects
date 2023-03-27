import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { Badge, Stack, Typography, ListItemText, ListItemButton, ListItemAvatar } from '@mui/material';
// components
import { CustomAvatar, CustomAvatarGroup } from '../../../../components/custom-avatar';
import BadgeStatus from '../../../../components/badge-status';
import { useAuthContext } from '../../../../auth/useAuthContext';
import axios from '../../../../utils/axios';


// ----------------------------------------------------------------------


ChatNavItem.propTypes = {
  openNav: PropTypes.bool,
  onSelect: PropTypes.func,
  isSelected: PropTypes.bool,
  conversation: PropTypes.object,
};

export default function ChatNavItem({ conversation, openNav, isSelected, onSelect }) {

  const { user } = useAuthContext();
  const CURRENT_USER_ID = user._id.toString();

  const [chatUser, setChatUser] = useState(null);

  const getUser = async (famId) => {
    try {
      const d = await axios(`/user/${famId}`);
      setChatUser(d.data)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const famId = conversation.members.find((m) => m !== CURRENT_USER_ID);
    getUser(famId);
  }, [conversation]);

  // const details = getDetails(conversation, CURRENT_USER_ID);

  // const lastActivity = conversation.messages[conversation.messages.length - 1].createdAt;

  // const isGroup = details.otherParticipants.length > 1;

  // const isUnread = conversation.unreadCount > 0;

  // const hasOnlineInGroup = isGroup && details.otherParticipants.map((item) => item.status).includes('online');

  return (
    <ListItemButton
      disableGutters
      onClick={onSelect}
      sx={{
        py: 1.5,
        px: 2.5,
        ...(isSelected && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <CustomAvatar
          key={chatUser?.id}
          alt={chatUser?.name}
          src={chatUser?.url}
          name={chatUser?.name}
          // BadgeProps={{
          //   badgeContent: <BadgeStatus status={details.otherParticipants[0].status} />,
          // }}
          sx={{ width: 48, height: 48 }}
        />
      </ListItemAvatar>

      {openNav && (
        <>
          <ListItemText
            primary={chatUser?.name}
            primaryTypographyProps={{ noWrap: true, variant: 'subtitle2' }}
            secondary={chatUser?.email}
            secondaryTypographyProps={{
              noWrap: true,
              // variant: isUnread ? 'subtitle2' : 'body2',
              // color: isUnread ? 'text.primary' : 'text.secondary',
            }}
          />
        </>
      )}
    </ListItemButton>
  );
}