import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({children}) => {
    return(
        <section className="relative">
            <div className="fixed top-0 left-0 h-screen bg-sidebar w-72">
                < Sidebar />
            </div>

            <Navbar/>
            <div className="pl-80 pr-4">
                {children}
            </div>
        </section>
    )
}

export default Layout