import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog, Popover, Transition, Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import MTLogo from "../Assets/MTlogo.svg";
import axios from "axios";
import Loader from "../Assets/Loader";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState(null);

  const navigate = useNavigate();

  const [initials, setInitials] = useState("");
  
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading]=useState(true);
   const employeeId=localStorage.getItem("employeeId");
  

  useEffect(() => {
    // Retrieve the user role from localStorage
    const storedRole = localStorage.getItem("role");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    if (firstName && lastName) {
      setInitials(
        firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
      );
    }

    setRole(storedRole);
  }, []);

  

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true)
        const token= localStorage.getItem('token');
        try {
            
            console.log(token);
            console.log("upto");
            const response = await axios.get(`https://msquirebackend.azurewebsites.net/api/v1/employeeManager/getEmployee/${employeeId}`,{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type':'application/json'
                }
            });
            console.log("employee", response);
            console.log(response.status);
            setEmployee(response.data);
            setLoading(false);
           
        } catch (error) {
            console.error("Error fetching employee data:", error.response.status);
            if(error.response.status===401){
              localStorage.removeItem("employeeId");
              localStorage.removeItem("email");
              localStorage.removeItem("role");
              localStorage.removeItem("firstName");
              localStorage.removeItem("lastName");
              localStorage.removeItem("token");
              navigate("/login")

            }
            setLoading(false);
        }
      };
      fetchEmployee();
  }, [employeeId, navigate]);


  const handleSignOut = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("employeeId");
    localStorage.clear();

    navigate("/login");
    window.location.reload();
  };

  const handleChange = () => {
    navigate("/ChangePassword");
  };

  const adminNavItems = [
    
    { name: "Tasks", href: "/tasks", access:"task" },
    { name: "Organization Chart", href: "/OrgChart", access:"organizationChart" },
    { name: "Timesheet", href: "/TimesheetManage", access:"timeSheet" },
    { name: "Leave Management", href: "/LeaveManagement", access:"leaveManagement"},
  ];

  const managerNavItems = [
    
    { name: "Tasks", href: "/tasks", access:"task" },
    { name: "Organization Chart", href: "/OrgChart", access:"organizationChart"},
    { name: "Timesheet", href: "/TimesheetManage", access:"timeSheet" },
    { name: "Leave Management", href: "/LeaveManagement", access:"leaveManagement" },
  ];

  const employeeNavItems = [
    { name: "Tasks", href: "/tasks", access:"task"},
    { name: "Organization Chart", href: "/OrgChart", access:"organizationChart"},
    { name: "Timesheet", href: "/TimesheetManage", access:"timeSheet"},
    { name: "Leave Management", href: "/LeaveManagement", access:"leaveManagement"},
  ];

  // Show admin nav items if role is 'admin', else show employee nav items
  
  let navItems = [];

if (role === "admin" || role === "Admin") {
  navItems = adminNavItems;
} else if (role === "employee") {
  navItems = employeeNavItems;
} else if (role === "manager") {
  navItems = managerNavItems;
} else {
  // Handle unexpected role case (maybe log or throw an error)
  console.error("Unknown role:", role);
}



  return (
    <div>
      {loading? <Loader/>:<header className="bg-white">
      <nav
        className="flex items-center justify-between p-6 lg:px-8 flex-shrink-0"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/dashboard" className="-m-1.5 p-1.5">
            <span className="sr-only">Middleware</span>
            <img className="h-20 w-auto" src={MTLogo} alt="Middleware" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
        <Link
              key="Dashboard"
              to="/dashboard"
              className="text-2xl font-semibold leading-6 text-gray-900"
            >
              Dashboard
            </Link>
            {employee.role!=="manager" && employee.role!=="employee" && <Link
              key="Employees"
              to="/employee"
              className="text-2xl font-semibold leading-6 text-gray-900"
            >
              Employees
            </Link>}
            {employee.role!=="employee" && <Link
              key="My Team"
              to="/MyTeam"
              className="text-2xl font-semibold leading-6 text-gray-900"
            >
              My Team
            </Link>}
          {navItems.length!==0 && navItems.map((item) => (
            employee[item.access] && <Link
              key={item.name}
              to={item.href}
              className="text-2xl font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </Link>
          ))}
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
          {/* <button
                        type="button"
                        className="relative rounded-full bg-white-800 p-1 text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-8 w-8" aria-hidden="true" />
                    </button> */}

          {/* Profile dropdown */}
          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button className="relative flex rounded-ful text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                {/* <img
                                    className="h-12 w-12 rounded-full"
                                    src=""
                                    alt=""
                                /> */}
                {/* <Bars3Icon className="h-9 w-9 " aria-hidden="true" /> */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
                  {initials}
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {/* <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            to="/profile"
                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-2xl text-gray-500')}
                                        >
                                            Your Profile
                                        </Link>
                                    )}
                                </Menu.Item> */}
                {/* <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            to="/settings"
                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-2xl text-gray-500')}
                                        >
                                            Settings
                                        </Link>
                                    )}
                                </Menu.Item> */}
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/ProfileCard"
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block w-full text-left px-4 py-2 text-2xl text-gray-500"
                      )}
                    >
                      Profile Card
                    </Link>
                  )}
                </Menu.Item>
                
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleChange}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block w-full text-left px-4 py-2 text-2xl text-gray-500"
                      )}
                    >
                      Change Password
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleSignOut}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block w-full text-left px-4 py-2 text-2xl text-gray-500"
                      )}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="-m-1.5 p-1.5">
              <span className="sr-only">Middleware</span>
              <img
                className="h-8 w-auto"
                src={MTLogo}
                alt="Middleware"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
              <Link
              key="Dashboard"
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            {employee.role!=="manager" && employee.role!=="employee" && <Link
              key="Employees"
              to="/employee"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Employees
            </Link>}
            {employee.role!=="employee" && <Link
              key="My Team"
              to="/MyTeam"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              My Team
            </Link>}
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  to="/ProfileCard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Profile Card
                </Link>
              </div>
              <div className="py-6">
                <Link
                  onClick={handleChange}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Change Password
                </Link>
              </div>
              <div className="py-6">
                <Link
                  onClick={handleSignOut}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  // onClick={() => setMobileMenuOpen(false)}
                >
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>}
    </div>
  );
}