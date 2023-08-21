import React from 'react';
import Text from '../elements/Text';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="text-white md:block hidden">
            <ul>
                <Text className="md:block hidden text-2xl pl-4 mt-6 font-bold mb-12">
                    Focus<span className="text-tertiary">Vest</span>
                </Text>

                <div className='flex flex-col md:hidden items-center justify-between p-4 mt-6 space-y-6   mb-12'>
                    <Text className="text-sm "> X </Text>
                    <Text className="text-2xl font-bold">
                        F<span className="text-tertiary">V</span>
                    </Text>


                </div>


                <NavLink
                    to="/home"
                    className={({ isActive }) =>
                        isActive ? "bg-secondary w-full block border-l-2 border-l-tertiary mr-2 py-3  text-sm"
                            :
                            "mr-2 text-sm py-3 "
                    }
                >
                    <li className="p-4 ">
                        Home
                    </li>
                </NavLink>

                <NavLink
                    to="/notes"
                    className={({ isActive }) =>
                        isActive ? "bg-secondary w-full block border-l-2 border-l-tertiary mr-2 py-3  text-sm"
                            :
                            "mr-2 text-sm py-3 pl-4"
                    }
                >
                    <li className="p-4">
                        Notes
                    </li>
                </NavLink>

            </ul>
        </aside>
    )
}

export default Sidebar