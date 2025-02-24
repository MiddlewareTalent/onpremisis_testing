import { useState } from 'react'
import axios from "axios";
import Loader from '../../Assets/Loader';


export default function UpdateTasks(props) {
  const[loading, setLoading]=useState(false);
  const {taskUpdate, taskData}=props
  const {taskId}=taskData
    const [personName, setName]=useState(taskData.personName)
    const [email, setEmail]=useState(taskData.personEmail)
    const [taskName, setTaskName]=useState(taskData.taskName)
    const [taskDetails, setTaskDetails]=useState(taskData.taskDetails)
    const [effectiveDate, setEffectiveDate]=useState(taskData.effectiveDate)
    const [dueDate, setDueDate]=useState(taskData.dueDate)
    const [isChecked, setIsChecked]=useState(taskData.taskStatus)
    
    const [isError, setIsError]=useState(false);
    const token=localStorage.getItem("token");
    const personId=taskData.personId;

    const handleCheckBoxChange=(event)=>{
      setIsChecked(!isChecked)
    }


    const taskCreated=async(event)=>{
      event.preventDefault();
      setLoading(true);

      if(taskName!=="" && taskDetails!==""){
        setIsError(false)
        await axios.put(`https://middlewaretalentsbackend.azurewebsites.net/apis/employees/tasks/${taskId}`, {
        taskId:taskId,
        taskAssignedBy:localStorage.getItem('email'),
        personName:personName,
        personEmail:email,
        taskName:taskName,
        taskDetails:taskDetails,
        effectiveDate:effectiveDate,
        dueDate:dueDate,
        taskStatus:isChecked
      },{
        headers: {
          "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
        }
      })
        setLoading(false);
      taskUpdate()
      }
      else{
        setIsError(true)
      }

      try{
        await axios.post("https://middlewaretalentsbackend.azurewebsites.net/apis/employees/notifications",{
          "notificationType":"tasks",
          "notification": `Your ${taskName} task has been updated. Please click here to see the full details.`,
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
      }
    }

  return (
    <div>
      {loading && <Loader/>}
      <form action="#" method="POST" onSubmit={taskCreated} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 grid-rows-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="lg:row-span-2">
            <label htmlFor="fullName" className="block text-2xl font-semibold leading-6 text-gray-900">
              Full name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="fullName"
                id="fullName"
                autoComplete="given-name"
                value={personName}
                onChange={event=>setName(event.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-2xl sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-2xl font-semibold leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                value={email}
                onChange={event=>setEmail(event.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-2xl sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="taskTitle" className="block text-2xl font-semibold leading-6 text-gray-900">
            Task Title <span className='text-red-600'>*</span>
            </label>
            <div className="relative mt-2.5">

              <input
                type="tel"
                name="taskTitle"
                id="taskTitle"
                autoComplete="tel"
                value={taskName}
                onChange={event=>setTaskName(event.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-2xl sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="taskDetails" className="block text-2xl font-semibold leading-6 text-gray-900">
            Task Details <span className='text-red-600'>*</span>
            </label>
            <div className="mt-2.5">
              <textarea
                name="taskDetails"
                id="taskDetails"
                rows={5}
                value={taskDetails}
                onChange={event=>setTaskDetails(event.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-2xl sm:leading-6"
                defaultValue={''}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="effectiveDate" className="block text-2xl font-semibold leading-6 text-gray-900">
               Effective Date
            </label>
            <div className="relative mt-2.5">

              <input
                type="date"
                name="effectiveDate"
                id="effectiveDate"
                autoComplete="tel"
                value={effectiveDate}
                onChange={event=>setEffectiveDate(event.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-2xl sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="dueDate" className="block text-2xl font-semibold leading-6 text-gray-900">
               Due Date
            </label>
            <div className="relative mt-2.5">

              <input
                type="date"
                name="dueDate"
                id="dueDate"
                value={dueDate}
                autoComplete="tel"
                onChange={event=>setDueDate(event.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-2xl sm:leading-6"
              />
            </div>

            <div className='mt-10'>

            <label htmlFor="completed" className="block text-2xl font-semibold leading-6 text-gray-900 p-3">
            <input type='checkbox' checked={isChecked} onChange={handleCheckBoxChange} id='completed'/>
              Completed
            </label>
          </div></div>



        </div>



        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Update task
          </button>
          {isError && <p className='text-red-600'>*Please Fill Mandatory Fields</p>}
        </div>
      </form>
    </div>
  )
}
