import {React, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import * as auth from '../auth.js';
import '../styles/auth.css';
import logo from '../images/header_logo.svg';

export default function Register({setIsInfoToolTipsOpened}) {
  const [values, setValues] = useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const {name, value} = e.target
    setValues(v => ({
      ...v,
      [name]: value,
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
        auth.register(values.password, values.email)
        .then(res => {
          if (res.statusCode !== 400) {
            setIsInfoToolTipsOpened(true)
            navigate('/')
          }
        })
    }

    return (
        <>
            <header className="header">
                <img className="header__logo" src={logo} alt="Лого" />
                <Link to="/sign-in" className="signup__link">Войти</Link>
            </header>
            <div className="auth">
                <p className='auth__title'>Регистрация</p>
                <label className='auth__field'>
                    <input placeholder='Email' className='auth__input' required id="email" name="email" type="email" value={values.email}
                        onChange={handleChange}/>
                    <input placeholder='Пароль' className='auth__input' required id="password" name="password" type="password" value={values.password}
                        onChange={handleChange}/>
                </label>
                <button className='auth__button' type='submit' onClick={handleSubmit}>
                    Зарегистрироваться
                </button>
                <div className="auth__sign-in">
                    <p className='auth__sign-in-text'>Уже зарегистрированы?</p>
                    <Link to="/sign-in" className="auth__signup-link">Войти</Link>
                </div>
            </div>
        </>
      )
}