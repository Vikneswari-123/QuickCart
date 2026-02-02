import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { Link, Outlet } from "react-router-dom";
import toast from "react-hot-toast";


const SellerLayout = () => {

    const { axios, navigate } = useAppContext();

    const sidebarLinks = [
        { name: "Add Product", path: "/seller", icon: assets.add_icon},
        { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
        { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    ];

    const logout = async ()=>{
        try {
           const {data} = await axios.get('/api/seller/logout') 
           if(data.success){
               toast.success(data.message)
               navigate('/')
           }else{
               toast.error(data.message)
           }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
                <Link to='/'>
                    <img src={assets.logo} alt="log" className="cursor-pointer w-16 md:w-20" />
                </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <p>Hi! Admin</p>
                    <button onClick={logout} className='border rounded-full text-sm px-4 py-1'>Logout</button>
                </div>
            </div>

            <div className="flex flex-row"> 

            <div className="md:w-64 w-16 border-r h-[550px] text-base border-gray-300 pt-4 flex flex-col">
                {sidebarLinks.map((item) => (
                    <NavLink to={item.path} key={item.name} end={item.path === '/seller'}
                        className={({isActive})=>`flex flex-row items-center py-3 px-4 gap-3 overflow-hidden
                            ${isActive ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                : "hover:bg-gray-100/90  text-gray-700"
                            }`
                        }
                    >
                        <img src={item.icon} alt="" className="w-6 h-6 flex-shrink-0"/>
                        
                        <span className="hidden md:inline text-sm font-medium flex flex-col">{item.name}</span>
                    
                    </NavLink>
                ))}
            </div>
            <Outlet/>
          </div>  
        </>
    );
};

export default SellerLayout;