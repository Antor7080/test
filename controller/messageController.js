const asyncHandler = require("express-async-handler");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name image email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  const user = res.locals.user;

  if (!content || !chatId) {
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: user._id,
    content: content,
    chat: chatId,
    chatId: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name image")
    message = await message.populate("chatId")
    message = await User.populate(message, {
      path: "chatId.users",
      select: "name image email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };