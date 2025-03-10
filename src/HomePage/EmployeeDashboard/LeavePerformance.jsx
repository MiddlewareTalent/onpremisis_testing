import { useState, useEffect } from "react";
import axios from 'axios';
const LeavePerformance = () => {
    const [performanceData, setPerformanceData]=useState({
      pending:0,
      approved:0,
      reject:0,
      leaveCount:0
    })
    const token=localStorage.getItem("token");
    useEffect(() => {
        const fetchData = async (status) => {
          console.log(status);
            const employeeId=localStorage.getItem('employeeId');
            console.log(employeeId);
          try {
            const response = await axios.get(`https://ssitcloudbackend.azurewebsites.net/api/leaves/getStatus/${employeeId}`, {
                headers: {
                  "Authorization": `Bearer ${token}`  
                }});
                console.log(response);
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
<h3 className="text-2xl font-semibold text-gray-900">Hoilday Planner</h3> {/* Increased text size */}
<p className="mt-2 text-lg text-gray-700">
                Track every minute to refine and maximize your performance. {/* Example content */}
</p>
</div>
<div className="mt-5 ">
<div>
<h1 className=" mt-2 text-xl font-semibold text-gray-900">Pending Leaves:<span className="ml-10 text-blue-600">{performanceData.pending}</span></h1>
<h1 className="mt-2 text-xl font-semibold text-gray-900">Approved Leaves:<span className="ml-6 text-green-600">{performanceData.approved}</span></h1>
<h1 className="mt-2 text-xl font-semibold text-gray-900">Rejected Leaves:<span className="ml-8 text-red-600">{performanceData.reject}</span></h1>
<h1 className="mt-2 text-xl font-semibold text-gray-900">Total Leaves:<span className="ml-16 text-violet-500">{performanceData.leaveCount}</span></h1>
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
export default LeavePerformance;