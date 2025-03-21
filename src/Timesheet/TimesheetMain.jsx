
import React, { useState, useContext } from 'react';
import { MyContext } from '../MyProvider/MyProvider';
import EmployeeHomePage from './EmployeeHomePage';
import ManagerTimesheets from './ManagerTimesheets';
import { useNavigate } from 'react-router-dom';


const TimesheetMain=()=>{
    const [isTrue, setIsTrue]=useState(true);
    const [submissions, setSubmissions] = useState([]);
    const{state}=useContext(MyContext);
    const navigate=useNavigate();
    let btn1="border border-gray-950 rounded-lg w-80";
    let btn2="bg-blue-700 rounded-lg text-white w-80";

    if(!state.timeSheet){
        navigate("/dashboard");
    }


    return(
        <div>
            <div className="flex row justify-center space-x-20 pb-10">
            <button className={isTrue ? `${btn2}`: `${btn1}`} onClick={()=>setIsTrue(true)}>Submitted Timesheets</button>
            <button className={isTrue ? `${btn1}`: `${btn2}`} onClick={()=>setIsTrue(false)}>Received Timesheets</button>
        </div>
        <div>
                {isTrue ? <EmployeeHomePage submissions={submissions} setSubmissions={setSubmissions}/>:<ManagerTimesheets/>}
            </div>
        </div>
    )

}

export default TimesheetMain;