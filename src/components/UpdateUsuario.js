import React, { useState, useEffect, Component } from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select'
import { useHistory, useLocation } from "react-router-dom";
import { decode } from '../util/decode';




const UpdateUsuario = ({ history }) => {
    const location = useLocation();
    const [usr,setUsr] = useState(
        location.state ? JSON.parse(location.state.usuario) : ''
      );

    const [usernameUpdate, setUsername] = useState(usr.username);
    const [passwordUpdate, setPassword] = useState('');
    const [roles, setRoles] = useState(usr.roles);
    const [mensajeError, setMensajeError] = useState('');
    const [listaRoles, setListaRoles] = useState([]);

    useEffect(() => {
        fetch('/api/roles', {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => Promise.all([response.json()]))
            .then(([body]) => {
                setListaRoles(body);
            });
    }, []);


    const handleChangeUsername = ({ target: { value } }) => {
        setUsername(value);
    };

    const handleChangePassword = ({ target: { value } }) => {
        setPassword(value);
    };

    const handleChangeRoles = ({ target: { value } }) => {
        let obj = JSON.parse(value);
        setRoles([obj]);
    };




    const btnUpdate = () => {
        const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
        setMensajeError(''); {
            const reqBody = {
                username: usr.username,
                password: "",
                usernameUpdate,
                passwordUpdate,
                roles,
                usuario
            };
            fetch('/api/usuarios/update', {
                method: 'PUT',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody)
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(text) })
                }
                else {
                    return res.text().then(
                        res => {
                            setMensajeError(`Usuario "${res}" actualizado correctamente`);
                        }
                    );
                }
            })
                .catch(err => {
                    setMensajeError(err.toString());
                });
        }

    };

    if(!location.state) return history.push("/");

    return (
        <>
            <div className="seccion registroBox">
                <h2>Update de usuarios</h2>
                <label htmlFor="txtUsu"><b>Nombre de usuario</b></label>
                <input className="texto" type="text" onChange={handleChangeUsername} value={usernameUpdate}
                    name="txtUsu" />
                <label htmlFor="slcTipo"><b>Tipo de usuario</b></label>
                <select className='select' name="slcTipo" onChange={handleChangeRoles} value={JSON.stringify(roles[0])}>
                    <option value="Default" disabled>Seleccione un rol</option>
                    {listaRoles.map((item, index) => (
                        <option key={index} value={JSON.stringify(item)}>{item.authority}</option>
                    ))}
                </select>
                <input type="button" value="Actualizar" onClick={btnUpdate} className="btnRegistro" />
                <p className="mensaje-error">{mensajeError}</p>
            </div>
        </>
    );
};

export default withRouter(UpdateUsuario);
