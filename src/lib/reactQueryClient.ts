import { MutationCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// QueryClient setup
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (res: any) => {
      if (res.message) toast.success(res.message || "Success");
    },
    onError: (error: any) => {
      const apiError = error.response?.data || error.response || error;
      const errorMessage =
        apiError?.errors?.error?.[0] ||
        apiError?.message ||
        apiError?.message?.[0] ||
        "Something went wrong";
      toast.error(errorMessage);
    },
  }),
});
