import React, { useState } from 'react';
import axios from "axios";
import Loader from '../../Assets/Loader';
import { useNavigate } from 'react-router-dom';

const NewContacts = () => {
    const [formData, setFormData] = useState({
        contactCreatedEmployee: localStorage.getItem("email"),
        employeeId:localStorage.getItem("employeeId"),
        personName: '',
        relation:'',
        countryCode:'',
        personMobile: '',
        personEmail: '',
        company:'',
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
    const[isAdding, setIsAdding]=useState(false);
    const [isError, setIsError]=useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const token=localStorage.getItem("token");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(formData.personName!=="" && formData.personMobile!==""){
            setIsError(false);
            setIsAdding(true);
        await axios.post("https://middlewaretalentsbackend.azurewebsites.net/apis/employees/contacts/contacts", formData,{
            headers: {
              "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
            }
          });
        setIsAdding(false);
        setShowPopup(true);
        }
        else{
            setIsError(true);
        }
    };
 const handleClosePopup = () => {
     setFormData({
                 contactCreatedEmployee: localStorage.getItem("email"),
                 personName: '',
                 relation:'',
                 countryCode:'',
                 personMobile: '',
                 personEmail: '',
                 company:'',
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
    setShowPopup(false);
    navigate("/ProfileCard")
  };

    return (
        <div>
            {isAdding && <Loader/>}
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md h-full">
            <h2 className="text-3xl font-bold mb-6">Person Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-lg font-medium text-gray-700">Person Name: <span className='text-red-600'>*</span></label>
                    <input type="text" name="personName" value={formData.personName} onChange={handleChange}
                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                </div>
                <div>
          <label className="block text-lg font-medium text-gray-700">Relation: <span className='text-red-600'>*</span></label>
          <select
            name="relation"
            value={formData.relation}
            onChange={handleChange}
            className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md"
          >
            <option value="">Select Relation</option>
            <option value="Friend">Friend</option>
            <option value="Family">Family</option>
            <option value="Colleague">Colleague</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">Mobile <span className='text-red-600'>*</span></label>
          <div className="flex">
            <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
              className="mt-1 p-3 block w-1/4 shadow-sm text-lg border border-gray-300 rounded-md"
              id="countryCode">
              <option value="+1">+1</option>
              <option value="+91">+91</option>
              <option value="+44">+44</option>
            </select>
            <input type="text" name="personMobile" value={formData.personMobile} onChange={handleChange}
                        className="mt-1 p-3 block w-3/4 shadow-sm text-lg border border-gray-300 rounded-md" />
          </div>
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Person Email:</label>
                    <input type="email" name="personEmail" value={formData.personEmail} onChange={handleChange}
                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Company:</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange}
                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Country:</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange}
                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">State:</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange}
                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Address:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange}
                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Pincode:</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                </div>
            </div>
            {/* <h2 className="text-3xl font-bold mb-6">Bank Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-lg font-medium text-gray-700">Bank Name:</label>
                    <input type="text" name="bankName" value={formData.bankName} onChange={handleChange}
                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Bank Code:</label>
                    <input type="text" name="bankCode" value={formData.bankCode} onChange={handleChange}
                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Account Number:</label>
                    <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange}
                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Account Name:</label>
                    <input type="text" name="accountName" value={formData.accountName} onChange={handleChange}
                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Other Account Information:</label>
                    <input type="text" name="otherAccountInformation" value={formData.otherAccountInformation} onChange={handleChange}
                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700">Bank Address:</label>
                    <input type="text" name="bankAddress" value={formData.bankAddress} onChange={handleChange}
                        className="mt-1 p-3 block w-full shadow-sm text-lg border border-gray-300 rounded-md" />
                </div>
            </div> */}
            <div className="flex flex-row">
            <button type="submit" className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-700">Submit</button>
            {isAdding?<p className='text-green-500'>Adding Contact.....</p>:null}
            {isError && <p className='text-red-600'>*Please Fill Mandatory Fields</p>}
            </div>
        </form>
        {showPopup && (
                <div style={popupStyle}>
                  <div style={popupContentStyle}>
                    <h2> {formData.personName} contact has submitted successfully!</h2>


                    <button
                      onClick={handleClosePopup}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
        </div>
    );
};

const popupStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  textAlign: 'center',
};

export default NewContacts;