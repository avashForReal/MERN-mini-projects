const router = require("express").Router();

const Chat = require("../../models/chatSchema");
const User = require("../../models/userSchema");

const authenticate = require("../../middleware/authenticate");


const checkChatExists = async (userId, receiverId) => {
  const chat = await Chat.findOne({
    members: { $all: [userId, receiverId] },
  });
  return chat;
}

//CREATE CHAT
router.post("/", authenticate, async (req, res) => {
  try {
    const { receiverId } = req.body;
    const { userId } = req;
    if (!receiverId) {
      return res.status(500).json({ message: 'receiver id is required.' })
    }
    if (receiverId === userId) {
      return res.status(500).json({ message: 'cannot create chat with self.' })
    }
    const user = await User.findById(req.userId);
    // Get the family Id of the user
    const familyId = user.family;
    // Find all the users that belong to the given familyId
    const famUsers = await User.find({ family: familyId });
    // Extract the user IDs from the user documents
    const famUserIds = famUsers.map((user) => user._id.toString());

    if (!famUserIds.includes(receiverId)) {
      return res.status(500).json({ message: 'chat can be created with family members only.' })
    }

    const chatExists = await checkChatExists(userId, receiverId);
    if (chatExists) {
      return res.status(401).json({ message: 'chat with the user already exists' })
    }

    const newChat = new Chat({
      members: [userId, receiverId],
    });
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//USER CHAT
router.get("/", authenticate, async (req, res) => {
  try {
    const { userId } = req;
    const chat = await Chat.find({
      members: { $in: [userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get users without a conversation started
router.get("/no-chat-users", authenticate, async (req, res) => {
  try {
    const { userId } = req;

    const user = await User.findById(req.userId);
    // Get the family Id of the user
    const familyId = user.family;
    // Find all the users that belong to the given familyId
    const famUsers = await User.find({ family: familyId }).select('-password');
    // Extract the user IDs from the user documents
    const famUserFilter = famUsers.filter((m) => (m._id.toString()) !== userId);
    const userChats = await Chat.find({
      members: { $in: [userId] },
    });
    if (famUserFilter.length === 0) {
      return res.status(500).json({ message: 'No family members found. Please invite some family members.' })
    }

    if (userChats.length === 0) {
      return res.status(200).json({ noChatUsers: famUserFilter });
    }

    const noChatUsers = []
 
    for (const mem of famUserFilter) {
      const chat = await checkChatExists(userId,mem._id.toString())
      if(!chat){
        noChatUsers.push(mem)
      }
    }
    res.status(200).json({ noChatUsers });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
