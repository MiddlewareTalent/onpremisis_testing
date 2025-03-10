import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiArrowLongLeft } from "react-icons/hi2";
import { Navigate } from 'react-router-dom';
import AddTask from "./AddTask";
import TeamMember from "./TeamMember";
import Modal from 'react-modal';
import { IoCloseCircleOutline } from "react-icons/io5";
import Loader from "../../Assets/Loader";

const EmployeesList = props => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Define how many employees to show per page
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [personToAddTask, setPersonToAddTask] = useState();
  const [searchTerm, setSearchTerm] = useState("");  // Add search state

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem('token');
      setLoading(true);

      try {
        const employeeId=localStorage.getItem("employeeId");
        const response = await fetch(`https://ssitcloudbackend.azurewebsites.net/api/v1/employeeManager/reporting-to/${employeeId}/all`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const data = await response.json();
        
        setEmployees(data);  // Assuming the API returns an array of employees
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees by name
  let filteredEmployees = [];
if (employees.length > 0) {
  filteredEmployees = employees.filter(employee =>
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by first name or last name
  );
}

  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:bg-gray-200"
        >
          Previous
        </button>
        <div className="flex space-x-2">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageClick(number)}
              className={`px-4 py-2 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {number}
            </button>
          ))}
        </div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:bg-gray-200"
        >
          Next
        </button>
      </div>
    );
  };

  const taskCreate = (email) => {
    if (!isOpen) {
      const onePerson = employees.filter(each =>
        each.corporateEmail === email
      );
      setPersonToAddTask(onePerson);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const isLoggedIn = localStorage.getItem('email');
  if (isLoggedIn === null) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="ml-10 mr-10">
      <div className="mb-6">
        <Link to="/Tasks" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <HiArrowLongLeft className="mr-2 h-6 w-6" />
          Back to tasks
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-xl font-semibold leading-6 text-gray-900">
              Select employees to assign the task.
            </h3>
            
            {/* Search input */}
            <input
              type="text"
              placeholder="Search by name"
              className="mt-4 px-4 py-2 border rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}  // Update search term
            />
          </div>
          <ul className="divide-y divide-gray-200">
            {currentEmployees.map((member) => (
              <TeamMember key={member.corporateEmail} taskCreate={taskCreate} member={member} />
            ))}
          </ul>
        </div>
      )}

      {renderPagination()} {/* Pagination controls */}

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
                <IoCloseCircleOutline className="h-8 w-8" />
              </button>
            </div>
            <AddTask taskCreate={() => setIsOpen(false)} personToAddTask={personToAddTask} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeesList;
