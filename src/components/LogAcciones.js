import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { default as DynamicTable } from '../util/DynamicTable.js'
import { refresh } from '../util/FuncionesBroadcast.js';


const LogAcciones = () => {
    const [acciones, setAcciones] = useState([]);
    const [filtro, setFiltro] = useState("Usuario");
    const [busqueda, setBusqueda] = useState("");
    const [fechaInicio, setInicio] = useState("");
    const [fechaFin, setFin] = useState("");
    const [mensajeError, setMensajeError] = useState("");

    const opcionesFiltro = ["Usuario", "Accion", "Sujeto", "Fecha"]

    useEffect(() => {
        try {
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
                    if (err.toString().includes('"status":500')) {
                        console.log("Error: Token inválido o error interno");
                    }
                    else console.log(err);
                });
        } catch (error) {
            alert("Token inválido");
            refresh();
        }

    }, []);

    const handleChangeFiltro = ({ target: { value } }) => {
        setFiltro(value)
    }

    const handleChangeBusqueda = ({ target: { value } }) => {
        setBusqueda(value);
    }

    const handleChangeInicio = ({ target: { value } }) => {
        setInicio(value)
    }

    const handleChangeFin = ({ target: { value } }) => {
        setFin(value);
    }

    const buscar = () => {
        try {
            document.body.style.cursor = 'wait'
            const reqBody = {
                filtro,
                busqueda,
                fechaInicio,
                fechaFin
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
                            document.body.style.cursor = 'default'
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
                    document.body.style.cursor = 'default'
                    if (err.toString().includes('"status":500')) {
                        setMensajeError("Error: Token inválido o error interno");
                    }
                    else setMensajeError(err.toString());
                });
        } catch (error) {
            alert("Token inválido.");
            refresh();
        }

    }

    const checkEnter = (e) => {
        const { key, keyCode } = e;
        if (keyCode === 13) {
            buscar();
        }
    };

    return (
        <>
            <div className='seccion'>
                <h3>Log de acciones</h3>
                <hr />
                {acciones.length > 0 ?
                    <div className='flex-column'>
                        <div className='flex-row'>
                            <label htmlFor="slcFiltro">Buscar por: </label>
                            <select id="slcFiltro" defaultValue="usuario" onChange={handleChangeFiltro}>
                                {opcionesFiltro.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select>
                            {filtro === "Fecha" ?
                                <div>
                                    <label htmlFor='inputInicio'>Desde: </label>
                                    <input type="date" id="inputInicio" onKeyDown={checkEnter} onChange={handleChangeInicio}></input>
                                    <label htmlFor='inputFin'>Hasta: </label>
                                    <input type="date" id="inputFin" onKeyDown={checkEnter} onChange={handleChangeFin}></input>
                                </div>
                                :
                                <input type="text" onKeyDown={checkEnter} onChange={handleChangeBusqueda}></input>
                            }
                            <button onClick={() => buscar()}>Buscar</button>
                            <p className="mensaje-error">{mensajeError}</p>
                        </div>
                        <hr />
                        <DynamicTable TableData={acciones} num={10} />
                    </div> : <p>Cargando...</p>}
            </div>
        </>
    );
}

export default LogAcciones;