import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const ItemSecciones = (props) => {
    const { nombre, icono, to, exact, onClick, subMenus, inactivo, open } = props;
    const [expand, setExpand] = useState(false);

    const openAndExpand = () => {
        open();
        setExpand(!expand)
    }

    return (
        <li>
            {to.length > 0 ?
                <NavLink to={to} exact={exact} onClick={onClick} className="itemListado">
                    <div className="iconoListado">
                        <i className={icono}></i>
                    </div>
                    <span>{nombre}</span>
                </NavLink> :
                <span onClick={() => openAndExpand()} className="itemListado">
                    <div className="iconoListado">
                        <i className={icono}></i>
                    </div>
                    <span>{nombre}</span>
                    <div className="iconoListadoDerecha">
                        <i className={expand ? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"}></i>
                    </div>
                </span>}


            {subMenus && subMenus.length > 0 ? (
                <ul className={`subMenu ${expand ? "expanded" : ""}`}>
                    {subMenus.map((menu, index) => (
                        <li key={index} >
                            <NavLink to={menu.to}>{menu.nombre}</NavLink>
                        </li>
                    ))}
                </ul>
            ) : null}
        </li>

    );

};


export default ItemSecciones;