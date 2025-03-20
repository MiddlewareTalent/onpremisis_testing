import React, { useState, useEffect } from "react";
import axios from "axios";
// import { set } from 'react-datepicker/dist/date_utils';
import { useNavigate } from "react-router-dom";

const LeaveSheet = () => {
    // State to manage the inputs
    const [leaveData, setLeaveData] = useState({
        sick: "",
        vacation: "",
        casual: "",
        marriage: "",
        paternity: "",
        maternity: "",
        others: "",
    });

    // State to track form submission
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [leaveId, setLeaveId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLeaveSheet();
    }, []);

    const fetchLeaveSheet = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://msquirebackend.azurewebsites.net/api/getSheets", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.data.length > 0) {
                setLeaveData(response.data[0]);
                setLeaveId(response.data[0].id);
                setIsSubmitted(true);
            }
        } catch (error) {
            console.log("Error fetching leave sheet:", error);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLeaveData({
            ...leaveData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (isSubmitted && leaveId) {
                const response = await axios.put(
                    `https://msquirebackend.azurewebsites.net/api/updateSheet/${leaveId}`,
                    leaveData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("Leave sheet updated:", response.data);
                setIsSubmitted(true); // Ensure it remains submitted
            } else {
                // If no data exists, create a new leave sheet
                const token = localStorage.getItem("token");
                const response = await axios.post(
                    "https://msquirebackend.azurewebsites.net/api/submitSheet",
                    leaveData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("Leave sheet submitted:", response.data);

                setLeaveId(response.data.id); // Store the returned ID
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error("Error submitting leave sheet:", error);
        }
    };

    // Handle edit mode
    const handleEdit = () => {
        setIsSubmitted(false); // Enable editing mode
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">
                Leave Sheet Form
            </h2>

            {isSubmitted ? (
                <div className="text-center text-green-600 font-semibold">
                    <p>Your leave request has been submitted successfully!</p>
                    <button
                        onClick={() => navigate("/LeaveManagement")}
                        className="mt-4 mr-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleEdit}
                        className="mt-4 py-2 px-4 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                        Edit Leave Request
                    </button>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {/* Leave Input Fields */}
                    {Object.keys(leaveData)
                        .slice(1)
                        .map((key) => (
                            <div key={key}>
                                <label
                                    className="block text-base font-semibold mb-2 text-gray-700"
                                    htmlFor={key}
                                >
                                    {key.charAt(0).toUpperCase() + key.slice(1)} Leave:
                                </label>
                                <input
                                    type="number"
                                    id={key}
                                    name={key}
                                    value={leaveData[key] || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    placeholder="Days"
                                    required
                                />
                            </div>
                        ))}

                    {/* Submit Button */}
                    <div className="col-span-full">
                        <button
                            type="submit"
                            className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {isSubmitted ? "Update" : "Submit"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default LeaveSheet;