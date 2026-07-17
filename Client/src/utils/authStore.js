import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    isLoading: false,
    error: null,
    message: null,

    clearError: () => set({ error: null}),

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null});
        try {
           const res = axiosInstance.get('/auth/check-auth')
           set({ user: res.data.user, isAuthenticated: true, isCheckingAuth: false})
        } catch (error) {
           set({ error: error.response?.data?.message || null, isCheckingAuth: false, isAuthenticated: false});
        }
    },

    signup: async (data) => {
        set({ isLoading: true, error: null})
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ user: res.data.user, isAuthenticated: true,})
        } catch (error) {
            set({ error: error.response?.data?.message || 'Signup Failed'});
            throw error;
        } finally {
            set({ isLoading: false})
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null});
        try {
            const res = await axiosInstance.post('/auth/verify-email', { code });
            set({ user: res.data.user, isAuthenticated: true})
            toast.success('Email successfully verified')
        } catch (error) {
            set({ error: error.response?.data?.message})
            throw error
        } finally {
            set({ isLoading: false})
        }
    },

    login: async (data) => {
        set({ isLoading: true, error: null})
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ user: res.data.user, isAuthenticated: true, isLoading: false})
            console.log(res)
        } catch (error) {
            set({ error: error.response?.data?.message || 'Login Failed'});
            throw error
        } finally {
            set({ isLoading: false,})
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null, message: null})
        try {
            const res = await axiosInstance.post('/auth/forgot-password', {email})
            set({message: res.data.message})
            toast.success("Password reset link sent to your email!")
        } catch (error) {
            set({ error: error?.response?.data?.message || "Error sending reset password email."})
            throw error;
        } finally {
            set({isLoading: false, error: null})
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null})
        try {
            const res = await axiosInstance.post(`/auth/reset-password/${token}`, {password})
            set({ user: res.data.user, message: res.data.message})
            toast.success("Password reset successful! You can now log in.")
        } catch (error) {
            set({ error: error?.response?.data?.message || "Error resetting password."})
            toast.error(error?.response?.data?.message || "Error resetting password.")
            throw error;
        } finally {
            set({isLoading: false, error: null})
        }
    },


}))