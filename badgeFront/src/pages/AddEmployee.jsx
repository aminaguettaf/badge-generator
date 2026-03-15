import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import Select from "react-select";

const AddEmployee = () => {
    const { url, navigate, loading, setLoading, getAuthHeaders } = useAppContext();
    const [photoPreview, setPhotoPreview] = useState(null);
    const [formData, setFormData] = useState({
        old_matricule: '', new_matricule: '', ssn: '', 
        first_name: '', last_name: '', function: '', 
        department: '', blood_type: '', photo: null, category: ''
    });

    const [errors, setErrors] = useState({
        new_matricule: "", old_matricule: "", ssn: "", 
        first_name: "", last_name: "", function: "", 
        department: "", blood_type: "", category:'', general: ""
});

    const handleError = (field, message) => {
        setErrors((prev) => ({...prev, [field]: message}));
    };

    const clearErrors = () => {
        setErrors({
            new_matricule: "", old_matricule: "", ssn: "", 
            first_name: "", last_name: "", function: "", 
            department: "", blood_type: "", category:"", general: ""
        });
    };

    const bloodTypes = [
        {value: 'AP', label: 'A+'}, {value: 'AN', label: 'A-'}, {value: 'BP', label: 'B+'},
        {value: 'BN', label: 'B-'}, {value: 'ABP', label: 'AB+'}, {value: 'ABN', label: 'AB-'},
        {value: 'OP', label: 'O+'}, {value: 'ON', label: 'O-'}
    ];

    const departments = [
        'IT', 'EP', 'HSE', 'XP', 'MNT', 'FIN', 'JUR', 'DAT', 'MOG', 'PE', 'INT', 'REAL', 'SEC', 'TEC', 'SIE', 'MED', 'INFRA', 
    ];

    const departmentOptions = departments.map(dept => ({value: dept, label: dept}));
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectChange = (selectedOption, { name }) => {
        setFormData(prev => ({...prev, [name]: selectedOption ? selectedOption.value : '' }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, photo: file }));
            const reader = new FileReader();
            reader.onloadend = () => { setPhotoPreview(reader.result); };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearErrors();
        if (!formData.new_matricule){
            handleError('new_matricule', 'Le matricule est requis');
            return;
        }
        if (!formData.first_name){
            handleError('first_name', 'Le prénom est requis');
            return;
        }
        if (!formData.last_name){
            handleError('last_name', 'Le nom est requis');
            return;
        }
        if (!formData.function){
            handleError('function', 'La fonction est requise');
            return;
        }
        if (!formData.department){
            handleError('department', 'La structure est requise');
            return;
        }
        if (!formData.ssn){
            handleError('ssn', 'Le NNS est requis');
            return;
        }
        if (!formData.blood_type){
            handleError('blood_type', 'Le groupe sanguin est requis');
            return;
        }
        if (!formData.category){
            handleError('category', 'La catégorie est requise');
            return;
        }
        setLoading(true);
        try {
            const headers = await getAuthHeaders();
            delete headers['Content-Type'];

            const data = new FormData();
            data.append('new_matricule', formData.new_matricule);
            data.append('first_name', formData.first_name);
            data.append('last_name', formData.last_name);
            data.append('function', formData.function);
            data.append('department', formData.department);
            data.append('category', formData.category);
            if (formData.old_matricule) data.append('old_matricule', formData.old_matricule);
            if (formData.ssn) data.append('ssn', formData.ssn);
            if (formData.blood_type) data.append('blood_type', formData.blood_type);
            if (formData.photo) { data.append('photo', formData.photo); }

            const response = await axios.post(`${url}/employees/`, data, {headers: {...headers, 'Content-Type': 'multipart/form-data'}, withCredentials: true, timeout: 20000});
            
            if (response.data.success || response.status === 201) {
                toast.success(response.data.message);
                setFormData({
                    old_matricule: '', new_matricule: '', ssn: '',
                    first_name: '', last_name: '', function: '',
                    department: '', blood_type: '', photo: null
                });
                setPhotoPreview(null);
                navigate('/employes');
            }
        }  catch (error) {
            console.error("Détails de l'erreur :", error); 
            if (error.response && error.response.data) {
                const data = error.response.data;
                let hasValidationError = false;
                const errorFields = ['old_matricule', 'new_matricule', 'ssn', 'first_name', 'last_name', 'function', 'department', 'blood_type', 'category'];
                errorFields.forEach(field => {
                    if (data[field]) {
                        handleError(field, Array.isArray(data[field]) ? data[field][0] : data[field]);
                        hasValidationError = true;
                    }
                });   
                if (!hasValidationError) {
                    handleError('general', data.detail || data.message || 'Une erreur est survenue lors de la modification.');
                }
            } else {
                handleError('general', 'Erreur de connexion au serveur.');
            }
        } finally {
            setLoading(false);
        }
    }

    const customSelectStyles = {
        control: (base, state) => ({...base, paddingLeft: '2rem', minHeight: '50px', borderRadius: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderColor: state.isFocused ? "#FF8500" : (errors.department ? "#ef4444" : "#d1d5db"), boxShadow: state.isFocused ? "0 0 0 2px #FF850080" : "none", "&:hover": {borderColor: "#FF8500"}}),
        menu: (base) => ({...base, borderRadius: '0.75rem', overflow: 'hidden', zIndex: 50})
    };

    return (
        <div className="min-h-screen bg-bg py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/employes" className="group flex items-center text-text-secondary hover:text-primary transition-colors duration-300">
                        <i className="fa-solid fa-arrow-left text-lg mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"></i>
                        Retour à la liste
                    </Link>
                    <h1 className="text-3xl font-extrabold text-text-primary">
                        <span className="bg-gradient-to-r from-secondary to-secondary-dull bg-clip-text text-transparent">Ajouter un employé</span>
                    </h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {errors.general && (
                        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{errors.general}</p>
                        </div>
                    )}
                    <div className="bg-white rounded-2xl shadow-xl  border border-gray-100">
                        <div className="bg-gradient-to-r from-primary/5 to-primary-dull/5 p-6 border-b border-gray-100">
                            <div className="flex items-center space-x-6">
                                <div className="relative group">
                                    <div className={` w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-dull flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl ${photoPreview ? 'p-1' : ''} `}>
                                        {photoPreview ? ( <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <i className="fa-solid fa-user text-3xl text-white"></i>
                                        )}
                                    </div>
                                    <label htmlFor="photo" className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary-dull transition-colors duration-300" >
                                        <i className="fa-solid fa-camera text-sm text-white"></i>
                                    </label>
                                    <input type="file" id="photo" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary">Photo de profil</h3>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <label className="block text-sm font-medium text-text-primary mb-2">Nouveau matricule <span className="text-primary">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <i className="fa-solid fa-id-badge text-text-secondary group-focus-within:text-primary transition-colors"></i>
                                        </div>
                                        <input type="text" name="new_matricule" value={formData.new_matricule} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm relative z-0 ${errors.new_matricule ? 'border-red-500' : 'border-gray-300 text-text-primary'}`} placeholder="Ex: 254766411"/>
                                    </div>
                                    {errors.new_matricule && <p className="mt-1 text-xs text-red-500">{errors.new_matricule}</p>}
                                </div>
                                <div className="relative group">
                                    <label className="block text-sm font-medium text-text-primary mb-2">Ancien matricule</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <i className="fa-solid fa-id-card text-text-secondary group-focus-within:text-primary transition-colors"></i>
                                        </div>
                                        <input type="text" name="old_matricule" value={formData.old_matricule} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm relative z-0 ${errors.new_matricule ? 'border-red-500' : 'border-gray-300 text-text-primary'}`} placeholder="Ex: 83821L"/>
                                    </div>
                                    {errors.old_matricule && <p className="mt-1 text-xs text-red-500">{errors.old_matricule}</p>}
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-sm font-medium text-text-primary mb-2">Numéro de Sécurité Sociale <span className="text-primary">*</span></label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                        <i className="fa-solid fa-hashtag text-text-secondary group-focus-within:text-primary transition-colors"></i>
                                    </div>
                                    <input type="text" name="ssn" value={formData.ssn} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm relative z-0 ${errors.ssn ? 'border-red-500' : 'border-gray-300 text-text-primary'}`} placeholder="123456789"/>
                                </div>
                                {errors.ssn && <p className="mt-1 text-xs text-red-500">{errors.ssn}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <label className="block text-sm font-medium text-text-primary mb-2">Prénom <span className="text-primary">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <i className="fa-solid fa-user text-text-secondary group-focus-within:text-primary transition-colors"></i>
                                        </div>
                                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm relative z-0 ${errors.first_name ? 'border-red-500' : 'border-gray-300 text-text-primary'}`} placeholder="Mohamed"/>
                                    </div>
                                    {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                                </div>

                                <div className="relative group">
                                    <label className="block text-sm font-medium text-text-primary mb-2"> Nom <span className="text-primary">*</span> </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <i className="fa-regular fa-user text-text-secondary group-focus-within:text-primary transition-colors"></i>
                                        </div>
                                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm relative z-0 ${errors.last_name ? 'border-red-500' : 'border-gray-300 text-text-primary'} `} placeholder="Guettal"/>
                                    </div>
                                    {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <label className="block text-sm font-medium text-text-primary mb-2">Fonction <span className="text-primary">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <i className="fa-solid fa-briefcase text-text-secondary group-focus-within:text-primary transition-colors"></i>
                                        </div>
                                        <input name="function" value={formData.function} onChange={handleChange}  className={` block w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none relative z-0 ${errors.function ? 'border-red-500' : 'border-gray-300 text-text-primary'} `} placeholder='Fonction'/>
                                    </div>
                                    {errors.function && <p className="mt-1 text-xs text-red-500">{errors.function}</p>}
                                </div>
                                <div className="relative group z-20">
                                    <label className="block text-sm font-medium text-text-primary mb-2">Département <span className="text-primary">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <i className="fa-solid fa-building text-text-secondary group-focus-within:text-primary transition-colors"></i>
                                        </div>
                                        <Select name="department" options={departmentOptions} value={departmentOptions.find(op => op.value === formData.department) || null} onChange={handleSelectChange} styles={customSelectStyles} placeholder="Sélectionner une structure" className={`relative z-0 ${errors.department ? 'error-select' : ''}`} isClearable/>
                                    </div>
                                    {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="block text-sm font-medium text-text-primary mb-2">Catégorie<span className="text-primary">*</span> </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                        <i className="fa-solid fa-layer-group text-text-secondary group-focus-within:text-primary transition-colors"></i>
                                    </div>
                                    <input type="number" name="category" value={formData.category} onChange={handleChange} min="10" max="21" className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm relative z-0 ${ errors.category ? 'border-red-500' : 'border-gray-300 text-text-primary' }`} placeholder="20" />
                                </div>
                               {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-3">Groupe sanguin <span className="text-primary">*</span></label>
                                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                                    {bloodTypes.map(type => (
                                        <button key={type.value} type="button" onClick={() => setFormData(prev => ({...prev, blood_type: type.value}))} className={`relative group py-2 px-1 rounded-lg text-xs font-medium transition-all duration-300 transform cursor-pointer hover:scale-110 ${formData.blood_type === type.value ? `bg-red-500 text-white shadow-lg scale-105 ring-2 ring-primary ring-offset-2` : 'bg-white text-text-primary border border-gray-200 hover:bg-bg'}`}>
                                            <span className="relative z-10">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                                {errors.blood_type && <p className="mt-1 text-xs text-red-500">{errors.blood_type}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end space-x-4">
                        <Link to="/employes" className="px-6 py-3 border border-gray-300 rounded-xl text-text-primary font-medium hover:bg-bg transition-all duration-300" >Annuler</Link>
                        <button type="submit" disabled={loading} className="group relative px-8 py-3 bg-gradient-to-r from-primary to-primary-dull text-white font-semibold rounded-xl shadow-lg shadow-primary/25 cursor-pointer hover:shadow-xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2">
                            <span>Ajouter l'employé</span>
                            {loading ? 
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> :
                                <i className="fa-solid fa-paper-plane transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"></i>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;