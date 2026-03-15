import React from 'react';

const Pagination = ({currentPage, totalPages, totalCount, pageSize, onPageChange, onPageSizeChange, loading = false, siblingCount = 1, className = '', showFirstLast = true, showPrevNext = true, size = 'medium'})=>{
  
  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;
    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;
    if (!showLeftDots && showRightDots) {
      const leftItemsCount = 1 + 2 * siblingCount + 2;
      for (let i = 1; i <= leftItemsCount; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    } else if (showLeftDots && !showRightDots) {
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = totalPages - (1 + 2 * siblingCount + 1); i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (showLeftDots && showRightDots) {
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const sizeClasses = {
    small: { button: 'w-8 h-8 text-sm', icon: 'w-4 h-4', container: 'space-x-1' },
    medium: { button: 'w-10 h-10 text-base', icon: 'w-5 h-5', container: 'space-x-2' },
    large: { button: 'w-12 h-12 text-lg', icon: 'w-6 h-6', container: 'space-x-3' }
  };

  const handlePageChange = (page) => {
    if (!loading && page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1 && totalCount === 0) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between mt-6 ${className}`}>
      
      <div className="flex items-center mb-4 sm:mb-0 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
        <label htmlFor="pageSize" className="text-sm text-gray-500 mr-3">Lignes par page:</label>
        <select id="pageSize" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} disabled={loading} className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none focus:ring-0 cursor-pointer disabled:opacity-50" >
          {[5, 10, 20, 50].map(size => (<option key={size} value={size}>{size}</option>))}
        </select>
        <span className="ml-4 pl-4 border-l border-gray-200 text-sm text-gray-500"> Total: <span className="font-semibold text-primary">{totalCount}</span> </span>
      </div>
      <div className={`flex items-center ${sizeClasses[size].container} p-2 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100`}>
        {showFirstLast && (
          <button onClick={() => handlePageChange(1)} disabled={currentPage === 1 || loading} className={`${sizeClasses[size].button} flex items-center justify-center rounded-xl text-gray-500 cursor-pointer hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-50 transition-all duration-300`} >
            <i className={`fa-solid fa-angles-left ${sizeClasses[size].icon}`}></i>
          </button>
        )}
        {showPrevNext && (
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading} className={`${sizeClasses[size].button} flex items-center justify-center rounded-xl text-gray-500 cursor-pointer hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-50 transition-all duration-300`} >
            <i className={`fa-solid fa-chevron-left ${sizeClasses[size].icon}`}></i>
          </button>
        )}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className={`${sizeClasses[size].button} flex items-center justify-center text-gray-400 select-none`}>⋯</span>
            ) : (
              <button key={page} onClick={() => handlePageChange(page)} disabled={loading} className={`${sizeClasses[size].button} relative flex items-center justify-center rounded-xl font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 ${currentPage === page ? 'bg-gradient-to-r from-primary to-[#D28A35] text-white shadow-md' : 'text-gray-600 hover:text-primary hover:bg-orange-50'}`} >
                {page}
              </button>
            )
          ))}
        </div>
        {showPrevNext && (
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || loading} className={`${sizeClasses[size].button} flex items-center justify-center rounded-xl text-gray-500 cursor-pointer hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-50 transition-all duration-300`} >
            <i className={`fa-solid fa-chevron-right ${sizeClasses[size].icon}`}></i>
          </button>
        )}
        {showFirstLast && (
          <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages || loading} className={`${sizeClasses[size].button} flex items-center justify-center rounded-xl text-gray-500 cursor-pointer hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-50 transition-all duration-300`} >
            <i className={`fa-solid fa-angles-right ${sizeClasses[size].icon}`}></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;