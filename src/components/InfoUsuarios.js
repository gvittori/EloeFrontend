import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import ItemUsuario from './ItemUsuario';
import * as funciones from '../util/FuncionesUsuarios'

const InfoUsuarios = ({ history }) => {
    const [listado, setListado] = useState([]);
    const [usuario, setUsuario] = useState(JSON.parse(sessionStorage.getItem("usr")));
    const [ok, setOk] = useState(false);


    useEffect(() => {
        funciones.default.Obtener().then(result => { setListado(result); /*setUsuario(null); */setOk(false); });
    }, [ok ? ok : null]);

    const handleChangeUsuario = ({ target: { value } }) => {
        let obj = JSON.parse(value);
        setUsuario(obj);
        sessionStorage.setItem("usr", value);
    };

    const actualizar = (usuario) => {
        return funciones.default.Actualizar(usuario, history);
    }
    const eliminar = (username) => {
        funciones.default.Eliminar(username).then(result => setOk(result));
        /*if(funciones.default.Eliminar(empresaNombre)){
            handleChangeListado(empresaNombre);
        }  */
    }


    const verUsuario = () => {
        if (usuario === null) {
            return <p>No hay selección</p>
        } else {
            return (
                <>
                    <ItemUsuario
                        username={usuario.username}
                        roles={usuario.roles} />
                    <button onClick={() => actualizar(usuario)}>Actualizar datos</button>
                    <button onClick={() => eliminar(usuario.username)}>Deshabilitar usuario</button>
                    <hr />
                </>)
        }
    }

    return (
        <>
            <div className='seccion'>
                <h3>Información de usuarios</h3>
                <hr />
                <label htmlFor="slcTipo"><b>Listado de usuarios: </b></label>
                {listado.length > 0 ? <select className='select' name="slcTipo" onChange={handleChangeUsuario} defaultValue={usuario?JSON.stringify(usuario) : 'Default'}>
                    <option value="Default" disabled>Seleccione un usuario</option>
                    {listado.map((item, index) => (
                        <option key={index} value={JSON.stringify(item)}>{item.username}</option>
                    ))}
                </select> : <div><p>Cargando usuarios...</p></div>}

                <hr />
                {verUsuario()}

            </div>
        </>
    );
};

InfoUsuarios.propTypes = {};
export default withRouter(InfoUsuarios);
