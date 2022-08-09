import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import GraficaClicks from '../util/GraficaClicks';
import GraficaMeses from '../util/GraficaMeses';
import GraficaSemanas from '../util/GraficaSemanas';
import ItemEmpresa from './ItemEmpresa';
import * as funciones from '../util/FuncionesEmpresas.js'
import { default as DynamicTable } from '../util/DynamicTable.js'
import InfoFacturas from './InfoFacturas';

const InfoEmpresas = ({ history }) => {
    const [listado, setListado] = useState([]);
    const [empresa, setEmpresa] = useState(null);
    const [ok, setOk] = useState(false);
    const [listClicks, setListClicks] = useState([]);

    const opcionesFiltro = ["Pais", "Url", "Ip"]

    const [filtro, setFiltro] = useState(opcionesFiltro[0]);
    const [busqueda, setBusqueda] = useState("");
    const [mensajeError, setMensajeError] = useState("");

    const handleChangeFiltro = ({ target: { value } }) => {
        setFiltro(value)
    }

    const handleChangeBusqueda = ({ target: { value } }) => {
        setBusqueda(value);
    }

    const setClicks = (clicks) => {
        empresa.clicks = clicks;
    }


    useEffect(() => {
        funciones.default.Obtener().then(result => { setListado(result); setEmpresa(null); setOk(false); });
    }, [ok ? ok : null]);

    const handleChangeEmpresa = ({ target: { value } }) => {
        let obj = JSON.parse(value);
        setEmpresa(obj);
        setListClicks(obj.clicks);
    };

    const actualizar = (empresa) => {
        return funciones.default.Actualizar(empresa, history);
    }
    const eliminar = (empresaNombre) => {
        funciones.default.Eliminar(empresaNombre).then(result => setOk(result));
        /*if(funciones.default.Eliminar(empresaNombre)){
            handleChangeListado(empresaNombre);
        }  */
    }


    const buscar = () => {
        const empresaNom = empresa.empresaNombre;
        const reqBody = {
            empresaNom,
            filtro,
            busqueda
        }
        fetch('/api/clicks/busqueda', {
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
                            setListClicks(body);
                        }
                    });
            }
        })
            .catch(err => {
                console.log(err);
            });
    }


    const verEmpresa = () => {
        if (empresa === null) {
            return <p>No hay selección</p>
        } else {
            return (
                <>
                    <ItemEmpresa
                        nombre={empresa.empresaNombre}
                        mail={empresa.empresaMail}
                        clicks={empresa.clicks}
                        deuda={empresa.deuda}
                        taza={empresa.tazaClicks}
                        cnpj={empresa.empresaCnpj}
                        anual={empresa.totalAnual}
                    />
                    <button onClick={() => actualizar(empresa)}>Actualizar datos</button>
                    <button onClick={() => eliminar(empresa.empresaNombre)}>Deshabilitar empresa</button>
                    <hr />
                    <h3>Clicks generados</h3>
                    {empresa.clicks.length > 0
                        ? <div className='flex-column'>
                            <div className='flex-row'>
                                <label htmlFor="slcFiltro">Buscar por: </label>
                                <select id="slcFiltro" defaultValue={filtro} onChange={handleChangeFiltro}>
                                    {opcionesFiltro.map((item, index) => (
                                        <option key={index} value={item}>{item}</option>
                                    ))}
                                </select>
                                <input type="text" onChange={handleChangeBusqueda}></input>
                                <button onClick={() => buscar()}>Buscar</button>
                                <p className="mensaje-error">{mensajeError}</p>
                            </div>
                            <hr />
                            <DynamicTable TableData={listClicks} />
                            <GraficaMeses empresa={empresa} />
                            <GraficaSemanas empresa={empresa} />
                        </div>
                        : <h4>No existen clicks generados para esta empresa</h4>
                    }
                </>)
        }
    }

    return (
        <>
            <div className='seccion'>
                <div className='flex-column'>
                    <div>
                        <h3>Información de empresas</h3>
                        <hr />
                        <label htmlFor="slcTipo"><b>Listado de empresas: </b></label>
                        {listado.length > 0 ? <select className='select' name="slcTipo" onChange={handleChangeEmpresa} defaultValue={'Default'}>
                            <option value="Default" disabled>Seleccione una empresa</option>
                            {listado.map((item, index) => (
                                <option key={index} value={JSON.stringify(item)}>{item.empresaNombre}</option>
                            ))}
                        </select> : <div><p>Cargando empresas...</p></div>}

                        <hr />
                        {verEmpresa()}

                    </div>
                </div>
            </div>
        </>
    );
};

InfoEmpresas.propTypes = {};
export default withRouter(InfoEmpresas);
