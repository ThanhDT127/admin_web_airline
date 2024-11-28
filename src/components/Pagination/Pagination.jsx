// src/components/tables/Pagination.jsx
import React from 'react';
import './Pagination.scss';

function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="pagination">
            <button className='bt_pagination' onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </button>
            <span> Page {currentPage} of {totalPages} </span>
            <button className='bt_pagination'
                onClick={() => {


                    onPageChange(currentPage + 1);
                    // console.log("Next page:", currentPage + 1);
                }} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
}

export default Pagination;
