import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const ContactsDetails = () => {
    const [formData, setFormData] = useState({
        contactCreatedEmployee: localStorage.getItem("email"),
        employeeId:'',
        personName: '',
        relation: '',
        countryCode: '',
        personMobile: '',
        personEmail: '',
        company: '',
        country: '',
        state: '',
        address: '',
        pincode: '',
        bankName: '',
        bankCode: '',
        accountNumber: '',
        accountName: '',
        otherAccountInformation: '',
        bankAddress: ''
    });

    const [isLoading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const isDisable = true;
    const token=localStorage.getItem("token");
    const employeeId=localStorage.getItem("employeeId");

    let { contactId } = useParams();

    const path = `/UpdateContacts/${contactId}`;
    const navigate = useNavigate();
    console.log(contactId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://msquirebackend.azurewebsites.net/apis/employees/contacts/contacts/${contactId}`,{
                    headers: {
                      "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
                    }
                  });
                console.log(response.data);
                setFormData(response.data);
                setLoading(true);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [contactId, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const deleteContact = async () => {
        await axios.delete(`https://msquirebackend.azurewebsites.net/apis/employees/contacts/contacts/${contactId}`,{
            headers: {
              "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
            }
          });
        navigate('/ProfileCard');
    }

    const customStyles = {
        content: {
            width: '40vw',
            height: '20vh',
            margin: 'auto',
            top: '20%',
            left: '30%',
            transform: 'translate(-50%, -50%)',
        },
    };

    const modalChange = () => {
        setIsOpen(!isOpen);
    }

    const details = () => {
        return (
            <div className="relative">
                {/* Back Button */}
                <div className="absolute top-4 left-4">
                    <button
                        onClick={() => navigate('/ProfileCard')} // This will navigate back to the previous page
                        className="px-4 py-2 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-700"
                    >
                        Back
                    </button>
                </div>

                {/* Modal */}
                <Modal isOpen={isOpen} style={customStyles}>
                    <div className="flex flex-col justify-center items-center">
                        <h1>Do you want to delete "{formData.personName}" contact details?</h1>
                        <div className='mt-8'>
                            <button
                                type="button"
                                onClick={deleteContact}
                                className="ml-5 px-6 py-3 bg-red-500 text-white text-lg font-semibold rounded-md hover:bg-red-700"
                            >Yes
                            </button>
                            <button
                                type="button"
                                onClick={modalChange}
                                className="ml-5 px-6 py-3 bg-white-500 border-current border text-black text-lg font-semibold rounded-md hover:bg-white-700 border-solid"
                            >No
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Form */}
                <div className="flex justify-center items-center min-h-screen">
                    <form  className="w-full max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md h-full">
                            <h2 className="text-3xl font-bold mb-6">Person Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Person Name:</label>
                                    <input type="text" disabled={isDisable} name="personName" value={formData.personName} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Relation:</label>
                                    <input type="text" disabled={isDisable} name="personName" value={formData.relation} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">Mobile <span className='text-red-600'>*</span></label>
                              <div className="flex">
                              <input type="text" disabled={isDisable} name="personName" value={formData.countryCode} onChange={handleChange}
                                        className="mt-1 p-3 block w-1/4 shadow-sm text-lg border border-gray-300 rounded-md" />

                                <input disabled={isDisable} type="text" name="personMobile" value={formData.personMobile} onChange={handleChange}
                                            className="mt-1 p-3 block w-3/4 shadow-sm text-lg border border-gray-300 rounded-md" />
                              </div>
                                    </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Person Email:</label>
                                    <input type="email" disabled={isDisable} name="personEmail" value={formData.personEmail} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Company:</label>
                                    <input type="text" disabled={isDisable} name="company" value={formData.company} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Country:</label>
                                    <input type="text" disabled={isDisable} name="country" value={formData.country} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">State:</label>
                                    <input type="text" disabled={isDisable} name="state" value={formData.state} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Address:</label>
                                    <input type="text" disabled={isDisable} name="address" value={formData.address} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Pincode:</label>
                                    <input type="text" disabled={isDisable} name="pincode" value={formData.pincode} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                            </div>
                            {/* <h2 className="text-3xl font-bold mb-6">Bank Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Bank Name:</label>
                                    <input type="text" disabled={isDisable} name="bankName" value={formData.bankName} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Bank Code:</label>
                                    <input type="text" disabled={isDisable} name="bankCode" value={formData.bankCode} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Account Number:</label>
                                    <input type="text" disabled={isDisable} name="accountNumber" value={formData.accountNumber} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Account Name:</label>
                                    <input type="text" disabled={isDisable} name="accountName" value={formData.accountName} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Other Account Information:</label>
                                    <input type="text" disabled={isDisable} name="otherAccountInformation" value={formData.otherAccountInformation} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700">Bank Address:</label>
                                    <input type="text" disabled={isDisable} name="bankAddress" value={formData.bankAddress} onChange={handleChange}
                                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                                </div>
                            </div> */}
                            <div>
                            { formData.employeeId!=="" && formData.employeeId===employeeId &&
                                <div>
                                    <Link to={path}><button type="button" className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-700">Edit</button></Link>
                            <button
                                            type="button"
                                            onClick={modalChange}
                                            className="ml-5 px-6 py-3 bg-red-500 text-white text-lg font-semibold rounded-md hover:bg-red-700"
                                        >Delete
                                        </button>
                                    </div>}
                            </div>
                        </form>
                </div>
            </div>
        );
    }

    return (<div>
        {isLoading ? details() : null}
    </div>);
};

export default ContactsDetails;
