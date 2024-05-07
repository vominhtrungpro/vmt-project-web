import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode'

function NavBar({ isLoggedIn, handleLogout, openModalLogin, openModalRegister }) {
    const [showTool,setShowTool] = useState(false)
    
    const getAvatarUrl = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token)


          return decoded.AvatarUrl;
        }
        return null;
      };
    
  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="nav-item">
            <span className="nav-link" onClick={() => {window.location.href = '/'}}>Home</span>
          </li>
        </ul>
        <ul className="navbar-nav right">
          {isLoggedIn ? (
            <li className="nav-item menu">
                <img src={getAvatarUrl()} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} onClick={()=>setShowTool(!showTool)}/>
              {showTool && (
          <ul className='menu-list'>
            <li><span onClick={() => {window.location.href = '/user-info'}}>User Information</span></li>
            <li><span onClick={handleLogout}>Logout</span></li>
          </ul>
      )}
            </li>
          ) : (
            <>
              <li className="nav-item">
                <span className="nav-link" onClick={openModalLogin}>
                  Login
                </span>
              </li>
              <li className="nav-item">
              <span className="nav-link" onClick={openModalRegister}>
                  Register
                </span>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
