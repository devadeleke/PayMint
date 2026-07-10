import { create } from 'zustand';
import toast from 'react-hot-toast';

import { axiosInstance } from '../lib/axios';

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,

    signup: async (data) => {
        set({ isLoading: true})
        try {
            const res = await axiosInstance.post('/auth/signup', data)
            set({ user: data})  
            toast.success("Signup successful! Please login to continue.")
            return res.data;
        } catch (error) {
           const message = error?.response?.data?.message || "Signup Failed"
           console.log(message)
           toast.error("Signup failed. Please try again.", error) 
        } finally {
            set({ isLoading: false})
        }
    },

    // ... your existing login action ...
    login: async (data) => {
        try {
           const res = await axiosInstance.post('/auth/login', data)
           set({ user: res.data.user})
           toast.success("Login successful!")
           return res.data; 
        } catch (error) {
           const message = error?.response?.data?.message || "Login Failed"
           console.log(message)
           toast.error(message) 
        }
    },

    verifyEmail: async (data) => {
        try {
            // data usually contains { token } or { code }
            const res = await axiosInstance.post('/auth/verify-email', data)
            
            // If verification automatically logs them in or updates user status:
            if (res.data?.user) {
                set({ user: res.data.user })
            }
            
            toast.success("Email verified successfully!")
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Email verification failed."
            console.log(message)
            toast.error(message)
            throw error; // Throwing allows your UI to handle loading/error states locally if needed
        }
    },

    forgotPassword: async (data) => {
        try {
            // data usually contains { email }
            const res = await axiosInstance.post('/auth/forgot-password', data)
            toast.success("Password reset link sent to your email!")
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to send reset email."
            console.log(message)
            toast.error(message)
            throw error;
        }
    },

    resetPassword: async (token, data) => {
        try {
            const res = await axiosInstance.post(`/auth/reset-password/${token}`, data)
            toast.success("Password reset successful! You can now log in.")
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Password reset failed."
            console.log(message)
            toast.error(message)
            throw error;
        }
    },


    
})
)