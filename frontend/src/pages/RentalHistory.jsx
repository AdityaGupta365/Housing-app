
// import React ,{useEffect, useState} from 'react'
// import {useDispatch} from 'react-redux';
// import {useSelector} from 'react-redux';

// import LoadingSpinner from '../common/LoadingSpinner.jsx';
// import { fetchRentalHistory } from '../redux/slices/rentalHistorySlice.js';

// const RentalHistory=()=>{
//     const {history,loading,error}=useSelector((state)=>state.RentalHistory);
//     if(loading){
//         return <LoadingSpinner message="loading rental history"/>
//     }

//     return(
//         <>
//         <h1>
//             RENTAL HISTORY
//         </h1> 
        
//         <div>
//             history.map((ele)=>(
//                 <div>ele</div>
//             ))
//         </div>
//         </>
//     )
// }
// export default RentalHistory;






import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { fetchRentalHistory } from '../redux/slices/rentalHistorySlice.js';

const RentalHistory = () => {
  const dispatch = useDispatch();
  // assumes reducer key is `rentalHistory` in your root reducer
  const { history, loading, error } = useSelector((state) => state.rentalHistory);

  useEffect(() => {
    dispatch(fetchRentalHistory());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner message="loading rental history" />;
  }

  return (
    <>
      <h1>RENTAL HISTORY</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '12px' }}>
          Error: {error}
        </div>
      )}

      <div>
        {Array.isArray(history) && history.length > 0 ? (
          history.map((ele) => (
            <div key={ele._id} style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '8px' }}>
              <h3>{ele.propertyName || ele.property?.title || 'Property'}</h3>
              <p>
                <strong>Tenant:</strong> {ele.tenantName || ele.tenant?.name || 'N/A'}
              </p>
              <p>
                <strong>From:</strong> {ele.startDate ? new Date(ele.startDate).toLocaleDateString() : 'N/A'}{' '}
                <strong>To:</strong> {ele.endDate ? new Date(ele.endDate).toLocaleDateString() : 'N/A'}
              </p>
              <p>
                <strong>Amount:</strong> {ele.amount ?? ele.total ?? 'N/A'}
              </p>
              <p>
                <strong>Payment Status:</strong> {ele.paymentStatus || ele.status || 'unknown'}
              </p>
            </div>
          ))
        ) : (
          <div>No rental history found.</div>
        )}
      </div>
    </>
  );
};

export default RentalHistory;
