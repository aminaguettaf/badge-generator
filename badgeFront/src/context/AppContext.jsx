import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {
    const navigate = useNavigate()
    const url = '/api'

    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [allEmployees, setAllEmployees] = useState([]);

    const [user, setUser] = useState(() => {const savedUser = localStorage.getItem('user'); return savedUser ? JSON.parse(savedUser) : '';});
  

    const getAuthHeaders = useCallback(async () => {
        axios.defaults.withCredentials = true;
        const getCsrfToken = () => {
            return document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];
        };
        let token = getCsrfToken();
        if (!token) {
            try {
            await axios.get(`${url}/sanctum/csrf-cookie/`, {headers: {'Accept': 'application/json'}});
            token = getCsrfToken();
            } catch (error) {
            throw new Error(error.message);
            }
        }
        if (!token) throw new Error("XSRF-TOKEN not found in cookies");
        return {
            'Accept': 'application/json',
            'X-XSRF-TOKEN': token,
            'Content-Type': 'application/json',
        };
    }, [url]);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const headers = await getAuthHeaders();
            const data = {username, password};
            const response = await axios.post(`${url}/login/`, data, {headers, withCredentials: true, timeout: 20000});
            if (response.data?.user) {
            setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/');
                return {success: true, data: response.data};
            } else {
                return {success: false, error: response.data?.error || 'Erreur de connexion'};
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erreur de connexion';
            return {success: false, error: errorMessage};
        } finally {
            setLoading(false);
        }
    };

    const getUser = async () => {
        try {
            setIsLoading(true)
            const headers = await getAuthHeaders();
            const response = await axios.get(`${url}/user/`, {headers, withCredentials: true});
            if (response.data?.user) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log(response.data.user);
            }
        } catch (error) {
            console.error('Get user error:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('user');
                setUser('');
                navigate('/');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const logout = async () => {
        try {
            const headers = await getAuthHeaders();
            const response = await axios.post(`${url}/logout/`, {}, {headers, withCredentials: true});
            toast.success(response.data.message);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            sessionStorage.clear();
            localStorage.clear();
            setUser('');
            navigate('/login', {replace: true});
        }
    };

    const getAllEmployees = useCallback(async() => {
        setIsLoading(true);
        try {
            const headers = await getAuthHeaders();
            const response = await axios.get(`${url}/employees/?all=true`, {headers, withCredentials: true} );
            if (response.data.success) {
                setAllEmployees(response.data.data);
                console.log(response.data.data);
            } else {
                console.log('Erreur inattendue lors de la récupération');
            }
        } catch (error) {
            console.error('error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [getAuthHeaders, url]); 

    const value = {
        navigate, url,
        loading, setLoading,
        isLoading, setIsLoading,
        user, setUser, getAuthHeaders,
        login, getUser, logout,
        getAllEmployees, allEmployees
    };

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext);
}