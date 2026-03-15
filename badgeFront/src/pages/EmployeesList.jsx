import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Pagination from '../components/Pagination'; 
import DeleteModal from '../components/DeleteModal';

const EmployeesList = () => {
  const {getAuthHeaders, url, isLoading, setIsLoading} = useAppContext();

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteModal, setDeleteModal] = useState({show: false, id: null, name: ''});

  const getEmployees = useCallback(async (page = 1, newPageSize = pageSize) => {
    setIsLoading(true);
    try {
      const headers = await getAuthHeaders();
      let params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      params.append("page", page);
      params.append("page_size", newPageSize);
      const response = await axios.get(`${url}/employees/?${params.toString()}`, {headers, withCredentials: true});
      const data = response.data;
      if (data.results) { 
        setEmployees(data.results);
        setTotalCount(data.count);
        setCurrentPage(page);
        setTotalPages(Math.ceil(data.count / newPageSize));
      } else {
        const actualData = data.data || data;
        const count = data.count || actualData.length;
        setEmployees(actualData);
        setTotalCount(count);
        setCurrentPage(page); 
        setTotalPages(Math.ceil(count / newPageSize)); 
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des employés");
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders, url, searchTerm, pageSize, setIsLoading]);

  useEffect(() => {
    getEmployees(1);
  }, [getEmployees]);

  const handlePageChange = (page) => {
    getEmployees(page);
    window.scrollTo({top: 0, behavior: "smooth"});
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    getEmployees(1, newSize);
  };

  const handleDelete = async (id) => {
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${url}/employees/${id}/`, {headers, withCredentials: true});
      toast.success("Employé supprimé avec succès");
      setDeleteModal({ show: false, id: null, name: ''});
      getEmployees(currentPage);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center">
              <span className="bg-gradient-to-r from-secondary to-secondary-dull bg-clip-text text-transparent">Gestion des Employés</span>
            </h1>
            <p className="text-text-secondary mt-1">Gérez facilement vos employés et leurs informations</p>
          </div>
          <Link to="/employes/ajouter" className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-secondary to-secondary-dull text-white font-semibold rounded-xl shadow-lg shadow-secondary-500/25 hover:shadow-xl transform transition-all duration-300 hover:scale-105" >
            <i className="fa-solid fa-plus w-3 h-3 mr-2 group-hover:rotate-90 transition-transform duration-300"></i>
            Ajouter un employé
          </Link>
        </div>
        <div className="mb-8 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-text-secondary text-lg group-focus-within:text-primary transition-colors duration-200"></i>
          </div>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher par nom, prénom, matricule, NSS, fonction, département..." className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white shadow-sm" />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <i className="fa-solid fa-xmark text-text-secondary text-lg hover:text-primary transition-colors duration-200"></i>
            </button>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {employees.length === 0 ? (
            <div className="text-center py-20">
              <i className="fa-regular fa-face-frown mx-auto text-text-secondary text-4xl"></i>
              <h3 className="mt-2 text-sm font-medium text-text-primary">Aucun employé trouvé</h3>
              <p className="mt-1 text-sm text-text-secondary">Commencez par ajouter un employé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Photo</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Matricule</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Nom complet</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Fonction</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Département</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Catégorie</th> 
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Groupe sanguin</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dull rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {emp.photo ? (
                            <img src={emp.photo} alt={emp.first_name} className="w-full h-full object-cover rounded-lg"/>
                          ) : (
                            emp.first_name?.charAt(0) + emp.last_name?.charAt(0)
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary">{emp.new_matricule}</div>
                        {emp.old_matricule && (<div className="text-xs text-text-secondary">Anc: {emp.old_matricule}</div>)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-text-primary">{emp.first_name} {emp.last_name}</div>
                        {emp.ssn && (<div className="text-xs text-text-secondary">NSS: {emp.ssn}</div>)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-primary">{emp.function}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{emp.department}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Cat. {emp.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {emp.blood_type ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{emp.blood_type}</span>
                        ) : (
                          <span className="text-text-secondary">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link to={`/employes/modifier/${emp.id}`} className="text-primary cursor-pointer hover:text-primary-dull" title="Modifier" > <i className="fa-solid fa-pen-to-square w-5 h-5"></i></Link>
                          <button onClick={() => setDeleteModal({ show: true, id: emp.id, name: `${emp.first_name} ${emp.last_name}` })} className="text-red-600 cursor-pointer hover:text-red-900" title="Supprimer">
                            <i className="fa-solid fa-trash w-5 h-5"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {deleteModal.show && (
          <DeleteModal itemName={deleteModal.name} onClose={() => setDeleteModal({show: false, id: null, name: ''})} onConfirm={()=>handleDelete(deleteModal.id)}/>
        )}
        {employees.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} totalCount={totalCount} pageSize={pageSize} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} loading={isLoading}/>
        )}
      </div>
    </div>
  );
};

export default EmployeesList;