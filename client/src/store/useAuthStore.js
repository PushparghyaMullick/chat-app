import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? 'http://localhost:5001' : '/';

export const useAuthStore = create((set, get) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {  // whenever refreshing page
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get('/auth/check');
      set({ user: response.data });
      get().connectSocket();
    }
    catch (err) {
      set({ user: null });
    }
    finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post('/auth/signup', formData);
      set({ user: response.data });
      toast.success("Signed up successfully!")

      get().connectSocket();
    }
    catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
    finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ user: null });
      toast.success("Logged out successfully!");

      get().disconnectSocket();
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post('/auth/login', formData);
      set({ user: response.data });
      toast.success("Logged in successfully!")

      get().connectSocket();
    }
    catch (err) {
      console.log(err);
      toast.error(err.response.data.message)
    }
    finally {
      set({ isLoggingIn: false });
    }
  },
  
  updateProfile: async (data, userId) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put(`/auth/${userId}/update`, data);
      set({ user: response.data });
      toast.success("Profile updated successfully!")
    }
    catch (err) {
      console.log(err);
      toast.error(err.response.data.message)
    }
    finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const {user} = get()
    if(!user || get().socket?.connected) 
      return;

    const socket = io(BASE_URL, {
      query: {
        userId: user._id
      }
    })
    socket.connect()
    set({ socket })

    // listen to this event to get online users
    socket.on('getOnlineUsers', (users) => {
      set({ onlineUsers: users })
    })
  },

  disconnectSocket: () => {
    if(get().socket?.connected) {
      get().socket.disconnect()
      set({ socket: null })
    }
  }
}))