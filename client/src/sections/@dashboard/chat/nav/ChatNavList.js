import { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// @mui
import { List } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// components
import { SkeletonConversationItem } from '../../../../components/skeleton';
//
import ChatNavItem from './ChatNavItem';
import axios from '../../../../utils/axios';


// ----------------------------------------------------------------------

const CURRENT_USER_ID = '8864c717-587d-472a-929a-8e5f298024da-0';

ChatNavList.propTypes = {
  sx: PropTypes.object,
  openNav: PropTypes.bool,
  selected: PropTypes.func,
  handleChatSelect: PropTypes.func,
  onCloseNav: PropTypes.func,
  conversations: PropTypes.object,
  triggerFetchConvo: PropTypes.bool,
};

export default function ChatNavList({ openNav, onCloseNav, selected, handleChatSelect, triggerFetchConvo, sx, ...other }) {
  const navigate = useNavigate();

  const isDesktop = useResponsive('up', 'md');

  const [conversations, setConversations] = useState({});
  const [convoLoading,setConvoLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const d = await axios.get('/chat');
      setConversations(d.data)
      setConvoLoading(false);
    } catch (error) {
      toast.error(error.message || "An error occured", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  useEffect(() => {
    fetchConversations();
  }, [triggerFetchConvo]);


  return (
    <List disablePadding sx={sx} {...other}>
      {(convoLoading || !conversations.length ? [...Array(12)] : conversations).map((convo, index) =>
        convo ? (
          <ChatNavItem
            key={index}
            openNav={openNav}
            conversation={convo}
            isSelected={selected(convo._id)}
            onSelect={() => {
              if (!isDesktop) {
                onCloseNav();
              }
              handleChatSelect(convo);
            }}
          />
        ) : (
          <SkeletonConversationItem key={index} />
        )
      )}
    </List>
  );
}
