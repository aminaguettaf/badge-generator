import './App.css'
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast'

import Login from './pages/Login'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Loader from './components/Loader'


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
 
  return (
    <div>
      <Toaster />
      {isLoading && <Loader/>}
      <Navbar />
      <Routes>
        <Route path='/login' element={user ? <Navigate to="/" replace/> : <Login/>}/>
        <Route path='/' element={<ProtectedRoute> <Home/> </ProtectedRoute>}/>
      </Routes>
    </div>
  )
}

export default App
