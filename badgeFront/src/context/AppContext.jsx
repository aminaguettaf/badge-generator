import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {
    const navigate = useNavigate()
    const url = '/api'

    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // const [user, setUser] = useState(() => {const savedUser = localStorage.getItem('user'); return savedUser ? JSON.parse(savedUser) : '';});
    const [user, setUser] = useState();

    const value = {
        navigate, url,
        loading, setLoading,
        isLoading, setIsLoading,
        user, setUser
    };

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext);
}