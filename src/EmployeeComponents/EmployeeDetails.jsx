
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    UserCircleIcon,
    EnvelopeIcon,
    UserGroupIcon,
    BriefcaseIcon,
    MapPinIcon,
    PaperClipIcon,
    ShieldCheckIcon,
    ClockIcon,
    BuildingOfficeIcon,
    IdentificationIcon,
    GlobeAmericasIcon,
    CreditCardIcon
} from "@heroicons/react/20/solid";

import axios from "axios";
import Loader from "../Assets/Loader";
import EmpContacts from "./EmpContacts";


 
const Badge = ({ children, variant, className }) => (
    <span className={`inline-flex items-center rounded-full px-3 py-2 text-xs font-medium ${variant === 'outline' ? 'border' : 'bg-gray-100'} ${className}`}>
        {children}
    </span>
);
 
const Button = ({ children, variant, size, ...props }) => (
    <button
        className={`rounded-md font-medium ${variant === 'outline' ? 'border border-gray-300' : 'bg-blue-500 text-white'} ${size === 'sm' ? 'px-2 py-1 text-base' : 'px-4 py-2 text-lg'}`}
        {...props}
    >
        {children}
    </button>
);
 
const ScrollArea = ({ children, className }) => <div className={`overflow-auto ${className}`}>{children}</div>;
const Separator = () => <hr className="my-4" />;
 
export default function EmployeeDetails() {
    const { id,employeeId } = useParams();
    const [employee, setEmployee] = useState(null);
    const [contacts, setContacts]=useState([]);
    
 
    useEffect(() => {
        const fetchEmployee = async () => {
            const token= localStorage.getItem('token');
            try {
                
                console.log(token);
                console.log("upto");
                const response = await axios.get(`https://mtlbackendapp.azurewebsites.net/api/v1/employeeManager/employees/${id}`,{
                    method:'GET',
                    headers:{
                        'Authorization':`Bearer ${token}`,
                        'Content-Type':'application/json'
                    }
                });
                console.log(response.data);
                console.log(response.status);
                setEmployee(response.data);
               
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
            try {
                const response = await axios.get(`https://mtlbackendapp.azurewebsites.net/apis/employees/contacts/contactsBy/${employeeId}`,{
                  headers: {
                    "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
                  }
                });
                
                setContacts(response.data);
                
              } catch (error) {
                
                console.error('Error fetching data:', error);
              }
        };
        fetchEmployee();
    }, [id,employeeId]);
 
    if (!employee) {
        return <div className="flex justify-center items-center h-screen"><Loader /></div>;
    }
 
    // Attachments mapping
    const attachments = [
        { label: "Identity Card", file: employee.identityCard },
        { label: "Visa", file: employee.visa },
        { label: "Other Documents", file: employee.otherDocuments },
    ];
 
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm w-full">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-4xl font-semibold text-gray-900">Employee Information</h1>
                    <Badge variant="outline" className="text-lg px-5 py-3">
                        <ShieldCheckIcon className="w-10 h-10 mr-2 text-green-600" />
                        <span className="font-bold">{employee.role || "N/A"}</span>
                    </Badge>
                </div>
            </header>
            <ScrollArea className="flex-grow">
                <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <InfoItem icon={<UserCircleIcon />} label="Full name" value={`${employee.firstName || 'N/A'} ${employee.lastName || ''}`} />
                                <InfoItem icon={<BuildingOfficeIcon />} label="Company Name" value={employee.companyName || "N/A"} highlight={true} />
                                <InfoItem icon={<IdentificationIcon />} label="Employee ID" value={employee.employeeId || "N/A"} />
                                <InfoItem icon={<EnvelopeIcon />} label="Personal Email" value={employee.email || "N/A"} />
                                <InfoItem icon={<EnvelopeIcon />} label="Corporate Email" value={employee.corporateEmail || "N/A"} />
                                <InfoItem icon={<UserGroupIcon />} label="Reporting to" value={employee.reportingTo || "N/A"} />
                                <InfoItem icon={<UserGroupIcon />} label="Reporting to" value={employee.employeeId || "N/A"} />

                                <InfoItem icon={<BriefcaseIcon />} label="Job role" value={employee.jobRole || "N/A"} />
                                <InfoItem
                                    icon={<ClockIcon />}
                                    label="Employee Status"
                                    value={
                                        <Badge variant="secondary" className="text-lg px-3 py-1">
                                            {employee.employmentStatus || "N/A"}
                                        </Badge>
                                    }
                                />
                                <InfoItem icon={<GlobeAmericasIcon />} label="Working Country" value={employee.workingCountry || "N/A"} />
                                <InfoItem icon={<CreditCardIcon />} label="National Id Number" value={employee.nationalInsuranceNumber || "N/A"} />
                            </div>
                            <Separator />
                            <div>
                                <InfoItem icon={<MapPinIcon />} label="Address" value={`${employee.streetAddress || ''}, ${employee.city || ''}, ${employee.region || ''} - ${employee.postalCode || ''}`} fullWidth />
                            </div>
                            <Separator />
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Attachments</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {attachments.map((attachment, idx) => (
                                        attachment.file ? (
                                            <AttachmentItem
                                                key={idx}
                                                filename={attachment.label}
                                                filesize={getFileSize(attachment.file)}
                                                fileUrl={attachment.file}
                                                icon={<PaperClipIcon className="h-6 w-6 text-gray-400" />}
                                            />
                                        ) : null
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Emergency Contact</h2>
                                {contacts.length===0 ? <p>No Emergency Contact</p>: <EmpContacts employeeId={employeeId}/>}
                            </div>
                                
                            </div>
                        </div>
                    </div>
                </main>
            </ScrollArea>
        </div>
    );
}
 
function InfoItem({ icon, label, value, fullWidth = false, highlight = false }) {
    return (
        <div className={`flex items-start space-x-4 ${fullWidth ? 'col-span-full' : ''} ${highlight ? 'bg-blue-50 p-4 rounded-md' : ''}`}>
            <div className="flex-shrink-0 mt-1">
                {React.cloneElement(icon, { className: `h-10 w-10 ${highlight ? 'text-blue-500' : 'text-gray-400'}` })}
            </div>
            <div className="flex-grow">
                <p className={`text-xl font-medium ${highlight ? 'text-blue-600' : 'text-gray-500'}`}>{label}</p>
                <div className={`mt-1 text-xl ${highlight ? 'text-blue-700 font-semibold' : 'text-gray-900'}`}>{value}</div>
            </div>
        </div>
    );
}
 
function AttachmentItem({ filename, filesize, icon, fileUrl }) {
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", filename); // Set download filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
 
    return (
        <li className="flex items-center justify-between py-4 pl-3 pr-4 text-lg bg-gray-50 rounded-md">
            <div className="flex items-center">
                {icon}
                <span className="ml-3 truncate">{filename}</span>
            </div>
            <div className="ml-4 flex items-center space-x-4">
                <span className="text-gray-500">{filesize}</span>
                <Button variant="outline" size="lg" onClick={handleDownload}>
                    Download
                </Button>
            </div>
        </li>
    );
}
 
function getFileSize(fileUrl) {
    return "1.2 MB";
}
 

