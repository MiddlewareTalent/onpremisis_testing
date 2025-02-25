import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { IoCloseCircleOutline } from "react-icons/io5";
 
const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  options = [],
}) => (
  <div className="mb-4 md:w-1/2 flex flex-col space-y-2 font-serif">
    <label className="block text-xl font-medium text-black font-serif py-5">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
      >
        <option value="" className="text-gray-500">
          Select {label.toLowerCase()}
        </option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 p-2 block w-full border border-gray-300 rounded-md "
      />
    )}
  </div>
);
 
 
const TimesheetManagement = ({ setSubmissions ,employeeId}) => {
  const firstName=localStorage.getItem('firstName');
  const lastName=localStorage.getItem('lastName');
  const fullName= firstName+" "+lastName;
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [formData, setFormData] = useState({
    employeeId:localStorage.getItem("employeeId"),
    managerId: "",
    employeeName:fullName,// employeeName: "Anitha",
    startDate: "",
    endDate: "",
    numberOfHours: "",
    extraHours: "",
    clientName: "",
    projectName: "",
    taskType: "",
    workLocation: "",
    reportingManager: "",
    onCallSupport: "",
    taskDescription: "",
    emailId:localStorage.getItem("email")
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
 
  const navigate = useNavigate();
  const location = useLocation();
  const [employeeData,setEmployeeData] = useState(null)
 
  useEffect(() => {
    const employeeId=localStorage.getItem('employeeId');
   
    if (location.state?.submission) {
      setFormData(location.state.submission);
      setIsEditing(true);
    } else if (location.state?.formData) {
      setFormData(location.state.formData);
    }
    // }, [location.state]);
 
    setFormData(prevData => ({
      ...prevData,
      employeeId,  
    }));
 
  }
  , [location.state]);
 
  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId");
 
    if (!employeeId) {
        console.error("Employee ID not found in localStorage");
        return;
    }
 
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
           
            if (!token) {
                console.error("Token not found in localStorage");
                return;
            }
 
            console.log("Fetching data with token:", token);  // Log token for debugging
           
            const response = await axios.get(
                `https://middlewaretalentsbackend.azurewebsites.net/api/v1/employeeManager/getEmployee/${employeeId}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
 
            setEmployeeData(response.data);
            setFormData((prevData) => ({ ...prevData, managerId: response.data.reportingTo}));
            console.log("Fetched employee data:", response.data);  // Log response data
 
        } catch (error) {
            console.error("Error fetching the employee data", error.response || error.message);
        }
    };
 
    fetchData();
}, [employeeData]);
 
 
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  //   setErrors(null); // Clear errors when input is updated
  // };
  const handleChange = (e) => {
    const { name, value, type } = e.target;
 
    if (type === "number") {
      // For number fields, ensure the value is valid (positive numbers or empty string)
      if (value === "" || /^[0-9]+(\.[0-9]*)?$/.test(value)) {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
    } else if (type === "date") {
      // For date fields, just update the state
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    } else {
      // For other fields (text, select, etc.), just update the state
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };  
 
 
  const handleCloseForm = () => {
    setIsFormVisible(false); // Set form visibility to false
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    // List of required fields
    const requiredFields = [
      "startDate",
      "endDate",
      "clientName",
      "projectName",
      "taskType",
      "workLocation",
      "reportingManager",
      "onCallSupport",
    ];
 
    // Validation to check if all required fields are filled correctly
    const isValid = requiredFields.every((field) => {
      const fieldValue = formData[field];
      if (field === "numberOfHours" || field === "extraHours") {
        // For numeric fields, check if they are valid numbers
        return !isNaN(fieldValue) && fieldValue !== "";
      }
      // For string fields, use trim to ensure there is no empty or whitespace only value
      return typeof fieldValue === "string"
        ? fieldValue.trim() !== ""
        : fieldValue != null;
    });
 
    // Additional validation to check if the start date is before or equal to the end date
    if (!isValid || new Date(formData.startDate) > new Date(formData.endDate)) {
      setErrors("Please fill all required fields correctly.");
      return;
    }
 
    setLoading(true);
 
    // Navigate to TimesheetSubmission.jsx without submitting to database yet
    navigate("/timesheet-submission", { state: { formData } });
  };
 
  // Options for dropdowns
  const taskTypes = [
    "development",
    "design",
    "testing",
    "documentation",
    "research",
    "administration",
    "training",
    "support",
    "consulting",
    "maintenance",
    "meeting",
    "other",
  ];
  const workLocations = [
    "office",
    "home",
    "client",
    "co-working Space",
    "field",
    "hybrid",
    "on-Site",
    "temporary Location",
    "mobile",
  ];
  const onCallOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];
 
  if (!isFormVisible) return navigate('/EmployeeHomePage');
 
  return (
    <div className="mx-auto py-8 px-4 font-serif w-8/12 text-xl ">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
        <div className="flex justify-between text-3xl font-semibold mb-6 bg-gray-100 p-2 rounded-t-sm">
          {isEditing ? "Edit Timesheet" : "Submit Timesheet"}
          <button onClick={handleCloseForm} className="text-gray-400 hover:text-gray-500">
                          <IoCloseCircleOutline className="h-8 w-8" />
                        </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row min-w-40 gap-5 text-xl">
            <FormField
              label="Start Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              type="date"
              required
            />
            <FormField
              label="End Date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              type="date"
              required
            />
          </div>
          <div className="flex flex-row min-w-40 gap-5">
            <FormField
              label="Number of Hours"
              name="numberOfHours"
              value={formData.numberOfHours}
              onChange={handleChange}
              type="number"
              min="0"
              required
            />
            <FormField
              label="Extra Hours"
              name="extraHours"
              value={formData.extraHours}
              onChange={handleChange}
              type="number"
            />
          </div>
          <div className="flex flex-row min-w-40 gap-5">
            <FormField
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
            />
            <FormField
              label="Project Name"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-row min-w-40 gap-5">
            <FormField
              label="Task Type"
              name="taskType"
              value={formData.taskType}
              onChange={handleChange}
              type="select"
              options={taskTypes.map((type) => ({
                value: type,
                label: type.charAt(0).toUpperCase() + type.slice(1),
              }))}
              required
            />
            <FormField
              label="Work Location"
              name="workLocation"
              value={formData.workLocation}
              onChange={handleChange}
              type="select"
              options={workLocations.map((location) => ({
                value: location,
                label: location.charAt(0).toUpperCase() + location.slice(1),
              }))}
              required
            />
          </div>
          <div className="flex flex-row min-w-96 gap-5">
            <FormField
              label="Reporting Manager"
              name="reportingManager"
              value={formData.reportingManager}
              onChange={handleChange}
              required
            />
            <FormField
              label="On-Call Support"
              name="onCallSupport"
              value={formData.onCallSupport}
              onChange={handleChange}
              type="select"
              options={onCallOptions}
              required
            />
          </div>
 
          <div className="m-2 w-11/12 gap-5">
            <label className="block font-medium text-black">
              Task Description
            </label>
            <textarea
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleChange}
              className="p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          {errors && <div className="text-red-500 mb-3">{errors}</div>}
          <button
            disabled={loading}
            type="submit"
            className={`py-2 px-4 rounded-lg text-white ${
              isEditing ? "bg-yellow-500" : "bg-blue-500"
            } hover:${
              isEditing ? "bg-yellow-600" : "bg-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isEditing ? "Update Timesheet" : "Submit Timesheet"}
          </button>
        </form>
      </div>
    </div>
  );
};
 
export default TimesheetManagement;