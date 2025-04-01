import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIng: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: any[];
  socket: any;
  login: (loginData: LoginData) => Promise<void>;
  checkAuth: () => Promise<void>;
  signUp: (formData: FormDataTypes) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

interface FormDataTypes {
  fullName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await api.get("/api/auth/check");
      set(() => ({ authUser: response.data }));
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set(() => ({ authUser: null }));
    } finally {
      set(() => ({ isCheckingAuth: false }));
    }
  },

  signUp: async (formData: FormDataTypes) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/api/auth/signup", formData);
      set(() => ({ authUser: res.data }));
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (err: any) {
      toast.error(`${err.response.data.message}`);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/api/auth/logout");
      set(() => ({ authUser: null }));
      get().disconnectSocket();

      toast.success("Logout successfully");
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  },

  login: async (loginData: LoginData) => {
    set({ isLoggingIng: true });
    try {
      const res = await api.post("/api/auth/login", loginData);
      set(() => ({ authUser: res.data }));
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      set({ isLoggingIng: false });
    }
  },

  updateProfile: async (data: any) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await api.put("/api/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile successfully updated");
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();

    if (!authUser || get().socket?.connected) {
      return;
    }

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      }
    });
    socket.connect();
    set({socket : socket});

    socket.on("getOnlineUsers", (userIds) => {
      set({onlineUsers: userIds});
    })
  },

  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  },
}));
