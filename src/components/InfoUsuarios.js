import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import ItemUsuario from './ItemUsuario';
import * as funciones from '../util/FuncionesUsuarios'
import { decode } from '../util/decode';
import { refresh, setDataClearUsr } from '../util/FuncionesBroadcast';
import DropdownList from "react-widgets/DropdownList";

const InfoUsuarios = ({ history }) => {
    const [listado, setListado] = useState([]);
    const [usuario, setUsuario] = useState(funciones.default.Validar());
    const [ok, setOk] = useState(false);
    const [actual, setActual] = useState(decode(localStorage.getItem("jwt")).sub);
    const [inProgress, setInProgress] = useState(false);

    const refreshUsr = (lista)=>{
        if(usuario!==null){
            let usr = lista.find((usr) => usr.usuId == usuario.usuId);
            if(usr!==undefined){
                setUsuario(usu);
            }
        }
    }


    useEffect(() => {
        funciones.default.Obtener().then(result => { refreshUsr(result); setListado(result); setOk(false); });
    }, [ok ? ok : null]);

    const handleChangeUsuario = (value/*{ target: { value } }*/) => {
        setUsuario(value);
        let string = JSON.stringify(value);
        sessionStorage.setItem("usr", string);
        /*let obj = JSON.parse(value);
        setUsuario(obj);
        sessionStorage.setItem("usr", value);*/
    };

    const actualizar = (usuario) => {
        return funciones.default.Actualizar(usuario, history);
    }
    const eliminar = (username) => {
        setInProgress(true);
        funciones.default.Eliminar(username).then(result => setDataClearUsr(usuario)/*setOk(result)*/);
        /*if(funciones.default.Eliminar(empresaNombre)){
            handleChangeListado(empresaNombre);
        }  */
    }

    const verUsuario = () => {
        if (usuario === null) {
            return <p>No hay selección</p>
        } else {
            return (
                <div className='flex-row'>
                    <ItemUsuario
                        username={usuario.username}
                        roles={usuario.roles} />
                    <div className='flex-column centerBox'>
                        <button className='btnRegistro' disabled={inProgress ? true : usuario.username !== actual ? false : true} onClick={() => actualizar(usuario)}>Actualizar datos</button>
                        <button className='btnRegistro' disabled={inProgress ? true : usuario.username !== actual ? false : true} onClick={() => eliminar(usuario.username)}>Deshabilitar usuario</button>
                    </div>
                </div>
            )
        }
    }

    return (
        <>
            {inProgress ?
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
                : null}
            <div className='seccion'>
                <h3>Información de usuarios</h3>
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
                        />
                    </div>
                    : <div><p>Cargando usuarios...</p></div>}

                <hr />
                {verUsuario()}

            </div>
        </>
    );
};

InfoUsuarios.propTypes = {};
export default withRouter(InfoUsuarios);

/*<select className='select' name="slcTipo" onChange={handleChangeUsuario} defaultValue={usuario ? JSON.stringify(usuario) : 'Default'}>
                    <option value="Default" disabled>Seleccione un usuario</option>
                    {listado.map((item, index) => (
                        <option key={index} value={JSON.stringify(item)}>{item.username}</option>
                    ))}
                </select> */