import './App.css'
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import { Toaster, toast } from 'react-hot-toast'
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
axios.defaults.withCredentials = true;

import EmployeesList from './pages/EmployeesList';
import Login from './pages/Login'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer';
import Loader from './components/Loader'
import AddEmployee from './pages/AddEmployee';
import UpdateEmployees from './pages/UpdateEmployees';



const ProtectedRoute = ({ children }) => {
  const {user} = useAppContext();
  if (!user){
    return <Navigate to="/login" replace/>;
  }
  return children;
};


function App() {
  const {user, isLoading, setIsLoading} = useAppContext();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 400);
      return () => clearTimeout(timeout);
    }
    else {
    setIsLoading(false);
  }
  }, [location.pathname]);

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const isLogoutRequest = error.config?.url?.includes('/logout');
        const isLoginRequest = error.config?.url?.includes('/login');
        if ((error.response?.status === 401 || error.response?.status === 403) && !isLogoutRequest && !isLoginRequest) {
          localStorage.removeItem('user');
          sessionStorage.clear();
          toast.error('Session expirée. Veuillez vous reconnecter.', {duration: 4000, position: 'top-center'});
          window.location.href = '/login';
          return new Promise(() => {}); 
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);
 

  return (
    <div>
      <Toaster />
      {isLoading && <Loader/>}
      <Navbar />
      <Routes>
        <Route path='/login' element={user ? <Navigate to="/" replace/> : <Login/>}/>
        <Route path='/' element={<ProtectedRoute> <Home/> </ProtectedRoute>}/>
        <Route path='/employes' element={<ProtectedRoute> <EmployeesList/> </ProtectedRoute>}/>
        <Route path='/employes/ajouter' element={<ProtectedRoute> <AddEmployee/> </ProtectedRoute>}/>
        <Route path='employes/modifier/:id' element={<ProtectedRoute> <UpdateEmployees/> </ProtectedRoute>}/>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
