import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../MyProvider/MyProvider';
import LeaveEmployee from './LeaveEmployee';
import LeaveApprovalDashboard from './LeaveAdmin';

const LeaveMain = () => {
  const navigate = useNavigate();
  const [isTrue, setIsTrue] = useState(true);
  const {state}=useContext(MyContext);
  

  // Button styles
  const btn1 = "border border-gray-950 rounded-lg w-80 py-2"; // added padding for button height consistency
  const btn2 = "bg-blue-700 rounded-lg text-white w-80 py-2";

  // Navigate to LeaveSheet page
  const sheetButton = () => {
    navigate('/LeaveSheet');
  };

  if(!state.leaveManagement){
    navigate("/dashboard");
  };

  return (
    <div>
      <div className="flex justify-center space-x-20 pb-10">
        {/* Toggle button classes */}
        <button
          className={isTrue ? btn2 : btn1}
          onClick={() => setIsTrue(true)}
        >
          Submitted Leaves
        </button>
        <button
          className={isTrue ? btn1 : btn2}
          onClick={() => setIsTrue(false)}
        >
          Received Leaves
        </button>

        {/* Show sheet button for employees */}
        {localStorage.getItem("role") !== "employee" && (
          <button onClick={sheetButton} className="bg-green-500 text-white rounded-lg w-80 py-2">
            Sheet
          </button>
        )}
      </div>

      {/* Conditional rendering of components based on `isTrue` */}
      <div>
        {isTrue ? <LeaveEmployee /> : <LeaveApprovalDashboard />}
      </div>
    </div>
  );
};

export default LeaveMain;
