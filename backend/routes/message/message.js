const router = require("express").Router();

const Message = require("../../models/messageSchema");
const Chat = require("../../models/chatSchema");
const User = require("../../models/userSchema");

const authenticate = require("../../middleware/authenticate");

//ADD MESSAGE
router.post("/", authenticate, async (req, res) => {
  try {
    const { userId } = req;
    const { chatId, text } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found." })
    }
    const checkUser = chat.members.find((m) => userId === m);
    if (!checkUser) {
      return res.status(404).json({ message: "User is not a member of the chat." })
    }
    const newMessage = new Message({
      chatId,
      senderId: userId,
      text,
    });
    const result = await newMessage.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET MESSAGE
router.get("/:chatId", authenticate, async (req, res) => {
  try {
    const { userId } = req;
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId).populate({
      path: 'members',
      model: User,
      select: { '_id': 1, 'name': 1, 'email': 1 }
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." })
    }
    const checkUser = chat.members.find((m) => userId === m._id.toString());
    if (!checkUser) {
      return res.status(404).json({ message: "User is not a member of the chat." })
    }
    const result = await Message.find({ chatId });
    return res.status(200).json({ messages: result, participants: chat.members });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
