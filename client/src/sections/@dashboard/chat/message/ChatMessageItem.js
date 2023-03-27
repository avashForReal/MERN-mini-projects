import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { Avatar, Typography, Stack } from '@mui/material';

import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

const CURRENT_USER_ID = '8864c717-587d-472a-929a-8e5f298024da-0';

ChatMessageItem.propTypes = {
  message: PropTypes.object,
  participants: PropTypes.array
};

export default function ChatMessageItem({ message, participants }) {
  const { user } = useAuthContext();
  const sender = participants.find((participant) => participant._id.toString() === message.senderId);

  const senderDetails =
    (message.senderId === user._id.toString())
      ? {
        type: 'me',
      }
      : {
        avatar: sender?.avatar,
        name: sender?.name,
      };

  const currentUser = senderDetails.type === 'me';

  return (
    <Stack direction="row" justifyContent={currentUser ? 'flex-end' : 'unset'} sx={{ mb: 3 }}>
      {!currentUser && (
        <Avatar alt={senderDetails.name} src={senderDetails.avatar} sx={{ width: 32, height: 32, mr: 2 }} />
      )}

      <Stack spacing={1} alignItems="flex-end">
        <Typography
          noWrap
          variant="caption"
          sx={{
            color: 'text.disabled',
            ...(!currentUser && {
              mr: 'auto',
            }),
          }}
        >
          {formatDistanceToNowStrict(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </Typography>

        <Stack
          sx={{
            p: 1.5,
            minWidth: 48,
            maxWidth: 320,
            borderRadius: 1,
            overflow: 'hidden',
            typography: 'body2',
            bgcolor: 'background.neutral',
            ...(currentUser && {
              color: 'grey.800',
              bgcolor: 'primary.lighter',
            })
          }}
        >
          {message.text}
        </Stack>
      </Stack>
    </Stack>
  );
}
