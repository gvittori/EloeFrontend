import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const SeccionesItem = (props) => {
    const {nombre, icono, to, exact, onClick} = props;
return (
    <li>
        <NavLink to={to} exact={exact} onClick={onClick} className="itemListado">
            <div className="iconoListado">
                <i className={icono}></i>
            </div>
            <span>{nombre}</span>
        </NavLink>
    </li>
  );

};


export default SeccionesItem;