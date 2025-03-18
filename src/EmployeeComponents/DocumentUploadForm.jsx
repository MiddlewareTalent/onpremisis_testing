


import { useState } from "react";
import axios from 'axios';


const DocumentUploadForm = ({ formData, onNext, onBack, onCancel, onFormDataChange,handleLoading }) => {
    const [documents, setDocuments] = useState({
        identityCard: null,
        visa: null,
        otherDocuments: null,
    });

    const [error, setError] = useState({});
    const [submissionMessage, setSubmissionMessage] = useState('');
    

    const handleFileChange = (event, documentType) => {
        const file = event.target.files[0];
        setDocuments((prevDocuments) => ({
            ...prevDocuments,
            [documentType]: file,
        }));

        setError((prevError) => ({
            ...prevError,
            [documentType]: null
        }));
    };

    const handleFileRemove = (documentType) => {
        setDocuments((prevDocuments) => ({
            ...prevDocuments,
            [documentType]: null,
        }));
    };

    const handleSubmit = async () => {
        let formHasError = false;
        handleLoading();

        // Check if required fields are filled
        if (!documents.identityCard) {
            setError((prevError) => ({
                ...prevError,
                identityCard: 'Identity card is required.',
            }));
            formHasError = true;
        }
        // Add checks for other required documents if necessary

        if (formHasError) {
            return;
        }

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });
        Object.entries(documents).forEach(([key, file]) => {
            if (file) formDataToSend.append(key, file);
        });

        try {
            const token = localStorage.getItem('token');
            console.log("str"+documents.identityCard);
            const response = await axios.post('https://msquirebackend.azurewebsites.net/api/v1/employeeManager/add', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',

                    'Authorization': `Bearer ${token}` // Add Authorization header with JWT token

                }

            });

            setSubmissionMessage('Documents uploaded successfully!');
            onFormDataChange({ credentials: response.data });
            onNext();

        } catch (error) {
            console.error('Error submitting the form', error.response ? error.response.data : error);
            setError((prevError) => ({
                ...prevError,
                submission: 'Failed to submit the form. Please try again.'
            }));
        }
        handleLoading();
    };

    return (
        <>
             <form>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Upload Documents</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Please upload the following required documents.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                            {/* National Card */}
                            <div className="col-span-full">
                                <label htmlFor="national-card" className="block text-sm font-medium leading-6 text-gray-900">
                                    Identity Card <span className="text-red-600">*</span>
                                </label>
                                <div className="mt-2 flex items-center">
                                    {!documents.identityCard ? (
                                        <>
                                            <input
                                                id="identityCard"
                                                name="identityCard"
                                                type="file"
                                                className="sr-only"
                                                onChange={(e) => handleFileChange(e, 'identityCard')}
                                            />
                                            <label
                                                htmlFor="identityCard"
                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                            >
                                                <span>Upload</span>
                                            </label>
                                            {error.identityCard && (
                                                <p className="text-sm text-red-600 pl-4">{error.identityCard}</p>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex items-center">
                                            <p className="pl-4 text-sm text-gray-600">{documents.identityCard.name}</p>
                                            <button
                                                type="button"
                                                className="ml-4 text-red-600 hover:text-red-800"
                                                onClick={() => handleFileRemove('identityCard')}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="national-card" className="block text-sm font-medium leading-6 text-gray-900">
                                Visa 
                                </label>
                                <div className="mt-2 flex items-center">
                                    {!documents.visa? (
                                        <>
                                            <input
                                                id="visa"
                                                name="visa"
                                                type="file"
                                                className="sr-only"
                                                onChange={(e) => handleFileChange(e, 'visa')}
                                            />
                                            <label
                                                htmlFor="visa"
                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                            >
                                                <span>Upload</span>
                                            </label>
                                            {error.identityCard && (
                                                <p className="text-sm text-red-600 pl-4">{error.visa}</p>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex items-center">
                                            <p className="pl-4 text-sm text-gray-600">{documents.visa.name}</p>
                                            <button
                                                type="button"
                                                className="ml-4 text-red-600 hover:text-red-800"
                                                onClick={() => handleFileRemove('identityCard')}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="national-card" className="block text-sm font-medium leading-6 text-gray-900">
                                Other Documents 
                                </label>
                                <div className="mt-2 flex items-center">
                                    {!documents.otherDocuments ? (
                                        <>
                                            <input
                                                id="otherDocuments"
                                                name="otherDocuments"
                                                type="file"
                                                className="sr-only"
                                                onChange={(e) => handleFileChange(e, 'otherDocuments')}
                                            />
                                            <label
                                                htmlFor="otherDocuments"
                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                            >
                                                <span>Upload</span>
                                            </label>
                                            {error.otherDocuments && (
                                                <p className="text-sm text-red-600 pl-4">{error.otherDocuments}</p>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex items-center">
                                            <p className="pl-4 text-sm text-gray-600">{documents.otherDocuments.name}</p>
                                            <button
                                                type="button"
                                                className="ml-4 text-red-600 hover:text-red-800"
                                                onClick={() => handleFileRemove('otherDocuments')}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Add similar code structures for other documents, e.g., tenthCertificate, twelfthCertificate, graduationCertificate */}

                        </div>
                        

                            {/* National Card */}
                            

                            

                            {/* Add similar code structures for other documents, e.g., tenthCertificate, twelfthCertificate, graduationCertificate */}

                        </div>
                    </div>
                

                {error.submission && <p className="text-red-500 text-sm mt-2">{error.submission}</p>}
                {submissionMessage && <p className="text-green-500 text-sm mt-2">{submissionMessage}</p>}

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={onBack}>
                        Back
                    </button>
                    <button
                        type="button"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </>
    );
};

export default DocumentUploadForm;