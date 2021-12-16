import React from 'react';
import logo from '../images/header_logo.svg';

function Header({email, handleLogout}) {
    return(
        <header className="header">
            <img className="header__logo" src={logo} alt="Лого" />
            <div className='header__container'>
                <p className='header__email'>{email}</p>
                <button className='header__logout' type='button' onClick={handleLogout}>Выйти</button>
            </div>
        </header>
    );
}

export default Header;