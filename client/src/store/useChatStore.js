import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { io } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    filteredUsers: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const response = await axiosInstance.get('/message/users');
            set({ users: response.data });
            set({ filteredUsers: response.data });
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    setFilteredUsers: (searchTerm) => {
        const { users } = get()

        set({ filteredUsers: users.filter((user) =>
            user.username.toLowerCase().startsWith(searchTerm.trim().toLowerCase())
          ) })
    },

    getMessages: async (userId) => {  //userId: selectedUser
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/message/${userId}`);
            set({ messages: response.data });
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (data) => {
        const { selectedUser, messages } = get();
        try {
            const response = await axiosInstance.post(`/message/${selectedUser._id}`, data);
            set({ messages: [...messages, response.data] });


        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if(!selectedUser) return;

        const { socket } = useAuthStore.getState();

        socket.on("newMessage", (message) => {
            if(message.senderId !== selectedUser._id)
                return;
            set({ messages: [...get().messages, message] });
        })
    },

    unsubscribeFromMessages: () => {
        const { socket } = useAuthStore.getState();
        socket.off("newMessage");
    },

    setSelectedUser: (user) => {
        set({ selectedUser: user });
    }
}))