import React, {useEffect, useState} from 'react';

const ProfessionalDetailsForm = ({ formData, onNext, onBack, onFormDataChange }) => {
    const [errors, setErrors] = useState({});

    const [employees, setEmployees] = useState([]);
    // const [ setLoading] = useState(false);
    const [employeeExists, setEmployeeExists] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('https://middlewaretalentsbackend.azurewebsites.net/api/v1/employeeManager/employees', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }

                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);



    const validate = () => {
        const newErrors = {};

        // Validate Company Name
        if (!/^[a-zA-Z0-9\s]+$/.test(formData.companyName)) {
            newErrors.companyName = "Company Name should accept numbers and characters.";
        }
        if (!/^[A-Z0-9]+$/.test(formData.employeeId)) {
            newErrors.employeeId = "Employee ID must contain only uppercase letters and digits.For Example : MTL1010";
        }

        // Validate Corporate Email
        if (!/\S+@\S+\.\S+/.test(formData.corporateEmail)) {
            newErrors.corporateEmail = "Please enter a valid email address.";
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@middlewaretalents\.com$/;
        if (!emailPattern.test(formData.corporateEmail)) {
            newErrors.corporateEmail = "Please enter a valid email address with @middlewaretalents.com domain.";
        }
        return newErrors;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        // Check if there are no errors before proceeding
        if (Object.keys(validationErrors).length === 0) {
            try {
                // Send the request to check if Employee ID exists
                const response = await fetch(`https://middlewaretalentsbackend.azurewebsites.net/api/v1/employeeManager/exists/${formData.employeeId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error checking employee ID');
                }

                const data = await response.json(); // Try to parse the response as JSON

                if (data === true) {
                    setEmployeeExists(true); // Employee ID exists
                    setErrors({ employeeId: 'Employee ID already exists in the database.' });
                } else {
                    setEmployeeExists(false); // Employee ID does not exist
                    onNext(); // Proceed to next step if employee ID is valid
                }
            } catch (error) {
                console.error('Error:', error);
                // Handle unexpected errors (e.g., network issues)
                setErrors({ employeeId: 'There was an error checking the Employee ID. Please try again.' });
            }
        }
    };



    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Professional Information</h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                        <div className="sm:col-span-3">
                            <label htmlFor="company-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Company Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="company-name"
                                    name="companyName"
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => onFormDataChange({companyName: e.target.value})}
                                    className="block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                                />
                                {errors.companyName && <p className="text-sm text-red-600">{errors.companyName}</p>}
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="employee-id" className="block text-sm font-medium leading-6 text-gray-900">
                                Employee ID
                            </label>
                            <div className="mt-2">
                                <input
                                    id="employee-id"
                                    name="employeeId"
                                    type="text"
                                    value={formData.employeeId}
                                    onChange={(e) => onFormDataChange({employeeId: e.target.value})}
                                    className="block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                                />
                                {errors.employeeId && <p className="text-sm text-red-600">{errors.employeeId}</p>}
                                {employeeExists && (
                                    <p className="text-sm text-red-600">This Employee ID already exists. Please use a unique ID.</p>
                                )}
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="corporate-email"
                                   className="block text-sm font-medium leading-6 text-gray-900">
                                Corporate Email
                            </label>
                            <div className="mt-2">
                                <input
                                    id="corporate-email"
                                    name="corporateEmail"
                                    type="email"
                                    value={formData.corporateEmail}
                                    onChange={(e) => onFormDataChange({corporateEmail: e.target.value})}
                                    className="block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                                />
                                {errors.corporateEmail &&
                                    <p className="text-sm text-red-600">{errors.corporateEmail}</p>}
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="job-role" className="block text-sm font-medium leading-6 text-gray-900">
                                Job Role
                            </label>
                            <div className="mt-2">
                                <select
                                    id="job-role"
                                    name="jobRole"
                                    value={formData.jobRole}
                                    onChange={(e) => onFormDataChange({jobRole: e.target.value})}
                                    className="block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6"
                                >
                                    <option value="">Select Job Role</option>
                                    <option value="CEO">CEO</option>
                                    <option value="Software Developer">Software Developer</option>
                                    <option value="Product Manager">Product Manager</option>
                                    <option value="Designe">Designer</option>
                                    <option value="HR">HR</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="employment-status"
                                   className="block text-sm font-medium leading-6 text-gray-900">
                                Employment Status
                            </label>
                            <div className="mt-2">
                                <select
                                    id="employment-status"
                                    name="employmentStatus"
                                    value={formData.employmentStatus}
                                    onChange={(e) => onFormDataChange({employmentStatus: e.target.value})}
                                    className="block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6"
                                >
                                    <option value="">Select Employment Status</option>
                                    <option value="full-time">Full-Time</option>
                                    <option value="part-time">Part-Time</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="reporting-to" className="block text-sm font-medium leading-6 text-gray-900">
                                Reporting To
                            </label>
                            <div className="mt-2">
                                <select
                                    id="reporting-to"
                                    name="reportingTo"
                                    value={formData.reportingTo}
                                    onChange={(e) => onFormDataChange({reportingTo: e.target.value})}
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
                        </div>


                        <fieldset className="sm:col-span-full">
                            <legend className="text-sm font-semibold leading-6 text-gray-900">Role</legend>
                            <div className="mt-6 space-y-6">
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="role-admin"
                                        name="role"
                                        type="radio"
                                        value="admin"
                                        checked={formData.role === 'admin'}
                                        onChange={() => onFormDataChange({role: 'admin'})}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="role-admin"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Admin
                                    </label>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="role-manager"
                                        name="role"
                                        type="radio"
                                        value="manager"
                                        checked={formData.role === 'manager'}
                                        onChange={() => onFormDataChange({role: 'manager'})}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="role-admin"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Manager
                                    </label>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <input
                                        id="role-employee"
                                        name="role"
                                        type="radio"
                                        value="employee"
                                        checked={formData.role === 'employee'}
                                        onChange={() => onFormDataChange({role: 'employee'})}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="role-employee"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Employee
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={onBack}>
                        Back
                    </button>
                    <button type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 -offset-2 focus-visible:outline-indigo-600">
                        Next
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ProfessionalDetailsForm;
