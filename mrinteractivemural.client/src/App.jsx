import { Routes, Route, NavLink } from 'react-router-dom';
import AR from './AR';
import { AdminPage } from './AdminPage';

const App = () => {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="ar" element={<AR />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="*" element={<p>There is nothing here: 404!</p>} />

        </Routes>
    );
};

/*const Layout = () => {
    const style = ({ isActive }) => ({
        fontWeight: isActive ? 'bold' : 'normal',
    });

    return (
        <>
            <h1>React Router</h1>

            <nav
                style={{
                    borderBottom: 'solid 1px',
                    paddingBottom: '1rem',
                }}
            >
                <NavLink to="/home" style={style}>
                    Home
                </NavLink>
                <NavLink to="/ar" style={style}>
                    AR
                </NavLink>
            </nav>

            <main style={{ padding: '1rem 0' }}>
                <Outlet />
            </main>
        </>
    );
};*/

const Home = () => {
    return (
        <div className="home-container" style={{ fontSize: '50px', marginLeft: '800px' }}>
            <h2 className="home-title">Home</h2>
            <nav>
                <NavLink className="nav-link" to="/ar" style={{ color: 'teal', marginLeft: '80px' }} >
                    AR
                </NavLink>
                <NavLink className="nav-link" to="/admin" style={{ color: 'teal', marginLeft: '80px' }} >
                    Admin
                </NavLink>
            </nav>
        </div>
    );
};


export default App;