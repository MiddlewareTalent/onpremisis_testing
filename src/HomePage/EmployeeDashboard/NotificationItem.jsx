import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationItem=(props)=>{
    const {notificationId, notificationType, notification, notificationTo, isRead}=props.each;

    const navigate=useNavigate();

    let className;
    if(isRead===true){
        className='bg-slate-100 mt-5 p-1 rounded-lg drop-shadow-md text-gray-700';
    }
    else{
         className='bg-slate-100 mt-5 p-1 rounded-lg drop-shadow-md border border-red-800 font-bold text-red-500';
    }

    const redirect=async()=>{
        const token=localStorage.getItem("token");
        try {
            const response = await axios.put(
                `https://mtlbackendapp.azurewebsites.net/apis/employees/notificationUpdate/${notificationId}`, 
                {
                    notificationId: notificationId,
                    notificationType: notificationType,
                    notification: notification,
                    notificationTo: notificationTo,
                    isRead: true
                }, {
                    headers: {
                      "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
                    }
                  }
            );
            
            // Handle the response data if needed
            console.log('Notification updated successfully:', response.data);
            
        } catch (error) {
            if (error.response) {
                // The request was made, but the server responded with an error status
                console.error('Error status:', error.response.status);
                console.error('Error details:', error.response.data);
                // You can display a specific message to the user based on the status code or response
                if (error.response.status === 404) {
                    alert("Notification not found!");
                } else if (error.response.status === 500) {
                    alert("Server error, please try again later.");
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                alert('No response from the server. Please check your network or try again later.');
            } else {
                // Something happened while setting up the request
                console.error('Error setting up request:', error.message);
                alert('Error sending the request. Please try again later.');
            }
        }

        if(notificationType==="tasks"){
            navigate("/tasks")
        }
        else if(notificationType==="TimesheetManage"){
            navigate("/TimesheetManage")
        }
        else if(notificationType==="leave"){
            navigate("/LeaveManagement")
        }
    }




    
    return(
        <li>
            <button className="text-left" onClick={redirect}>
            <div className={className}>
            <p className="mt-2 text-lg ">{notification}</p>
        </div>
        </button>
        </li>
    )
};

export default NotificationItem;