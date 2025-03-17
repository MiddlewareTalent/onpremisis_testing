import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
 
const getNationalHolidays = (year) => {
    return [
        new Date(year, 0, 1), // January 1 (New Year)
        new Date(year, 0, 26), // January 26 (Republic day)
        new Date(year, 7, 15), // August 15 (Independence day)
        new Date(year, 9, 2), // October 2 (Gandhi jayathi)
        new Date(year, 11, 25) // December 25 (Christmas)
 
    ]
}
 
 
function LeaveRequestForm(props) {
    const navigate = useNavigate();
    const location = useLocation();
    
   
    const [formData, setFormData] = useState({
        firstName:'', lastName:  '', employeeId:'',
         email:'', managerId:  '', managerEmail: '',
         leaveRequestFor:  'Days', leaveType:   '', leaveStartDate: '',
        leaveEndDate:  '', duration: '', comments:  '', medicalDocument: null,LOP:false
    });
    const [selectedFile, setSelectedFile] = useState(null); // New state for file upload
    const [errors, setErrors] = useState(false);
    const [isCommentsEnabled, setIsCommentsEnabled] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [leaveError, setLeaveError] = useState(''); // To set leave balance error from backend
    const [loading, setLoading] = useState(false);
    const [remainingLeaveDays, setRemainingLeaveDays] = useState(null); // State for remaining leave days
    const [year] = useState(new Date().getFullYear()); // Current year
    const [showLop,setShowLop]=useState(false);
    const nationalHolidays = getNationalHolidays(year); // Get holidays for the current year
 
 
 
    // use useeffect to populate formdata when the component loads
    useEffect(() => {
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');
        const email = localStorage.getItem('email');
        const employeeId = localStorage.getItem('employeeId');
        console.log('localstorage:', {firstName, lastName, email, employeeId})
        if(firstName && lastName && email && employeeId){
            //set the retrieved data in the form state
            setFormData(prevData => ({
                ...prevData,
                firstName: prevData.firstName || firstName,
                lastName: prevData.lastName || lastName,
                email: prevData.email || email,
                employeeId: prevData.employeeId || employeeId
            }));
        } else{
            // If the data is not found in localStorage, you can redirect or show an error
            navigate('/login'); // Redirect to login if not found
        }
    }, [navigate]); // this will run once wen the component mounts
 
 
    useEffect(() => {
       
        const fetchData = async () => {
          try {
            const employeeId = localStorage.getItem('employeeId');
            if (!employeeId) {
              console.error("Employee ID not found in localStorage");
              return;
            }
            const token = localStorage.getItem('token')
           
            const [originResponse] = await Promise.all([
                axios.get(`https://msquirebackend.azurewebsites.net/api/v1/employeeManager/origin/${employeeId}`, {
                    method: 'GET',
                    headers: {
                      'Authorization' : `Bearer ${token}`,
                      'Content-Type': "application/json",
                    },
                   
                  })
         
            ])  ;
 
           
            // Log the data to the console
            console.log("hello")
            console.log("API Response:", originResponse);
           
            const responseData = originResponse.data;
            console.log("response data: " , responseData)
            
           
            const currentEmployee = responseData.find((emp) => emp.employeeId === employeeId);
            console.log("manager id:", currentEmployee.reportingTo);
            if (currentEmployee){
                const managerId = currentEmployee.reportingTo;
                const manager = responseData.find((emp) => emp.employeeId === managerId)
                console.log("Manager Details:", manager);
               
                   setFormData(prevData => ({
                ...prevData,
                // employeeId: prevData.employeeId,
                managerId: prevData.managerId|| managerId,
                managerEmail: prevData.managerEmail || manager?.email,
               
            }));
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
   
        fetchData();
      }, []); // Empty dependency array ensures the effect runs once on component mount
   
 
    useEffect(() => {
        const isHoliday = (date) => {
            const formattedDate = new Date(date).toLocaleDateString("en-GB"); // Format as dd/mm/yyyy
            for (let holiday of nationalHolidays) {
                if (holiday.toLocaleDateString("en-GB") === formattedDate) {
                    return true;
                }
            }
            return false;
        };
        const calculateDuration = (startDate, endDate) => {
            if (!startDate || !endDate) return 0;
     
            const start = new Date(startDate);
            const end = new Date(endDate);
            let totalDays = 0;
     
            for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                const day = date.getDay();
                if (day !== 0 && day !== 6 && !isHoliday(date)) { // Exclude weekends (0 is Sunday, 6 is Saturday)
                    totalDays++;
                }
            }
     
            return totalDays;
        };

        const fetchRemainingLeaveDays = async (employeeId, leaveType, leaveStartDate, leaveEndDate) => {
       
            try {
                const token = localStorage.getItem('token')
                console.log(token)
                const response = await axios.get('https://msquirebackend.azurewebsites.net/api/leaves/remaining-leaves', {
                    method:'GET',
                    headers:{
                      'Authorization' : `Bearer ${token}`,
                      'Content-Type' : 'application/json'
                    },
                    params: { employeeId, leaveType, leaveStartDate, leaveEndDate }
                });
                console.log("Fetching remaining leave days...");
        console.log("Employee ID:", employeeId);
        console.log("Leave Type:", leaveType);
        console.log("Leave Start Date:", leaveStartDate);
        console.log("Leave End Date:", leaveEndDate);
        console.log(leaveStartDate)
        console.log(leaveEndDate)
       
       
                // Ensure the response is a valid number
                const remainingDays = response.data;
                console.log("remain:", remainingDays)
                if (typeof remainingDays === 'number' && !isNaN(remainingDays)) {
                    const currentDuration = calculateDuration(leaveStartDate, leaveEndDate);
                    if (remainingDays >= currentDuration) {
                        // const remain = remainingDays - formData.duration;
                        setRemainingLeaveDays(remainingDays -  currentDuration); // Set the remaining leave days in state
                    } else {
                        setRemainingLeaveDays('You don\'t have enough remaining leave days.');
                        setErrors(true);
                    }
                } else {
                    setRemainingLeaveDays('Invalid data received from the server.');
                    setErrors(true);
                }
       
            } catch (error) {
                console.error('Error fetching remaining leave days:', error);
                setRemainingLeaveDays('Error fetching leave data.');
                setErrors(true);
            }
        };
        if (location.state && location.state.edit) {
            setIsEditing(true);
            const { employeeId, leaveType, leaveStartDate, leaveEndDate, medicalDocument } = location.state;
   
            // Initialize formData and selectedFile
            setFormData((prevData) => ({
                ...prevData,
                ...location.state,
                leaveStartDate: leaveStartDate || '',
                leaveEndDate: leaveEndDate || '',
                leaveType: leaveType || '',
            }));
            if (medicalDocument) {
                setSelectedFile(medicalDocument);
            }
   
            // Fetch remaining leave days initially
            fetchRemainingLeaveDays(employeeId, leaveType, leaveStartDate, leaveEndDate);
        }
    }, [location.state, nationalHolidays]);
   
 
   
 
 
    const handleChange = (e) => {
        console.log(e.target.checked);
        const {name, value} = e.target;
        console.log(name);
 
         // Temporarily store the updated start and end dates
    const updatedLeaveStartDate = name === 'leaveStartDate' ? value : formData.leaveStartDate;
    const updatedLeaveEndDate = name === 'leaveEndDate' ? value : formData.leaveEndDate;
    const updatedLeaveType = name === 'leaveType' ? value : formData.leaveType;
 
    // Calculate the duration with the updated dates
    const updatedDuration = calculateDuration(updatedLeaveStartDate, updatedLeaveEndDate);
 
        // check if the field is for file upload
 
        if(name==="LOP"){
            setFormData(prevData => ({
                ...prevData,
                [name]: e.target.checked,
                leaveStartDate: updatedLeaveStartDate,
                leaveEndDate: updatedLeaveEndDate,
                leaveType : updatedLeaveType,
                duration: updatedDuration,
            }));
        }
        else{
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
                leaveStartDate: updatedLeaveStartDate,
                leaveEndDate: updatedLeaveEndDate,
                leaveType : updatedLeaveType,
                duration: updatedDuration,
            }));
        }
 
 
 
        // Fetch remaining leave days with updated values
    if (name === 'leaveType' || name === 'leaveStartDate' || name === 'leaveEndDate') {
        fetchRemainingLeaveDays(
            formData.employeeId,
            updatedLeaveType,
            updatedLeaveStartDate,
            updatedLeaveEndDate
        );
    }
 
    // Enable comments for "OTHERS" leave type
    if (name === 'leaveType') {
        setIsCommentsEnabled(value === 'OTHERS');
    }
    };
 
    const handleFileChange = (event) => {
        //  const { name} = event.target;
         const file = event.target.files[0];
         setSelectedFile(file);
        setFormData(prevData => ({
            ...prevData,
            medicalDocument: file
        }));
 
    }
 
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLeaveError(''); // Reset error messages
        setErrors(false); // Reset error state
 
        // Validation: Check for medical document if leave type is "SICK" and duration > 2
        if (formData.leaveType === 'SICK' && formData.duration > 2 && !formData.medicalDocument  && !location.state?.medicalDocument) {
            setLeaveError("Please upload a document");
            return;
        }
 
        // // Validation: Check for valid email
        // const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|middlewaretalents\.com)$/;
        // if (!emailPattern.test(formData.email)) {
        //     setLeaveError('Please enter a valid email address from @gmail.com or @middlewaretalents.com');
        //     setErrors(true);
        //     return;
        // }
 
        // Validation: Check if all required fields are filled
        const requiredFields = [
            'leaveStartDate',
            'leaveEndDate', 'leaveType', 'duration',
        ];
 
        const hasEmptyFields = requiredFields.some(field => !formData[field]);
        console.log('Checking required fields:', requiredFields);
