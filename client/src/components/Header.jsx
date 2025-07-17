import {FaSearch} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
    const {currentUser} = useSelector((state) => state.user); 
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        } 
    }, [location.search]);

  return (
    <header className='bg-slate-200 shadow-md w-full'>
        <div className='flex justify-between items-center w-full px-8 py-3'>
            {/* Home page */}
            <Link to="/" className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                    <span className='text-slate-500'>Origin</span>
                    <span className="text-slate-700">Estate</span>
                </h1>
            </Link>

            {/* Search form */}
            <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-xl items-center hidden sm:flex'>
                <input 
                    type="text"
                    placeholder='Search...' 
                    className='bg-transparent focus:outline-none w-24 sm:w-64'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">
                    <FaSearch className='text-slate-600 hover:shadow-xl cursor-pointer' />
                </button>
            </form>
            <ul className='flex gap-4 text-slate-700'>
                <Link to='/'>
                    <li className='hidden sm:inline hover:underline'>Home</li>
                </Link>
                <Link to='/about'>
                    <li className='hidden sm:inline hover:underline'>About</li>
                </Link>
                {currentUser ? (
                    <Link to='/profile'>
                        <img 
                            src={currentUser.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                            alt='profile'
                            className='rounded-full h-7 w-7 object-cover cursor-pointer'
                        />
                    </Link>
                ) : ( 
                    <Link to='/sign-in'>
                        <li className='hover:underline'> Sign In </li>
                    </Link>
                )}
            </ul>
        </div>
    </header>
  )
}
