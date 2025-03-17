import React, { useState, useEffect } from 'react';

import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaTimes } from 'react-icons/fa';
import {MdOutlineHorizontalRule} from 'react-icons/md';
import axios from 'axios';  // Use 'import' syntax for axios
import Pagination, { getPaginationData } from './Pagination';
import LeaveRequestForm from './LeaveForm.jsx'
import Loader from "../Assets/Loader";
import Empty from '../Assets/Empty.svg';
 
export default function LeaveEmployee() {
  const [leaveRequests, setLeaveRequests] = useState([])
 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [deleteRequestId, setDeleteRequestId] = useState(null); // Store request ID to be deleted
  const [modalType, setModalType] = useState(null); // Track the type of modal ("leave" or "delete")
  const [count, setCount] = useState(0);
  const [statusCount, setStatusCount] = useState({pending: 0, approved: 0, rejected: 0,});
 // const [editingRequest, setEditingRequest] = useState(null); // state to old the request being edited
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  //const [currentRequest, setCurrentRequest] = useState(null); // Track the request being edited
  const [filteredRequests, setFilteredRequests] = useState([]);
   const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [startDate, setStartDate] = useState(null); // Start date for filtering
  const [endDate, setEndDate] = useState(null); // End date for filtering
  const [employeesPerPage] = useState(5);
 
 
    const fetchLeaveRequests = async () => {
      const employeeId= localStorage.getItem('employeeId');
      console.log('Employee ID:', employeeId); // Add this to check
  if (!employeeId) {
    console.log("Employee ID is missing");
    return;
  }
      setLoading(true);
      try {
        const token = localStorage.getItem('token')
        console.log(token)
        const response = await axios.get(`https://msquirebackend.azurewebsites.net/api/leaves/employee/${employeeId}`, {
          headers:{
            'Authorization' : `Bearer ${token}`,
          }
        });
        console.log('Employee', employeeId);
        console.log("API Response Data:", response.data); // Log the response
        // Sort leave requests to put the most recent requests on top
        const leaves = response.data
        setLeaveRequests(leaves.sort((a, b) => (b.createdAt || b.id) - (a.createdAt || a.id)));
        setFilteredRequests(leaves);  // Initially set all requests to filtered requests
        const total = leaves.length;
          const pending = leaves.filter(leave => leave.leaveStatus === 'PENDING').length;
          const approved = leaves.filter(leave => leave.leaveStatus === 'APPROVED').length;
          const rejected = leaves.filter(leave => leave.leaveStatus === 'REJECTED').length;
   
          setCount(total);
          setStatusCount({ pending, approved, rejected });
      }
      catch (error) {
     
        console.log("Error fetching in leave requests", error)
      }
      finally{
        setLoading(false);
      }
    }
 
    useEffect(() =>{
      fetchLeaveRequests();
    }, []);
 
  
 
    const applyFilters = () => {
       
       if (!Array.isArray(leaveRequests)) return;
    
       let filtered = [...leaveRequests] // always start from original data
    
       console.log("Filtering with Start Date:", startDate);
       console.log("Filtering with End Date:", endDate);
    
    
        // Reset filters when "Show All" is clicked
        if (selectedStatus === 'ALL' && !startDate && !endDate) {
         setFilteredRequests(leaveRequests); // Show all requests
         
         return;
     }
    
       // Apply status filters
       if(selectedStatus !== 'ALL'){
         filtered = filtered.filter(request => request.leaveStatus === selectedStatus);
        
       }  
      
    
    
      
       // If a start date is selected, filter the leave requests that are >= start date
       if (startDate) {
         filtered = filtered.filter(request => new Date(request.leaveStartDate) >= new Date(startDate));
        
       }
   
       // If an end date is selected, filter the leave requests that are <= end date
       if (endDate) {
         filtered = filtered.filter(request => new Date(request.leaveEndDate) <= new Date(endDate));
        
       }
    
        setFilteredRequests(filtered);
         
     }
    
      // call applyFilters() whenever filter is changed
    const filterByStatus = (status) => {
     setSelectedStatus(status);
    
   }
    
   useEffect(() => {
     if (leaveRequests.length > 0) {  // ✅ Only apply filters if Data is loaded
     applyFilters();
     }
   });
    
     const filterByDateRange = (start, end) => {
       setStartDate(start);
       setEndDate(end);
       applyFilters();
      
      
     }
    
 
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <FaCheckCircle className="text-green-500" />
      case 'REJECTED':
        return <FaTimesCircle className="text-red-500" />
      default:
        return <FaHourglassHalf className="text-yellow-500" />
    }
  }
 
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }
 
  // const handleEditRequest = (request) => {
  // //  console.log("Request: " + request.medicalDocument)
  
  //   navigate("/LeaveForm", {
  //     state: {
  //       edit: true,
  //       ...request // passing all details for editing
  //     },
  //   });
  // };
 
 
  const headers = ["Start Date", "End Date", "Type", "Status", "Action"];
 
  // Get paginate data
  const {totalPages, currentItems} = getPaginationData(filteredRequests, currentPage, employeesPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
 
  const handleOpenModal = (type, id) => {
    setModalType(type); // Set modal type (leave request or delete confirmation)
    if (type === 'delete') {
      setDeleteRequestId(id); // Store the request ID for deletion
    }
    setIsModalOpen(true); // Open modal
  }
 
  const closeModal = async() => {
    setIsModalOpen(false); // Close modal
    setDeleteRequestId(null); // Reset request ID
    setModalType(null); // Reset modal type
    const employeeId= localStorage.getItem('employeeId');
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`https://msquirebackend.azurewebsites.net/api/leaves/employee/${employeeId}`, {
        method:'GET',
        headers:{
          'Authorization' : `Bearer ${token}`,
          'Content-Type' : 'application/json'
        },
      });
      console.log('Employee', employeeId);
      console.log("API Response Data:", response.data); // Log the response
      // Sort leave requests to put the most recent requests on top
      const leaves = response.data
      setLeaveRequests(leaves.sort((a, b) => (b.createdAt || b.id) - (a.createdAt || a.id)));
      setFilteredRequests(leaves);  // Initially set all requests to filtered requests
     
    }
    catch (error) {
   
      console.log("Error fetching in leave requests", error)
    }
    finally{
      setLoading(false);
    }
   
   
  }
 
  const handleCloseModal = async() => {
    fetchLeaveRequests();
    setIsModalOpen(false);
    
    
}
 
  const handleConfirmDelete = async () => {
    const employeeId= localStorage.getItem('employeeId');
    setLoading(true);
    try {
      // Proceed with deletion
      const token = localStorage.getItem('token')
      await axios.delete(`https://msquirebackend.azurewebsites.net/api/leaves/delete/${deleteRequestId}`, {
        method:'GET',
        headers:{
          'Authorization' : `Bearer ${token}`,
          'Content-Type' : 'application/json'
        },
      });
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`https://msquirebackend.azurewebsites.net/api/leaves/employee/${employeeId}`, {
          method:'GET',
          headers:{
            'Authorization' : `Bearer ${token}`,
            'Content-Type' : 'application/json'
          },
        });
        console.log('Employee', employeeId);
        console.log("API Response Data:", response.data); // Log the response
        // Sort leave requests to put the most recent requests on top
        const leaves = response.data
        setLeaveRequests(leaves.sort((a, b) => (b.createdAt || b.id) - (a.createdAt || a.id)));
        setFilteredRequests(leaves);  // Initially set all requests to filtered requests
       
      }
      catch (error) {
     
        console.log("Error fetching in leave requests", error)
      }
      finally{
        setLoading(false);
      }
      setIsModalOpen(false); // Close modal after delete
     
      // alert('Leave request deleted successfully.');
    } catch (error) {
     
      console.error('Error deleting leave request:', error);
      // alert('Failed to delete leave request. Please try again.');
    } finally{
      setLoading(false);
    }
  }
 
   // Handle changes in date inputs
   const handleStartDateChange = (e) => {
    const value = e.target.value;
    console.log("Selected Start Date: ", value);
    setStartDate(value);
};
 
