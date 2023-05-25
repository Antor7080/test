const asyncHandler = require("express-async-handler");
const Notification = require("../models/notification");

const addNewNotification = asyncHandler(async (req, res) => {
  try {
    const user =res.locals.user
    const { notification } = req.body;
    if (!notification) {
      return res.sendStatus(400);
    }
    const alreadyExist = await Notification.findOne({
      notificationId: notification,
    });
    if (alreadyExist) return res.send("duplicates not allowed");
    var newNotification = await Notification.create({
      user: user._id,
      notificationId: notification,
    });
    newNotification = await newNotification.populate("user", "-password");
    newNotification = await newNotification.populate("notificationId");
    newNotification = await Notification.populate(newNotification, {
      path: "notificationId.sender",
      select: "name image email",
    });
    newNotification = await Notification.populate(newNotification, {
      path: "notificationId.chatId",
      select: "chatName isGroupChat latestMessage users",
    });
    newNotification = await Notification.populate(newNotification, {
      path: "notificationId.chatId.users",
      select: "name image email",
    });
    res.status(201).json(newNotification);
  } catch (err) {
    console.log(err);
    res.status(500);
  
  }
});

const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  try {
    const no = await Notification.findOne({  notificationId });
    var newNotification = await Notification.findOneAndDelete({notificationId: notificationId
    });
    res.status(202).json(newNotification);
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

const getNotification = asyncHandler(async (req, res) => {
  const user = res.locals.user;
  try {
    var notificationItem = await Notification.find({
      user: user._id,
    })
      .populate("user", "-password")
      .populate("notificationId");
    notificationItem = await Notification.populate(notificationItem, {
      path: "notificationId.sender",
      select: "name image email",
    });
    notificationItem = await Notification.populate(notificationItem, {
      path: "notificationId.chatId",
      select: "chatName isGroupChat latestMessage users",
    });
    notificationItem = await Notification.populate(notificationItem, {
      path: "notificationId.chatId.users",
      select: "name image email",
    });
    res.status(200).json(notificationItem);
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});
module.exports = { addNewNotification, deleteNotification, getNotification };
