import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/auth.css';
import logo from '../images/header_logo.svg';
import * as auth from '../utils/auth.js';

function Login({onLogin, setEmail}) {
  const [values, setValues] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const {name, value} = e.target;

    setValues(v => ({
      ...v,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.email || !values.password) {
      return
    }

    auth
      .authorize(values.password, values.email)
      .then(res => {
        if (res.token) {
          setEmail(values.email)
          setValues({
            email: '',
            password: '',
          })
          localStorage.setItem('jwt', res.token)
          onLogin()
          navigate('/')
        }
      })
      .catch(err => console.log(err))
  }


  return (
    <>
        <header className="header">
            <img className="header__logo" src={logo} alt="Лого" />
            <Link to="/sign-on" className="signup__link">Регистрация</Link>
        </header>
        <div className="auth">
            <p className='auth__title'>Вход</p>
              <form onSubmit={handleSubmit}>
                <label className='auth__field'>
                    <input placeholder='Email' className='auth__input' required id="email" name="email" type="email" value={values.email}
                        onChange={handleChange}/>
                    <input placeholder='Пароль' className='auth__input' required id="password" name="password" type="password" value={values.password}
                        onChange={handleChange}/>
                </label>
                <button className='auth__button' type='submit'>
                Войти
                </button>
              </form>
        </div>
    </>
  )
}

export default Login;