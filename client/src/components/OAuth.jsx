import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase'; 
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app); 

            const result = await signInWithPopup(auth, provider);
            console.log("Google user data:", {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL
            });

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                })
            });
            const data = await res.json();
            console.log("Backend response:", data);
            
            dispatch(signInSuccess(data));
            Navigate("/");
        } catch (error) {
            console.error("Google sign-in failed:", error);
        }
    }
  return (
    <button onClick={handleGoogleClick} type="button" className='bg-red-700 text-white p-3 rounded-xl uppercase hover:opacity-85 cursor-pointer'>
        Continue with Google
    </button>
  )
}
