import { useState, useEffect } from "react";
import axios from 'axios';

const Performance = () => {
    const [performanceData, setPerformanceData]=useState({
        overDueTasks:0,
        pendingTasks:0,
        completedTasks:0,
        tasksEfficiency:0
    })
    

    useEffect(() => {
        const token=localStorage.getItem("token");
        const fetchData = async () => {
            const employeeId=localStorage.getItem('employeeId');
          try {
            const response = await axios.get(`https://msquirebackend.azurewebsites.net/apis/employees/TasksDetails/PersonId/${employeeId}`, {
                headers: {
                  "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
                }});
            
            setPerformanceData(response.data);
            console.log(performanceData)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [performanceData]);
    return (
        <div className="relative max-lg:row-start-1 p-6"> {/* Added padding */}
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
               <div>
               <h3 className="text-2xl font-semibold text-gray-900">Performance Metrics</h3> {/* Increased text size */}
                <p className="mt-2 text-lg text-gray-700">
                    Monitor your performance metrics and improve your efficiency. {/* Example content */}
                </p>
               </div>
                    <div className="mt-5 ">
                        <div>
                        <h1 className=" mt-2 text-xl font-semibold text-gray-900">Overdue Tasks: <span className="ml-10 text-red-600">{performanceData.overDueTasks}</span></h1>
                        <h1 className="mt-2 text-xl font-semibold text-gray-900">Pending Tasks: <span className="ml-10 text-orange-600">{performanceData.pendingTasks}</span></h1>
                        <h1 className="mt-2 text-xl font-semibold text-gray-900">Completed Tasks: <span className="ml-4 text-green-600">{performanceData.completedTasks}</span></h1>
                    </div>
                    
                    <div className="mt-5">
                    <h3 className="text-2xl font-semibold text-gray-900">Your work efficiency is currently at {performanceData.tasksEfficiency}%.</h3>
                    </div>
                    
                        </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
        </div>
    );
};

export default Performance;