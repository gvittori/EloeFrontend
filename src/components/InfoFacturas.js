import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import DynamicTable from '../util/DynamicTable';
import { decode } from '../util/decode';
import { refresh } from '../util/FuncionesBroadcast';

const InfoFacturas = () => {
    const [facturas, setFacturas] = useState([]);

    const [filtro, setFiltro] = useState("Empresa");
    const [busqueda, setBusqueda] = useState("");
    const [fechaInicio, setInicio] = useState("");
    const [fechaFin, setFin] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [inProgress, setInProgress] = useState(false);

    const opcionesFiltro = ["Empresa", "Monto", "Clicks", "Pagada", "Fecha generada", "Fecha vencimiento"]


    useEffect(() => {
        try {
            fetch('/api/facturas', {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                    'Content-Type': 'application/json'
                },
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(text) })
                }
                else {
                    Promise.all([res.json()])
                        .then(([body]) => {
                            setFacturas(body);
                        });
                }
            })
        } catch (error) {
            alert("Token inválido.")
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
            fetch('/api/facturas/busqueda', {
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
                                setFacturas(body);
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
            alert("Token inválido.")
            refresh();
        }

    }

    const checkEnter = (e) => {
        const { key, keyCode } = e;
        if (keyCode === 13) {
            buscar();
        }
    };

    const updateFactura = (data) => {
        try {
            const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
            setInProgress(true)
            document.body.style.cursor = 'wait'
            let id = data.empresa.split(/[\s]/)[2];
            let reqBody = {
                fechaGenerada: data.fechaGenerada,
                empresaId: id,
                usuario
            }
            fetch('/api/facturas/update', {
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
                    document.body.style.cursor = 'default'
                    return res.text().then(text => { throw new Error("Token inválido.") })
                }
                else {
                    Promise.all([res.json()])
                        .then(([body]) => {
                            let copy = JSON.parse(JSON.stringify(facturas))
                            let index = facturas.indexOf(data)
                            copy[index] = body
                            setFacturas(copy)
                            document.body.style.cursor = 'default'
                            setInProgress(false)
                        });
                }
            })
        } catch (error) {
            alert("Token inválido.");
            refresh();
        }

    }

    return (
        <>
            <div className='seccion'>
                <div className='flex-column'>
                    <h3>Listado de facturas</h3>
                    <hr />
                    {facturas.length > 0 ?
                        <>
                            <div className='flex-row'>
                                <label htmlFor="slcFiltro">Buscar por: </label>
                                <select id="slcFiltro" defaultValue={filtro} onChange={handleChangeFiltro}>
                                    {opcionesFiltro.map((item, index) => (
                                        <option key={index} value={item}>{item}</option>
                                    ))}
                                </select>
                                {filtro === "Fecha generada" || filtro === "Fecha vencimiento" ?
                                    <div>
                                        <label htmlFor='inputInicio'>Desde: </label>
                                        <input type="date" id="inputInicio" onKeyDown={checkEnter} onChange={handleChangeInicio}></input>
                                        <label htmlFor='inputFin'>Hasta: </label>
                                        <input type="date" id="inputFin" onKeyDown={checkEnter} onChange={handleChangeFin}></input>
                                    </div>
                                    : filtro === "Clicks" || filtro === "Monto" ?
                                        <input type="number" onKeyDown={checkEnter} onChange={handleChangeBusqueda}></input> :
                                        filtro === "Pagada" ?
                                            <select defaultValue="true" onKeyDown={checkEnter} onChange={handleChangeBusqueda}>
                                                <option value="true">Si</option>
                                                <option value="false">No</option>
                                            </select>
                                            : <input type="text" onKeyDown={checkEnter} onChange={handleChangeBusqueda}></input>}
                                <button onClick={() => buscar()}>Buscar</button>
                                <p className="mensaje-error">{mensajeError}</p>
                            </div>
                            <div>
                                <DynamicTable TableData={facturas} num={10} facturas={true} update={updateFactura} inProgress={inProgress} />
                            </div></> : <p>Cargando...</p>}
                </div>
            </div>
        </>
    )

}

InfoFacturas.propTypes = {};
export default withRouter(InfoFacturas);