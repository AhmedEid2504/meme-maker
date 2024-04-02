import { useState } from 'react';
import { doSignInWithEmailAndPassword } from '../Auth/auth'; // Import the authentication function
import './login.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const loggedinNotify = () => toast("Welcome Back", { type: "success" });
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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

        try {
            await doSignInWithEmailAndPassword(formData.email, formData.password); // Call the authentication function
            loggedinNotify();
            navigate('/')
        } catch (error) {
            console.error('Error signing in:', error.message);
            alert(error.message);
        }
    };

    return (
        <div className="main-container">
            <div className="main">
                <div className="login-container">
                    <h2>Login</h2>
                    <form className='login-form' onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                className='login-input'
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                className='login-input'
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button className='login-button' type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
