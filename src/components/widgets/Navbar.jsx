import React, { useState } from 'react';
import Text from '../elements/Text';
import Button from '../elements/Button';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { BsPersonCircle } from 'react-icons/bs';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {


        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });

    }

    const handleOpenNavbar = () => {
        setOpen(prev => !prev);
    }

    return (
        <>
            <nav className="flex justify-between px-3 pt-8">
                <Text className="text-white font-bold text-xl">
                    Welcome, <span className="italic"> Name </span>
                </Text>

                <div className='relative space-y-2'>

                    {/* <BsPencilSquare  /> */}
                    <BsPersonCircle onClick={handleOpenNavbar} className='cursor-pointer text-white'/>
                    {
                        open && <div className='absolute top-5 right-0 flex justify-end border border-white bg-sidebar z-40'>
                            <div className='flex flex-col px-12 py-6 space-y-6'>
                                <button className="text-right text-xs text-white underline">
                                    View Profile
                                </button>
                                <button className="px-6 py-2 text-xs text-white bg-secondary" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    }
                </div>


            </nav>
        </>
    )
}

export default Navbar;