const handleEndDateChange = (e) => {
    const value = e.target.value;
    console.log("Selected End Date: ", value);
    setEndDate(value);
};
 
const handleSubmit = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      console.log("Filtering with Leave Start Date:", startDate);
      console.log("Filtering with Leave End Date:", endDate);
  } else {
      console.log("Please select both leave start and end dates.");
  }
};

 const renderActions = (request) => {
   if(request.leaveStatus === 'APPROVED' || request.leaveStatus === 'REJECTED'){
    return <MdOutlineHorizontalRule className='m-6' />
   }

   if(request.leaveStatus === 'PENDING'){
    return(
      <div className="flex space-x-2">
                        
                       
                        <button
                         onClick={() => handleOpenModal('delete', request.id)}
                          className="inline-flex items-center px-4 py-1 border border-transparent font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                          Delete
                        </button>
                      </div>
    )
   }

   
  };
 

 
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      
      <div className="max-w-full mx-auto">
        <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
        <div className='p-6 sm:p-8'>
        {/* Heading */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold text-center ml-4">SUBMITTED LEAVE REQUESTS</h1>
           {/* Leave Request Button */}
        <div className="flex justify-end">
          <button onClick={() => handleOpenModal('leave')} className="px-4 py-2 bg-blue-400 font-bold text-white rounded shadow-md cursor-pointer transition duration-300 ease-in-out">
            LEAVE REQUEST
          </button>
        </div>
        </div>
          <div className="flex items-center space-x-4">
           
            {/* Calendar for selecting start and end dates */}
            <div>
            <form onSubmit={handleSubmit}>
                <div className="flex items-center space-x-2">
                    <input
                        type="date"
                        value={leaveRequests.leaveStartDate}  // Convert to yyyy-MM-dd
                         onChange={handleStartDateChange}
                        placeholder="Select start date"
                        className="p-3 border rounded-md text-md"
                    />
                    <span>to</span>
                    <input
                        type="date"
                       value={leaveRequests.leaveEndDate}  // Convert to yyyy-MM-dd
                       onChange={handleEndDateChange}
                        placeholder="Select end date"
                        className="p-3 border rounded-md"
                    />
                </div>
               
            </form>
        </div>
                   
           
            {/* Filter and Show All buttons */}
            <div className="flex space-x-2">
              <button
                onClick={filterByDateRange}
                className="ml-4 px-4 py-2 bg-blue-600 text-white text-lg rounded"
              >
                Filter
              </button>
              <button
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setFilteredRequests(leaveRequests); // Reset to show all requests
                  setCurrentPage(1); // Reset pagination to the first page
                }}
                className="ml-4 px-4 py-2 bg-gray-600 text-white text-lg rounded"
              >
                Show All
              </button>
            </div>
          </div>
       
 
       
      </div>

       {/* Status Summary */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <div className="text-center text-sm font-bold p-2">
          <button className="bg-blue-100 hover:bg-blue-200 text-gray-700 p-4 rounded-lg text-xl shadow-md cursor-pointer transition duration-300 ease-in-out" onClick={() => filterByStatus('ALL')}>Total Requests : {count}</button>
        </div>
        <div className="text-center text-sm font-bold p-2">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-lg text-xl shadow-md cursor-pointer transition duration-300 ease-in-out" onClick={() => filterByStatus('PENDING')}>Pending : {statusCount.pending}</button>
        </div>
        <div className="text-center text-sm font-bold p-2">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-4 rounded-lg text-xl shadow-md cursor-pointer transition duration-300 ease-in-out" onClick={() => filterByStatus('APPROVED')}>Approved : {statusCount.approved}</button>
        </div>
        <div className="text-center text-sm font-bold p-2">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-4 rounded-lg text-xl shadow-md cursor-pointer transition duration-300 ease-in-out" onClick={() => filterByStatus('REJECTED')}>Rejected : {statusCount.rejected}</button>
        </div>
      </div>
     
 
      {/* Modal for Leave Request Form or Delete Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
           <div className="bg-white p-4 rounded-lg shadow-lg relative max-w-xl w-full max-h-screen">  
           
            {modalType === 'leave' && (
              <div>
                {/* Render the Leave Request Form */}
                <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600"><FaTimes /></button>
                <LeaveRequestForm close={handleCloseModal} />
              </div>
            )}
           
           
            {modalType === 'delete' && (
              <div>
                {/* Render Delete Confirmation */}
                <h2 className="text-md font-bold">Are you sure you want to delete this leave request?</h2>
                <div className="flex space-x-4 mt-4">
                  <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded text-md">Confirm</button>
                  <button onClick={closeModal} className="px-4 py-2 bg-gray-600 text-white rounded">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
     
 
      {/* Leave Requests Table */}
      {loading ? <Loader/>: filteredRequests.length===0 ? <img className='mt-40 ml-auto mr-auto h-80 self-center ' src={Empty} alt="No Data FOund"/> :
      (<div className="overflow-x-auto m-6">
        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
       
         
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100">
                {headers.map((header) => (
                  <th key={header} className="px-5 py-3 border-b-2 border-gray-200  text-left font-bold text-gray-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
 
            <tbody>
              {currentItems.map((request => (
                <tr key={request.id} className="bg-white hover:bg-gray-50">
                  <td className="px-5 py-5 border-b border-gray-200 text-lg">
                    <p className="text-gray-900 whitespace-nowrap">{request.leaveStartDate}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-lg">
                    <p className="text-gray-900 whitespace-nowrap">{request.leaveEndDate}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-lg">
                    <p className="text-gray-900 whitespace-nowrap">{request.leaveType}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-lg">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${getStatusColor(request.leaveStatus)}`}>
                      {getStatusIcon(request.leaveStatus)}
                      <span className="ml-1">{request.leaveStatus}</span>
                    </span>
                  </td>
                 
                   <td className="px-5 py-5 border-b border-gray-200 text-lg">
                {renderActions(request)}
              </td>
                </tr>
              )))}
            </tbody>
            
          </table>
 
       
     
    {/* Pagination controls */}
    <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    paginate={paginate} />
       </div>
         
          </div>
            )}
         
    </div>
    </div>
    </div>
           
  )
 
}