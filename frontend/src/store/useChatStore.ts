import toast from "react-hot-toast";
import { create } from "zustand";
import { api } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Message {
  _id: string;
  senderId: string;
  recieverId: string;
  text: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ChatStoreType {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: any) => Promise<void>;
  sendMessage: (message: any) => Promise<void>;
  setSelectedUser: (user : any) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatStoreType>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await api.get("/api/messages/users");
      set({ users: res.data });
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId : any) => {
    set({ isMessagesLoading: true });

    try {
      const res = await api.get(`/api/messages/${userId}`);
      set({ messages: res.data });
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage : async (message: any) => {
    const {selectedUser, messages} = get();

    try{
      const res = await api.post(`/api/messages/send/${selectedUser?._id}`,message)
      set({messages: [...messages, res.data]})
    }
    catch(err : any){
      toast.error(err.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const selectedUser = get().selectedUser
    if(!selectedUser) return;
    
    const socket = useAuthStore.getState().socket;
    
    socket.on("newMessage", (newMessage : any) => {
      set({ messages : [...get().messages, newMessage]});
    })
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (user: any) => {
    set({selectedUser : user});
  }
}));
