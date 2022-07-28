import React, { useState, useEffect } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import PrintFactura from '../util/PrintFactura';


const ItemUsuario = (props) => {
    const { username, roles } = props;

    return (
            <div>
                <h4>• Nombre de usuario: {username}</h4>
                <ul>
                    <p>Roles:</p>
                    {roles.map((item, index) => (
                        <li key={index}> - {item.authority}</li>
                    ))}
                </ul>
            </div>
    );

};


export default ItemUsuario;