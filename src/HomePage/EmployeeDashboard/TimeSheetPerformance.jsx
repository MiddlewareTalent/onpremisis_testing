import { useState, useEffect } from "react";
import axios from 'axios';
 
const TimesheetPerformance = () => {
    const [performanceData, setPerformanceData]=useState({
      pending:0,
      approve:0,
      reject:0,
      total:0
    })
    const token=localStorage.getItem("token");
 
    useEffect(() => {
        const fetchData = async (status) => {
          console.log(status);
            const employeeId=localStorage.getItem('employeeId');
            console.log(employeeId);
          try {
            const response = await axios.get(`https://middlewaretalentsbackend.azurewebsites.net/api/timesheets/employeeId/${employeeId}/total/timesheets`, {
                headers: {
                  "Authorization": `Bearer ${token}`  
                }});
           
            setPerformanceData(response.data);
            console.log(performanceData)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
   
        fetchData();
      }, [performanceData,token]);
    return (
        <div className="relative max-lg:row-start-1 p-6"> {/* Added padding */}
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
               <div>
               <h3 className="text-2xl font-semibold text-gray-900">Timesheet Performance</h3> {/* Increased text size */}
                <p className="mt-2 text-lg text-gray-700">
                Track your work hours and manage your productivity with a timesheet. {/* Example content */}
                </p>
               </div>
                    <div className="mt-5 ">
                        <div>
                        <h1 className=" mt-2 text-xl font-semibold text-gray-900">Pending Timesheets:<span className="ml-8 text-blue-600">{performanceData.pending}</span></h1>
                        <h1 className="mt-2 text-xl font-semibold text-gray-900">Approved Timesheets:<span className="ml-4 text-green-600">{performanceData.approve}</span></h1>
                        <h1 className="mt-2 text-xl font-semibold text-gray-900">Rejected Timesheets:<span className="ml-6 text-red-600">{performanceData.reject}</span></h1>
                        <h1 className="mt-2 text-xl font-semibold text-gray-900">Total Timesheets:<span className="ml-14 text-violet-500">{performanceData.total}</span></h1>
                    </div>
                   
                    {/* <div className="mt-5">
                    <h3 className="text-2xl font-semibold text-gray-900">Your work efficiency is currently at {performanceData.tasksEfficiency}%.</h3>
                    </div> */}
                   
                        </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
        </div>
    );
};
 
export default TimesheetPerformance;