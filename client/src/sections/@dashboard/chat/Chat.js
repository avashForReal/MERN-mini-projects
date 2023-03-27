import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

// @mui
import { Card, Container, Stack, Skeleton, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import ChatNav from './nav/ChatNav';
import ChatMessageInput from './message/ChatMessageInput';
import ChatMessageList from './message/ChatMessageList';
import ChatHeaderDetail from './header/ChatHeaderDetail';

import axios from '../../../utils/axios'

import { useAuthContext } from '../../../auth/useAuthContext';



export default function Chat() {
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [msgLoading, setMsgLoading] = useState(true);

  const [msg, setMsg] = useState('');
  const [arrivalMsg, setArrivalMsg] = useState(null);

  const socket = useRef()

  const handleEnterPress = (event) => {
    if (!msg.trim()) {
      return 0;
    }
    if (event.key === 'Enter') {
      handleSendMessage();
    }
    return 1;
  }

  const handleSendMessage = async () => {
    const newText = {
      chatId: selectedChat,
      text: msg
    }

    const receiverId = selectedChat.members.find((m) => m !== (user._id.toString()))

    socket.current.emit("sendMessage", {
      senderId: user._id.toString(),
      receiverId,
      text: msg
    })
    try {
      const d = await axios.post(`/message`, newText);
      setMessages([...messages, d.data]);
      setMsg('')
    } catch (error) {
      toast.error(error.message || "An error occured", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      if (selectedChat) {
        const d = await axios.get(`/message/${chatId}`);
        setMessages(d.data.messages);
        setParticipants(d.data.participants);
        setMsgLoading(false);
      }
    } catch (error) {
      toast.error(error.message || "An error occured", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  const handleChatSelect = (chat) => {
    setSelectedChat(chat)
  }

  const isChatSelected = (chatId) => selectedChat?._id.toString() === chatId
  

  useEffect(() => {
    const chatId = selectedChat?._id.toString();
    fetchMessages(chatId);
  }, [selectedChat])

  useEffect(() => {
    socket.current = io("ws://localhost:5000");
  }, [])

  useEffect(() => {
    socket.current.emit("addUser", user._id.toString())
  }, [user,socket])

  useEffect(() => {
    socket.current.on("getMessage", d => setArrivalMsg({
      senderId: d.senderId,
      text: d.text,
      createdAt: Date.now()
    }))
  }, [])

  useEffect(() => {
    if (arrivalMsg && selectedChat?.members.includes(arrivalMsg.senderId)) {
      setMessages([...messages, arrivalMsg]);
    }
  }, [arrivalMsg, selectedChat]);

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Chat"
        links={[
          {
            name: 'Dashboard',
            href: PATH_DASHBOARD.root,
          },
          { name: 'Chat' },
        ]}
      />

      <Card sx={{ height: '72vh', display: 'flex' }}>
        <ChatNav handleChatSelect={handleChatSelect} isChatSelected={isChatSelected} />
        <Stack flexGrow={1}>
          {
            !selectedChat && (
              <>
                <Stack sx={{ marginTop: '60px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly'
                  }}>
                    <div style={{
                      objectFit: 'cover',
                    }}>
                      <img src='/assets/illustrations/characters/sofa_chat.png' alt='chat_image' />
                    </div>
                    <div>
                      <Typography variant='h4' color={'gray'}>
                        Please select a member to start chatting.
                      </Typography>
                    </div>
                  </div>
                </Stack>
              </>
            )
          }
          {
            msgLoading && selectedChat &&
            (
              <>
                <Stack sx={{
                  marginX: '10px',
                  marginxY: '30px'
                }}>
                  <Skeleton variant="rectangular" width={'100vw'} height={'100vh'} />
                </Stack>
              </>
            )
          }
          {!msgLoading && selectedChat &&
            (
              <>
                <ChatHeaderDetail participants={participants} />
                <Stack
                  direction="row"
                  flexGrow={1}
                  sx={{
                    overflow: 'hidden',
                    borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <Stack flexGrow={1}>
                    <ChatMessageList conversation={messages} participants={participants} />
                    <ChatMessageInput
                      message={msg}
                      setMessage={setMsg}
                      handleEnterPress={handleEnterPress}
                      handleSend={handleSendMessage}
                    />
                  </Stack>
                </Stack>
              </>
            )
          }
        </Stack>
      </Card>
    </Container>
  );
}
