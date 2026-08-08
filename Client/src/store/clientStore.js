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
    isRestoringClient: false,
    
    error: null,
    clearError: () => set({ error: null }),
    clearClient: () => set({ client: null }),

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
    },

    getClient: async (id) => {
        set({ client: null, isFetchingClient: true, error: null})
        try {
            const res = await axiosInstance.get(`/clients/${id}`)
            console.log("Response:", res.data);
            set({ client: res.data.data, isFetchingClient: false}) 
            console.log("Stored client:", res.data.data);
        } catch (error) {
            console.log(error);
            set({ isFetchingClient: false})
        }
    },

    updateClient: async (id, clientData) => {
      set({ isUpdatingClient: true });

      try {
        const res = await axiosInstance.patch(`/clients/${id}`, clientData);

        set((state) => ({
          clients: state.clients.map((client) =>
            client._id === id ? res.data.data : client
          ),
          client: res.data.data,
        }));

        toast.success("Client updated successfully");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to update client"
        );
        throw error;
      } finally {
        set({ isUpdatingClient: false });
      }
    },

    archiveClient: async (id) => {
      set({ isArchivingClient: true});
      try {
        const res = await axiosInstance.patch(`/clients/${id}/archive`);
        set((state) => ({
      clients: state.clients.filter(
        (client) => client._id !== id
      ),
      client:
        state.client?._id === id
          ? res.data.data
          : state.client,
    }));

    toast.success("Client archived successfully");

        toast.success("Client archived successfully");
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to archive client");
          throw error;
      } finally {
        set({ isArchivingClient: false });
      }
    },

    restoreClient: async (id) => {
      set({ isRestoringClient: true });

      try {
        const res = await axiosInstance.patch(`/clients/${id}/restore`);

        set((state) => ({
          clients: state.clients.map((client) =>
            client._id === id ? res.data.data : client
          ),
          client:
            state.client?._id === id
              ? res.data.data
              : state.client,
        }));

        toast.success("Client restored successfully");
      } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to restore client"
          );
          throw error;
      } finally {
          set({ isRestoringClient: false });
      }
  },
}))