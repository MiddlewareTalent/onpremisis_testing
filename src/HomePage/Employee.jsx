import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    PlusIcon,
    UsersIcon,
    PencilIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/20/solid';
import ModalWrapper from '../EmployeeComponents/ModalWrapper';
import MultiStepForm from '../EmployeeComponents/MultiStepForm';
import Loader from "../Assets/Loader";
import UpdateEmployeeModal from './EmployeeUpdate/UpdateEmployeeModal';
import ChangePass from '../HomePage/ChangePass'


export default function Employee() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(7);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  // Delete modal state
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [selfDelete, setSelfDelete] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateEmployeeId, setUpdateEmployeeId] = useState(null);
    const [resetPasswordEmployeeId, setResetPasswordEmployeeId] = useState();
    const [isReset, setIsReset] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCountry, setFilterCountry]=useState("");


    useEffect(() => {
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');

        const fetchEmployees = async () => {
            const token = localStorage.getItem('token');
            setIsUpdateModalOpen(false)
            setLoading(true);
            let url='https://msquirebackend.azurewebsites.net/api/v1/employeeManager/employees';
            if (filterCountry!==""){
                url=`https://msquirebackend.azurewebsites.net/api/v1/employeeManager/getEmployeesByWorkingCountry/${filterCountry}`;
            }
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response.data);
                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }
                const data = await response.json();
                console.log(data);
                setCurrentPage(1);
                setEmployees(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                setIsUpdateModalOpen(false)
            }
        };

        if (!email || !role) {
            window.location.reload(); // Reload the entire application

            navigate('/login');
        } else {
            fetchEmployees();
        }
    }, [navigate, filterCountry]);

    let filteredEmployees = [];
    if (employees.length > 0) {
        filteredEmployees = employees.filter(employee =>
            employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by first name or last name
        );
    }




    const fetchEmployees = async () => {
        const token = localStorage.getItem('token');
        setIsUpdateModalOpen(false)
        setLoading(true);
        let url='https://msquirebackend.azurewebsites.net/api/v1/employeeManager/employees';
        if (filterCountry!==""){
            url=`https://msquirebackend.azurewebsites.net/api/v1/employeeManager/getEmployeesByWorkingCountry/${filterCountry}`;
        }
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            const data = await response.json();
            console.log(data);
            setEmployees(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setIsUpdateModalOpen(false)
        }
    };

    const updateEmployeeDetails = (id) => {
        setUpdateEmployeeId(id);
        setIsUpdateModalOpen(true)
    }

    const resetPassFun = (id) => {
        setResetPasswordEmployeeId(id);
        console.log(resetPasswordEmployeeId);
        setIsReset(true);
    }
    const closeResetPass = () => {
        setIsReset(false);
    }

    const handleDeleteEmployee = async (employeeId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token is missing. Cannot delete employee.");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`https://msquirebackend.azurewebsites.net/api/v1/employeeManager/employees/${employeeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchEmployees();
                setIsDeleteModalOpen(false);  // Close delete confirmation modal

            } else {
                const errorData = await response.json();
                console.error("Failed to delete employee:", errorData);
            }
        } catch (error) {
            console.error("Error while deleting employee:", error.message);
        }
    };

    const handleEmployeeAdded = () => {
        fetchEmployees();
        setIsModalOpen(false);
    };

    const handleDeleteModalOpen = (employee) => {
        if (employee.employeeId === localStorage.getItem("employeeId")) {
            setSelfDelete(true);
        }
        else {
            setEmployeeToDelete(employee);
            setIsDeleteModalOpen(true);
        }  // Open delete confirmation modal
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
    };

    const handleLoadings = () => {
        setLoading((prevData) => !prevData);
    }

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const totalEmployees = employees.length;

    console.log(filterCountry);


    // Pagination logic
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gray-100 w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Employee Dashboard</h1>

                <ChangePass isOpen={isReset} id={resetPasswordEmployeeId} onClose={closeResetPass} />

                {/* Metrics Section */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <UsersIcon className="h-9 w-9 text-blue-400" aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-lg font-bold text-gray-500 truncate">Total Employees</dt>
                                        <dd className="text-xl font-medium text-gray-900">{totalEmployees}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    placeholder="Search by name"
                                    className="mt-4 px-4 py-2 border rounded-lg w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}  // Update search term
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                            <select
                                    id="country"
                                    name="country"
                                    autoComplete="country-name"
                                    className="mt-4 px-4 py-2 border rounded-lg w-full"
                                    value={filterCountry}
                                    onChange={(e)=>setFilterCountry(e.target.value)}
                                >
                                    <option value="">Filter By Country</option>
                                    <option value="">All Employees</option>
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                    <option>India</option>
                                    <option>UK</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Employee List Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h2 className="text-xl leading-6 font-bold text-gray-900">Employee List</h2>
                        {/*here*/}


                        {/*here*/}

                        <button
                            onClick={handleOpenModal}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            Add Employee
                        </button>
                    </div>
                    {loading ? (
                        <div className="text-center py-4">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col"
                                                className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name
                                            </th>
                                            <th scope="col"
                                                className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Corporate
                                                Email
                                            </th>
                                            <th scope="col"
                                                className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Job Role</th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Reset Password</span>
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Delete</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentEmployees.map((employee) => (
                                            <tr key={`${employee.corporateEmail}-${employee.firstName}`}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">

                                                        <div className="ml-4">
                                                            <button
                                                                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                                                                onClick={() => navigate(`/employeedetails/${employee.id}/${employee.employeeId}`)}
                                                            >
                                                                {employee.firstName} {employee.lastName}
                                                            </button>
                                                            <div className="text-sm text-gray-500">{employee.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-lg text-gray-900">{employee.corporateEmail}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">{employee.role}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">{employee.jobRole}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => resetPassFun(employee.employeeId)}
                                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                                        aria-label="Edit employee"
                                                    >
                                                        Reset Password
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => updateEmployeeDetails(employee.employeeId)}
                                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                                        aria-label="Edit employee"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                                                    <button
                                                        onClick={() => handleDeleteModalOpen(employee)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
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
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{indexOfFirstEmployee + 1}</span> to <span className="font-medium">{Math.min(indexOfLastEmployee, totalEmployees)}</span> of <span className="font-medium">{totalEmployees}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
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
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${index + 1 === currentPage
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
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
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Add Employee Modal */}
            <ModalWrapper open={isModalOpen} onClose={handleCloseModal}>
                <MultiStepForm onSubmit={handleEmployeeAdded} handleLoadings={handleLoadings} onCancel={handleCloseModal} />
            </ModalWrapper>


            {/* <ModalWrapper open={selfDelete} onClose={handleCloseModal}>
                <AccountDeletionModal/>
            </ModalWrapper> */}

            {isDeleteModalOpen && (
                <ModalWrapper open={isDeleteModalOpen} onClose={handleDeleteModalClose}>
                    <div className="p-4 text-center">
                        <h2 className="text-xl font-bold mb-4">Are you sure you want to delete {employeeToDelete?.firstName} {employeeToDelete?.lastName}?</h2>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => handleDeleteEmployee(employeeToDelete.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={handleDeleteModalClose}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </ModalWrapper>
            )}


            {selfDelete && (
                <ModalWrapper open={selfDelete} onClose={handleDeleteModalClose}>
                    <div className="p-4 text-center flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-semibold mb-4 text-red-600">Account Deletion</h2> {/* Increased font size */}
                        <p className="text-lg text-gray-500 mb-6"> {/* Adjusted margin */}
                            You can't delete your own account. Contact "Raja" to deactivate your account.
                        </p>
                        <p className="text-lg text-gray-500 mb-6"> {/* Adjusted margin */}
                            Please reach out to:{" "}
                            <a
                                href="mailto:raja@middlewaretalents.com"
                                className="font-medium text-blue-600 hover:underline"
                            >
                                rajahk@middlewaretalents.com
                            </a>
                        </p>
                        <button
                            type="button"
                            onClick={() => setSelfDelete(false)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded float-right"
                        >
                            Close
                        </button>
                    </div>
                </ModalWrapper>

            )}

            {updateEmployeeId && (
                <UpdateEmployeeModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => fetchEmployees()}
                    employeeId={updateEmployeeId}
                />
            )}
        </div>
    );
}
