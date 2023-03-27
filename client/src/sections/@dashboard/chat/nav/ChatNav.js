import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Drawer, IconButton, Divider, Typography } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// utils
import axios from '../../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { useAuthContext } from '../../../../auth/useAuthContext';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
//
import ChatNavList from './ChatNavList';
import ChatNavSearch from './ChatNavSearch';
import ChatNavAccount from './ChatNavAccount';
import ChatNavSearchResults from './ChatNavSearchResults';
import ChatHeaderCompose from '../header/ChatHeaderCompose';

// ----------------------------------------------------------------------

const StyledToggleButton = styled((props) => <IconButton disableRipple {...props} />)(({ theme }) => ({
  left: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  top: theme.spacing(13),
  borderRadius: `0 12px 12px 0`,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.customShadows.primary,
  '&:hover': {
    backgroundColor: theme.palette.primary.darker,
  },
}));

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

ChatNav.propTypes = {
  isChatSelected: PropTypes.func,
  handleChatSelect: PropTypes.func

};

export default function ChatNav({ handleChatSelect, isChatSelected }) {
  const theme = useTheme();

  const navigate = useNavigate();

  const isDesktop = useResponsive('up', 'md');

  const [openNav, setOpenNav] = useState(false);

  const [triggerFetchConvo, setTriggerFetchConvo] = useState(false);
  const [noChatUsers, setNoChatUsers] = useState([]);
  const [noUserError, setNoUserError] = useState(true);

  const isCollapse = isDesktop && !openNav;

  useEffect(() => {
    if (!isDesktop) {
      handleCloseNav();
    } else {
      handleOpenNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  const handleToggleNav = () => {
    setOpenNav(!openNav);
  };

  const handleOpenNav = () => {
    setOpenNav(true);
  };

  const handleCloseNav = () => {
    setOpenNav(false);
  };

  const fetchNoChatUsers = async () => {
    try {
      const d = await axios.get('/chat/no-chat-users');
      if (d.data?.noChatUsers.length === 0) {
        setNoUserError(true);
      } else {
        setNoChatUsers(d.data.noChatUsers)
        setNoUserError(false);
      }
    } catch (error) {
      setNoUserError(true);
    }
  }

  const addChat = async (receiver) => {
    try {
      const d = await axios.post('/chat', {
        receiverId: receiver
      });
      toast.success("Chat created successfully", {
        position: toast.POSITION.TOP_RIGHT
      });
      setTriggerFetchConvo(!triggerFetchConvo);
    } catch (error) {
      toast.error(error.message || "An error occured", {
        position: toast.POSITION.TOP_RIGHT
      });
      setTriggerFetchConvo(!triggerFetchConvo);
    }
  }

  useEffect(() => {
    fetchNoChatUsers();
  }, [triggerFetchConvo]);

  const renderContent = (
    <>
      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          {!isCollapse && (
            <>
              <ChatNavAccount />
              <Box sx={{ flexGrow: 1 }} />
            </>
          )}
          <IconButton onClick={handleToggleNav}>
            <Iconify icon={openNav ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'} />
          </IconButton>

        </Stack>
      </Box>

      <Divider />

      {
        (!isCollapse && !noUserError) && (
          <>
            <ChatHeaderCompose noChatUsers={noChatUsers} addChat={addChat} />
            <Divider />
          </>
        )
      }

      {
        (!isCollapse && noUserError) && (
          <>
            <Typography variant="subtitle" sx={{
              marginLeft: '10px',
              paddingY: '15px'
            }}>
              No members to add.
            </Typography>
            <Divider />
          </>
        )
      }

      <Scrollbar>
        <ChatNavList
          openNav={openNav}
          onCloseNav={handleCloseNav}
          handleChatSelect={handleChatSelect}
          selected={isChatSelected}
          triggerFetchConvo={triggerFetchConvo}
        />
      </Scrollbar>
    </>
  );

  return (
    <>
      {!isDesktop && (
        <StyledToggleButton onClick={handleToggleNav}>
          <Iconify width={16} icon="eva:people-fill" />
        </StyledToggleButton>
      )}

      {isDesktop ? (
        <Drawer
          open={openNav}
          variant="persistent"
          PaperProps={{
            sx: {
              pb: 1,
              width: 1,
              position: 'static',
              ...(isCollapse && {
                transform: 'none !important',
                visibility: 'visible !important',
              }),
            },
          }}
          sx={{
            width: NAV_WIDTH,
            transition: theme.transitions.create('width'),
            ...(isCollapse && {
              width: NAV_COLLAPSE_WIDTH,
            }),
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={handleCloseNav}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              pb: 1,
              width: NAV_WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}
