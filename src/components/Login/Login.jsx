import { useState } from 'react';
import { useAuth } from '../../contexts/authContext'; // Import the AuthContext hook
import { doSignInWithEmailAndPassword } from '../Auth/auth'; // Import the authentication function


const Login = () => {
    const { currentUser } = useAuth(); // Access currentUser from the AuthContext
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
            // You can handle successful login redirection or any other logic here
            console.log("successfully logged in");
        } catch (error) {
            console.error('Error signing in:', error.message);
            alert(error.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
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
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
