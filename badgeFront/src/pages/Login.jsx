import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
  const {login, loading, getUser} = useAppContext();
  const [formData, setFormData] = useState({username: '', password: ''});
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({username: "", password: "", general: ""});

  const handleError = (field, message) => {
    setErrors((prev) => ({...prev, [field]: message}));
  };

  const clearErrors = () => {
    setErrors({username: "", password: "", general: ""});
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    clearErrors();
    if(!formData.username){
      handleError('username', 'Veuillez remplir ce champ');
      return;
    }
    if(!formData.password){
      handleError('password', 'Veuillez remplir ce champ');
      return;
    }
    try {
      const result = await login(formData.username, formData.password);
      if(result.success){
        toast.success(result.data.message);
        await getUser();
      }
      else{
        handleError('general', result.error)
      }
    } catch (error) {
      console.error(error);
      handleError('general', 'Erreur lors de la connexion')
    }
  };

  return (
    <div className="h-[760px] bg-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-primary to-primary-dull rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary to-primary-dull rounded-full opacity-10 blur-3xl"></div>
        <div className="text-center relative">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dull rounded-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xl overflow-hidden">
                <img src={assets.logo} alt='logo'/>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-dull rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-300"></div>
            </div>
          </div>
          <p className="text-sm text-text-secondary">Connecte-toi pour générer tes badges</p>
        </div>
        {errors.general && (
          <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5"> 
            <div className="relative group">
              <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-1 ml-1">Nom d'utilisateur</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <i className="fa-solid fa-user h-5 w-5 flex items-center justify-center text-text-secondary group-focus-within:text-primary transition-colors duration-200"></i>
                </div>
                <input id="username" name="username" type="text" required value={formData.username} onChange={handleChange} className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} placeholder-text-secondary text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm z-0`} placeholder="Entrez votre nom d'utilisateur"/>
                {errors.username && (<p className="text-red-500 text-xs mt-1">{errors.username}</p>)}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dull rounded-xl opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <div className="relative group">
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1 ml-1">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <i className="fa-solid fa-lock h-5 w-5 flex items-center justify-center text-text-secondary group-focus-within:text-primary transition-colors duration-200"></i>
                </div>
                <input id="password" name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} placeholder-text-secondary text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm z-0`} placeholder="Entrez votre mot de passe"/>
                {errors.password && (<p className="text-red-500 text-xs mt-1">{errors.password}</p>)}
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-10">
                  {showPassword ? (
                    <i className="fa-solid fa-eye h-5 w-5 flex items-center justify-center text-text-secondary hover:text-primary transition-colors duration-200"></i>
                  ) : (
                    <i className="fa-solid fa-eye-slash h-5 w-5 flex items-center justify-center text-text-secondary hover:text-primary transition-colors duration-200"></i>
                  )}
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dull rounded-xl opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-primary to-primary-dull hover:from-primary-dull hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg shadow-orange-500/25 cursor-pointer">
              Se connecter
              <span className="absolute right-3 inset-y-0 flex items-center pl-3">
                {loading ? 
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 
                  <i className="fa-solid fa-right-from-bracket h-5 w-5 flex items-center justify-center text-white/70 group-hover:text-white transition-colors duration-200"></i>
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;