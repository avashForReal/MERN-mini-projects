import { memo } from 'react';
import { Box } from '@mui/material';
import BackgroundIllustration from './BackgroundIllustration';

function ChatIllustration({ ...other }) {
  return (
    <Box {...other}>
        <BackgroundIllustration />
        <image href="/assets/illustrations/characters/sofa_chat.png" />
    </Box>
  );
}

export default memo(ChatIllustration);
