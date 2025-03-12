import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ChartNode from "./ChartNode";
// import ProfileCard from "./ProfileCard";
// import SearchError from "../Assets/searcherror.png";
// import { EnvelopeIcon, MapPinIcon, BriefcaseIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { FaMapMarkerAlt, FaEnvelope, FaCopy } from 'react-icons/fa';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { motion } from "framer-motion"
import Loader from "../Assets/Loader";
 
 
export default function Chart() {
  const [originData, setOriginData] = useState([]);
  const [reportingEmployees, setReportingEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(localStorage.getItem('employeeId')); // Initial employee ID
  const [allEmployees, setAllEmployees] = useState([]);
  const [highlightedId, setHighlightedId] = useState(null);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // For displaying errors
  const [searchError, setSearchError] = useState(false); // For tracking if search has no results
  const suggestionsRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [highlightedData, setHeiglightedData] = useState({ "jobRole": "", "employeeId": "", "country": "" });
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
  const [workingWith, setWorkingWith] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCountry, setFilterCountry] = useState("all");
 
  // Fetch data based on the employeeId
  useEffect(() => {
    const fetchAllData = async () => {
      const fetchData = async () => {
        setLoading((prev) => true);
        try {
          const token = localStorage.getItem('token')
          console.log(token)
          const [originResponse] = await Promise.all([
            axios.get(`https://ssitcloudbackend.azurewebsites.net/api/v1/employeeManager/origin/${employeeId}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
              }
            })
          ]);
 
          // Setting the fetched data
          setOriginData(originResponse.data.reverse());
 
          // Clear any previous error messages on successful data fetch
          setErrorMessage("");
 
        } catch (error) {
          // If an error occurs (e.g., 404), set an error message
          console.error('Error fetching data:', error);
          setErrorMessage("there are no reporting employees to this person");
          setReportingEmployees([]); // Reset reporting employees in case of failure
        }
 
 
        try {
          const token = localStorage.getItem('token')
          console.log(token)
          const [reportingResponse] = await Promise.all([
            axios.get(`https://ssitcloudbackend.azurewebsites.net/api/v1/employeeManager/reporting-to/${employeeId}/${filterCountry}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
              }
            }),
          ]);
 
          // Setting the fetched data
          setReportingEmployees(reportingResponse.data);
 
          // Clear any previous error messages on successful data fetch
          setErrorMessage("");
 
        } catch (error) {
          // If an error occurs (e.g., 404), set an error message
          console.error('Error fetching data:', error);
          setErrorMessage("There are no reporting employees");
          setReportingEmployees([]); // Reset reporting employees in case of failure
        }
 
 
 
        try {
          const token = localStorage.getItem('token')
          console.log(token)
          const [employeesResponse] = await Promise.all([
            axios.get("https://ssitcloudbackend.azurewebsites.net/api/v1/employeeManager/employees", {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
              }
            })
          ]);
 
 
 
 
          // Setting the fetched data
          setAllEmployees(employeesResponse.data); // Save all employees for search functionality
          setSearchError(false); // Reset search error
          // Clear any previous error messages on successful data fetch
          setErrorMessage("");
 
        } catch (error) {
          // If an error occurs (e.g., 404), set an error message
          console.error('Error fetching data:', error);
          setErrorMessage("there are no reporting employees to this person");
          // Reset reporting employees in case of failure
        }
 
        setLoading((prev) => false);
 
 
      };
 
      const fetchWorkingWith = async () => {
        try {
          const token = localStorage.getItem('token')
          console.log(token)
          const [workingWithResponse] = await Promise.all([
            axios.get(`https://ssitcloudbackend.azurewebsites.net/api/v1/employeeManager/alsoWorkingWith/${employeeId}/${filterCountry}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
              }
            }),
          ]);
 
          // Setting the fetched data
          setWorkingWith(workingWithResponse.data);
 
          // Clear any previous error messages on successful data fetch
          setErrorMessage("");
 
        } catch (error) {
          // If an error occurs (e.g., 404), set an error message
          console.error('Error fetching data:', error);
          setErrorMessage("There are no reporting employees");
          setWorkingWith([]); // Reset reporting employees in case of failure
        }
      }
 
      await fetchData();
      await fetchWorkingWith();
    }
 
    fetchAllData();
 
 
  }, [employeeId, filterCountry]); // This effect runs when the employeeId changes
 
  // Handle employee change on suggestion click
  const changeEmployee = (newEmployeeId) => {
    setEmployeeId(newEmployeeId);  // Set the new employeeId to trigger data fetch
    setHighlightedId(newEmployeeId);  // Highlight the selected employee
  };
 
 
  // Handle search input changes
  const handleSearch = (event) => {
    const inputValue = event.target.value;
    setSearch(inputValue);
 
    // If search input is empty, clear suggestions
    if (inputValue === "") {
      setSearchData([]);
      setSearchError(false); // Reset search error on empty input
      return;
    }
 
    // Filter employees based on firstName and lastName
    const filteredData = allEmployees.filter((each) => {
      const fullName = `${each.firstName} ${each.lastName}`.toLowerCase(); // Concatenate first and last name
      return fullName.includes(inputValue.toLowerCase());
    });
 
    setSearchData(filteredData);
 
    // Set search error if no employees found
    if (filteredData.length === 0) {
      setSearchError(true);
    } else {
      setSearchError(false);
    }
  };
 
  // Handle suggestion click (update employeeId)
  const handleSuggestionClick = (newId) => {
    setSearch(""); // Clear the search input
    changeEmployee(newId); // Change employeeId, triggering re-fetch of data
    setSearchData([]); // Clear search suggestions
  };
 
  // Close suggestions if clicked outside of suggestions box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSearchData([]); // Close suggestions when clicked outside
      }
    };
 
    document.addEventListener("mousedown", handleClickOutside);
 
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 
  let timeId = "";
 
  const setHoverontrue = (each, event) => {
    const { top, left, width } = event.target.getBoundingClientRect();
    setHoverPosition({ top, left: left + width + 10 }); // Position the profile next to the hovered node
    setHeiglightedData(each);
    setIsHovered(true);
    clearTimeout(timeId);
  };
 
  const setHoveronfalse = () => {
 
    timeId = setTimeout(function () {
      setIsHovered(false);
      setHeiglightedData("");
    }, 3000)
  };
 
  const handleAlsoWorkWith = (newEmloyeeId) => {
    setEmployeeId(newEmloyeeId);
    setHighlightedId(newEmloyeeId);
  }
 
  return (
    <div>
      {loading ? <Loader /> : <div
        className="bg-cover bg-repeat-y bg-fixed bg-top h-screen"
 
      >
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
          <h1 className="text-4xl font-bold text-center  mb-8">Organization Chart</h1>
 
          <div className="w-screen mb-8 relative flex">
            <div className="flex flex-row justify-center">
            <div >
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees..."
                value={search}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="ml-10">
              <select
                id="country"
                name="country"
                autoComplete="country-name"
                className="px-4 py-2 border rounded-lg w-fit "
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
              >
                <option value="all">Filter By Country</option>
                <option value="all">All Employees</option>
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
                <option>India</option>
                <option>UK</option>
              </select>
            </div>
            </div>
            {searchData.length === 0 && searchError && (
              <div className=" absolute z-10 w-96 bg-white border border-gray-300 mt-20 rounded-md max-h-60  shadow-lg text-center">
                
                <p className="text-gray-600">No results found</p>
              </div>
            )}
            {searchData.length > 0 && search !== "" && !searchError && (
              <ul ref={suggestionsRef} className="absolute z-10 w-96 bg-white border border-gray-300 mt-20 rounded-md max-h-60 overflow-y-auto shadow-lg">
                {searchData.map((each) => (
                  <li
                    key={each.employeeId} // Ensure the key is unique for each suggestion
                    onClick={() => handleSuggestionClick(each.employeeId)} // Update the employeeId on click
                    className="p-3 hover:bg-blue-50 cursor-pointer transition duration-150 ease-in-out"
                  >
                    {each.firstName} {each.lastName} {/* Display full name */}
                  </li>
                ))}
              </ul>
            )}
          </div>
 
          {!searchError && (
            <div className="flex flex-col text-center items-center space-y-8">
              <div className="flex flex-row gap-5">
                <div className="w-full max-w-4xl ">
                  <div className="flex flex-col space-y-8">
                    {originData.map((each, index) => (
                      <div flex flex-row items-center>
                        <div
                          key={each.employeeId}
                          className="flex flex-col items-center"
                          onMouseEnter={(e) => setHoverontrue(each, e)}
                          onMouseLeave={setHoveronfalse}
                        >
                          <ChartNode
                            employee={each}
                            changeEmployee={changeEmployee}
                            isHighlighted={highlightedId === each.employeeId} // Highlight the selected employee
                          />
                          {index < originData.length - 1 && (
                            <div className="w-px h-8 bg-blue-400"></div> // Vertical line between nodes
                          )}
                        </div>
                      </div>
                    ))}
                    <div>
 
                      {isHovered && (
                        <div
                          className="absolute  p-6"
                          style={{ top: hoverPosition.top, left: hoverPosition.left, zIndex: 9999 }}
                        >
 
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className=" mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-lg overflow-hidden"
                          >
                            <div className="p-6">
                              <div className="flex items-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-4">
                                  {highlightedData.firstName.charAt(0).toUpperCase()}
                                  {highlightedData.lastName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h2 className="text-3xl font-bold text-gray-800">
                                    {highlightedData.firstName.charAt(0).toUpperCase() + highlightedData.firstName.slice(1).toLowerCase()} {highlightedData.lastName.charAt(0).toUpperCase() + highlightedData.lastName.slice(1).toLowerCase()}
                                  </h2>
                                  <p className="text-xl text-purple-600 font-semibold">{highlightedData.jobRole}</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center">
                                  <FaMapMarkerAlt className="text-purple-500 mr-3 text-xl" />
                                  <p className="text-gray-600 text-lg">
                                    {highlightedData.city}, {highlightedData.country}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  <FaEnvelope className="text-purple-500 mr-3 text-xl" />
                                  <p className="text-gray-600 text-lg">{highlightedData.corporateEmail}</p>
                                  <CopyToClipboard text={highlightedData.corporateEmail}>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="ml-3 p-2 rounded-full bg-purple-200 hover:bg-purple-300 transition-colors duration-200"
                                    >
                                      <FaCopy className="text-purple-600" />
                                    </motion.button>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-center">
            <div className="flex flex-col md:flex-row w-full max-w-6xl space-y-8 md:space-y-0 md:space-x-8">
 
              {reportingEmployees.length > 0 ? (
                <div className="flex-1  bg-white rounded-lg shadow-lg p-6 items-center ">
                  <h2 className="text-2xl font-semibold text-blue-800 mb-4">Reporting Employees</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
 
                    {reportingEmployees.map((each) => (
                      <ChartNode
                        key={each.employeeId} // Ensure the key is unique for reporting employees
                        employee={{
                          ...each,
                          firstName: each.firstName.charAt(0).toUpperCase() + each.firstName.slice(1).toLowerCase(),
                          lastName: each.lastName.charAt(0).toUpperCase() + each.lastName.slice(1).toLowerCase(),
                        }}
                        changeEmployee={changeEmployee}
                        isHighlighted={highlightedId === each.employeeId} // Highlight reporting employees
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-blue-800 mb-4">Reporting Employees</h2>
                  <p className="text-red-600 font-semibold">{errorMessage || filterCountry==="all" ?  "This employee has no direct reports.": `This employee has no direct reports in ${filterCountry}.`}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex justify-center mt-10 ">
            <div className="shadow-lg rounded-lg bg-white flex flex-col p-10 w-4/5  ">
              <div>
                <h1 className="text-2xl font-semibold text-blue-800">Also works with</h1>
              </div>
              <div className="grid grid-cols-4 gap-4 pt-3 w-auto">
                {workingWith.map((each) => (
                  <div onClick={() => handleAlsoWorkWith(each.employeeId)} key={each.employeeId} className="bg-white p-3 rounded-lg shadow-md hover:bg-blue-50 cursor-pointer">
                    <p className=" font-semibold text-blue-800"  >{each.firstName.charAt(0).toUpperCase() + each.firstName.slice(1).toLowerCase()} {each.lastName.charAt(0).toUpperCase() + each.lastName.slice(1).toLowerCase()}</p>
                    <p className="text-xl opacity-75 text-blue-800">{each.workingCountry}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
 
        </div>
 
 
      </div>}
    </div>
  )
}