requiredFields.forEach(field => {
    console.log(`${field}: ${formData[field]}`);
});
 
        if (hasEmptyFields) {
            setLeaveError('Please fill in all required fields.');
            setErrors(true);
            return;
        }
 
        // Prepare FormData for submission
        const data = new FormData();
        for (const key in formData) {
            if (formData[key]) { //Check if value exists before appending
                data.append(key, formData[key]);
            }
        }
        if (selectedFile) {
            data.append("medicalDocument", selectedFile); // Attach medical document if provided
        } else if (location.state?.medicalDocument) {
            data.append("medicalDocument", location.state.medicalDocument); // Keep the previous document if editing
        }
       
 
        setLoading(true); // Indicate loading state
 
        try {
            const token = localStorage.getItem('token')
            console.log(formData);
            const url = isEditing
                ? `https://msquirebackend.azurewebsites.net/api/leaves/update/${formData.id}`
                : `https://msquirebackend.azurewebsites.net/api/leaves/submit`;
 
   
            let response;
            if (!isEditing) {
                console.log("POST Request:", formData);
                response = await axios({
                    method: 'POST',
                    url,
                    data,
                    headers: {
                        'Authorization' : `Bearer ${token}`,
                    },
 
                });
 
            } else {
                console.log("PUT Request:", formData);
                response = await axios({
                    method: 'PUT',
                    url,
                    data: formData,
                    // headers : {
                    //   'Content-Type' :  'multipart/form-data',
                    // },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                   
 
 
                });
 
            }
 
            // Handle success
            if (response.status === 200) {
                if(isEditing){
                    navigate('/LeaveManagement');
                }
                else{
                    props.close();
                }
            } else {
                setLeaveError('Error processing the request. Please try again.');
               
            }
        } catch (error) {
            // Handle errors
            console.log(error);
            if(error.response?.data?.leavesCompleted){
                setShowLop(true);
            }
            setLeaveError(error.response?.data?.message || 'Error occurred');
 
            setErrors(true);
        } finally {
            setLoading(false); // Reset loading state
        }
    };
 
    const fetchRemainingLeaveDays = async (employeeId, leaveType, leaveStartDate, leaveEndDate) => {
       
        try {
            const token = localStorage.getItem('token')
            console.log(token)
            const response = await axios.get('https://msquirebackend.azurewebsites.net/api/leaves/remaining-leaves', {
                method:'GET',
                headers:{
                  'Authorization' : `Bearer ${token}`,
                  'Content-Type' : 'application/json'
                },
                params: { employeeId, leaveType, leaveStartDate, leaveEndDate }
            });
            console.log("Fetching remaining leave days...");
    console.log("Employee ID:", employeeId);
    console.log("Leave Type:", leaveType);
    console.log("Leave Start Date:", leaveStartDate);
    console.log("Leave End Date:", leaveEndDate);
    console.log(leaveStartDate)
    console.log(leaveEndDate)
   
   
            // Ensure the response is a valid number
            const remainingDays = response.data;
            console.log("remain:", remainingDays)
            if (typeof remainingDays === 'number' && !isNaN(remainingDays)) {
                const currentDuration = calculateDuration(leaveStartDate, leaveEndDate);
                if (remainingDays >= currentDuration) {
                    // const remain = remainingDays - formData.duration;
                    setRemainingLeaveDays(remainingDays -  currentDuration); // Set the remaining leave days in state
                } else {
                    setRemainingLeaveDays('You don\'t have enough remaining leave days.');
                    setErrors(true);
                }
            } else {
                setRemainingLeaveDays('Invalid data received from the server.');
                setErrors(true);
            }
   
        } catch (error) {
            console.error('Error fetching remaining leave days:', error);
            setRemainingLeaveDays('Error fetching leave data.');
            setErrors(true);
        }
    };
   
 
   
   
 
    const calculateDuration = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;
 
        const start = new Date(startDate);
        const end = new Date(endDate);
        let totalDays = 0;
 
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const day = date.getDay();
            if (day !== 0 && day !== 6 && !isHoliday(date)) { // Exclude weekends (0 is Sunday, 6 is Saturday)
                totalDays++;
            }
        }
 
        return totalDays;
    };
 
     // Function to check if the selected date is a holiday
     const isHoliday = (date) => {
        const formattedDate = new Date(date).toLocaleDateString("en-GB"); // Format as dd/mm/yyyy
        for (let holiday of nationalHolidays) {
            if (holiday.toLocaleDateString("en-GB") === formattedDate) {
                return true;
            }
        }
        return false;
    };
 
    // Disable weekends and holidays in the date picker
    const disableDate = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6 || isHoliday(date); // Disable weekends and holidays
    };
 
    // Update duration when both dates are set
    useEffect(() => {
        const isHoliday = (date) => {
            const formattedDate = new Date(date).toLocaleDateString("en-GB"); // Format as dd/mm/yyyy
            for (let holiday of nationalHolidays) {
                if (holiday.toLocaleDateString("en-GB") === formattedDate) {
                    return true;
                }
            }
            return false;
        };
        const calculateDuration = (startDate, endDate) => {
            if (!startDate || !endDate) return 0;
     
            const start = new Date(startDate);
            const end = new Date(endDate);
            let totalDays = 0;
     
            for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                const day = date.getDay();
                if (day !== 0 && day !== 6 && !isHoliday(date)) { // Exclude weekends (0 is Sunday, 6 is Saturday)
                    totalDays++;
                }
            }
     
            return totalDays;
        };
        if (formData.leaveStartDate && formData.leaveEndDate) {
            const duration = calculateDuration(formData.leaveStartDate, formData.leaveEndDate);
            setFormData((prevData) => ({
                ...prevData,
                duration
            }));
        }
    }, [formData.leaveStartDate, formData.leaveEndDate, nationalHolidays]);
 
     
   
   //const md = formData.medicalDocument
    return (
        <div >
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
           
            <h1 className="text-2xl font-bold text-center font-Playfair-Display mb-6">
                {isEditing ? 'EDIT LEAVE REQUEST' : 'NEW LEAVE REQUEST'}
            </h1>
               
   
 
 
                {/* Leave Dates */}
                {/* Leave Start and End Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col">
                        <label htmlFor="leaveStartDate" className="mb-1">Leave Start Date</label>
                        <input
                            type="date"
                            name="leaveStartDate"
                            className="p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm"
                            value={formData.leaveStartDate}
                            onChange={handleChange}
                            // min={new Date().toISOString().split('T')[0]} // Set the min attribute to today's date
                            disabled={disableDate(new Date(formData.leaveStartDate))}
                        />
                    </div>
 
                    <div className="flex flex-col">
                        <label htmlFor="leaveEndDate" className="mb-1">Leave End Date</label>
                        <input
                            type="date"
                            name="leaveEndDate"
                            className="p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm"
                            value={formData.leaveEndDate}
                            onChange={handleChange}
                            // min={new Date().toISOString().split('T')[0]} // Set the min attribute to today's date
                            disabled={disableDate(new Date(formData.leaveEndDate))}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                {/* Duration */}
                <div className="flex flex-col">
                    <label htmlFor="duration" className="mb-1">Duration (Days)</label>
                    <input
                        type="text"
                        name="duration"
                        className={`p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm`}
                        value={formData.duration}
                        readOnly
                    />
                    {errors && formData.duration === '' &&
                        <span className="text-red-600 text-sm">Duration is required</span>}
                </div>
 
                {/* Leave Type */}
                <div className="flex flex-col">
                    <label htmlFor="leaveType" className="mb-1">Leave Type</label>
                    <div className='flex items-center space-x-2'>
                        <select
                            name="leaveType"
                            className={`p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm`}
                            onChange={handleChange}
                            value={formData.leaveType}
                        >
                            <option value="">Select Leave Type</option>
                            <option value="SICK">Sick Leave</option>
                            <option value="CASUAL">Casual Leave</option>
                            <option value="VACATION">Vacation Leave</option>
                            <option value="MARRIAGE">Marriage Leave</option>
                            <option value="MATERNITY">Maternity Leave</option>
                            <option value="PATERNITY">Paternity Leave</option>
                            <option value="OTHERS">Others</option>
                        </select>
 
                    </div>
                    {errors && formData.leaveType === '' &&
                        <span className="text-red-600 text-sm">Leave Type is required</span>}
                </div>
 
             
                {formData.leaveType === 'SICK' && formData.duration > 2 && (
    <div className="flex flex-col">
        <label htmlFor="document" className="mb-1">Upload Document</label>
       
        {selectedFile ? (
            <a
                href={typeof selectedFile === 'string' ? selectedFile : URL.createObjectURL(selectedFile)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mb-2"
            >
                View Uploaded Document
            </a>
        ) : (
            <span className="text-gray-600 mb-2">No document uploaded yet</span>
        )}
 
        <input
            type="file"
            name="document"
            onChange={handleFileChange}
            className={`p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm`}
        />
    </div>
)}
 
           
 
<div className="flex flex-col">
    <label htmlFor="remainingLeaveDays" className="mb-1">Remaining Leave Days</label>
    <input
        type="text"
        name="remainingLeaveDays"
        className={`p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm`}
        value={remainingLeaveDays || 'N/A'} // Show remaining leave days or N/A if not available
       
        readOnly
    />
</div>
 
 
           
 
 
                {/* Comments for "OTHERS" Leave Type */}
                {isCommentsEnabled && (
                    <div className="flex flex-col">
                        <label htmlFor="comments" className="mb-1">Comments</label>
                        <textarea
                            name="comments"
                            rows="4"
                            className={`p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm`}
                            onChange={handleChange}
                            value={formData.comments}
                        ></textarea>
                    </div>
                )}
 
                {leaveError && <span className="text-red-600 text-sm">{leaveError}</span>}
                </div>
                {showLop && <div>
                    <input type="checkbox" onChange={handleChange} name="LOP"/>
                <label>LOP</label>
                    </div>}
 
                <button
                    type="submit"
                    className={`w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm`}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : isEditing ? 'Update Leave' : 'Submit Leave'}
                </button>
 
            </form>
        </div>
    );
}
 
