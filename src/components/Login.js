import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/auth.css';
import logo from '../images/header_logo.svg';
// import * as auth from '../auth.js';

function Login({onLogin}) {
  const [values, setValues] = useState({
    username: '',
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

//   const handleSubmit = (e) => {
    // e.preventDefault();
    // if (!values.username || !values.password) {
    //   return
    // }

    // auth
    //   .authorize(values.username, values.password)
    //   .then(res => {
        // if (res.user && res.jwt) {
        //   setValues({
            // username: '',
            // password: '',
        //   })

        //   localStorage.setItem('jwt', res.jwt)
        //   onLogin()
        //   navigate('/diary')
        // }
    //   })
    //   .catch(err => console.log(err))
//   }


  return (
    <>
        <header className="header">
            <img className="header__logo" src={logo} alt="Лого" />
            <Link to="/sign-on" className="signup__link">Регистрация</Link>
        </header>
        <div className="auth">
            <p className='auth__title'>Вход</p>
            <label className='auth__field'>
                <input placeholder='Email' className='auth__input' required id="username" name="username" type="text" value={values.username}
                    onChange={handleChange}/>
                <input placeholder='Пароль' className='auth__input' required id="password" name="password" type="password" value={values.password}
                    onChange={handleChange}/>
            </label>
            <button className='auth__button' type='submit'>
                Войти
            </button>
        </div>
    </>
  )
}

export default Login;