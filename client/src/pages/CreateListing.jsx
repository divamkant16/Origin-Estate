import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
    const {currentUser} = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent', 
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 15000,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    console.log(formData);

    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((err) => {
                    setImageUploadError('Image upload failed (2 mb max per image)');
                    setUploading(false);
                });
        } else {
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
            
            console.log('Uploading to:', `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`);
            console.log('Upload preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
            
            fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            })
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    return response.text().then(text => {
                        console.error('Error response:', text);
                        throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Upload successful:', data);
                if (data.secure_url) {
                    resolve(data.secure_url);
                } else {
                    reject(new Error('Image upload failed - no secure_url in response'));
                }
            })
            .catch(error => {
                console.error('Upload error:', error);
                reject(error);
            });
        });
    }

    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            });
        }

        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) 
                return setError("You must upload at least one image");
            if(+formData.regularPrice < +formData.discountPrice) // '+' to convert to number
                return setError("Discount price must be lower than regular price");
            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                }),
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false) {
                setError(data.message);
                return;
            }
            navigate(`/listing/${data._id}`);
        } catch(error) {
            setError(error.message);
            setLoading(false);
        }
    }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

        <form onSubmit={handleSubmit} className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col gap-4 w-full sm-w-1/2 flex-1'>
                <input 
                    type="text"
                    placeholder='Name'
                    className='border border-gray-300 p-3 rounded-xl bg-white'
                    id="name"
                    maxLength='62' 
                    minLength='10'
                    required
                    onChange={handleChange}
                    value={formData.name}
                />
                <textarea 
                    type="text"
                    placeholder='Description'
                    className='border border-gray-300 p-3 rounded-xl bg-white'
                    id="description"
                    required
                    onChange={handleChange}
                    value={formData.description}
                />
                <input 
                    type="text"
                    placeholder='Address'
                    className='border border-gray-300 p-3 rounded-xl bg-white'
                    id="address"
                    required
                    onChange={handleChange}
                    value={formData.address}
                />
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input 
                            type="checkbox" id='sale'
                            className='w-5 '
                            onChange={handleChange}
                            checked={formData.type === 'sale'}
                        />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type="checkbox" id='rent'
                            className='w-5 '
                            onChange={handleChange}
                            checked={formData.type === 'rent'}
                        />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type="checkbox" id='parking'
                            className='w-5 '
                            onChange={handleChange}
                            checked={formData.parking}
                        />
                        <span>Parking spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type="checkbox" id='furnished'
                            className='w-5 '
                            onChange={handleChange}
                            checked={formData.furnished}
                        />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type="checkbox" id='offer'
                            className='w-5 '
                            onChange={handleChange}
                            checked={formData.offer}
                        />
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex gap-6 flex-wrap'>
                    <div className='flex items-center gap-2'>
                        <input  className='border border-gray-300 p-3 rounded-xl bg-white'
                            type='number' id='bedrooms'
                            max='10' min='1'
                            required
                            onChange={handleChange}
                            value={formData.bedrooms}
                        />
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input  className='border border-gray-300 p-3 rounded-xl bg-white'
                            type='number' id='bathrooms'
                            max='10' min='1'
                            required
                            onChange={handleChange}
                            value={formData.bathrooms}
                        />
                        <p>Bath</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input  className='border border-gray-300 p-3 rounded-xl bg-white'
                            type='number' id='regularPrice'
                            max='15000000' min='15000'
                            required
                            onChange={handleChange}
                            value={formData.regularPrice}
                        />
                        <div className='flex flex-col items-center'>
                            <p>Regular Price</p>
                            <span className='text-xs'>(₹ / month)</span>
                        </div>
                    </div>
                    {formData.offer && (
                        <div className='flex items-center gap-2'>
                            <input  className='border border-gray-300 p-3 rounded-xl bg-white'
                                type='number' id='discountPrice'
                                max='15000000' min='0'
                                required
                                onChange={handleChange}
                                value={formData.discountPrice}
                            />
                            <div className='flex flex-col items-center'>
                                <p>Discounted Price</p>
                                <span className='text-xs'>(₹ / month)</span>
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>
            
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold '>Images: 
                    <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                </p>
                <div className='flex gap-4'>
                    <input 
                        onChange={(e) => setFiles(e.target.files)} 
                        className='p-3 border rounded-xl bg-white w-full'
                        type="file"
                        id='images'
                        accept='image/*'
                        multiple 
                    />
                    <button 
                        type='button' 
                        disabled={uploading}
                        onClick={handleImageSubmit} 
                        className='p-3 text-green-700 border border-green-700 rounded-xl uppercase hover:shadow-lg disabled:opacity-80 cursor-pointer'
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                {imageUploadError && <p className='text-red-700 text-sm'>{imageUploadError}</p>}
                {formData.imageUrls.length > 0 && 
                    formData.imageUrls.map((url, index) => (
                        <div key={url} className='flex justify-between p-3 border items-center'>
                            <img 
                                src={url} 
                                alt='listing image' 
                                className='w-20 h-20 object-contain rounded-xl'
                            />
                            <button 
                                type='button' 
                                onClick={() => handleRemoveImage(index)}
                                className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75 cursor-pointer'
                            >
                                Delete
                            </button>
                        </div>
                    ))
                }
                <button 
                    disabled={loading || uploading}
                    className='bg-slate-700 p-3 text-white rounded-xl uppercase hover:opacity-95 disabled:opacity-80'
                >
                    {loading ? 'Creating...' : 'Create Listing'}
                </button>
                {error && <p className='text-red-700 text-sm mt-4'>{error}</p>}
            </div>
            
        </form>


    </main>
  ) 
}