export default LeaveRequestForm;
 
 
// // Name Fields
// <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//     <div className="flex flex-col">
//         <label htmlFor="firstName" className="mb-1">First Name</label>
//         <input
//             type="text"
//             name="firstName"
//             className={'p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm'}
//             onChange={handleChange}
//             value={formData.firstName}
//         />
//         {errors && formData.firstName === '' &&
//             <span className="text-red-600 text-sm">First Name is required</span>}
//     </div>
 
//     <div className="flex flex-col">
//         <label htmlFor="lastName" className="mb-1">Last Name</label>
//         <input
//             type="text"
//             name="lastName"
//             className={'p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm'}
//             onChange={handleChange}
//             value={formData.lastName}
//         />
//         {errors && formData.lastName === '' &&
//             <span className="text-red-600 text-sm">Last Name is required</span>}
//     </div>
// </div>
 
 
 
 
// {/* Employee ID and Email */}
// <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
// <div className="flex flex-col">
//     <label htmlFor="employeeId" className="mb-1">Employee ID</label>
//     <input
//         type="text"
//         name="employeeId"
//         className={`p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm`}
//         onChange={handleChange}
//         value={formData.employeeId}
//     />
//     {errors && formData.employeeId === '' &&
//         <span className="text-red-600 text-sm">Employee ID is required</span>}
// </div>
//     <div className="flex flex-col">
//         <label htmlFor="email" className="mb-1">Email</label>
//         <input
//             type="email"
//             name="email"
//             className={'p-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-700 focus:outline-none text-sm'}
//             onChange={handleChange}
//             value={formData.email}
//         />
//         {errors && formData.email === '' &&
//             <span className="text-red-600 text-sm">Email is required</span>}
//     </div>
 
 
// </div>
 
// {/* Manager Info */}
//   {/* Manager ID (Auto-filled) */}
// <div className="flex flex-col">
// <label htmlFor="managerId" className="mb-1">
// Manager ID
// </label>
// <input
// type="text"
// name="managerId"
// value={formData.managerId}
// readOnly
// className="p-2 border rounded-lg bg-gray-200 border-gray-300 text-sm"
// />
// </div>
 
// {/* Manager Email (Auto-filled) */}
// <div className="flex flex-col">
// <label htmlFor="managerEmail" className="mb-1">
// Manager Email
// </label>
// <input
// type="email"
// name="managerEmail"
// value={formData.managerEmail}
// readOnly
// className="p-2 border rounded-lg bg-gray-200 border-gray-300 text-sm"
// />
// </div>