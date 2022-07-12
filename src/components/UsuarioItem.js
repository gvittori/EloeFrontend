import React, { useState, useEffect } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import PrintFactura from '../util/PrintFactura';


const UsuarioItem = (props) => {
    const { username, roles } = props;

    return (
            <div>
                <p>• Nombre de usuario: {username}</p>
                <ul>
                    <h3>Roles:</h3>
                    {roles.map((item, index) => (
                        <li key={index}>{item.authority}</li>
                    ))}
                </ul>
            </div>
    );

};


export default UsuarioItem;