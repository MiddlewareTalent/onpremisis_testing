import { useState, useEffect } from "react";
import axios from "axios";

const Holiday = () => {
    const [tab, setTab] = useState("View Holiday");
    const [newHoliday, setNewHoliday] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [AllHolidays, setAllHolidays] = useState([]);
    const [upcomingHoliday, setUpcomingHoliday] = useState(null);

    
        const fetchHolidays = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`https://msquirebackend.azurewebsites.net/api/holiday/getAllHolidays`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setAllHolidays(response.data);
            } catch (error) {
                console.error("Error fetching holidays:", error);
            }
        };

       

    // This effect will run whenever the AllHolidays state changes
    useEffect(() => {
        const today = new Date();

        // Filter holidays to only show upcoming ones
        const upcomingHolidays = AllHolidays.filter((holiday) => {
            const holidayDate = new Date(holiday.date);
            return holidayDate >= today;
        });

        // Sort holidays by date (earliest first)
        const sortedUpcomingHolidays = upcomingHolidays.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Set the first upcoming holiday
        if (sortedUpcomingHolidays.length > 0) {
            setUpcomingHoliday(sortedUpcomingHolidays[0]);
        } else {
            setUpcomingHoliday(null); // No upcoming holidays
        }
    }, [AllHolidays]); // This effect depends on AllHolidays

    const postHoliday = async () => {
        const token = localStorage.getItem('token');
    
        // Validate inputs
        if (!newHoliday || !date || !description) {
            alert("Please fill in all fields");
            return;
        }
    
        // Ensure the date is in the correct format (YYYY-MM-DD)
        const formattedDate = new Date(date).toISOString().split('T')[0]; // "YYYY-MM-DD"
    
        try {
            const response = await axios.post(
                'https://msquirebackend.azurewebsites.net/api/holiday/holiday',
                {
                    name: newHoliday,
                    date: formattedDate,  // Send the formatted date
                    description: description,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );          
    
            // Directly update the local state with the newly added holiday
            setAllHolidays(prevHolidays => [response.data, ...prevHolidays]);
    
            // Reset form fields
            setNewHoliday("");
            setDate("");
            setDescription("");
           
    
            // Change the tab back to 'View Holiday' after posting
            fetchHolidays();
            setTab("View Holiday");
    
        } catch (error) {
            console.log("Error posting holiday:", error);
            alert("Failed to post holiday");
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, []);
    

    const deleteHoliday = async (id) => {
        const token = localStorage.getItem('token');
    
        try {
            // Send DELETE request to backend to delete the holiday
            await axios.delete(`https://msquirebackend.azurewebsites.net/api/holiday/deleteHolidayById/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
    
            // Remove the deleted holiday from the state
            setAllHolidays(AllHolidays.filter(holiday => holiday.id !== id));
    
            // Optionally, display a success message
            alert("Holiday deleted successfully");
    
        } catch (error) {
            console.error("Error deleting holiday:", error);
            alert("Failed to delete holiday");
        }
    };
    

    // Toggle Modal visibility
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="relative lg:row-span-2 p-6" style={{ height: '380px' }}>
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem] border border-gray-200"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <h3 className="text-2xl font-semibold text-gray-900 ml-5">Upcoming Holiday</h3>
                <p className="mt-2 text-lg text-gray-700">Stay updated on your upcoming holidays.</p>
                <div className="">
                    {localStorage.getItem("role") !== "employee" && (
                        <div className="col-start-1 col-end-3 mt-5">
                            {tab === "Post Holiday" && (
                                <button
                                    className="mr-5 border border-solid border-black rounded-md w-40"
                                    onClick={() => { setTab("View Holiday"); }}
                                >
                                    View Holidays
                                </button>
                            )}
                            {tab === "View Holiday" && (
                                <button
                                    className="mr-5 border border-solid border-black rounded-md w-40"
                                    onClick={() => { setTab("Post Holiday"); }}
                                >
                                    Post Holiday
                                </button>
                            )}
                            {tab === "Post Holiday" && (
                                <button
                                    className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    onClick={postHoliday} // Call the postHoliday function when clicked
                                >
                                    Post
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <hr className="border-gray-300 my-4" />

                {tab === "Post Holiday" && (
                    <div className="p-4">
                        <input
                            value={newHoliday}
                            onChange={(e) => setNewHoliday(e.target.value)}
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Holiday name"
                        />
                        <input
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type='date'
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-5 w-full h-40 border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Holiday Description"
                        ></textarea>
                    </div>
                )}

                {tab === "View Holiday" && upcomingHoliday && (
                    <div className="bg-slate-100 shadow-lg rounded-lg p-4">
                        <h2 className="text-2xl font-bold text-gray-800">{upcomingHoliday.name}</h2>
                        <p className="text-2xl font-semibold text-gray-800 mt-2">
                            Date: {new Date(upcomingHoliday.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-800 mt-2 break-words">{upcomingHoliday.description}</p>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-xl"
                                onClick={toggleModal} // Opens the modal
                            >
                                View More
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal for View More */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 w-1/3 shadow-xl">
                            <h2 className="text-2xl font-semibold text-gray-800">Holiday List</h2>
                            <ul className="mt-4 space-y-2">
                                {AllHolidays.map((holiday, index) => (
                                    <li key={index} className="flex justify-between text-lg text-gray-700">
                                        {holiday.name} - {new Date(holiday.date).toLocaleDateString()}
                                        {localStorage.getItem("role") !== "employee" && (
                                            <button className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-300 "
                                            onClick={() => deleteHoliday(holiday.id)}>
                                                Delete
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4">
                                <button
                                    onClick={toggleModal} // Close the modal
                                    className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Holiday;
