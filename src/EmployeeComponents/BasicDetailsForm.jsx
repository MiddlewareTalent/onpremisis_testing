import React, { useState, useEffect } from 'react';

const BasicDetailsForm = ({ onNext, onCancel, formData: initialData = {}, onFormDataChange }) => {
    const [formData, setFormData] = useState({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        country: initialData.country || '',
        streetAddress: initialData.streetAddress || '',
        city: initialData.city || '',
        region: initialData.region || '',
        postalCode: initialData.postalCode || ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Update local state when initialData changes
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        onFormDataChange({ [name]: value }); // Update parent state
    };

    const validate = () => {
        const newErrors = {};
        const namePattern = /^[a-zA-Z\s]*$/;
        const postalCodePattern = /^\d+$/;

        if (!formData.firstName || !namePattern.test(formData.firstName)) {
            newErrors.firstName = "*First name must contain only letters.";
        }
        if (!formData.lastName || !namePattern.test(formData.lastName)) {
            newErrors.lastName = "*Last name must contain only letters.";
        }
        if (!formData.country) {
            newErrors.country = "*Country is required.";
        }
        if (!formData.streetAddress) {
            newErrors.streetAddress = "*Street address is required.";
        }
        if (!formData.city || !namePattern.test(formData.city)) {
            newErrors.city = "*City must contain only letters.";
        }
        if (!formData.region || !namePattern.test(formData.region)) {
            newErrors.region = "*State / Province must contain only letters.";
        }
        if (!formData.postalCode || !postalCodePattern.test(formData.postalCode)) {
            newErrors.postalCode = "*ZIP / Postal code must contain only numbers.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onNext(); // Call next step function
        }
    };
    return (
        <>
            <form className="w-full max-w-3xl mx-auto" onSubmit={handleSubmit}>
                <div className="space-y-12">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Personal Information
                    </h2>
                    <p className="mt-1 text-base text-gray-600">
                        NOTE : You can't change the Email once the fill the form </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-lg font-medium leading-6 text-gray-900">
                                First name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="first-name"
                                    name="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    className={`block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6 ${errors.firstName ? 'border-red-500' : ''}`}
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                {errors.firstName && <p className="text-lg text-red-500">{errors.firstName}</p>}
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="last-name" className="block text-lg font-medium leading-6 text-gray-900">
                                Last name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="last-name"
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    className={`block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6 ${errors.lastName ? 'border-red-500' : ''}`}
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                                {errors.lastName && <p className="text-lg text-red-500">{errors.lastName}</p>}
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="country" className="block text-lg font-medium leading-6 text-gray-900">
                                Country
                            </label>
                            <div className="mt-2">
                                <select
                                    id="country"
                                    name="country"
                                    autoComplete="country-name"
                                    className={`block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6 ${errors.country ? 'border-red-500' : ''}`}
                                    value={formData.country}
                                    onChange={handleChange}
                                >
                                    <option value="">Select a country</option>
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                    <option>India</option>
                                    <option>UK</option>
                                </select>
                                {errors.country && <p className="text-lg text-red-500">{errors.country}</p>}
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="street-address"
                                   className="block text-lg font-medium leading-6 text-gray-900">
                                Street address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="street-address"
                                    name="streetAddress"
                                    type="text"
                                    autoComplete="street-address"
                                    className={`block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6 ${errors.streetAddress ? 'border-red-500' : ''}`}
                                    value={formData.streetAddress}
                                    onChange={handleChange}
                                />
                                {errors.streetAddress && <p className="text-lg text-red-500">{errors.streetAddress}</p>}
                            </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="city" className="block text-lg font-medium leading-6 text-gray-900">
                                City
                            </label>
                            <div className="mt-2">
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    autoComplete="address-level2"
                                    className={`block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6 ${errors.city ? 'border-red-500' : ''}`}
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                                {errors.city && <p className="text-lg text-red-500">{errors.city}</p>}
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="region" className="block text-lg font-medium leading-6 text-gray-900">
                                State / Province
                            </label>
                            <div className="mt-2">
                                <input
                                    id="region"
                                    name="region"
                                    type="text"
                                    autoComplete="address-level1"
                                    className={`block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6 ${errors.region ? 'border-red-500' : ''}`}
                                    value={formData.region}
                                    onChange={handleChange}
                                />
                                {errors.region && <p className="text-lg text-red-500">{errors.region}</p>}
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="postal-code" className="block text-lg font-medium leading-6 text-gray-900">
                                ZIP / Postal code
                            </label>
                            <div className="mt-2">
                                <input
                                    id="postal-code"
                                    name="postalCode"
                                    type="text"
                                    autoComplete="postal-code"
                                    className={`block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6 ${errors.postalCode ? 'border-red-500' : ''}`}
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                />
                                {errors.postalCode && <p className="text-lg text-red-500">{errors.postalCode}</p>}
                            </div>
                        </div>
                    </div>
                </div>


                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-lg font-semibold leading-6 text-gray-900" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Next
                    </button>
                </div>
            </form>
        </>
    );
};

export default BasicDetailsForm;
