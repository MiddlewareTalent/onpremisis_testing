import { useState } from "react"
import axios from "axios";
 
const ChangePasswordModal = ({ isOpen, onClose, id }) => {
    console.log(id);
 
  const [newPassword, setNewPassword] = useState("");
  const employeeId=id;
  console.log("empId"+employeeId);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    // Get the token from localStorage
    const token = localStorage.getItem("token");
   
    // Make sure newPassword is not empty
    if (!newPassword) {
        alert("Please enter a new password.");
        return;
    }
 
    try {
        // Perform the API request to change the password
        const response = await axios.post(
            `https://msquirebackend.azurewebsites.net/api/v1/employeeManager/reset-password/${employeeId}/${newPassword}`,
            
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
 
        // Handle the success case
        console.log("Password changed successfully", response.data);
 
        // Reset the password input field
        setNewPassword("");
       
        // Close the modal (assuming onClose is a function passed as prop)
        onClose();
 
    } catch (error) {
        // Handle different types of errors
 
        // If the error is a response from the server (e.g., validation error, 400)
        if (error.response) {
            console.error("Error response from server:", error.response.data);
            alert(`Error: ${error.response.data.message || "Password change failed"}`);
        }
        // If the error is related to the request itself (e.g., network issue, no response)
        else if (error.request) {
            console.error("No response received:", error.request);
            alert("Network error. Please try again later.");
        }
        // Other types of errors (e.g., wrong usage of axios)
        else {
            console.error("Error setting up request:", error.message);
            alert("An unexpected error occurred. Please try again later.");
        }
    }
};
 
 
  if (!isOpen) return null
 
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="employeeId" className="block text-gray-700 text-sm font-bold mb-2">
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              value={id}
             
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Change Password
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
 
export default ChangePasswordModal