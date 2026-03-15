
const DeleteModal = ({itemName, onClose, onConfirm}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="text-sm text-center text-gray-800 bg-white shadow-[0px_4px_25px_0px_#0000000D] px-4 py-8 md:px-10 md:py-10 m-1 rounded-lg max-w-md w-full">
            <div className="mt-6 text-center">
                <h3 className="text-lg font-medium text-text-primary mb-2">Confirmer la suppression</h3>
                <p className="text-sm text-text-secondary">
                    Êtes-vous sûr de vouloir supprimer l'employé<br/>
                    <span className="font-semibold text-text-primary">{itemName}</span> ?
                </p>
            </div>
            <div className="mt-8 flex justify-center space-x-4">
                <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-text-primary hover:bg-gray-50 transition-colors cursor-pointer">Annuler</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer">Supprimer</button>
            </div>
        </div>
    </div>
  );
};

export default DeleteModal;