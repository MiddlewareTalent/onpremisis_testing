import React, { useEffect, useState} from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';
import { Navigate } from 'react-router-dom';
import Modal from 'react-modal';
import UpdateTasks from './UpdateTasks';
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaSearch } from 'react-icons/fa';
import { PlusIcon } from "@heroicons/react/16/solid";
import { Link } from 'react-router-dom';
import Loader from '../../Assets/Loader';
import Empty from '../../Assets/Empty.svg';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const AssignedTasks = (props) => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [taskData, setTaskData] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [taskType, setTaskType] = useState("allTasks");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);  // Current page
  const [itemsPerPage] = useState(5);  // Items per page (can be adjusted)
  const employeeId=localStorage.getItem("employeeId");
  const token=localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {

      let url;

      if (taskType === "allTasks") {
        url = `https://middlewaretalentsbackend.azurewebsites.net/apis/employees/tasksAssignedBy/${employeeId}`;
      } else if (taskType === "overdueTasks") {
        url = `https://middlewaretalentsbackend.azurewebsites.net/apis/employees/OverdueTasks/AssignedFrom/${employeeId}`;
      }
      else if(taskType==="pendingTasks"){
        url=`https://middlewaretalentsbackend.azurewebsites.net/apis/employees/PendingTasks/AssignedFrom/${employeeId}`;
        console.log(2);
      }
      else if(taskType==="completedTasks"){
        url=`https://middlewaretalentsbackend.azurewebsites.net/apis/employees/CompletedTasks/AssignedFrom/${employeeId}`;
        console.log(2);
      }

      try {
          // Retrieve the token from localStorage
        
        const response = await axios.get(url, {
          headers: {
            "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
          }
        });
        console.log(response.data);
        setData(response.data.reverse());  // Handle the response data
        setLoading(false);  // Stop the loading state
      } catch (error) {
        console.error('Error fetching data:', error);  // Log any error that occurs
        setLoading(false);  // Stop the loading state
      }
      
    };

    fetchData();
  }, [taskType, employeeId, token]);  // Rerun the effect when taskType changes

  const isLoggedIn = localStorage.getItem('email');
  if (isLoggedIn === null) {
    return <Navigate to="/login" />
  }

  // Function to handle task deletion
  const deleteTask = async (id) => {
    setDeleteId(id);
    setIsDelete(true);
  }

  const no = () => {
    setIsDelete(false);
  }

  const confirmDelete = async () => {
    setLoading(true);
    const id = deleteId;
    await axios.delete(`https://middlewaretalentsbackend.azurewebsites.net/apis/employees/tasks/${id}`,{
      headers: {
        "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
      }
    });

    // Refresh data after deletion
    const fetchData = async () => {

      let url;

      if (taskType === "allTasks") {
        url = `https://middlewaretalentsbackend.azurewebsites.net/apis/employees/tasksAssignedBy/${employeeId}`;
      } else if (taskType === "overdueTasks") {
        url = `https://middlewaretalentsbackend.azurewebsites.net/apis/employees/OverdueTasks/AssignedFrom/${employeeId}`;
      }

      try {
        const response = await axios.get(url,{
          headers: {
            "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
          }
        });
        setData(response.data.reverse());
        setLoading(false);
        setIsDelete(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }

  const taskUpdate = async (taskId) => {
    setLoading(true);
    if (!isOpen) {
      try {
        const response = await axios.get(`https://middlewaretalentsbackend.azurewebsites.net/apis/employees/tasks/${taskId}`,{
          headers: {
            "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
          }
        });
        setTaskData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setIsOpen(true);
    } else {
      const fetchData = async () => {

        let url;

        if (taskType === "allTasks") {
          url = `https://middlewaretalentsbackend.azurewebsites.net/apis/employees/tasksAssignedBy/${employeeId}`;
        } else if (taskType === "overdueTasks") {
          url = `https://middlewaretalentsbackend.azurewebsites.net/apis/employees/OverdueTasks/AssignedFrom/${employeeId}`;
        }

        try {
          const response = await axios.get(url,{
            headers: {
              "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
            }
          }
          );
          setData(response.data.reverse());
          setLoading(false);
          setIsDelete(false);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
      setIsOpen(false);
    }
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
  const taskTypeChange=(event)=>{

      setLoading(true);
      const fetchData = async () => {
      setTaskType(event.target.value);
      setCurrentPage(1);

        let url;
      if(event.target.value==="allTasks"){
        url=`https://middlewaretalentsbackend.azurewebsites.net/apis/employees/tasksAssignedBy/${employeeId}`;
        console.log(1);
      }
      else if(event.target.value==="overdueTasks"){
        url=`https://middlewaretalentsbackend.azurewebsites.net/apis/employees/OverdueTasks/AssignedFrom/${employeeId}`;
        console.log(2);
      }
      else if(event.target.value==="pendingTasks"){
        url=`https://middlewaretalentsbackend.azurewebsites.net/apis/employees/PendingTasks/AssignedFrom/${employeeId}`;
        console.log(2);
      }
      else if(event.target.value==="completedTasks"){
        url=`https://middlewaretalentsbackend.azurewebsites.net/apis/employees/CompletedTasks/AssignedFrom/${employeeId}`;
        console.log(2);
      }
      console.log(taskType);
      console.log(url);


      try {
        const response = await axios.get(url,{
          headers: {
            "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
          }
        });
        setData(response.data.reverse());
        setLoading(false)
      } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    }

  const table = () => {
    const searchData = currentTasks.filter(each =>
      each.personName.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <div> 
      <div>

{/*           <Transition appear show={isOpen} as={Fragment}> */}
{/*                 <Dialog as="div" className="relative z-10" onClose={setIsOpen}> */}
{/*                   <Transition.Child */}
{/*                     as={Fragment} */}
{/*                     enter="ease-out duration-300" */}
{/*                     enterFrom="opacity-0" */}
{/*                     enterTo="opacity-100" */}
{/*                     leave="ease-in duration-200" */}
{/*                     leaveFrom="opacity-100" */}
{/*                     leaveTo="opacity-0" */}
{/*                   > */}
{/*                     <div className="fixed inset-0 bg-black bg-opacity-25" /> */}
{/*                   </Transition.Child> */}

{/*                   <div className="fixed inset-0 overflow-y-auto overflow-x-auto"> */}
{/*                     <div className="flex min-h-full min-w-full items-center justify-center p-4 text-center"> */}
{/*                       <Transition.Child */}
{/*                         as={Fragment} */}
{/*                         enter="ease-out duration-300" */}
{/*                         enterFrom="opacity-0 scale-95" */}
{/*                         enterTo="opacity-100 scale-100" */}
{/*                         leave="ease-in duration-200" */}
{/*                         leaveFrom="opacity-100 scale-100" */}
{/*                         leaveTo="opacity-0 scale-95" */}
{/*                       > */}
{/*                         <Dialog.Panel className="max-w-full w-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"> */}
{/*                            */}
{/*                           <div className="mt-10 w-lg"> */}

{/*                   </div> */}
{/*                         </Dialog.Panel> */}
{/*                       </Transition.Child> */}
{/*                     </div> */}
{/*                     <button onClick={taskUpdate} type="button" className="self-end text-red-600"> */}
{/*                                    <IoCloseCircleOutline className="size-12" /> */}
{/*                                  </button> */}
{/*                                  <UpdateTasks taskUpdate={taskUpdate} taskData={taskData} /> */}
{/*                   </div> */}
{/*                 </Dialog> */}
{/*               </Transition> */}
{/*         <Modal isOpen={isOpen} style={customStyles}> */}
{/*           <div className="flex flex-col justify-center items-center"> */}
{/*             <button onClick={taskUpdate} type="button" className="self-end text-red-600"> */}
{/*               <IoCloseCircleOutline className="size-12" /> */}
{/*             </button> */}
{/*             <UpdateTasks taskUpdate={taskUpdate} taskData={taskData} /> */}
{/*           </div> */}
{/*         </Modal> */}
        {/* <Modal isOpen={isDelete} style={customStylesDelete}> */}
{/*           <div className="flex flex-col justify-center items-center"> */}
{/*             <h1>Do you want to delete task?</h1> */}
{/*             <div className='mt-8'> */}
{/*               <button */}
{/*                 type="button" */}
{/*                 onClick={confirmDelete} */}
{/*                 className="ml-5 px-6 py-3 bg-red-500 text-white text-lg font-semibold rounded-md hover:bg-red-700" */}
{/*               > */}
{/*                 Yes */}
{/*               </button> */}
{/*               <button */}
{/*                 type="button" */}
{/*                 onClick={no} */}
{/*                 className="ml-5 px-6 py-3 bg-white-500 border-current border text-black text-lg font-semibold rounded-md hover:bg-white-700 border-solid" */}
{/*               > */}
{/*                 No */}
{/*               </button> */}
{/*             </div> */}
{/*           </div> */}
{/*         </Modal> */}

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
            <UpdateTasks taskUpdate={taskUpdate} taskData={taskData} />
          </div>
        </div>
      </Modal>

<Modal isOpen={isDelete} style={customStylesDelete}>
          <div className="flex flex-col justify-center items-center">
            <h1>Do you want to delete task?</h1>
            <div className='mt-8'>
              <button
                type="button"
                onClick={confirmDelete}
                className="ml-5 px-6 py-3 bg-red-500 text-white text-lg font-semibold rounded-md hover:bg-red-700"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={no}
                className="ml-5 px-6 py-3 bg-white-500 border-current border text-black text-lg font-semibold rounded-md hover:bg-white-700 border-solid"
              >
                No
              </button>
            </div>
          </div>
        </Modal>

        <table className="min-w-full divide-y divide-gray-200 mt-10">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                Task Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                Effective Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                Delete
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider">
                Update
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {searchData.map(each => (
              <TaskItem key={each.id} each={each} deleteTask={deleteTask} taskUpdate={taskUpdate} />
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
      </div></div>
    );
  };



  const customStylesDelete = {
    content: {
      width: '40vw',
      height: '20vh',
      margin: 'auto',
      top: '20%',
      left: '30%',
      transform: 'translate(-50%, -50%)',
    },
  };

  return (
    <div>
      <div className='flex flex-row'>
        <h2 className="text-4xl font-bold leading-7 text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
          Tasks assigned by you
        </h2>
      </div>

      <div className='flex flex-row mt-5 mb-5'>
        <Link to="/CreateTask">
          <button
            type="button"
            className="inline-flex ml-5 mt-5 items-center rounded-md bg-indigo-600 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-8 w-8" aria-hidden="true" />
            Create Task
          </button>
        </Link>

        <select
          value={taskType}
          onChange={taskTypeChange}
          className="ml-5 border border-gray-300 rounded-md"
        >
          <option value="allTasks">All Tasks</option>
          <option value="pendingTasks">Pending Tasks</option>
          <option value="overdueTasks">Overdue Tasks</option>
          <option value="completedTasks">Completed Tasks</option>
        </select>

        <div className='relative flex items-center ml-5'>
          <input
            type='text'
            className='pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Employee Name'
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <FaSearch className='absolute left-3 text-gray-400' />
        </div>
      </div>

      {isLoading ? <Loader/>: data.length===0 ? <img className='mt-40 ml-auto mr-auto h-80 self-center ' src={Empty} alt="No Data FOund"/>:table()}
    </div>
  );
}

export default AssignedTasks;
