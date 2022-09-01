import React, { useState, useEffect } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { refresh } from '../util/FuncionesBroadcast';
import PrintFactura from '../util/PrintFactura';


const ItemUsuario = (props) => {
    const { username, roles } = props;
    const [ultima, setUltima] = useState(null);

    useEffect(() => {
        try {
            fetch('/api/acciones/ultima', {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                    'Content-Type': 'application/json'
                },
                body: username
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(text) })
                }
                else {
                    Promise.all([res.json()])
                        .then(([body]) => {
                            if (body.length > 0) {
                                setUltima(body[0]);
                            } else {
                                setUltima(null);
                            }
                        });
                }
            })
                .catch(err => {
                    if (err.toString().includes('"status":500')) {
                        console.log("Error: Token inválido o error interno");
                    }
                    else console.log(err);
                });

        } catch (error) {
            alert("Token inválido.");
            refresh();
        }

    }, [username]);


    return (
        <div className='flex-column centerBox'>
            <p>• Nombre de usuario: {username}</p>
            <p>• Ultima accion realizada: {ultima !== null ? ultima.accion : "No hay acciones"}</p>
            <ul>
                <p>• Roles:</p>
                {roles.map((item, index) => (
                    <li key={index}> - {item.authority}</li>
                ))}
            </ul>
        </div>
    );

};


export default ItemUsuario;