import React, { useState } from 'react';
import Text from '../elements/Text';
import Button from '../elements/Button';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { BsPersonCircle } from 'react-icons/bs';
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
// import Button from '@mui/material/Button';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({
        left: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

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

    const list = (anchor) => (
        <Box
            className="bg-sidebar h-screen text-white"
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );


    return (
        <>

            <nav className="flex justify-between px-3 pt-8">
                <div className='flex items-center space-x-2'>
                    <div className='md:hidden block'>
                        {['left'].map((anchor) => (
                            <React.Fragment key={anchor}>
                                <Button onClick={toggleDrawer(anchor, true)}>
                                    <BsPersonCircle />
                                </Button>
                                <SwipeableDrawer
                                    anchor={anchor}
                                    open={state[anchor]}
                                    onClose={toggleDrawer(anchor, false)}
                                    onOpen={toggleDrawer(anchor, true)}
                                >
                                    {list(anchor)}
                                </SwipeableDrawer>
                            </React.Fragment>
                        ))}
                    </div>
                    <Text className="text-white font-bold text-xl">
                        Welcome, <span className="italic"> Name </span>
                    </Text>
                </div>

                <div className='relative space-y-2'>

                    {/* <BsPencilSquare  /> */}
                    <BsPersonCircle onClick={handleOpenNavbar} className='cursor-pointer text-white' />
                    {
                        open && <div className='absolute top-5 right-0 flex justify-end border border-slate-500 bg-sidebar z-40'>
                            <div className='flex flex-col text-right justify-right pl-20 pr-2 py-4 space-y-4'>
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