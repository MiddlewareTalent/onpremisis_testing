import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../SharedCSS/SharedCss.css';
import axios from "axios";
import Loader from "../Assets/Loader"; // Ensure Loader is correctly imported

const Register = () => {
    const [employee_name, setEmployeename] = useState("");
    const [last_name, setLastName] = useState("");
    const [employeeNameError, setEmployeeNameError] = useState("");
    const [lastNameError, setLastNameError] = useState(""); // Added specific error state for last name
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Register: Create an Account';
        return () => {
            document.title = 'Access HR';
        };
    }, []);

    const validateInput = () => {
        let isValid = true;
        const namePattern = /^[a-zA-Z\s]*$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@middlewaretalents\.com$/; // Restrict to middlewaretalents.com

        if (!employee_name) {
            setEmployeeNameError("* Please fill in the employee name.");
            isValid = false;
        } else if (!namePattern.test(employee_name)) {
            setEmployeeNameError("Name must not contain numbers or special characters.");
            isValid = false;
        } else {
            setEmployeeNameError("");
        }

        if (!last_name) {
            setLastNameError("* Please fill in the last name.");
            isValid = false;
        } else if (!namePattern.test(last_name)) {
            setLastNameError("Last name must not contain numbers or special characters.");
            isValid = false;
        } else {
            setLastNameError("");
        }

        if (!email) {
            setEmailError("* Please fill in the email.");
            isValid = false;
        } else if (!emailPattern.test(email)) {
            setEmailError("* Email must end with @middlewaretalents.com.");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("* Please fill in the password.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    async function save(event) {
        event.preventDefault();

        if (!validateInput()) {
            return;
        }

        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/;
        if (!passwordPattern.test(password)) {
            setPasswordError("* Password must be at least 7 characters long, contain at least one special character, and have one number.");
            return;
        } else {
            setPasswordError("");
        }

        setLoading(true); 

        const formData = new FormData();
        formData.append("firstName", employee_name);
        formData.append("lastName", last_name);
        formData.append("email", email);
        formData.append("password", password);

        try {
            console.log("Sending registration request to API"); // Debug message
            const response = await axios.post("https://ssitcloudbackend.azurewebsites.net/api/v1/employeeManager/register", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                navigate('/login');
            }
        } catch (err) {
            if (err.response) {
                if (err.response.data.message === "Email already exists.") {
                    setEmailExistsError("* This email is already registered.");
                } else {
                    alert(err.response.data.message || "An error occurred during registration.");
                }
            } else {
                alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="container">
                <main className="signup-container">
                    <h1 className="heading-primary">Sign up<span className="span-blue">.</span></h1>
                    <p className="text-mute">Create an Account to get complete access.</p>
                    <form className="signup-form" onSubmit={save}>
                        <label className="inp">
                            <input type="text" className="input-text" placeholder="&nbsp;"
                                   value={employee_name}
                                   onChange={(e) => setEmployeename(e.target.value)} />
                            <span className="label">First Name</span>
                            <span className="input-icon"></span>
                        </label>
                        {employeeNameError && <p className="error-message">{employeeNameError}</p>}

                        <label className="inp">
                            <input type="text" className="input-text" placeholder="&nbsp;"
                                   value={last_name}
                                   onChange={(e) => setLastName(e.target.value)} />
                            <span className="label">Last Name</span>
                            <span className="input-icon"></span>
                        </label>
                        {lastNameError && <p className="error-message">{lastNameError}</p>}

                        <label className="inp">
                            <input type="email" className="input-text" placeholder="&nbsp;"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)} />
                            <span className="label">Email</span>
                            <span className="input-icon"></span>
                        </label>
                        {emailError && <p className="error-message">{emailError}</p>}
                        {emailExistsError && <p className="error-message">{emailExistsError}</p>}

                        <label className="inp">
                            <input type="password" className="input-text" placeholder="&nbsp;"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)} />
                            <span className="label">Password</span>
                            <span className="input-icon input-icon-password"></span>
                        </label>
                        {passwordError && <p className="error-message">{passwordError}</p>}

                        <button className="btn btn-login" type="submit" disabled={loading}>
                            {loading ? "Loading..." : "Register →"}
                        </button>

                        {loading && <Loader />}

                        <label className="privacy_policy">
                            By clicking the Register button, you agree to our
                            <span> Terms & Conditions</span> and
                            <span> Privacy Policy</span>.
                        </label>
                    </form>

                    <p className="text-mute">Already a member? <Link to="/login">Login</Link></p>
                </main>
                <div className="welcome-container">
                    <h1 className="heading-secondary">Welcome to <span className="lg">MT Buddy!</span></h1>
                </div>
            </div>
        </>
    );
};

export default Register;
