import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: localStorage.getItem("email"),
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { newPassword, confirmPassword } = formData;
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePassword(newPassword)) {
            setError('Password must have at least one uppercase, one lowercase, one number, and one special character');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authorization token found');
                return;
            }

            await axios.post(
                `https://ssitcloudbackend.azurewebsites.net/api/v1/employeeManager/change-password`,
                {
                    email: formData.email,
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                }
            );

            navigate('/login'); // Navigate to Dashboard upon success
        } catch (error) {
            console.log(error);
            console.log(error.response.status);
            if (error.response.status===500){
                setError(error.response.data);
            }
            else{
                setError('Failed to change password. Please try again.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-semibold text-center mb-4">Change Password</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                placeholder="Enter Email"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Old Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword.oldPassword ? "text" : "password"}
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                    placeholder="Enter Old Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("oldPassword")}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                >
                                    {showPassword.oldPassword ? "hide" : "show"}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword.newPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                    placeholder="Enter New Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("newPassword")}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                >
                                    {showPassword.newPassword ? "hide" : "show"}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword.confirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                    placeholder="Confirm Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("confirmPassword")}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                >
                                    {showPassword.confirmPassword ? "hide" : "show"}
                                </button>
                            </div>
                        </div>

                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/Dashboard')}
                                className="px-4 py-2 bg-gray-400 rounded-lg shadow hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
