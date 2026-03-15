import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const Home = () => {
    const { url, loading, setLoading, getAuthHeaders } = useAppContext();
    const [matricule, setMatricule] = useState('');
    const [employeeData, setEmployeeData] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [downloadingBadge, setDownloadingBadge] = useState(false);

    const handleError = (field, message) => {
        setErrors((prev) => ({...prev, [field]: message}));
    };

    const clearErrors = () => {
        setErrors({});
    };

    const handleMatriculeChange = (e) => {
        setMatricule(e.target.value);
        if (errors.matricule) {
            setErrors(prev => ({...prev, matricule: ''}));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                if (employeeData) {
                    setEmployeeData({...employeeData, photo: reader.result});
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLoadEmployee = async () => {
        if (!matricule) {
            handleError('matricule', 'Veuillez entrer un matricule');
            return;
        }
        clearErrors();
        setLoading(true);
        try {
            const headers = await getAuthHeaders();
            const response = await axios.get(`${url}/employees/by-matricule/${matricule}/`, {headers, withCredentials: true});

            if (response.data.success) {
                const employee = response.data.data;
                setEmployeeData({
                    nom: employee.last_name?.toUpperCase() || '',
                    prenom: employee.first_name?.toUpperCase() || '',
                    fonction: employee.function?.toUpperCase() || '',
                    structure: employee.department?.toUpperCase() || '',
                    nss: employee.ssn?.toUpperCase() || '',
                    gs: employee.blood_type?.toUpperCase() || '',
                    photo: employee.photo || null 
                });
                if (employee.photo) {
                    setPhotoPreview(employee.photo);
                } else {
                    setPhotoPreview(null);
                }
                setPhotoFile(null);
                
                toast.success('Informations chargées avec succès');
            }
        } catch (error) {
            console.error("Erreur lors du chargement :", error);
            if (error.response && error.response.status === 404) {
                handleError('matricule', 'Aucun employé trouvé avec ce matricule');
            } else {
                toast.error('Erreur lors du chargement des informations');
            }
            setEmployeeData(null);
            setPhotoPreview(null);
            setPhotoFile(null);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLoadEmployee();
        }
    };

    const handleGenerateBadge = async () => {
        if (!matricule) return;
        setDownloadingBadge(true);
        try {
            const headers = await getAuthHeaders();
            const formData = new FormData();
            if (photoFile) {
                formData.append('photo', photoFile);
            }
            const response = await axios.post(`${url}/employees/generate-badge/${matricule}/`, formData, {headers: {...headers, 'Content-Type': 'multipart/form-data'}, withCredentials: true, responseType: 'blob'});

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `Badge_${matricule}.docx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Badge généré avec succès !');
            if (photoFile) {
                setPhotoFile(null);
            }
        } catch (error) {
            console.error("Erreur lors de la génération du badge :", error);
            toast.error('Erreur lors de la génération du document.');
        } finally {
            setDownloadingBadge(false);
        }
    };

    return (
        <div className="h-[760px] bg-bg py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="my-6 text-center">
                    <p className="text-secondary">
                        Génération de badge de façon Simple et Efficace<br />
                        <span className="font-semibold">Charger <span className='text-primary'> > </span> Visualiser <span className='text-primary'> > </span> Imprimer</span>
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                            <i className="fa-solid fa-id-card text-primary mr-2"></i>
                            Informations de l'agent
                        </h2>
                        <div className="mb-6">
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-text-primary whitespace-nowrap w-24">Matricule:</label>
                                <div className="flex-1 flex gap-3">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <i className="fa-solid fa-id-badge text-text-secondary"></i>
                                        </div>
                                        <input type="text" value={matricule} onChange={handleMatriculeChange} onKeyPress={handleKeyPress} className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${errors.matricule ? 'border-red-500' : 'border-gray-300'}`} placeholder="Entrez le matricule"/>
                                    </div>
                                    <button onClick={handleLoadEmployee} disabled={loading} className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dull text-white font-semibold rounded-xl shadow-lg cursor-pointer hover:shadow-xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap">
                                        <span>Charger</span>
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <i className="fa-solid fa-cloud-arrow-down"></i>
                                        )}
                                    </button>
                                </div>
                            </div>
                            {errors.matricule && (<p className="mt-1 text-sm text-red-500 ml-24">{errors.matricule}</p>)}
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-text-primary whitespace-nowrap w-24">Nom:</label>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-regular fa-user text-text-secondary"></i>
                                    </div>
                                    <input type="text" value={employeeData?.nom || ''} readOnly className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="---"/>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-text-primary whitespace-nowrap w-24">Prénom:</label>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-user text-text-secondary"></i>
                                    </div>
                                    <input type="text" value={employeeData?.prenom || ''} readOnly className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="---"/>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-text-primary whitespace-nowrap w-24">Fonction:</label>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-briefcase text-text-secondary"></i>
                                    </div>
                                    <input type="text" value={employeeData?.fonction || ''} readOnly className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="---"/>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-text-primary whitespace-nowrap w-24">Structure:</label>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-building text-text-secondary"></i>
                                    </div>
                                    <input type="text" value={employeeData?.structure || ''} readOnly className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="---"/>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-text-primary whitespace-nowrap w-24">NSS:</label>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-hashtag text-text-secondary"></i>
                                    </div>
                                    <input type="text" value={employeeData?.nss || ''} readOnly className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="---"/>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-text-primary whitespace-nowrap w-24">G.S:</label>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-droplet text-text-secondary"></i>
                                    </div>
                                    <input type="text" value={employeeData?.gs || ''} readOnly className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="---"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                            <i className="fa-solid fa-camera text-primary mr-2"></i>
                            Photo de l'agent
                        </h2>
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <div className="relative group">
                                <div className={`w-64 h-64 rounded-2xl bg-gradient-to-br from-primary/10 to-primary-dull/10 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden transition-all duration-300 ${photoPreview ? 'border-solid border-primary' : ''}`}>
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Photo de l'agent" className="w-full h-full object-cover"/>
                                    ) : (
                                        <div className="text-center">
                                            <i className="fa-solid fa-image text-5xl text-gray-400 mb-2"></i>
                                            <p className="text-gray-400 text-sm">Aucune photo</p>
                                        </div>
                                    )}
                                </div>
                                <label htmlFor="photo-upload" className="absolute -bottom-3 right-1/2 transform translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary-dull transition-all duration-300 hover:scale-110">
                                    <i className="fa-solid fa-camera text-white text-lg"></i>
                                </label>
                                <input type="file" id="photo-upload" accept="image/*" onChange={handleFileChange} className="hidden"/>
                            </div>
                            <p className="text-sm text-text-secondary text-center">{photoPreview ? "Cliquez sur l'icône pour changer la photo" : "Cliquez sur l'icône pour importer une photo"}</p>
                        </div>
                        {employeeData && (
                            <div className="mt-16 p-2 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-700 text-sm flex items-center justify-center">
                                    <i className="fa-solid fa-check-circle mr-2"></i>
                                    Information de l'agent Chargées
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {employeeData && (
                <button onClick={handleGenerateBadge} disabled={downloadingBadge} className="w-[500px] mx-auto px-6 py-3 bg-gradient-to-r from-secondary to-secondary-dull text-white font-semibold rounded-xl shadow-lg cursor-pointer hover:shadow-xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    <span>Visualiser le badge</span>
                    {downloadingBadge ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <i className="fa-solid fa-eye text-xl"></i>
                    )}
                </button>
            )}
        </div>
    );
};

export default Home;