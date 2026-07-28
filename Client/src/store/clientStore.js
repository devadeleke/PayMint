import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useClientStore = create((set) => ({
    clients: [],
    client: null,

    isCreatingClient: false,
    isFetchingClients: false,
    isFetchingClient: false,
    isUpdatingClient: false,
    isArchivingClient: false,
    
    error: null,
    clearError: () => set({ error: null }),

    // CREATE CLIENT
    createClient: async (clientData) => {
        set({ isCreatingClient: true, error: null });
        try {
           const res = await axiosInstance.post('/clients/', clientData);
           set((state) => ({
            clients: [...state.clients, res.data.data.client],
            isCreatingClient: false
           }));

           toast.success("Client created successfully");
           return res.data.data.client;
        } catch (error) {
           const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message;

           set({ error: message, isCreatingClient: false,});
           toast.error(message);

           throw error;
        }
    },

    // GET CLIENTS
    getClients: async () => {
        set({ isFetchingClients: true, error: null})
        try {
           const res = await axiosInstance.get('/clients');
           set({ clients: res.data.data, isFetchingClients: false}) 
        } catch (error) {
            console.log(error)
            set({ isFetchingClients: false})
        }
    }
}))