import React from 'react';
import Text from '../elements/Text';
import Button from '../elements/Button';

const Navbar = () => {
    return(
        <>
            <nav className="flex justify-between pt-8">
                <Text className="text-white font-bold text-xl">
                    Welcome, <span className="italic"> Name </span>
                </Text>

                <Button className="py-1 px-6">
                    Logout
                </Button>
            </nav>
        </>
    )
}

export default Navbar;