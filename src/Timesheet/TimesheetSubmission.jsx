import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Loader from "./loader.js";
import { IoCloseCircleOutline } from "react-icons/io5";
 
const TimesheetSubmission = ({ setSubmissions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const { formData } = location.state || {};
  const token=localStorage.getItem("token");
 
  // Function to handle timesheet submission
  const handleSubmitToHome = async () => {
    setLoading(true);
    try {
      const newFormData = {
        ...formData,
        SubmissionDate: new Date().toISOString(),
      };
 
      const response = await axios.post("https://msquirebackend.azurewebsites.net/api/timesheets", newFormData, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log(response.data);
 
      // Add the new submission to the list of submissions
      setSubmissions((prev) => [...prev, response.data]);
      navigate('/TimesheetManage'); // Navigate to employee home page
 
    } catch (error) {
      console.log("Error submitting timesheet:", error);
 
      // Check if the error has response data
      const errorData = error.response?.data;
      console.log(error.response?.data);
      // Initialize the error message variable
      let errorMessage = '';
 
      // Check for missing or invalid fields and add specific messages
          if (!errorData.managerId) {
              errorMessage += 'managerId cannot be null or empty. ';
          }
          else if(!errorData.employeeId) {
              errorMessage += 'employeeId cannot be null or empty. ';
          }
          else if(!errorData.employeeName) {
              errorMessage += 'employeeName cannot be null or empty. ';
          }
          else if(!errorData.emailId) {
            errorMessage += 'emailId cannot be null or empty. ';
        }
      // If no specific error was found, set the default error message
      setErrors(errorMessage || 'Error occurred');
      console.log("Error response data:", errorData);
  }finally {
    setLoading(false);
  }
 
    try{
      await axios.post("https://msquirebackend.azurewebsites.net/apis/employees/notifications",{
        "notificationType":"TimesheetManage",
        "notification":formData.employeeName+" has submitted new timesheet, tap to see details",
        // "notification":"Tap to view the details of "+formData.employeeName+"'s recently submitted timesheet.",
        "notificationTo":formData.managerId,
        "isRead":false
      }
      , {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
    }catch (error) {
      console.log("Error submitting timesheet:", error);
 
      // Check if the error has response data
      const errorData = error.response?.data;
      console.log(error.response?.data);
      // Initialize the error message variable
      let errorMessage = '';
 
      // Check for missing or invalid fields and add specific messages
          if (!errorData.managerId) {
              errorMessage += 'managerId cannot be null or empty. ';
          }
          else if(!errorData.employeeId) {
              errorMessage += 'employeeId cannot be null or empty. ';
          }
          else if(!errorData.employeeName) {
              errorMessage += 'employeeName cannot be null or empty. ';
          }
          else if(!errorData.emailId) {
            errorMessage += 'emailId cannot be null or empty. ';
        }
      // If no specific error was found, set the default error message
      setErrors(errorMessage || 'Error occurred');
      console.log("Error response data:", errorData);
  }
 
  };
 
  const handleCloseForm = () => {
    setIsFormVisible(false); // Set form visibility to false
    navigate('/TimesheetManage');
  };
 
  // Function to handle going back to the form
  const handleBackToForm = () => {
    navigate('/timesheet-management', { state: { formData } });
  };
 
  // Destructure submissionData and prepare for rendering
  const {totalNumberOfHours, comments,  manager, status, id, ...displayData } = formData;
 
  if (!isFormVisible) return navigate('/EmployeeHomePage');
 
  return (
    <div className="mx-auto py-4 px-6 text-black w-10/12">
       {loading && <Loader />}
      <div className="bg-white rounded-lg shadow-md m-2 border border-gray-300">
        <div className="flex justify-between text-xs font-semibold mb-4 bg-gray-100 p-2 rounded-t-sm">
          <h2 className="text-3xl font-semibold">Submitted Timesheet Data</h2>
          <button onClick={handleCloseForm} className="text-gray-400 hover:text-gray-500">
                                    <IoCloseCircleOutline className="h-8 w-8" />
                                  </button>
        </div>
        <div className="p-2">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md border-r text-xl ">
            <thead >
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2 border-b border-r border-gray-300 text-center">Field</th>
                <th className="px-4 py-2 border-b border-r border-gray-300 text-center">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(displayData).map(([key, value]) => (
                <tr key={key} className="border-b hover:bg-gray-100 ">
                  <td className="px-4 py-2 border-b border-r border-gray-300 text-center">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </td>
                  <td className="px-4 py-2 border-b border-r border-gray-300 text-center">
                    {key === 'onCallSupport' ? (value === 'true' || value === true ? 'Yes' : 'No') : value !== undefined ? value : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {errors && <p className="text-red-600 mt-4">{errors}</p>}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleBackToForm}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Back to Form
            </button>
            <button
              onClick={handleSubmitToHome}
              className="bg-gradient-to-r from-red-500 to-orange-400 text-white py-2 px-6 rounded-lg shadow-lg hover:scale-95 active:scale-90 transition duration-300"
            >
              Submit and Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default TimesheetSubmission;