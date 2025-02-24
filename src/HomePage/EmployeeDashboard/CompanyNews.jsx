import { useState } from "react";
import axios from "axios";
import NewsCarousel from "./NewsCarousel";
 
const CompanyNews = () => {
    const [tab, setTab]=useState("View News");
    const [news, setNews]=useState("");
    const [newsHeading, setNewsHeading]=useState("");
 
    const postNews = async () => {
        const token=localStorage.getItem("token");
        try {
            const response = await axios.post("https://middlewaretalentsbackend.azurewebsites.net/apis/employees/companyNews/addNews", {
                userName: "",
                userId: "",
                userEmail: localStorage.getItem('email'),
                newsHeading: newsHeading,
                news: news,
                createdAt: new Date()
            }, {
                headers: {
                  "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
                }});
    
            // Reset the form or inputs after successfully posting the news
            setNews("");
            setNewsHeading("");
            
            // You can also handle the response here, if necessary
            console.log("News posted successfully:", response.data);
    
        } catch (error) {
            // Handle errors
            if (error.response) {
                // The server responded with a status other than 2xx
                console.error("Error response:", error.response.data);
                alert(`Error: ${error.response.data.message || 'An error occurred while posting news'}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("Error request:", error.request);
                alert("No response received from the server. Please check your network connection.");
            } else {
                // Something else went wrong
                console.error("Error message:", error.message);
                alert("An error occurred: " + error.message);
            }
    
            // Optionally reset the input fields in case of an error too
            setNews("");
            setNewsHeading("");
        }
    };
    
 
 
 
    return (
        <div className="relative lg:row-span-2 p-6" style={{ height: '280px' }}> {/* Added padding for spacing */}
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <h3 className="text-2xl font-semibold text-gray-900 ml-5">Company News</h3> {/* Increased text size */}
                <p className="mt-2 text-lg text-gray-700">
                    Stay updated with the latest company news and updates. {/* Example content */}
                </p>
                <div>
                    {
                        localStorage.getItem("role")!=="employee" &&
                        <div className=" flex fex-row mt-5">
                    {tab==="Post News" && <button className="mr-5 border border-solid border-black rounded-md w-40" onClick={(e=>{setTab("View News")})}>View News</button>}
                    {tab==="View News" && <button className="mr-5 border border-solid border-black rounded-md w-40" onClick={(e=>{setTab("Post News")})}>Post news</button>}
                </div>
                    }
                </div>
 
                <hr class="border-gray-300 my-4" />
 
                {tab==="Post News" && <div className="p-4">
                    <input
                    value={newsHeading}
                    onChange={(e) => setNewsHeading(e.target.value)}
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter news heading..."
                    />
                    <textarea
                        value={news}
                        onChange={(e) => setNews(e.target.value)} // Change here
                        className="mt-5 w-full h-48 border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter news here..."
                    ></textarea>
                    <button onClick={postNews} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                        Post
                    </button>
                </div>}
 
 
                {tab==="View News" && <div className="p-4">
                    <NewsCarousel/>
                </div>}
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
        </div>
    );
};
 
export default CompanyNews;