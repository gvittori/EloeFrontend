import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { default as DynamicTable } from '../util/DynamicTable.js'


const LogAcciones = () => {
    const [acciones, setAcciones] = useState([]);
    const [filtro, setFiltro] = useState("usuario");
    const [busqueda, setBusqueda] = useState("");
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        fetch('/api/acciones', {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text) })
            }
            else {
                Promise.all([res.json()])
                    .then(([body]) => {
                        setAcciones(body);
                    });
            }
        })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const handleChangeFiltro = ({ target: { value } }) => {
        setFiltro(value)
    }

    const handleChangeBusqueda = ({ target: { value } }) => {
        setBusqueda(value);
    }

    const buscar = () => {
        const reqBody = {
            filtro,
            busqueda
        }
        fetch('/api/acciones/busqueda', {
            method: 'POST',
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
                Promise.all([res.json()])
                    .then(([body]) => {
                        if (body.length <= 0) {
                            setMensajeError("No hay resultados para la busqueda");
                        } else {
                            setMensajeError("");
                            setAcciones(body);
                        }
                    });
            }
        })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <>
            <div className='seccion'>
                <h3>Log de acciones</h3>
                <hr />
                {acciones.length > 0 ?
                    <>
                        <div className='flex-row'>
                            <label htmlFor="slcFiltro">Buscar por: </label>
                            <select id="slcFiltro" defaultValue="usuario" onChange={handleChangeFiltro}>
                                <option value="usuario">Usuario</option>
                                <option value="accion">Accion</option>
                                <option value="sujeto">Sujeto</option>
                            </select>
                            <input type="text" onChange={handleChangeBusqueda}></input>
                            <button onClick={() => buscar()}>Buscar</button>
                            <p className="mensaje-error">{mensajeError}</p>
                        </div>
                        <hr />
                        <DynamicTable TableData={acciones} />
                    </> : <p>Cargando...</p>}
            </div>
        </>
    );
}

export default LogAcciones;