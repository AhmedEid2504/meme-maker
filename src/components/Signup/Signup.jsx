import { useState } from 'react';
import { useAuth } from '../../contexts/authContext'; // Import the AuthContext hook
import { doCreateUserWithEmailAndPassword } from '../Auth/auth'; // Import the authentication functions
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Access currentUser from the AuthContext
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            await doCreateUserWithEmailAndPassword(formData.email, formData.password); // Call the authentication function
            // Here you can save additional user information to Firestore or Realtime Database
            alert('User registered:', currentUser);
            navigate('/');
        } catch (error) {
            console.error('Error signing up:', error.message);
            alert(error.message);
        }
    };

    return (
        <div className="main-container">
            <div className="main">
                <div className="signup-container">
                    <h2>Sign Up</h2>
                    <form className='signup-form' onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                className='signup-input'
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                className='signup-input'
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input
                                className='signup-input'
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                className='signup-input'
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                className='signup-input'
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button className='signup-button' type="submit">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
