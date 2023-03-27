import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
// @mui
import { Stack, InputBase, IconButton, InputAdornment } from '@mui/material';
// utils
import uuidv4 from '../../../../utils/uuidv4';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

const CURRENT_USER_ID = '8864c717-587d-472a-929a-8e5f298024da-0';

ChatMessageInput.propTypes = {
  sx: PropTypes.object,
  message: PropTypes.string,
  handleSend: PropTypes.func,
  handleEnterPress: PropTypes.func,
  setMessage: PropTypes.func
};

export default function ChatMessageInput({ message, setMessage, handleSend, handleEnterPress, sx, ...other }) {
  return (
    <>
      <InputBase
        value={message}
        onKeyUp={handleEnterPress}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type a message"
        endAdornment={
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0, mr: 1.5 }}>
            <IconButton disabled={!message.trim()} onClick={handleSend}>
              <Iconify icon="material-symbols:send-rounded" sx={{
                cursor: (!message.trim()) ? 'not-allowed' : 'pointer'
              }} />
            </IconButton>
          </Stack>
        }
        sx={{
          pl: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          ...sx,
        }}
        {...other}
      />
    </>
  );
}
