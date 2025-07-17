import { useState } from 'react';
import { useSelector } from 'react-redux';
import { updateUserFailure, updateUserStart, updateUserSuccess, 
         deleteUserFailure, deleteUserStart, deleteUserSuccess,
         signOutUserStart, signOutUserSuccess, signOutUserFailure
} from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', {
        credentials: 'include',
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }
  
  const handleShowListings = async () => {
    try{
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if(data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch(error) {
      setShowListingsError(true);
    }
  }

  const handleListingDelete = async(listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await res.json();
      if(data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => 
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch(error) {
      console.log(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col items-center gap-4'>
        <img 
          src={currentUser?.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
          alt='profile'  
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <input 
          type="text"
          placeholder='username'
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-xl bg-white w-full max-w-md'
          onChange={handleChange}
        />
        <input 
          type="email"
          placeholder='email'
          defaultValue={currentUser.email}
          id='email'
          className='border p-3 rounded-xl bg-white w-full max-w-md'
          onChange={handleChange}
        />
        <input 
          type="password"
          placeholder='password'
          id='password'
          className='border p-3 rounded-xl bg-white w-full max-w-md'
          onChange={handleChange}
        />
        <button disabled={loading}
          type='submit' 
          className='bg-slate-700 text-white p-3 rounded-xl uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer w-full max-w-md'>
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link 
          className='bg-green-700 text-white p-3 rounded-xl text-center uppercase hover:opacity-95 cursor-pointer w-full max-w-md '
          to='/create-listing'>
          Create Listing
        </Link>
      </form>

      <div className='flex mt-5 justify-between'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>

      <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully': ''}</p>

      <button onClick={handleShowListings} className='text-green-700 p-5 w-full cursor-pointer font-semibold'>
        Show Listings
      </button>
      {showListingsError && <p className='text-red-500 mt-4'>Error showing listings</p>}
      {userListings && userListings.length > 0 && 
      <div className='flex flex-col gap-4'>
        <h1 className='text-center my-7 text-3xl font-semibold'>Your Listing</h1>
        {userListings.map((listing) => (
          <div key={listing._id} className='border border-slate-300 rounded-lg p-3 flex justify-between items-center gap-4' >
            <Link to={`/listing/${listing._id}`}>
              <img 
                src={listing.imageUrls[0]} alt='listing cover'
                className='h-16 w-16 object-contain mb-2'
              />              
            </Link>
            <Link className='flex-1 ml-2 text-slate-700 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
              <p className=''>
                {listing.name}
              </p>
            </Link>

            <div className='flex flex-col items-center gap-2'> 
              <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 cursor-pointer uppercase' >
                Delete
              </button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 cursor-pointer uppercase' >
                  Edit
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      }
    </div>
  )
}
