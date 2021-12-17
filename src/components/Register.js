import {React, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import * as auth from '../utils/auth.js';
import '../styles/auth.css';
import logo from '../images/header_logo.svg';

export default function Register({setIsInfoToolTipsOpened, setInfoStatus}) {
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
          if (res.data){
            setInfoStatus(true);
            setIsInfoToolTipsOpened(true);
            navigate('/');
          } else {
            setInfoStatus(false);
            setIsInfoToolTipsOpened(true);
          }
        })
        .catch(err => {
          console.error(err);
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
                <form  onSubmit={handleSubmit}>
                  <label className='auth__field'>
                      <input placeholder='Email' className='auth__input' required id="email" name="email" type="email" value={values.email}
                          onChange={handleChange}/>
                      <input placeholder='Пароль' className='auth__input' required id="password" name="password" type="password" value={values.password}
                          onChange={handleChange}/>
                  </label>
                  <button className='auth__button' type='submit'>
                      Зарегистрироваться
                  </button>
                </form>
                <div className="auth__sign-in">
                    <p className='auth__sign-in-text'>Уже зарегистрированы?</p>
                    <Link to="/sign-in" className="auth__signup-link">Войти</Link>
                </div>
            </div>
        </>
      )
}