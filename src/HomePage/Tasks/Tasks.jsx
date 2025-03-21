
import React, { useState, useContext } from 'react';
import { MyContext } from '../../MyProvider/MyProvider';
import AssignedTasks from './AssignedTasks';
import MyTasks from './MyTasks';
import { useNavigate } from 'react-router-dom';


const Tasks=()=>{
    const [isTrue, setIsTrue]=useState(true);
    const {state}=useContext(MyContext);
    const navigate=useNavigate();
    let btn1="border border-gray-950 rounded-lg w-80";
    let btn2="bg-blue-700 rounded-lg text-white w-80";
    if(!state.task){
        navigate("/dashboard")
    }


    return(
        <div>
            <div className="flex row justify-center space-x-20">
            <button className={isTrue ? `${btn2}`: `${btn1}`} onClick={()=>setIsTrue(true)}>Assigned Tasks</button>
            <button className={isTrue ? `${btn1}`: `${btn2}`} onClick={()=>setIsTrue(false)}>Recieved Tasks</button>
        </div>
        <div>
                {isTrue ? <AssignedTasks/>:<MyTasks/>}
            </div>
        </div>
    )

}

export default Tasks