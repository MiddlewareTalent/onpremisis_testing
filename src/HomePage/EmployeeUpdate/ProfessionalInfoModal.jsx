import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

export default function ProfessionalInfoModal({
  isOpen,
  onClose,
  onBack,
  onSubmit,
  initialData,
  onDataChange,
}) {
  const [formData, setFormData] = useState(initialData);
  const [employees, setEmployees] = useState([]);
  // const [errors, setErrors]=useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://msquirebackend.azurewebsites.net/api/v1/employeeManager/AdminsAndManagers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }

        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      const updatedData = { ...formData, [name]: value };
      setFormData(updatedData);
      onDataChange(updatedData);
      // setErrors((prevErrors)=>({...prevErrors,[name]:""}))
    } else {
      const updatedData = { ...formData, ...e };
      setFormData(updatedData);
      onDataChange(updatedData);
      
    }
  };

  // const validateForm=()=>{
  //   const newErrors={};
  //   if(!formData.workingCountry) newErrors.workingCountry="Country is required";
  //   if(!formData.jobRole) newErrors.jobRole="Job role is required";
  //   if(!formData.employmentStatus) newErrors.employmentStatus="Employment status is required";
  //   if(!formData.nationalInsuranceNumber) newErrors.nationalInsuranceNumber="National ID is required";
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length===0;
  // }

  const giveAccessAdminAndManager = () => {
    setFormData((prev) => ({
      ...prev,
      task: true,
      organizationChart: true,
      leaveManagement: true,
      timeSheet: true,
    }));
    onDataChange({
      ...formData,
      task: true,
      organizationChart: true,
      leaveManagement: true,
      timeSheet: true,
    });
  };

  const giveAccessEmployee = () => {
    setFormData((prev) => ({
      ...prev,
      task: false,
      organizationChart: false,
      leaveManagement: false,
      timeSheet: false,
    }));
    onDataChange({
      ...formData,
      task: false,
      organizationChart: false,
      leaveManagement: false,
      timeSheet: false,
    });
  };

  const handleLeave = () => {
    if (formData.role === "employee") {
      setFormData((prev) => ({
        ...prev,
        leaveManagement: !prev.leaveManagement,
      }));
      onDataChange({ ...formData, leaveManagement: !formData.leaveManagement });
    }
  };

  const handleOrgChart = () => {
    if (formData.role === "employee") {
      setFormData((prev) => ({
        ...prev,
        organizationChart: !prev.organizationChart,
      }));
      onDataChange({
        ...formData,
        organizationChart: !formData.organizationChart,
      });
    }
  };
  const handleTimesheet = () => {
    if (formData.role === "employee") {
      setFormData((prev) => ({
        ...prev,
        timeSheet: !prev.timeSheet,
      }));
      onDataChange({ ...formData, timeSheet: !formData.timeSheet });
    }
  };
  const handleTask = () => {
    if (formData.role === "employee") {
      setFormData((prev) => ({
        ...prev,
        task: !prev.task,
      }));
      onDataChange({ ...formData, task: !formData.task });
    }
  };

  // const handleSubmit=()=>{
  //   if(validateForm()){
  //     onSubmit(formData);
  //   }
  // }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl rounded-lg bg-white p-6 w-full">
          <Dialog.Title className="text-xl font-semibold mb-6">
            Professional Information
          </Dialog.Title>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="country"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Working Country
                </label>
                <div className="mt-2">
                  <select
                    id="working-country"
                    name="workingCountry"
                    type="text"
                    value={formData.workingCountry}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                  >
                    <option value="">Select a country</option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                    <option>India</option>
                    <option>UK</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId || ""}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Corporate Email
              </label>
              <input
                type="email"
                name="corporateEmail"
                value={formData.corporateEmail || ""}
                onChange={handleChange}
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of joining
              </label>
              <input
                type="date"
                id="date-of-joining"
                name="dateOfJoining"
                value={formData.dateOfJoining || ""}
                onChange={handleChange}
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Role
                </label>
                <select
                  name="jobRole"
                  value={formData.jobRole || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select Job Role</option>
                  <option value="CEO">CEO</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Designe">Designer</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employment Status
                </label>
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select Employment Status</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
                {/* {errors.employmentStatus && <p className="text-red-500">{errors.employmentStatus}</p>} */}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reporting To
                </label>
                <select
                  id="reporting-to"
                  name="reportingTo"
                  value={formData.reportingTo}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6"
                >
                  <option value="">Select Manager</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.employeeId}>
                      {employee.firstName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  National Id Number
                </label>
                <input
                  id="nationalInsuranceNumber"
                  name="nationalInsuranceNumber"
                  type="text"
                  value={formData.nationalInsuranceNumber}
                  disabled
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === "admin"}
                    onChange={() => {
                      handleChange({ role: "admin" });
                      giveAccessAdminAndManager();
                    }}
                    className="mr-2"
                  />
                  Admin
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="manager"
                    checked={formData.role === "manager"}
                    onChange={() => {
                      handleChange({ role: "manager" });
                      giveAccessAdminAndManager();
                    }}
                    className="mr-2"
                  />
                  Manager
                </label>
                <label className="flex items-center">
                  <input
                    id="role-employee"
                    type="radio"
                    name="role"
                    value="employee"
                    checked={formData.role === "employee"}
                    onChange={() => {
                      handleChange({ role: "employee" });
                      giveAccessEmployee();
                    }}
                    className="mr-2"
                  />
                  Employee
                </label>
              </div>
              {formData.role === "employee" && (
                <div>
                  <p className="mt-3 text-sm font-bold">Give Access</p>
                  <div className="mt-2 grid grid-cols-1 gap-x-40 gap-y-8 sm:grid-cols-6  ">
                    <div className="flex items-center gap-x-3">
                      <input
                        id="Leave-Management"
                        name="leaveManagement"
                        type="checkbox"
                        checked={formData.leaveManagement}
                        onChange={handleLeave}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="Leave-Management"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Leave Management
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="Time-sheet"
                        name="timeSheet"
                        type="checkbox"
                        checked={formData.timeSheet}
                        onChange={handleTimesheet}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="Time-sheet"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        TimeSheet
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="Task-Manager"
                        name="task"
                        type="checkbox"
                        checked={formData.task}
                        onChange={handleTask}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="Task-Manager"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Task Management
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="org-chart"
                        name="organizationChart"
                        type="checkbox"
                        checked={formData.organizationChart}
                        onChange={handleOrgChart}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="org-chart"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Organization Chart
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={()=>onSubmit(formData)}
              // disabled={Object.keys(errors).length>0}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
