
import React, { useEffect, useState, useContext } from 'react'
import PerformanceMatrix from './EmployeeDashboard/PerformanceMatrix'
import LeavePerformance from './EmployeeDashboard/LeavePerformance'
import TimesheetPerformance from './EmployeeDashboard/TimeSheetPerformance'
import CompanyNews from './EmployeeDashboard/CompanyNews'
import Notification from './EmployeeDashboard/Notification'
import { motion } from "framer-motion"
import { MyContext } from '../MyProvider/MyProvider'
import Holiday from './EmployeeDashboard/Holiday'


export default function EnhancedDashboard() {
//hi
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       const response = await fetch('http://localhost:8080/employees/team/444');
//       const data = await response.json();
//       setTeam(data);
//     };
//     fetchEmployees();
//   }, []);



const[initials,setInitials]=useState('');  // New state to store initials
const { state} = useContext(MyContext);

useEffect(()=>{
  

  if(state.email){
    
    // Get the initials (first letter of firstName and lastName)
    if(state.firstName && state.lastName) {
      setInitials(state.firstName.charAt(0).toUpperCase() + state.lastName.charAt(0).toUpperCase());
    }
  }
},[state.email,state.firstName,state.lastName])




  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6"
    >
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Employee Details */}
        <div className="col-span-full rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Employee Details</h2>
            <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              
            </button>
          </div>


            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">{initials}
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-1000">{state.firstName+" "+state.lastName||'employeeName not available'}</p>
                <p className="text-lg text-gray-900 dark:text-gray-900">{state.jobRole}</p>
                <p className="text-lg text-gray-900 dark:text-gray-900">Employee ID: {state.employeeId||'employee Id not available'}</p>
                <p className="text-lg text-blue-900 dark:text-blue-900">{state.email || 'Email not available'}</p>
              </div>
            </div>

        </div>

        {/* Performance Metrics */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          
            <PerformanceMatrix/>
          
        </div>

        {/* Company News */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <LeavePerformance/>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
         <TimesheetPerformance/>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-lg bg-white p-6 shadow-lg" style={{ height: '400px' }}>
          <CompanyNews/>
        </div>

        {/* Team Members */}
        <div className="rounded-lg bg-white p-6 shadow-lg" style={{ height: '400px' }}>
    <Notification />
</div>


        
<div className="rounded-lg bg-white p-6 shadow-lg" style={{ height: '400px' }}>
    <Holiday/>
</div>
        
      </div>
    </motion.div>
  )
}