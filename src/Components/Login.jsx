import React, { useEffect, useState } from 'react';
import '../SharedCSS/SharedCss.css';
import { useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import Loader from '../Assets/Loader'; // Ensure you have the Loader component imported correctly

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Sign in: Access Identify';
        return () => {
            document.title = 'Access HR';
        };
    }, []);

    async function login(event) {
        event.preventDefault();
        setError('');

        if (!email || !password) {
            setError('* Both email and password are required');
            return;
        }

        setLoading(true);

        try {
            // Send login request to the backend
            const response = await axios.post('https://msquirebackend.azurewebsites.net/api/v1/employeeManager/login', {
                email: email,
                password: password,
            }
        );

            // Log the entire response object
            console.log('Login response:', response);

            const { message, role,token,firstName,lastName,employeeId } = response.data;
            const tokenData=token;

            // Log the extracted message and role
            console.log('Message:', message);
            console.log('Role from backend:', role);
            console.log('First Name:', firstName);
            console.log('Last Name:', lastName);
            console.log('Employee ID:', employeeId);
            if (message === 'Email not exists') {
                setError('* Email does not exist');
            } else if (message === 'Login Success') {
                // Set role from backend; default to 'Admin' only if role is undefined
                // const userRole = role ? role.toLowerCase() : 'admin';
                // const userRole = "admin";
                localStorage.setItem('email', email);
                localStorage.setItem('role', role);
                localStorage.setItem('token',tokenData);
                localStorage.setItem('firstName', firstName);
                localStorage.setItem('lastName', lastName);
                localStorage.setItem('employeeId', employeeId);
                console.log(tokenData);
                console.log(firstName, lastName, employeeId);

                // Navigate to the dashboard page and trigger updates across components
                navigate('/dashboard');
                window.dispatchEvent(new Event('storage')); // To trigger updates across components
            } else {
                setError('* Incorrect email or password');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('* Unauthorized: Incorrect email or password');
            } else {
                setError('* An error occurred while logging in');
            }
            console.error('Login error:', err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    }



    return (
        <div className="container">
            <main className="signup-container">
                <h1 className="heading-primary">Sign in<span className="span-blue">.</span></h1>
                <p className="text-mute">Enter your credentials to access your account.</p>
                {error && <p className="error-message">{error}</p>}

                <form className="signup-form" onSubmit={login}>
                    <label className="inp">
                        <input
                            type="email"
                            className="input-text"
                            placeholder="&nbsp;"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <span className="label">Email</span>
                        <span className="input-icon"></span>
                    </label>
                    <label className="inp">
                        <input
                            type="password"
                            className="input-text"
                            placeholder="&nbsp;"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <span className="label">Password</span>
                        <span className="input-icon input-icon-password"></span>
                    </label>

                    <button className="btn btn-login" type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Get Started →'}
                    </button>

                    {loading && <Loader />}

                    <label className="privacy_policy">
                        <span>Terms & Conditions</span> | <span>Privacy Policy</span>.
                    </label>
                </form>

                <p className="text-mute">
                    Not a member? <Link to="/register">Register</Link>
                </p>
            </main>
            <div className="welcome-container">
                <h1 className="heading-secondary">
                    Welcome to <span className="lg">MT Buddy!</span>
                </h1>
            </div>
        </div>
    );
};

export default Login;
