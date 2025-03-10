import NotificationItem from "./NotificationItem";
import axios from "axios";
import { useState, useEffect } from "react";

const Notification = () => {
    const [notificationsData, setNotificationsData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const employeeId = localStorage.getItem('employeeId');
            const token=localStorage.getItem("token");
            try {
                const response = await axios.get(`https://ssitcloudbackend.azurewebsites.net/apis/employees/notificationsTo/${employeeId}`, {
                    headers: {
                      "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
                    }
                  });
                console.log(response);
                setNotificationsData(response.data.reverse());
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);

    return (
        <div className="relative lg:row-span-2 p-6 " style={{ height: '380px' }}>
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-r-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <h3 className="text-2xl font-semibold text-gray-900">Notifications</h3>
                <p className="mt-2 text-lg text-gray-700">
                    Check your latest notifications here.
                </p>
                <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 250px)' }}> {/* Fixed height with scrolling */}
                    <ul className="max-h-[calc(100vh-250px)]"> {/* Adjust this value based on your layout */}
                        {notificationsData !== null && notificationsData.map(each => (
                            <NotificationItem key={each.notificationId} each={each} />
                        ))}
                    </ul>
                </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-r-[2rem]"></div>
        </div>
    );
}    
export default Notification;
