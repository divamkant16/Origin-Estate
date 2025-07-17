import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        type: 'all',
        offer: false,
        furnished: false,
        parking: false,
        sort: 'createdAt',
        order: 'desc',
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    console.log(listings);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const offerFromUrl = urlParams.get('offer');
        const furnishedFromUrl = urlParams.get('furnished');
        const parkingFromUrl = urlParams.get('parking');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if(
            searchTermFromUrl ||
            typeFromUrl ||
            offerFromUrl ||
            furnishedFromUrl ||
            parkingFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebarData({
                searchTerm: searchTermFromUrl || "",
                type: typeFromUrl || 'all',
                offer: offerFromUrl === 'true',
                furnished: furnishedFromUrl === 'true',
                parking: parkingFromUrl === 'true',
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async() => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if(data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false); 
        };
        fetchListings();
    }, [window.location.search]);

    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebarData({ ...sidebarData, type: e.target.id });
        }
        if(e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') { 
            setSidebarData({ ...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false});
        }

        if(e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'createdAt';
            const order = e.target.value.split('_')[1] || 'desc';

            setSidebarData({ ...sidebarData, sort, order });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('offer', sidebarData.offer);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const onShowMoreClick = async() => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if(data.length < 9) { 
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    }

  return (
    <div className='flex flex-col sm:flex-row'>
        <div className='border-b-2 md:border-r-2 border-slate-200 md:min-h-screen md:w-1/3 lg:w-1/4'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-7'>
                <div className='flex items-center gap-2 '>
                    <label className='font-semibold whitespace-nowrap'>Search Term: </label>
                    <input 
                        type='text'
                        id='searchTerm' 
                        placeholder='Search...'
                        className='border border-white bg-white p-3 rounded-lg w-full'
                        value={sidebarData.searchTerm}
                        onChange={handleChange}
                    >
                    </input>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>
                        Type:
                    </label>
                    <div className='flex items-center gap-2'>
                        <input 
                            type='checkbox' 
                            id='all' 
                            className='w-5' 
                            checked={sidebarData.type === 'all'}
                            onChange={handleChange}
                        ></input>
                        <span>Rent & Sale</span>

                    </div>
                    <div className='flex items-center gap-2'>
                        <input 
                            type='checkbox' 
                            id='rent' 
                            className='w-5'
                            checked={sidebarData.type === 'rent'}
                            onChange={handleChange}
                        ></input>
                        <span>Rent</span>

                    </div>
                    <div className='flex items-center gap-2'>
                        <input 
                            type='checkbox' 
                            id='sale' 
                            className='w-5'
                            checked={sidebarData.type === 'sale'}
                            onChange={handleChange}
                        ></input>
                        <span>Sale</span>

                    </div>
                    <div className='flex items-center gap-2'>
                        <input 
                            type='checkbox' 
                            id='offer' 
                            className='w-5'
                            checked={sidebarData.offer}
                            onChange={handleChange}
                        ></input>
                        <span>Offer</span>

                    </div>
                </div>

                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>
                        Amenities:
                    </label>
                    <div className='flex items-center gap-2'>
                        <input 
                            type='checkbox' 
                            id='parking' 
                            className='w-5'
                            checked={sidebarData.parking}
                            onChange={handleChange}
                        ></input>
                        <span>Parking</span>

                    </div>
                    <div className='flex items-center gap-2'>
                        <input 
                            type='checkbox' 
                            id='furnished' 
                            className='w-5'
                            checked={sidebarData.furnished}
                            onChange={handleChange}
                        ></input>
                        <span>Furnished</span>

                    </div>
                </div>

                <div className='flex gap-2 items-center'>
                    <label className='font-semibold'>Sort: </label>
                    <select 
                        onChange={handleChange}
                        defaultValue={'createdAt_desc'}
                        id='sort_order' className='border border-white bg-white p-2 rounded-lg'
                    >
                        <option value='regularPrice_desc'>Price(high to low)</option>
                        <option value='regularPrice_asc'>Price(low to high)</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>
                </div>

                <button className='bg-slate-700 text-white p-3 rounded-xl uppercase hover:opacity-95 cursor-pointer'>
                    Search
                </button>
            </form>
        </div>
        
        <div className='flex flex-col flex-1'>
            <h1 className='text-3xl font-semibold border-b border-slate-200 text-slate-700 mt-4 p-3'>
                Listing Results:
            </h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {!loading && listings.length === 0 && ( 
                    <p className='text-2xl text-slate-700'>No listing found!</p>
                )}
                {loading && (
                    <p className='text-2xl text-slate-700 text-center w-full'>Loading</p>
                )}

                {
                    !loading && listings && listings.map((listing) => (
                        <ListingItem key={listing._id} listing={listing} />
                    ))
                }

                {showMore && (
                    <button onClick={onShowMoreClick} className='text-green hover:underline cursor-pointer p-7 text-center'>
                        Show More
                    </button>
                )}
            </div>

        </div>
    </div>
  )
}
