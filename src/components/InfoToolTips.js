import React from "react";
import success from '../images/Union.png';
import wrong from '../images/unionbad.png';
import '../styles/InfoToolTips.css';

export default function InfoToolTips({isOpened, onClose, onPopupClick}){
    return (
        <div className={`popup popup_info ${isOpened ? 'popup_opened' : ''}`} onMouseDown={onPopupClick}>
          <button type="button" className="popup__close" onClick={onClose}></button>
          <div className="info__container">
              <img className="info__image" src={success} />
              <p className="info__text">Вы успешно зарегистрировались</p>
          </div>
        </div>
    )    
}
