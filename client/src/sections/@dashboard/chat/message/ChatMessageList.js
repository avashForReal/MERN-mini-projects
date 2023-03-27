import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';

import Scrollbar from '../../../../components/scrollbar';
import ChatMessageItem from './ChatMessageItem';

// ----------------------------------------------------------------------

ChatMessageList.propTypes = {
  conversation: PropTypes.array,
  participants: PropTypes.array
};

export default function ChatMessageList({ conversation,participants }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
  }, [conversation]);

  return (
    <>
      <Scrollbar
        scrollableNodeProps={{
          ref: scrollRef,
        }}
        sx={{ p: 3, height: 1 }}
      >
        {conversation?.map((message,index) => (
          <ChatMessageItem
            key={message._id}
            message={message}
            participants={participants}
          />
        ))}
      </Scrollbar>
    </>
  );
}
