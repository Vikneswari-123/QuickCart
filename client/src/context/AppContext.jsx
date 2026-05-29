import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});

    // Fetch Seller Status
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get('/api/seller/is-auth');
            if (data.success) {
                setIsSeller(true);
            } else {
                setIsSeller(false);
            }
        } catch (error) {
            setIsSeller(false);
        }
    };

    // Fetch User Auth Status, User Data and Cart Items
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth');
            if (data.success) {
                setUser(data.user);
                const cartObject = {};
                data.user.cartItems?.forEach(item => {
                    if (item.productId) {
                        cartObject[item.productId.toString()] = item.quantity;
                    }
                });
                setCartItems(cartObject);
            }
        } catch (error) {
            setUser(null);
        }
    };

    // Fetch All Products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Helper to sync cart directly to backend database
    const syncCartToDatabase = async (updatedCart) => {
        try {
            const cartArray = Object.keys(updatedCart).map((id) => ({
                productId: id,
                quantity: updatedCart[id]
            }));
            const { data } = await axios.post('/api/cart/update', { cartItems: cartArray });
            if (!data.success) {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Cart sync error:", error.message);
        }
    };

    // Add Product to Cart       
    const addToCart = async (itemId) => {
        if (!user) {
            setShowUserLogin(true); // shows login popup
            toast.error('Please login to add items to cart');
            return;
        }
        
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        
        // 1. Update frontend state instantly for immediate responsive UI feedback
        setCartItems(cartData);
        toast.success("Added to Cart");

        // 2. Explicitly push to DB without a tricky useEffect listener hook loop
        await syncCartToDatabase(cartData);
    };

    // Update Cart Item Quantity
    const updateCartItem = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        if (quantity <= 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData);
        toast.success("Cart Updated");

        await syncCartToDatabase(cartData);
    };

    // Remove Product from Cart
    const removeFromCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        setCartItems(cartData);
        toast.success("Removed from Cart");

        await syncCartToDatabase(cartData);
    };

    // Get Cart Item Count
    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }
        return totalCount;
    };

    // Get Cart Total Amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo && cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    };

    // Initial data fetch loop on application load
    useEffect(() => {
        fetchUser();
        fetchSeller();
        fetchProducts();
    }, []);

    const value = {
        navigate, user, setUser, isSeller, setIsSeller,
        showUserLogin, setShowUserLogin, products, currency, addToCart,
        updateCartItem, removeFromCart, cartItems, searchQuery, 
        setSearchQuery, getCartAmount, getCartCount, axios, fetchProducts,
        setCartItems
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};