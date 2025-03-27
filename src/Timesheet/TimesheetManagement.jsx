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
  errorMessage = "",
}) => (
  <div className="mb-4 md:w-1/2 flex flex-col space-y-2 ">
    <label className="block text-2xl font-medium text-black  py-5">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
      >
        <option value="" className="text-gray-500">
        Select {typeof label === "string" ? label.toLowerCase() : "option"}
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
     {errorMessage && <div className="text-red-500 text-xl">{errorMessage}</div>}
  </div>
);


const TimesheetManagement = ({ setSubmissions, employeeId }) => {
  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');
  const fullName = firstName + " " + lastName;
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [formData, setFormData] = useState({
    employeeId: localStorage.getItem("employeeId"),
    managerId: "",
    employeeName: fullName,// employeeName: "Anitha",
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
    emailId: localStorage.getItem("email")
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [employeeData, setEmployeeData] = useState(null)

  useEffect(() => {
    const employeeId = localStorage.getItem('employeeId');

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
          `https://mtlbackendapp.azurewebsites.net/api/v1/employeeManager/getEmployee/${employeeId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setEmployeeData(response.data);
        setFormData((prevData) => ({ ...prevData, managerId: response.data.reportingTo }));
        console.log("Fetched employee data:", response.data);  // Log response data

      } catch (error) {
        console.error("Error fetching the employee data", error.response || error.message);
      }


      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token not found in localStorage");
          return;
        }

        console.log("Fetching data with token:", token);  // Log token for debugging

        const response = await axios.get(
          `https://mtlbackendapp.azurewebsites.net/api/v1/employeeManager/getEmployee/${formData.managerId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setEmployeeData(response.data);
        setFormData((prevData) => ({ ...prevData, reportingManager: response.data.firstName+" "+response.data.lastName }));
        console.log("Fetched employee data:", response.data);  // Log response data

      } catch (error) {
        console.error("Error fetching the employee data", error.response || error.message);
      }

      
    };

    fetchData();
  }, [employeeData, formData.managerId]);


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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };


  const handleCloseForm = () => {
    setIsFormVisible(false); // Set form visibility to false
    navigate('/TimesheetManage');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(errors);
    let formErrors = {};

    // Validation logic for each field
    if (!formData.startDate) {
      formErrors.startDate = "Please fill start date field.";
    }

    if (!formData.endDate) {
      formErrors.endDate = "Please fill end date field.";
    } else if (new Date(formData.startDate) > new Date(formData.endDate)) {
      formErrors.endDate = "End date must be after or equal to start date.";
    }

    if (!formData.clientName) {
      formErrors.clientName = "Please fill client name field.";
    }

    if (!formData.projectName) {
      formErrors.projectName = "Please fill project name field.";
    }

    if (!formData.taskType) {
      formErrors.taskType = "Please select a task type.";
    }

    if (!formData.workLocation) {
      formErrors.workLocation = "Please select a work mode.";
    }

    if (!formData.onCallSupport) {
      formErrors.onCallSupport = "Please select on-call support option.";
    }

    if (!formData.numberOfHours || isNaN(formData.numberOfHours)) {
      formErrors.numberOfHours = "Please fill number of hours.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);  // Set errors state here
      return;  // Prevent form submission if there are errors
    }
    
    setLoading(true);

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
  ];
  const onCallOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  if (!isFormVisible) return null;

  return (
    <div className="mx-auto py-8 px-4  w-8/12 text-2xl ">
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
             label={<>Start Date <span style={{ color: 'red' }}>*</span></>}
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              type="date"
              errorMessage={errors.startDate}
            />
            <FormField
              label={<>End Date <span style={{color:'red'}}>*</span></>}
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              type="date"
              errorMessage={errors.endDate}
            />
          </div> 
          <div className="flex flex-row min-w-40 gap-5 text-xl">
            <FormField
            label={<>Number of Hours <span style={{color:'red'}}>*</span></>}
              name="numberOfHours"
              value={formData.numberOfHours}
              onChange={handleChange}
              type="number"
              min="0"
              errorMessage={errors.numberOfHours}
            />
            <FormField
              label="Extra Hours"
              name="extraHours"
              value={formData.extraHours}
              onChange={handleChange}
              type="number"
              required={false}
            />
          </div>
          <div className="flex flex-row min-w-40 gap-5 text-xl">
            <FormField
            label={<>Client Name <span style={{color:'red'}}>*</span></>}
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              errorMessage={errors.clientName}
            />
            <FormField
             label={<>Project Name <span style={{color:'red'}}>*</span></>}
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              errorMessage={errors.projectName}
            />
          </div>
          <div className="flex flex-row min-w-40 gap-5 text-xl">
            <FormField
            label={<>Task Type <span style={{color:'red'}}>*</span></>}
              name="taskType"
              value={formData.taskType}
              onChange={handleChange}
              type="select"
              options={taskTypes.map((type) => ({
                value: type,
                label: type.charAt(0).toUpperCase() + type.slice(1),
              }))}
              errorMessage={errors.taskType}
            />
            <FormField
             label={<>Work Mode <span style={{color:'red'}}>*</span></>}
              name="workLocation"
              value={formData.workLocation}
              onChange={handleChange}
              type="select"
              options={workLocations.map((location) => ({
                value: location,
                label: location.charAt(0).toUpperCase() + location.slice(1),
              }))}
              errorMessage={errors.workLocation}
            />
          </div>
          <div className="flex flex-row min-w-40 gap-5 text-xl">
            <FormField
            label={<>On-Call Support <span style={{color:'red'}}>*</span></>}
              name="onCallSupport"
              value={formData.onCallSupport}
              onChange={handleChange}
              type="select"
              options={onCallOptions}
              errorMessage={errors.onCallSupport}
            />

            <div className="mb-4 md:w-1/2 flex flex-col space-y-2 text-xl ">
              <label className="block text-2xl font-medium text-black  py-5">
                Task Description
              </label>
              <textarea
                name="taskDescription"
                value={formData.taskDescription}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
            </div>
          </div>

        
          <button
            disabled={loading}
            type="submit"
            className={`py-2 px-4 rounded-lg text-white ${isEditing ? "bg-yellow-500" : "bg-blue-500"
              } hover:${isEditing ? "bg-yellow-600" : "bg-blue-600"
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