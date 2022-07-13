import React, { useState, useEffect } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import PrintFactura from '../util/PrintFactura';


const ItemUsuario = (props) => {
    const { username, roles } = props;

    return (
            <div>
                <p>• Nombre de usuario: {username}</p>
                <ul>
                    <h4>Roles:</h4>
                    {roles.map((item, index) => (
                        <li key={index}>{item.authority}</li>
                    ))}
                </ul>
            </div>
    );

};


export default ItemUsuario;