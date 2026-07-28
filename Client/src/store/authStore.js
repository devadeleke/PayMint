import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set) => {
    // AUTHENTICATE HELPER FUNCTION
    const authenticatedUser = (data) => {
        set({ user: data, isAuthenticated: true})
    }
    
    // LOGOUT HELPER FUNCTION
    const unauthenticateUser = () => {
        set({ user: null, isAuthenticated: false,});
    };
    
    // LOADING HELPER FUNCTION
    const startLoading = () => {
        set({ isLoading: true, error: null})
    }

    // STOP LOADING HELPER FUNCTION
    const stopLoading = () => {
        set({ isLoading: false})
    }

    // ERROR HANDLER HELPER FUNCTION
    const handleError = (error, fallbackMessage) => {
        const message = error.response?.data?.message || fallbackMessage;
        set({ error: message,});
        toast.error(message);
    };

    return {
        user: null,
        isAuthenticated: false,
        isCheckingAuth: true,
        isLoading: false,
        error: null,
        message: null,

        clearError: () => set({ error: null}),

        checkAuth: async () => {
            set({isCheckingAuth: true, error: null,});

            try {
                const res = await axiosInstance.get("/auth/check-auth");

                authenticatedUser(res.data.data);

            } catch (error) {
                unauthenticateUser();
            } finally {
                set({isCheckingAuth: false,});
            }
        },

        signup: async (data) => {
            startLoading();
            try {
                const res = await axiosInstance.post('/auth/signup', data);
                authenticatedUser(res.data.data)
                toast.success(res.data.message);
            } catch (error) {
                handleError(error, `Signup Failed Error ${error}`);
            } finally {
                stopLoading();
            }
        },

        verifyEmail: async (code) => {
            startLoading();
            try {
                const res = await axiosInstance.post('/auth/verify-email', { code });
                authenticatedUser(res.data.data)
                toast.success(res.data.message);
            } catch (error) {
                handleError(error, "Email verification failed");
            } finally {
                stopLoading();
            }
        },

        login: async (data) => {
            startLoading();
            try {
                const res = await axiosInstance.post('/auth/login', data);
                authenticatedUser(res.data.data)
                toast.success(res.data.message);
            } catch (error) {
                handleError(error, 'Login Failed');
            } finally {
                stopLoading();
            }
        },

        logout: async () => {
            try {
                const res = await axiosInstance.post("/auth/logout")
                unauthenticateUser();
                toast.success(res.data.message);
            } catch (error) {
                handleError(error, "Error logging out");
            }
        },

        forgotPassword: async (email) => {
            startLoading();
            try {
                const res = await axiosInstance.post('/auth/forgot-password', {email})
                set({message: res.data.message})
                toast.success(res.data.message);
            } catch (error) {
                set({ error: error?.response?.data?.message || "Error sending reset password email."})
                toast.error('Error sending reset link.')
            } finally {
                stopLoading();
            }
        },

        resetPassword: async (token, password) => {
            startLoading();
            try {
                const res = await axiosInstance.post(`/auth/reset-password/${token}`, {password})
                set({ user: res.data.data, message: res.data.message})
                toast.success(res.data.message);
            } catch (error) {
                set({ error: error?.response?.data?.message || "Error resetting password."})
                toast.error("Error resetting password.")
            } finally {
                stopLoading();
            }
        },
    }
})