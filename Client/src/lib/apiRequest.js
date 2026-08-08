import toast from "react-hot-toast";

export const apiRequest = async ({
  request,
  setLoading,
  successMessage,
  errorMessage,
  onSuccess,
}) => {
  try {
    setLoading?.(true);

    const { data } = await request();

    if (onSuccess) {
      onSuccess(data);
    }

    if (successMessage) {
      toast.success(successMessage);
    }

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      errorMessage ||
      "Something went wrong.";

    toast.error(message);

    throw error;
  } finally {
    setLoading?.(false);
  }
};