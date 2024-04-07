import { useState } from 'react';
import { doCreateUserWithEmailAndPassword } from '../Auth/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database } from '../../firebase/firebase'; // Import Firebase database
import { ref, set } from "firebase/database"
const Signup = () => {
    const signedUpNotify = () => toast("Signed Up Successfully", { type: "success" });
    const navigate = useNavigate();
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
            // Create user in Firebase Authentication
            const userCredential = await doCreateUserWithEmailAndPassword(formData.email, formData.password);
            const user = userCredential.user;

            // Store additional user data in Realtime Database
            await set(ref(database, 'users/' + user.uid), {
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
            });
            

            // Notify user and navigate
            signedUpNotify();
            navigate('/');
        } catch (error) {
            console.error('Error signing up:', error.message);
            alert(error.message);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center max-w-50 border-4 border-third p-5 rounded-md">
            <h2>Sign Up</h2>
            <form className='flex flex-col gap-5 p-2' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        className='w-[100%] h-8 bg-third rounded-sm p-2 border-none'
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        className='w-[100%] h-8 bg-third rounded-sm p-2 border-none'
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
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
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        className='w-[100%] h-8 bg-third rounded-sm p-2 border-none'
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button 
                    className="bg-primary shadow-md shadow-fourth focus:shadow-inner focus:shadow-primary p-2 rounded-md hover:bg-secondary hover:text-third border-2 border-primary transition-all duration-200 ease-in"
                    type="submit">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Signup;
