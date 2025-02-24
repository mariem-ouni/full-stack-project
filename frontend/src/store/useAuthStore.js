import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // Vérifie l'authentification de l'utilisateur
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check", {
        headers: { "authorization": localStorage.getItem("token") },
      });
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Inscription de l'utilisateur
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      // set({ authUser: res.data });
      toast.success("Account created successfully");
      // get().connectSocket();
    } catch (error) {
      console.log("Error in signup:", error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Connexion de l'utilisateur
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      localStorage.setItem('token', res.data.token);
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      console.log("Error in login:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Déconnexion de l'utilisateur
  logout: async () => {
    try {
      // await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem('token');
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout:", error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },

  // Mise à jour de l'image du profil de l'utilisateur
  updateProfileImage: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile-image", data, {
        headers: { "authorization": localStorage.getItem("token") },
      });
      set({ authUser: res.data });
      toast.success("Profile image updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error?.response?.data?.message || "Profile image update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Mise à jour des informations de l'utilisateur
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data, {
        headers: { "authorization": localStorage.getItem("token") },
      });
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error?.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Connexion au socket
  connectSocket: () => {
    const { authUser } = get();
    console.log("Auth User Socket:", authUser)
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // Déconnexion du socket
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
    }
  },
}));
