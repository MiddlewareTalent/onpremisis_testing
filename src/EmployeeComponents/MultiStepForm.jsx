import React, { useState } from 'react';
import BasicDetailsForm from './BasicDetailsForm';
import ProfessionalDetailsForm from './ProfessionalDetailsForm';
import DocumentUploadForm from './DocumentUploadForm';
import SuccessPage from './SuccessPage';
import Loader from '../Assets/Loader';

const MultiStepForm = ({ onCancel,handleLoadings }) => {
    const initialFormData = {
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        streetAddress: '',
        city: '',
        region: '',
        postalCode: '',
        workingCountry: '',
        employeeId: '',
        corporateEmail: '',
        jobRole: '',
        nationalInsuranceNumber:'',
        employmentStatus: '',
        reportingTo: '',
        role: '',
        credentials: null // For credentials data from API
    };

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);
    const loading =false;

    const handleLoading=()=>{
        handleLoadings();
    }

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleFormDataChange = (newData) => {
        console.log(newData)
        const keys=Object.keys(newData);
        if(keys[0]==="corporateEmail"){
            console.log(newData.corporateEmail)
            const data={
                "email":newData.corporateEmail,
                "corporateEmail":newData.corporateEmail
            }
            setFormData((prevData) => ({
                ...prevData,
                ...data
            }));  
        }
        else{
            setFormData((prevData) => ({
                ...prevData,
                ...newData
            }));
        }

        console.log(formData);
    };

    const handleCancel = () => {
        setStep(1);
        setFormData(initialFormData);
        onCancel();
        window.location.reload();

    };

    return (
       <>{loading ? <Loader/>:
        <>
            {step === 1 && (
                <BasicDetailsForm
                    formData={formData}
                    onNext={handleNext}
                    onCancel={handleCancel}
                    onFormDataChange={handleFormDataChange}
                />
            )}
            {step === 2 && (
                <ProfessionalDetailsForm
                    formData={formData}
                    onNext={handleNext}
                    onBack={handleBack}
                    onFormDataChange={handleFormDataChange}
                    onCancel={handleCancel}
                />
            )}
            {step === 3 && (
                <DocumentUploadForm
                    formData={formData}
                    onNext={handleNext}
                    onBack={handleBack}
                    handleLoading={handleLoading}
                    onFormDataChange={handleFormDataChange}
                    onCancel={handleCancel}
                                    />

            )}
            {step === 4 && (
                <SuccessPage
                    formData={formData} // Pass credentials to success page
                    onCancel={handleCancel}
                />
            )}
        </>}</>
    );
};

export default MultiStepForm;
