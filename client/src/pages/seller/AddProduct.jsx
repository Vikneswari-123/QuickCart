import React, { useState } from 'react'
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {

    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [generating, setGenerating] = useState(false); // 👈 ADD THIS

    const { axios } = useAppContext()

    const generateDescription = async () => {
        if (!name) {
            toast.error('Please enter a product name first');
            return;
        }
        setGenerating(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/ai/generate-description`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productName: name,
                        category: category || 'General',
                        price: price ? `₹${price}` : 'Not specified',
                    }),
                }
            );
            const data = await response.json();
            if (data.description) {
                setDescription(data.description);
                toast.success('Description generated!');
            } else {
                toast.error('Failed to generate description');
            }
        } catch (error) {
            toast.error('AI generation failed. Try again.');
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            const productData = {
                name,
                description: description.split('\n'),
                category,
                price,
                offerPrice
            }
            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i])
            }
            const { data } = await axios.post('/api/product/add', formData)
            if (data.success) {
                toast.success(data.message);
                setName('');
                setDescription('')
                setCategory('')
                setPrice('')
                setOfferPrice('')
                setFiles([])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">

                {/* Product Image */}
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input onChange={(e) => {
                                    const updatedFiles = [...files];
                                    updatedFiles[index] = e.target.files[0]
                                    setFiles(updatedFiles)
                                }} type="file" id={`image${index}`} hidden />
                                <img className="max-w-24 cursor-pointer"
                                    src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                                    alt="uploadArea" width={100} height={100} />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Product Name */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input onChange={(e) => setName(e.target.value)} value={name}
                        id="product-name" type="text" placeholder="Type here"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                </div>

                {/* Product Description with AI Button 👇 */}
                <div className="flex flex-col gap-1 max-w-md">
                    <div className="flex items-center justify-between">
                        <label className="text-base font-medium" htmlFor="product-description">
                            Product Description
                        </label>
                        <button
                            type="button"
                            onClick={generateDescription}
                            disabled={generating}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all
                                ${generating
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 cursor-pointer'
                                }`}
                        >
                            {generating ? (
                                <>
                                    <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                <>✨ Generate with AI</>
                            )}
                        </button>
                    </div>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)} value={description}
                        id="product-description" rows={4}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                        placeholder="Type here or click ✨ Generate with AI above">
                    </textarea>
                    <p className="text-xs text-gray-400">
                        💡 Tip: Enter product name and price first for better AI results
                    </p>
                </div>

                {/* Category */}
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select onChange={(e) => setCategory(e.target.value)} value={category}
                        id="category" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path}>{item.path}</option>
                        ))}
                    </select>
                </div>

                {/* Price */}
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input onChange={(e) => setPrice(e.target.value)} value={price}
                            id="product-price" type="number" placeholder="0"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input onChange={(e) => setOfferPrice(e.target.value)} value={offerPrice}
                            id="offer-price" type="number" placeholder="0"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                </div>

                <button className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer">ADD</button>
            </form>
        </div>
    );
};

export default AddProduct