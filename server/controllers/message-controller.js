import User from "../models/user.js";
import Message from "../models/message.js";
import { cloudinary } from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

const getUsers = async (req, res) => {
    let users;
    try {
        const userId = req.user._id;
        users = await User.find({ _id: { $ne: userId } }, '-password');
    }
    catch (err) {
        return res.status(500).json({ message: "Fetching users failed, please try again later" });
    }

    res.status(200).json(users);
}

const getMessages = async (req, res) => {
    try{
        const userToChatId = req.params.id;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(messages);
    }
    catch (err) {
        return res.status(500).json({ message: "Fetching messages failed, please try again later" });
    }
}

const sendMessage = async (req, res) => {
    try{
        const receiverId = req.params.id;
        const senderId = req.user._id;
        const { text, image } = req.body;

        let imageUrl;
        if(image) {
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {  // If user is online
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    }
    catch (err) {
        return res.status(500).json({ message: "Sending message failed, please try again later" });
    }
}

export { getUsers, getMessages, sendMessage };