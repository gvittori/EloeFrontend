import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import GraficaClicks from '../util/GraficaClicks';
import ItemEmpresa from './ItemEmpresa';
import * as funciones from '../util/FuncionesEmpresas.js'
import { default as DynamicTable } from '../util/DynamicTable.js'

const Home = ({ history }) => {
    const [listado, setListado] = useState([]);
    const [empresa, setEmpresa] = useState(null);
    const [ok, setOk] = useState(false);

    useEffect(() => {
        funciones.default.Obtener().then(result => { setListado(result); setEmpresa(null); setOk(false); });
    }, [ok ? ok : null]);

    const handleChangeEmpresa = ({ target: { value } }) => {
        let obj = JSON.parse(value);
        setEmpresa(obj);
    };

    const actualizar = (empresa) => {
        return funciones.default.Actualizar(empresa, history);
    }
    const eliminar = (empresaNombre) => {
        funciones.default.Eliminar(empresaNombre).then(result => setOk(result)).then(alert("Eliminando empresa..."))
        /*if(funciones.default.Eliminar(empresaNombre)){
            handleChangeListado(empresaNombre);
        }  */
    }

    const verEmpresa = () => {
        if (empresa === null) {
            return <p>No hay selección</p>
        } else {
            return <>
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
                <button onClick={() => eliminar(empresa.empresaNombre)}>Eliminar empresa</button>
                <hr />
                <h3>Clicks generados</h3>
                {empresa.clicks.length > 0 
                 ?<DynamicTable TableData={empresa.clicks} /> 
                 : <h4>No existen clicks generados para esta empresa</h4>}
            </>
        }
    }

    return (
        <>
            <div className="infoEmpresas">
                <div className="item">
                    <p>Información de empresas</p>
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
        </>
    );
};

Home.propTypes = {};
export default withRouter(Home);
