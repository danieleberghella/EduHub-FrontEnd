import { createContext, ReactNode, useContext, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

interface AlertContextProps {
    showAlert: (title: string, message: string, variant: "default" | "destructive" | "success" | null | undefined, timer?: number) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextProps | null>(null);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alertTitle, setAlertTitle] = useState<string | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertStyle, setAlertStyle] = useState<"default" | "destructive" | "success" | null | undefined>();

    const showAlert = (title: string, message: string, variant: "default" | "destructive" | "success" | null | undefined, timer: number= 3000) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertStyle(variant);
        setTimeout(() => hideAlert(), timer)
    };

    const hideAlert = () => {
        setAlertMessage(null);
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            {alertMessage && alertTitle && alertStyle && (
                <Alert variant={alertStyle} className={`fixed bottom-5 right-5 z-50 transition-all duration-300 transform ${alertMessage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                    }`}
                    style={{
                        backgroundColor: "white",
                        border: "2px solid",
                        borderRadius: "8px",
                        padding: "1rem 2rem",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        maxWidth: "300px",
                    }}>
                    <XCircle onClick={hideAlert} className="btn h-4 w-4 cursor-pointer" />
                    <AlertTitle >{alertTitle}</AlertTitle>
                    <AlertDescription >{alertMessage}</AlertDescription>
                </Alert>
            )}
        </AlertContext.Provider>
    );
};
