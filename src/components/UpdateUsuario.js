import React, { useState, useEffect, Component } from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select'
import { useHistory, useLocation } from "react-router-dom";
import { decode } from '../util/decode';
import * as funciones from '../util/FuncionesUsuarios'
import Multiselect from "react-widgets/Multiselect";
import { refresh, setDataUsr } from '../util/FuncionesBroadcast';
import DropdownList from "react-widgets/DropdownList";




const UpdateUsuario = ({ history }) => {
    const location = useLocation();
    const [actual, setActual] = useState()
    const [usr, setUsr] = useState(funciones.default.Validar());
    const [listado, setListado] = useState([]);
    useEffect(() => {
        try {
            setActual(decode(localStorage.getItem("jwt")).sub);
            funciones.default.Obtener().then(result => { setListado(result) });
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
        } catch (error) {
            alert("Token invalido.")
            refresh();
        }

    }, [])

    const [usernameUpdate, setUsername] = useState("");
    const [passwordUpdate, setPassword] = useState('');
    const [roles, setRoles] = useState([]);
    const [rolesUpdate, setRolesUpdate] = useState([]);
    const [mensajeError, setMensajeError] = useState('');
    const [listaRoles, setListaRoles] = useState([]);

    const [ver, setVer] = useState(false);

    useEffect(() => {
        if (usr !== null && usr.username !== actual) {
            if (usr) {
                setUsername(usr.username);
                setRoles(usr.roles);
                setPassword("");
            } else {
                setVer(true);
            }
        } else {
            setUsr(null);
        }

    }, [usr])



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

    const handleChangeUsuario = (value/*{ target: { value } }*/) => {
        setUsr(value);
        setMensajeError("");
        /*let obj = JSON.parse(value);
        setUsr(obj);
        setMensajeError("");*/
    };



    const btnUpdate = () => {
        try {
            const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
            setMensajeError('');
            let msj = "";
            if (usr === null || usr.username === null) {
                msj += `Error: Seleccione usuario\n`;
                setMensajeError(msj);
            } else {
                if (usr.username === actual) {
                    msj += `Error: No se permite actualizar usuario logeado\n`;
                }
                if (usernameUpdate.length > 30) {
                    msj += `Error: Nombre de usuario no puede exceder 30 caractéres\n`;
                }
                if (msj.length > 0) {
                    setMensajeError(msj);
                } else {
                    document.body.style.cursor = 'wait'
                    const reqBody = {
                        username: usr.username,
                        passwordUpdate,
                        usernameUpdate,
                        passwordUpdate,
                        rolesUpdate,
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
                            return res.json().then(
                                res => {
                                    document.body.style.cursor = 'default'
                                    setUsr(res);
                                    setMensajeError(`Usuario "${res.username}" actualizado correctamente`);
                                    if (!ver) { sessionStorage.setItem("usr", JSON.stringify(res)); }
                                    funciones.default.Obtener().then(result => { setListado(result) })
                                    setDataUsr(res);
                                }
                            );
                        }
                    })
                        .catch(err => {
                            document.body.style.cursor = 'default'
                            if (err.toString().includes('"status":500')) {
                                setMensajeError("Error: Token inválido o error interno");
                            }
                            else setMensajeError(err.toString());
                        });
                }

            }
        } catch (error) {
            alert("Token invalido.");
            refresh();
        }


    };

    const checkClick = (item) => {
        if (!rolesUpdate.includes(item)) {
            rolesUpdate.push(item);
        } else {
            setRolesUpdate(current =>
                current.filter(rol => {
                    return rol !== item;
                }),
            );
        }
    }


    const checkEnter = (e) => {
        const { key, keyCode } = e;
        if (keyCode === 13) {
            console.log(keyCode)
            btnUpdate();
        }
    };


    return (
        <>
            <div className="seccion registroBox">
                <h2>Update de usuarios</h2>
                <hr />
                <label htmlFor="slcTipo"><b>Listado de usuarios: </b></label>
                {listado.length > 0 ?
                    <div className='dropdown'>
                        <DropdownList
                            placeholder='Seleccione un usuario'
                            dataKey="usuId"
                            textField="username"
                            data={listado}
                            filter='contains'
                            onChange={value => handleChangeUsuario(value)}
                            disabled={[listado.find(obj=>obj.username===actual)]}
                        />
                    </div>
                    : <div><p>Cargando usuarios...</p></div>}

                <hr />
                <label htmlFor="txtUsu"><b>Nombre de usuario</b></label>
                <input className="texto" type="text" onChange={handleChangeUsername} value={usernameUpdate} onKeyDown={checkEnter}
                    name="txtUsu" />
                <label htmlFor="txtPass"><b>Contraseña</b></label>
                <input className="texto" type="password" onChange={handleChangePassword} onKeyDown={checkEnter}
                    name="txtPass" />
                <label htmlFor="slcTipo"><b>Tipo de usuario</b></label>
                <p>• Roles actuales:</p>
                {roles.map((item, index) => (
                    <li key={index}> - {item.authority}</li>
                ))}
                {listaRoles.length > 0 ?
                    <Multiselect
                        className='multiselect'
                        placeholder='Seleccione uno o multiples roles'
                        dataKey="rolId"
                        textField="authority"
                        data={listaRoles}
                        onChange={roles => setRolesUpdate(roles)}
                        onKeyDown={checkEnter} /> :
                    <p>Cargando roles...</p>}
                <input type="button" value="Actualizar" onClick={btnUpdate} disabled={usr === null ? true : false} className="btnRegistro" />
                <p className="mensaje-error">{mensajeError}</p>
            </div>
        </>
    );
};

export default withRouter(UpdateUsuario);

/*listaRoles.length > 0 ? listaRoles.map((item, index) => (
    <div key={index} >
        <label htmlFor={item.authority}>{item.authority} - </label>
        <input type="checkbox" onClick={() => checkClick(item)} id={item.authority} />
    </div>
)) : <p>Cargando roles...</p>*/
/*<select className='select'name="slcTipo" onChange={handleChangeRoles} defaultValue={'Default'}>
<option value="Default" disabled>Seleccione un rol</option>
{listaRoles.map((item, index) => (
<option key={index} value={JSON.stringify(item)}>{item.authority}</option>
))}
</select>                        {console.log(roles.includes(item))}*/

/*<select className='select' name="slcTipo" onChange={handleChangeUsuario} defaultValue={usr ? JSON.stringify(usr) : 'Default'}>
                    <option value="Default" disabled>Seleccione un usuario</option>
                    {listado.map((item, index) => (
                        item.username !== actual ?
                            <option key={index} value={JSON.stringify(item)}>{item.username}</option> : null
                    ))}
                </select>*/