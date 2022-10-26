import React from 'react';
import Text from '../elements/Text';
import Button from '../elements/Button';
import {  signOut } from "firebase/auth";
import {auth} from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
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
    
    return(
        <>
            <nav className="flex justify-between pt-8">
                <Text className="text-white font-bold text-xl">
                    Welcome, <span className="italic"> Name </span>
                </Text>

                <Button onClick={handleLogout} className="py-1 px-6">
                    Logout
                </Button>
            </nav>
        </>
    )
}

export default Navbar;