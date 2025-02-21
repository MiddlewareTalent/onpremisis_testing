import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyTaskItem from './MyTaskItem';
import { Navigate } from 'react-router-dom';
import Loader from '../../Assets/Loader';
import Empty from '../../Assets/Empty.svg';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const MyTasks = props => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [taskType, setTaskType] = useState("allTasks");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage] = useState(5); // Items per page (can be adjusted)
  const employeeId=localStorage.getItem("employeeId");
  const token=localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await axios.get(`https://middlewaretalentsbackend.azurewebsites.net/apis/employees/tasksAssignedTo/${employeeId}`,{
          headers: {
            "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
          }
        });
        setData(response.data.reverse());
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [employeeId, token]); // Only run once when component mounts

  // If the user is not logged in, redirect to login page
  const isLoggedIn = localStorage.getItem('email');
  if (isLoggedIn === null) {
    return <Navigate to="/login" />;
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the items to display on the current page
  const indexOfLastTask = currentPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = data?.slice(indexOfFirstTask, indexOfLastTask) || [];

  // Function to handle task type change
  const taskTypeChange = async (event) => {
    setLoading(true);
    setTaskType(event.target.value);
    setCurrentPage(1); // Reset to the first page when task type changes


    let url;

    if (event.target.value === "allTasks") {
      url = `https://middlewaretalentsbackend.azurewebsites.net/apis/employees/tasksAssignedTo/${employeeId}`;
    } else if (event.target.value === "overdueTasks") {
      url = `https://middlewaretalentsbackend.azurewebsites.net/apis/employees/OverdueTasks/PersonId/${employeeId}`;
    } else if (event.target.value === "pendingTasks") {
      url = `https://middlewaretalentsbackend.azurewebsites.net/apis/employees/PendingTasks/PersonId/${employeeId}`;
    } else if (event.target.value === "completedTasks") {
      url = `https://middlewaretalentsbackend.azurewebsites.net/apis/employees/CompletedTasks/PersonId/${employeeId}`;
    }

    try {
      const response = await axios.get(url,{
        headers: {
          "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
        }
      });
      setData(response.data.reverse());
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  // Table component with pagination
  const table = () => {
    return (
      <div>
        <table className="min-w-full divide-y divide-gray-200 mt-10">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"
              >
                Assigned By
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"
              >
                Task Details
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"
              >
                Effective Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"
              >
                Due Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTasks.map(each => (
              <MyTaskItem key={each.id} each={each} />
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="flex justify-end mt-5 mr-5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="px-4 py-2">{currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= data.length}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-4xl font-bold leading-7 text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
        Tasks Assigned to you
      </h2>
      <div className="flex flex-row mt-5 mb-5">
        <select
          value={taskType}
          onChange={taskTypeChange}
          className="ml-5 border border-gray-300 rounded-md"
        >
          <option selected value="allTasks">All Tasks</option>
          <option value="pendingTasks">Pending Tasks</option>
          <option value="overdueTasks">Overdue Tasks</option>
          <option value="completedTasks">Completed Tasks</option>
        </select>
      </div>
      {isLoading ? <Loader/>: data.length===0 ? <img className='mt-40 ml-auto mr-auto h-80 self-center ' src={Empty} alt="No Data FOund"/> : table() }
    </div>
  );
};

export default MyTasks;
