import React from 'react';

const Pagination = ({ page, setPage, hasNext }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
            <button
                style={{
                    backgroundColor: page === 0 ? '#ccc' : '#3498db',
                    color: page === 0 ? '#888' : '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    marginRight: '10px',
                    borderRadius: '5px',
                    cursor: page === 0 ? 'not-allowed' : 'pointer',
                }}
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
            >
                Previous
            </button>
            <span
                style={{
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    fontSize: '18px',
                    margin: '0 15px',
                }}
            >
                Page: {page + 1}
            </span>
            <button
                style={{
                    backgroundColor: hasNext ? '#3498db' : '#ccc',
                    color: hasNext ? '#fff' : '#888',
                    border: 'none',
                    padding: '10px 20px',
                    marginLeft: '10px',
                    borderRadius: '5px',
                    cursor: hasNext ? 'pointer' : 'not-allowed',
                }}
                disabled={!hasNext}
                onClick={() => setPage(page + 1)}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
