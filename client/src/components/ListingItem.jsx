import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({listing}) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden w-full sm:w-[330px] rounded-lg gap-4'>
        <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt='listin-cover' 
                className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300 mb-2'
            />
            <div className='p-3 flex flex-col gap-2 w-full'>
                <p className='text-lg font-semibold text-slate-700 truncate'>{listing.name}</p>
                <div className='flex items-center gap-1'>
                    <MdLocationOn className='h-4 w-4 text-green-700' />
                    <p className='text-sm text-gray-600 truncate'>{listing.address}</p>
                </div>
                <p className='text-sm text-gray-600 line-clamp-3'>{listing.description}</p>
                <p className='text-slate-500 mt-2 font-semibold flex'>
                    ₹{' '}
                    {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                    {listing.type === 'rent' && ' / month'}
                </p>
                <div className='text-slate-700 flex gap-4'>
                    <div className='font-bold text-xs'>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                    </div>
                    <div className='font-bold text-xs'>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}
