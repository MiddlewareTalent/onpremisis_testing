import axios from 'axios';
 
const BASE_URL = 'https://ssitcloudbackend.azurewebsites.net/api/v1/employeeManager';
 
export const getEmployeeDetails = async (employeeId) => {
   
    console.log(employeeId);
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/getEmployee/${employeeId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    // Check if the request was successful
    if (!response.ok) {
        throw new Error(`Error fetching employee data: ${response.statusText}`);
    }
    
    // Parse the response body as JSON
    const data = await response.json();
    console.log(data);
    
    // Return the parsed data
    return data;
  } catch (error) {
    throw error;
  }
};
 
export const updateEmployeeDetails = async (employeeId, employeeData) => {

    console.log(employeeData);
    try {
        const token = localStorage.getItem('token');

        const response = await axios.put(`${BASE_URL}/update/${employeeData.id}`, employeeData, {
            headers: {
                'Content-Type': 'multipart/form-data',

                'Authorization': `Bearer ${token}` // Add Authorization header with JWT token

            }

        });
        
        console.log(response);
    } catch (error) {
        console.error('Error in PUT request:', error);
        throw error;  // Rethrow error after logging it
    }
};