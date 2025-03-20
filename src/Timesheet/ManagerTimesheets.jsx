import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Loader from "./loader.js";
import Calendar from "react-calendar";
import { jsPDF } from "jspdf";
import { MdOutlineFileDownload } from 'react-icons/md';
import 'react-calendar/dist/Calendar.css';
import {ChevronLeftIcon,ChevronRightIcon} from '@heroicons/react/20/solid';
import "jspdf-autotable";
 
const ManagerTimesheets = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDownloadEnabled, setIsDownloadEnabled] = useState(false);
  const [rejectEmployeeId,setRejectEmployeeId]=useState();
 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);  // Set the number of items per page
 
  // const managerId = "";
  const employeeId = localStorage.getItem('employeeId');
  const token=localStorage.getItem("token");
 
  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    if (!employeeId) return;
 
    try {
      let url = `https://msquirebackend.azurewebsites.net/api/timesheets/list/manager/${employeeId}`;
       
      if (startDate && endDate) {
        url = `https://msquirebackend.azurewebsites.net/api/timesheets/totalList/startDate/${startDate}/endDate/${endDate}`;
      }
 
      const response = await axios.get(url, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = response.data.reverse();
      console.log(data);
      setSubmissions(data);
      setFilteredSubmissions(data);
      setCounts({
        total: data.length,
        pending: data.filter((sub) => sub.status === "PENDING").length,
        approved: data.filter((sub) => sub.status === "APPROVED").length,
        rejected: data.filter((sub) => sub.status === "REJECTED").length,
      });
    } catch (error) {
      console.log("Error:", error);
    }finally{
      setLoading(false);
    }
  }, [startDate, endDate, employeeId, token]);
 
  useEffect(() => {
    if (employeeId) {
      fetchSubmissions();
      const interval = setInterval(fetchSubmissions, 5000000);
      return () => clearInterval(interval);
    }
  }, [fetchSubmissions, employeeId]);
 
  const handleFilter = (status) => {
    if (status === "ALL") {
      setFilteredSubmissions(submissions);
    } else {
      setFilteredSubmissions(submissions.filter((sub) => sub.status === status));
    }
    setCurrentPage(1);  // Reset to the first page when filter changes
  };
 
  const handleShow = (id, rejectEmp) => { setCurrentId(id); setComments(""); setShowModal(true); setRejectEmployeeId(rejectEmp)};
  const handleClose = () => setShowModal(false);
 
  const handleApprove = async (id,aproveEmployeeId) => {
    setLoading(true);
    console.log(token); // Make sure the token is valid here
    try {
      await axios.put(`https://msquirebackend.azurewebsites.net/api/timesheets/Approve/${id}/status/APPROVED`, null, {
        headers: {
          "Authorization": `Bearer ${token}`,  // Ensure token is valid
        },
        // Ensure credentials (cookies) are sent
      });
      fetchSubmissions(); // Refresh the submissions after the approve request is successful
    } catch (error) {
      console.error("Error approving timesheet:", error);
    } finally {
      setLoading(false);
    }
    try{
      console.log(submissions.employeeId);
      await axios.post("https://msquirebackend.azurewebsites.net/apis/employees/notifications",{
        "notificationType":"TimesheetManage",
        "notification":"Your Timesheet has been Approved, tap to see details",
        "notificationTo":aproveEmployeeId,
        "isRead":false
      }
      , {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
    }catch (error) {
      console.error("Error approving timesheet:", error);
    } finally {
      setLoading(false);
    }
  };
 
 
  const handleReject = async () => {
    setLoading(true);
    console.log(rejectEmployeeId);
    try {
      await axios.put(`https://msquirebackend.azurewebsites.net/api/timesheets/reject/${currentId}/status/REJECTED/comments/${comments}`, null, {
        headers: {
          "Authorization": `Bearer ${token}`,  // Ensure the token is valid
        } // Ensure credentials (cookies) are sent
      });
      fetchSubmissions(); // Refresh the submissions after rejecting the timesheet
      handleClose(); // Close any modal or dialog if needed
    } catch (error) {
      console.error("Error rejecting timesheet:", error);
    } finally {
      setLoading(false);
    }
    try{
      await axios.post("https://msquirebackend.azurewebsites.net/apis/employees/notifications",{
        "notificationType":"TimesheetManage",
        "notification":"Your Timesheet has been Rejected, tap to see details",
        "notificationTo":rejectEmployeeId,
        "isRead":false
      }
      , {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
    }catch (error) {
      console.error("Error rejecting timesheet:", error);
    } finally {
      setLoading(false);
    }
  };
 
 
  const downloadTimesheets = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
 
    doc.text("Timesheets", 20, 20);
 
    const columns = [
      { title: "Client", dataKey: "clientName" },
      { title: "Project", dataKey: "projectName" },
      { title: "Date Range", dataKey: "dateRange" },
      { title: "Total Hours", dataKey: "totalNumberOfHours" },
      { title: "Status", dataKey: "status" },
    ];
 
    const rows = filteredSubmissions.map(submission => ({
      clientName: submission.clientName,
      projectName: submission.projectName,
      dateRange: `${submission.startDate} - ${submission.endDate}`,
      totalNumberOfHours: submission.totalNumberOfHours,
      status: submission.status,
    }));
 
    doc.autoTable({
      head: [columns.map(col => col.title)],
      body: rows.map(row => [
        row.clientName,
        row.projectName,
        row.dateRange,
        row.totalNumberOfHours,
        row.status,
      ]),
      startY: 30,
      theme: "grid",
      margin: { top: 10, left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: "auto", halign: "left" },
        1: { cellWidth: "auto", halign: "left" },
      },
    });
 
    doc.save("Timesheets.pdf");
  };
 
  const downloadTimesheet = (submission) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
 
    doc.text(`Timesheet for ${submission.clientName}`, 20, 20);
 
    const tableData = [
      ["Project", submission.projectName],
      ["Date Range", `${submission.startDate} - ${submission.endDate}`],
      ["Total Hours", submission.totalNumberOfHours],
      ["Status", submission.status],
    ];
 
    doc.autoTable({
      startY: 30,
      head: [["Field", "Value"]],
      body: tableData,
      theme: "grid",
      margin: { top: 10, left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: "auto", halign: "left" },
        1: { cellWidth: "auto", halign: "left" },
      },
    });
 
    doc.save(`Timesheet_${submission.clientName}_${submission.projectName}.pdf`);
  };
 
  const handleApplyDateRange = () => {
    if (startDate && endDate) { // Only apply the date range if both dates are provided
      setIsDownloadEnabled(true);
      setCurrentPage(1); // Reset to the first page
    } else {
      alert("Please select both start and end dates.");
    }
  };

  // Show All Button Logic
  const handleShowAll = () => {
    setStartDate("");
    setEndDate("");
    setFilteredSubmissions(submissions); // Show all submissions
    setCounts({
      total: submissions.length,
      pending: submissions.filter((sub) => sub.status === "PENDING").length,
      approved: submissions.filter((sub) => sub.status === "APPROVED").length,
      rejected: submissions.filter((sub) => sub.status === "REJECTED").length,
    });
    setIsDownloadEnabled(false); // Disable download if no date range is applied
    setCurrentPage(1); // Reset pagination to first page
  };
 
  // Pagination logic
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredSubmissions.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
 
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
 
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
 
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      {loading && <Loader />}
      <div className="max-w-full mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-bold text-gray-900">Recieved Timesheets</h2>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                {showCalendar ? "Hide Calendar" : "Show Calendar"}
              </button>
            </div>
 
            {showCalendar && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-4 text-center">
                  <Calendar onChange={setDate} value={date} className="rounded-lg shadow-md" />
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="mt-4 w-40 bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-5xl">
              {["TOTAL REQUESTS", "APPROVED", "PENDING", "REJECTED"].map((status) => (
                <div
                  key={status}
                  onClick={() => handleFilter(status === "TOTAL REQUESTS" ? "ALL" : status)}
                  className={`p-4 rounded-lg text-2xl text-center shadow-md cursor-pointer transition duration-300 ease-in-out ${
                    status === "TOTAL REQUESTS"
                      ? "bg-blue-100 hover:bg-blue-200"
                      : status === "APPROVED"
                      ? "bg-gray-100 hover:bg-gray-200"
                      : status === "PENDING"
                      ? "bg-gray-200 hover:bg-gray-300"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  <h3 className="font-semibold text-gray-800">{capitalizeFirstLetter(status)}</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {status === "TOTAL REQUESTS" ? counts.total : counts[status.toLowerCase()]}
                  </p>
                </div>
              ))}
            </div>
 
            <div className="mb-10">
              <label className="block text-lg font-medium text-gray-700">Filter by Date Range</label>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleApplyDateRange}
                  className={`bg-blue-500 text-white py-2 px-4 rounded-md ${!startDate || !endDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!startDate || !endDate}
                >
                  Download
                </button>
                <button
                  onClick={handleShowAll}
                  className="bg-gray-400 text-white py-2 px-4 rounded-md ml-4 hover:bg-gray-500"
                >
                  Show All
                </button>
              </div>
            </div>
 
            {currentEmployees.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Start Date", "End Date", "Employee Name", "Client Name", "Project Name", "Total Hours", "Status", "Actions"].map((col) => (
                        <th
                          key={col}
                          className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentEmployees.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-900">{submission.startDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-900">{submission.endDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-900">{submission.employeeName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-900">{submission.clientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-900">{submission.projectName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-900">{submission.totalNumberOfHours}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-lg leading-5 font-semibold rounded-full ${
                              submission.status === "APPROVED"
                                ? " text-green-500"
                                : submission.status === "REJECTED"
                                ? " text-red-500"
                                : " text-blue-600"
                            }`}
                          >
                            {submission.status}
                          </span>
                        </td>
                        <td className="flex px-6 py-4 gap-4 whitespace-nowrap text-lg font-medium">
                          {submission.status !== "APPROVED" && submission.status !== "REJECTED" && (
                            <>
                              <button
                                onClick={() => handleApprove(submission.id, submission.employeeId)}
                                className="text-green-600 hover:text-green-600 text-xl border border-green-500 px-1 py-1 rounded-lg hover:bg-green-100"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleShow(submission.id,submission.employeeId)}
                                className="text-red-600 hover:text-red-600 text-xl border border-red-500 px-1 py-1 rounded-lg hover:bg-red-100"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => downloadTimesheet(submission)}
                            className="text-grey hover:text-green-900 text-3xl"
                          >
                            <MdOutlineFileDownload />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-lg text-gray-600 mt-4">No submissions found.</div>
            )}
 
            {isDownloadEnabled && (
              <button
                onClick={downloadTimesheets}
                className={`bg-blue-500 text-white py-2 px-4 rounded-md mt-4 ${currentEmployees.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentEmployees.length === 0}
              >
                Download All Timesheets
              </button>
            )}
 
            {/* Pagination */}
            {/* <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstEmployee + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastEmployee, filteredSubmissions.length)}
                    </span>{" "}
                    of <span className="font-medium">{counts.total}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          index + 1 === currentPage
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div> */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
  <div className="flex-1 flex justify-between sm:hidden">
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
    >
      Previous
    </button>
    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
    >
      Next
    </button>
  </div>

  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
    <div>
      <p className="text-lg text-gray-700">
        Showing{" "}
        <span className="font-medium">{indexOfFirstEmployee + 1}</span> to{" "}
        <span className="font-medium">
          {Math.min(indexOfLastEmployee, filteredSubmissions.length)}
        </span>{" "}
        of <span className="font-medium">{counts.total}</span> results
      </p>
    </div>
    
    <div>
      <nav
        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        {/* Previous button */}
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Page Numbers */}
        {[...Array(5)].map((_, index) => {
          const pageNumber = Math.floor((currentPage - 1) / 5) * 5 + (index + 1);
          if (pageNumber <= totalPages) {
            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  pageNumber === currentPage
                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            );
          }
          return null;
        })}

        {/* Next button */}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  </div>
</div>
          </div>
        </div>
      </div>
 
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Reject Timesheet</h2>
            <textarea
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter rejection reason..."
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleClose}
                className="bg-gray-200 text-2xl text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 text-2xl text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
                disabled={loading}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default ManagerTimesheets;