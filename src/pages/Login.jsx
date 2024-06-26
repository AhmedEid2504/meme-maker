import { useState } from 'react';
import { doSignInWithEmailAndPassword } from '../components/Auth/auth'; // Import the authentication function
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
        <div className="flex flex-col justify-center items-center
                        max-w-50 border-4 border-third p-5 rounded-md"
        >
            <h2>Login</h2>
            <form className='flex flex-col gap-5 p-2' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        className='w-[100%] h-8 bg-third rounded-sm p-2 border-none'
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        className='w-[100%] h-8 bg-third rounded-sm p-2 border-none'
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className="bg-primary shadow-md shadow-fourth focus:shadow-inner
                                    focus:shadow-primary p-2 rounded-md hover:bg-secondary
                                    hover:text-third border-2 border-primary transition-all 
                                    duration-200 ease-in
                            " 
                        type="submit">Login
                </button>
            </form>
        </div>
    );
};

export default Login;
