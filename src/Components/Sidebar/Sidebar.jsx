import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import Nav from "./SideBarComponents/Nav";
import logo from '../../assets/logo/logo.svg';

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [location, setLocation] = useState(null);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const path = window.location.pathname.slice(1); // Remove the leading '/'
        setLocation(path === '' || path === '/' ? 'home' : path); // Set 'home' if path is empty or '/'
    }, []);


    return (
        <div className="fixed top-0 left-0 z-20">
            <div className={`${isOpen ? 'w-screen h-screen' : 'w-screen h-[80px]'} transition-all duration-500`}>

                {!isOpen ? (
                    <div className="flex flex-row justify-between border-b bg-base shadow-lg">
                        <div className="flex flex-row">
                            <button
                                className="text-primary text-3xl p-4"
                                onClick={toggleSidebar}
                            >
                                <Icon icon="iconamoon:menu-burger-horizontal-duotone" />
                            </button>
                            <h1 className="text-2xl font-bold p-4 capitalize">{location}</h1>
                        </div>
                        <img className='sm:h-[60px] sm:w-[100px] h-6 w-10 mr-10' src={logo} alt='Logo' />
                    </div>
                ) : (

                    // side bar
                    <div className="z-40 h-screen" onClick={() => { setIsOpen(false) }}>
                        <div className="bg-base h-full z-50 p-3 w-[300px]">
                            <div className="flex flex-row justify-between">
                                <img className='sm:h-[45px] sm:w-[90px] h-6 w-10' src={logo} alt='Logo' />
                                <button className="text-primary text-3xl p-4" onClick={toggleSidebar} >
                                    <Icon icon="tabler:x" />
                                </button>
                            </div>

                            <div>
                                <ul className='flex flex-col gap-5 mt-5'>
                                    <Nav title={"Home Banner"} destination={""} />
                                    <Nav title={"Contact Us"} destination={"ContactUs"} />
                                    <Nav title={"About Us"} destination={"AboutUs"} />
                                    <Nav title={"Social Media"} destination={"SocialMedia"} />
                                    <Nav title={"Testimonials"} destination={"Testimonials"} />
                                    <Nav title={"Manufacturing Page"} destination={"ManufacturingPage"} />
                                    <Nav title={"Query Form"} destination={"QueryForm"} />
                                    <Nav title={"Who Are We"} destination={"WhoAreWe"} />
                                    <Nav title={"Analytics"} destination={"Analytics"} />
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}