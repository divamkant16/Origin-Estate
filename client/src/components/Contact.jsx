import { set } from 'mongoose';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    const onChange = (e) => {
        setMessage(e.target.value);
    }
    useEffect(() => {
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                if(data.success === false)
                {
                    return;
                }
                setLandlord(data); 
            } catch(error) {
                console.log(error);
            }
        }
        fetchLandLord();

    }, [listing.userRef]);
  return (
    <>
        {landlord && (
            <div className='flex flex-col gap-2'>
                <p>
                    Contact{' '}
                    <span className='font-semibold'>{landlord.username}</span>
                    {' '}for{' '}
                    <span className='font-semibold'>{listing.name.toLowerCase()}</span>
                </p>
                <textarea 
                        name='message' id='message' rows='2'  
                        value={message} onChange={onChange}
                        placeholder='Type your message here...'
                        className='w-full border p-3 rounded-lg bg-white'
                    >
                    </textarea>

                    <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} 
                        className='w-full bg-slate-700 text-white text-center rounded-lg uppercase hover:opacity-95 p-3 cursor-pointer'>
                        
                        Send Message
                    </Link>
            </div>
        )}
    </>
  )
}
