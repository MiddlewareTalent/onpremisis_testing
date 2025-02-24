import { useState } from 'react';
import axios from "axios";
import Loader from '../../Assets/Loader';

export default function AddTask(props) {
  const { taskCreate, personToAddTask } = props;
  const [personName, setName] = useState(personToAddTask[0].firstName+" "+personToAddTask[0].lastName || "");
  const [email, setEmail] = useState(personToAddTask[0].corporateEmail || "");
  const [taskName, setTaskName] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const personId=personToAddTask[0].employeeId;
  console.log(personId);
  const token=localStorage.getItem('token');

  const taskCreated = async (event) => {
    event.preventDefault();
    const taskDetailsd = {
      taskAssignedById: localStorage.getItem("employeeId"),
      taskAssignedByEmail: localStorage.getItem('email'),
      personName,
      personEmail: email,
      taskName,
      taskDetails,
      effectiveDate,
      dueDate,
    };

    if (taskName !== "" && taskDetails !== "") {
      setIsLoading(true);
      try {
        axios.post("https://middlewaretalentsbackend.azurewebsites.net/apis/employees/tasks", {
          taskAssignedById: localStorage.getItem("employeeId"),
          taskAssignedByName: localStorage.getItem('firstName') + " " + localStorage.getItem('lastName'),
          taskAssignedByEmail: localStorage.getItem('email'),
          personId,
          personName,
          personEmail: email,
          taskName,
          taskDetails,
          effectiveDate,
          dueDate,
          taskStatus: false,
        }, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .then(response => {
          console.log('Task assigned successfully:', response.data);
        })
        .catch(error => {
          console.error('Error assigning task:', error);
        });
        setIsError(false);
        console.log(taskDetailsd);
        taskCreate();
      } catch (error) {
        console.error("Error creating task:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }


      try{
        await axios.post("https://middlewaretalentsbackend.azurewebsites.net/apis/employees/notifications",{
          "notificationType":"tasks",
          "notification": `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')} has been assigned a new task. Click here to see the full details.`,
          "notificationTo":personId,
          "isRead":false
        }
        , {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
      }
      catch (error) {
        console.error("Error creating task:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }


    } else {
      setIsError(true);
    }
  };

  return (
    <div>
      {isLoading && <Loader/>}
      <form onSubmit={taskCreated} className="mx-auto mt-8 max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Add New Task</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-lg font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              autoComplete="given-name"
              value={personName}
              onChange={event => setName(event.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
            />
          </div>

          <div>
            <label htmlFor="taskTitle" className="block text-lg font-medium text-gray-700 mb-1">
              Task Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="taskTitle"
              id="taskTitle"
              autoComplete="off"
              value={taskName}
              onChange={event => setTaskName(event.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
            />
          </div>

          <div>
            <label htmlFor="taskDetails" className="block text-lg font-medium text-gray-700 mb-1">
              Task Details <span className="text-red-600">*</span>
            </label>
            <textarea
              name="taskDetails"
              id="taskDetails"
              rows={4}
              value={taskDetails}
              onChange={event => setTaskDetails(event.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
            />
          </div>

          <div>
            <label htmlFor="effectiveDate" className="block text-lg font-medium text-gray-700 mb-1">
              Effective Date
            </label>
            <input
              type="date"
              name="effectiveDate"
              id="effectiveDate"
              value={effectiveDate}
              onChange={event => setEffectiveDate(event.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-lg font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              value={dueDate}
              onChange={event => setDueDate(event.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg"
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button
          type="submit"
          className="w-full px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Task
        </button>
        {isLoading && <p className="mt-2 text-lg text-blue-600">Please Wait...</p>}
        {isError && <p className="mt-2 text-lg text-red-600">*Please Fill Mandatory Fields</p>}
      </div>
    </form>
    </div>
  );
}

