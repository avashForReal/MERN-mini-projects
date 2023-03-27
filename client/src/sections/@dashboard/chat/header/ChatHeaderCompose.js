import PropTypes from 'prop-types';
import { useState } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Stack, Avatar, TextField, Typography, Autocomplete, IconButton } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import SearchNotFound from '../../../../components/search-not-found';

// ----------------------------------------------------------------------

ChatHeaderCompose.propTypes = {
  sx: PropTypes.object,
  noChatUsers: PropTypes.array,
  addChat: PropTypes.func
};

export default function ChatHeaderCompose({ noChatUsers, addChat, sx, ...other }) {
  const [searchRecipients, setSearchRecipients] = useState("");
  const [receiver, setReceiver] = useState(null)

  const handleAddRecipients = (rec) => {
    setSearchRecipients("");
    if (!rec) {
      setReceiver(null)
    } else {
      setReceiver(rec._id.toString())
    }
  };

  const handleSend = () => {
    addChat(receiver);
    setSearchRecipients('');
    setReceiver(null);
  }

  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      sx={{
        py: 2,
        px: 1,
        ...sx,
      }}
      {...other}
    >
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        To:
      </Typography>

      <Autocomplete
        sx={{ minWidth: 240 }}
        freeSolo
        popupIcon={null}
        noOptionsText={<SearchNotFound query={searchRecipients} />}
        onChange={(event, value) => handleAddRecipients(value)}
        onInputChange={(event, value) => setSearchRecipients(value)}
        options={noChatUsers}
        getOptionLabel={(recipient) => recipient.name}
        renderInput={(params) => (<TextField {...params} size="small" placeholder="Search members" />)}
        renderOption={(props, recipient, { inputValue, selected }) => {
          const { name, avatar } = recipient;
          const matches = match(name, inputValue);
          const parts = parse(name, matches);

          return (
            <Box
              component="li"
              sx={{
                p: '12px !important',
              }}
              {...props}
            >
              <Box
                sx={{
                  mr: 1.5,
                  width: 32,
                  height: 32,
                  overflow: 'hidden',
                  borderRadius: '50%',
                  position: 'relative',
                }}
              >
                <Avatar alt={name} src={avatar} />
                <Box
                  sx={{
                    top: 0,
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                    transition: (theme) =>
                      theme.transitions.create('opacity', {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.shorter,
                      }),
                    ...(selected && {
                      opacity: 1,
                      color: 'primary.main',
                    }),
                  }}
                >
                  <Iconify icon="eva:checkmark-fill" />
                </Box>
              </Box>

              {parts.map((part, index) => (
                <Typography key={index} variant="subtitle2" color={part.highlight ? 'primary' : 'textPrimary'}>
                  {part.text}
                </Typography>
              ))}
            </Box>
          );
        }}
      />

      <IconButton disabled={!receiver} onClick={handleSend}>
        <Iconify icon="material-symbols:send-rounded" sx={{
          cursor: (!receiver) ? 'not-allowed' : 'pointer'
        }} />
      </IconButton>

    </Stack>
  );
}
