import React, { useState, useEffect } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import { withRouter } from 'react-router-dom';
import ItemEmpresa from './ItemEmpresa';
import * as funciones from '../util/FuncionesEmpresas.js'

const ListadoEmpresas = ({ listado }) => {
    /*const [empresas, setEmpresas] = useState();
    
        useEffect(() => {
            fetch('/api/empresas', {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                    'Content-Type': 'application/json'
                }
            }).then((response) => Promise.all([response.json()]))
                .then(([body]) => {
                    setListado(body);
                });
        }, []);*/
    /*
        useEffect(() => {
            fetch('/api/empresas', {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                    'Content-Type': 'application/json'
                }
            }).then((response) => Promise.all([response.json()]))
                .then(([body]) => {
                    setListado(body);
                });
        }, [ok]);*/
    /*
        const handleChangeListado = (nombre) => {
            const nuevoListado = listado.map((item) => {
                if (item.empresaNombre != nombre) {
                    return item;
                }
            });
            setListado(nuevoListado.filter(element => {
                return element !== undefined;
            }));
        }*/

    /*
        const actualizar = (empresa) => {
            return funciones.default.Actualizar(empresa, history);
        }
        const eliminar = (empresaNombre) => {
            funciones.default.Eliminar(empresaNombre).then(result => setOk(result))
            if(funciones.default.Eliminar(empresaNombre)){
                handleChangeListado(empresaNombre);
            }  
        }
    */


    return (
        <>
            <div className="listaEmpresas">
                <h3>Listado de empresas</h3>
                <ul>
                    {listado.map((item, index) => (
                        <li key={index}>
                            <p>• Nombre de la empresa: {item.empresaNombre}</p>
                            <p>• Deuda del mes: ${item.deuda}</p>
                            <hr />
                        </li>
                    ))}
                </ul>
            </div>

        </>
    );

};



export default withRouter(ListadoEmpresas);
