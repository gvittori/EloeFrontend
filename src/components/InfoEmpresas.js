import React, { useState, useEffect, useRef } from 'react';
import { withRouter, useLocation } from 'react-router-dom';
import GraficaClicks from '../util/GraficaClicks';
import GraficaMeses from '../util/GraficaMeses';
import GraficaSemanas from '../util/GraficaSemanas';
import ItemEmpresa from './ItemEmpresa';
import * as funciones from '../util/FuncionesEmpresas.js'
import { default as DynamicTable } from '../util/DynamicTable.js'
import InfoFacturas from './InfoFacturas';
import { renderToString } from "react-dom/server";
import FacturaWindow from '../util/FacturaWindow';
import { useReactToPrint } from "react-to-print";

const InfoEmpresas = ({ history }) => {

    const [listado, setListado] = useState([]);
    const [empresa, setEmpresa] = useState(funciones.default.Validar());
    const [ok, setOk] = useState(false);
    const [listClicks, setListClicks] = useState(empresa !== null ? empresa.clicks : []);
    const [inProgress, setInProgress] = useState(false);

    const [fechaInicio, setInicio] = useState("");
    const [fechaFin, setFin] = useState("");

    const opcionesFiltro = ["Pais", "Url", "Ip", "Fecha"]

    const [filtro, setFiltro] = useState(opcionesFiltro[0]);
    const [busqueda, setBusqueda] = useState("");
    const [mensajeError, setMensajeError] = useState("");

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

    const setClicks = (clicks) => {
        empresa.clicks = clicks;
    }


    useEffect(() => {
        funciones.default.Obtener().then(result => { setListado(result); /*setEmpresa(null);*/ setOk(false); });
    }, [ok ? ok : null]);

    const handleChangeEmpresa = ({ target: { value } }) => {
        let obj = JSON.parse(value);
        setEmpresa(obj);
        setListClicks(obj.clicks);
        sessionStorage.setItem("empresa", value);
    };

    const actualizar = (empresa) => {
        return funciones.default.Actualizar(empresa, history);
    }
    const eliminar = (empresaCnpj) => {
        funciones.default.Eliminar(empresaCnpj).then(result => setOk(result));
        /*if(funciones.default.Eliminar(empresaNombre)){
            handleChangeListado(empresaNombre);
        }  */
    }


    const buscar = () => {
        const empresaNom = empresa.empresaNombre;
        document.body.style.cursor = 'wait'
        const reqBody = {
            empresaNom,
            filtro,
            busqueda,
            fechaInicio,
            fechaFin
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
                        document.body.style.cursor = 'default'
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
                document.body.style.cursor = 'default'
                console.log(err);
            });
    }

    const componentRef = useRef();

    const printFactura = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: "@page { size: 210mm 297mm }" //"@page { size: 1150px 1200px }"
    });

    /*const printFactura = (data) => {
        sessionStorage.setItem("printEmp", JSON.stringify(data));
        var printWindow = window.open('/FacturaWindow', '', 'height=700,width=1050');
        sessionStorage.clear();
        printWindow.print();
    }*/

    const enviarFactura = (empresa) => {
        setInProgress(true);
        funciones.default.Enviar(empresa).then(result => setInProgress(result));
    }


    const checkEnter = (e) => {
        const { key, keyCode } = e;
        if (keyCode === 13) {
            buscar();
        }
    };

    const verEmpresa = () => {
        if (empresa === null) {
            return <p>No hay selección</p>
        } else {
            return (
                <>
                    <div className='flex-row'>
                        <ItemEmpresa
                            nombre={empresa.empresaNombre}
                            mail={empresa.empresaMail}
                            clicks={empresa.clicks}
                            clicksMes={empresa.clicksMes}
                            deuda={empresa.deuda}
                            taza={empresa.tazaClicks}
                            cnpj={empresa.empresaCnpj}
                            anual={empresa.totalAnual}
                        />
                        <div className='flex-column centerBox'>
                            <button className='btnRegistro' disabled={empresa.clicks.length > 0 ? false : true} onClick={() => printFactura(empresa)}>Imprimir factura</button>
                            <button className='btnRegistro' disabled={empresa.clicks.length > 0 ? false : true} onClick={() => enviarFactura(empresa.empresaCnpj)}>Enviar factura</button>
                            <button className='btnRegistro' disabled={inProgress ? true : false} onClick={() => actualizar(empresa)}>Actualizar datos</button>
                            <button className='btnRegistro' disabled={inProgress ? true : false} onClick={() => eliminar(empresa.empresaCnpj)}>Deshabilitar empresa</button>
                        </div>
                    </div>
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
                                {filtro === "Fecha" ?
                                    <div>
                                        <label htmlFor='inputInicio'>Desde: </label>
                                        <input type="date" id="inputInicio" onKeyDown={checkEnter} onChange={handleChangeInicio}></input>
                                        <label htmlFor='inputFin'>Hasta: </label>
                                        <input type="date" id="inputFin" onKeyDown={checkEnter} onChange={handleChangeFin}></input>
                                    </div>
                                    : <input type="text" onKeyDown={checkEnter} onChange={handleChangeBusqueda}></input>}
                                <button onClick={() => buscar()}>Buscar</button>
                                <p className="mensaje-error">{mensajeError}</p>
                            </div>
                            <hr />
                            <DynamicTable TableData={listClicks} num={10} />
                            <GraficaMeses empresa={empresa} />
                            <GraficaSemanas empresa={empresa} />
                            <div ref={componentRef} className="print-only">
                                <FacturaWindow data={empresa} />
                            </div>
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
                    <div id='divToPrint'>
                        <h3>Información de empresas</h3>
                        <hr />
                        <label htmlFor="slcTipo"><b>Listado de empresas: </b></label>
                        {listado.length > 0 ? <select className='select' name="slcTipo" onChange={handleChangeEmpresa} defaultValue={empresa ? JSON.stringify(empresa) : 'Default'}>
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
