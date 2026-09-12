import { createContext, useState } from "react";
import LoadingOverlay from "../components/LoandingOverlay";

export const LoadingContext = createContext();

export default function LoadingProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState();

    return (
        <LoadingContext.Provider value={{ loading, setLoading, setLoadingText }}>
            {children}

            <LoadingOverlay
                visible={loading}
                text={loadingText}
            />
        </LoadingContext.Provider>
    );
}

