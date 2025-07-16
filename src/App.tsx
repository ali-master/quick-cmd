import { useState } from "react";
import { CommandLauncher } from "@/components/command-launcher.tsx";
import { ToastContainer, Toast } from "@/components/ui/toast";

function App() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  return (
    <div className="h-screen flex flex-col">
      <CommandLauncher onToast={showToast} />

      <ToastContainer>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast(null)}
          />
        )}
      </ToastContainer>
    </div>
  );
}

export default App;
