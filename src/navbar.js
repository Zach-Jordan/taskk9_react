import { Link } from 'react-router-dom';
import './styles/navbar.css';

function Navbar() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = sessionStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('role'); // Remove role on logout
        window.location.reload();
    };

    const getDashboardLink = () => {
        if (userRole === 'admin') {
            return '/adminDashboard'; // Adjust the admin dashboard route as needed
        } 
         else {
            return '/dashboard'; // Default homepage for other roles
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
