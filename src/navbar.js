import { Link } from 'react-router-dom';
import './styles/navbar.css';

function Navbar() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = sessionStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn', 'false');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('role'); 
        window.location.href = '/';
    };

    const getDashboardLink = () => {
        if (userRole === 'admin') {
            return '/adminDashboard'; 
        } 
         else {
            return '/dashboard'; 
        }
    };

    return (
        <nav className="navbar">
            {isLoggedIn ? (
                <h1 className="nav_logo"><Link to="/home">Task K9</Link></h1>
            ) : (
                <h1 className="nav_logo">Task K9</h1>
            )}
            <ul>
                {isLoggedIn ? (
                    <>
                        <li><button onClick={handleLogout}>Logout</button></li>
                        <li><button><Link to={getDashboardLink()}>Dashboard</Link></button></li>
                    </>
                ) : (
                    <>
                        <li><button><Link to="/sign_up">Sign Up</Link></button></li>
                        <li><button><Link to="/login">Login</Link></button></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
