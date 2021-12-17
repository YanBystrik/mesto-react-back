import React from "react";
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import ImagePopup from "./ImagePopup";
import { api } from "../utils/Api";
import currentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from  "./ProtectedRoute";
import InfoToolTips from "./InfoToolTips";
import * as auth from '../utils/auth.js';

function App() {
    //Стейты состояния модалок, инфы о пользователе и карточек
    const [isProfilePopupOpened, setIsProfilePopupOpened] = React.useState(false);
    const [isCreatePopupOpened, setIsCreatePopupOpened] = React.useState(false);
    const [isAvatarPopupOpened, setIsAvatarPopupOpened] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [isInfoToolTipsOpened, setIsInfoToolTipsOpened] = React.useState(false);
    const [infoStatus, setInfoStatus] = React.useState(null);

    React.useEffect(() => {
        handleTokenCheck()
      },[])
    
    //Проверяем наличие токена
      const handleTokenCheck = () => {
        if (localStorage.getItem('jwt')) {
          auth
            .checkToken(localStorage.getItem('jwt'))
            .then((res) => {
              if (res) {
                setLoggedIn(true)
                navigate('/')
                setEmail(res.data.email)
              }
            })
            .catch(err => console.error(err));
        }
      }
    //Логаут из приложения, удаляем токен из хранилища
      const handleLogout = (event) => {
        event.preventDefault()
        localStorage.removeItem('jwt')
        setLoggedIn(false)
        setEmail('')
        navigate('/sign-in')
      }
    
    //Флаг для понимания залогинен юзер или нет
    const onLogin = () => {
        setLoggedIn(true)
    }

    //Хук запроса к АПИ за изначальными картинками
    React.useEffect( () => {
        api.getCards()
        .then(data => {
            setCards(data)
        })
        .catch(err => {
            console.error(err);
        });
    }, []);

    //Сабмит карточки нового места
    function handleAddPlaceSubmit(data){
        api.updateCards(data)
        .then(newCard => {
            setCards([newCard, ...cards]);
            closeAllPopups();
        })
        .catch(err => {
            console.error(err);
        })
    }

    //Клик по кнопке лайка
    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        // Отправляем запрос в API и получаем обновлённые данные карточки
        isLiked 
        ? api.likeDelete(card._id).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch(err => {
            console.error(err);
        })
        : api.like(card._id).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch(err => {
            console.error(err);
        });
    }

    //Удаление карточки
    function handleCardDelete(cardId) {
        api.removeCard(cardId).then(() => {
            setCards((state) => state.filter((c) => c._id !== cardId));
        })
        .catch(err => {
            console.error(err);
        });
    }

    //Открываем превью карточки
    function handleCardClick(card){
        setSelectedCard(card)
    }

    //Запрос к АПИ на обновление инфы о пользователе
    function handleUpdateUser(data){
        api.updateUserInfo(data)
        .then((res) => {
            setCurrentUser(res);
            closeAllPopups();
        })
        .catch(err => {
            console.error(err);
        })
    }

    //Запрос к АПИ на обновление аватара
    function handleUpdateAvatar(avatar){
        api.updateAvatar(avatar)
        .then(res => {
            setCurrentUser(res);
            closeAllPopups();
        })
        .catch(err => {
            console.error(err);
        })
    }

    //Функционал закрытия модалок на ESC
    function closeAllPopups() {
        setIsProfilePopupOpened(false);
        setIsCreatePopupOpened(false);
        setIsAvatarPopupOpened(false);
        setIsInfoToolTipsOpened(false);
        setSelectedCard(null);
    }

    //Закрытие модалки на ESC
    React.useEffect(() => {
        if (isProfilePopupOpened || isCreatePopupOpened || isAvatarPopupOpened || selectedCard || isInfoToolTipsOpened) {
    
          function handleEsc(event) {
            if (event.key === 'Escape') {
              closeAllPopups()
            }
          }
    
          document.addEventListener("keydown", handleEsc)
    
          return () => {
            document.removeEventListener("keydown", handleEsc)
          }
        }
      }, [isProfilePopupOpened, isCreatePopupOpened, isAvatarPopupOpened, selectedCard, isInfoToolTipsOpened])

       //Закрытие модалки кликом на оверлей 
       function handlePopupClick(event) {
        if (event.target.classList.contains("popup")) { 
            closeAllPopups()
          } 
        } 

      //Эффект добавление изначальной информации о пользователе
      React.useEffect( () => {
        api.getUserInfo()
        .then(data =>{
            setCurrentUser(data);
        })
        .catch(err => {
            console.error(err);
        })
    }, [])

    //Отрисовка приложения
    return (
    <currentUserContext.Provider value={currentUser}>
        <div className="page">
            <Routes>
                <Route path="/"
                    element={
                        <ProtectedRoute loggedIn={loggedIn}>
                            <Header email={email} handleLogout={handleLogout}/>
                            <Main 
                                handleEditAvatarClick={ () =>
                                    setIsAvatarPopupOpened(true)
                                }
                                handleEditProfileClick={ () =>
                                    setIsProfilePopupOpened(true)
                                }
                                handleAddPlaceClick={ () =>
                                    setIsCreatePopupOpened(true)
                                }
                                onCardClick={ 
                                    handleCardClick}
                                
                                cards={cards}

                                onCardLike={handleCardLike}

                                onCardDelete={handleCardDelete}
                            />
                            <Footer />
                            <EditProfilePopup 
                                isOpened={isProfilePopupOpened} 
                                onClose={closeAllPopups} 
                                onPopupClick={handlePopupClick}
                                onUpdateUser={handleUpdateUser}
                            />
                            <EditAvatarPopup 
                                isOpened={isAvatarPopupOpened}
                                onClose={closeAllPopups}
                                onPopupClick={handlePopupClick}
                                onUpdateAvatar={handleUpdateAvatar}
                            />
                            <AddPlacePopup 
                                onPopupClick={handlePopupClick}
                                onClose={closeAllPopups} 
                                isOpened={isCreatePopupOpened}
                                onAddPlace={handleAddPlaceSubmit}
                            />
                            <ImagePopup 
                                card={selectedCard} 
                                onPopupClick={handlePopupClick} 
                                onClose={closeAllPopups} 
                            />
                        </ProtectedRoute>
                    } />
                <Route path='/sign-on' element={
                <Register setIsInfoToolTipsOpened={setIsInfoToolTipsOpened} setInfoStatus={setInfoStatus}/> 
                } />
                <Route path='/sign-in' element={<Login onLogin={onLogin} setEmail={setEmail} /> } />
            </Routes>
            <InfoToolTips info={infoStatus} isOpened={isInfoToolTipsOpened} onClose={closeAllPopups} onPopupClick={handlePopupClick}/>
        </div>
    </currentUserContext.Provider>
  );
}

export default App;