import { AppRouter } from "./routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/reactQueryClient";
import { Toaster } from "sonner";
import { AuthProvider } from "./providers/auth-provider";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
