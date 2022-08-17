import React, { useState, useEffect, useMemo } from 'react';
import { useLocalState } from '../util/useLocalStorage';
import { withRouter, useHistory } from 'react-router-dom';
import ItemEmpresa from './ItemEmpresa';
import * as funciones from '../util/FuncionesEmpresas.js'
import { useEventTracking } from "react-event-tracker";
import Pagination from "../util/Pagination"

const ListadoEmpresas = ({ listado, num }) => {
    const history = useHistory();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(num === undefined ? listado.length : num);
    const [sortedConfig, setSortedConfig] = useState(null);

    let sortedItems = [...listado];
    useMemo(() => {
        if (sortedConfig !== null) {
            sortedItems.sort((a, b) => {
                if (isNaN(+a[sortedConfig.key])) {
                    if (sortedConfig.direction === "asc") {
                        return a[sortedConfig.key].localeCompare(b[sortedConfig.key]);
                    } else {
                        return b[sortedConfig.key].localeCompare(a[sortedConfig.key]);
                    }
                } else {
                    if (sortedConfig.direction === "asc") {
                        return a[sortedConfig.key] - b[sortedConfig.key];
                    } else {
                        return b[sortedConfig.key] - a[sortedConfig.key];
                    }
                }

            });
            return sortedItems;
        }
    }, [sortedItems, sortedConfig]);

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

    const linkInfo = (empresa) => {
        sessionStorage.setItem("empresa", JSON.stringify(empresa));
        history.push("/ClientesInfo")
    }

    useEffect(() => {
        if (listado.length <= itemsPerPage) {
            setCurrentPage(1);
        }
    }, [listado])

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(listado.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => { setCurrentPage(pageNumber) };

    const paginateFront = () => { setCurrentPage(currentPage + 1 <= pageNumbers.length ? currentPage + 1 : currentPage) };
    const paginateBack = () => { setCurrentPage(currentPage - 1 > 0 ? currentPage - 1 : currentPage) };


    const requestSort = (key) => {
        let direction = 'asc';
        if (sortedConfig !== null) {
            if (sortedConfig.key === key && sortedConfig.direction === 'asc') {
                direction = 'desc';
            }
        }
        setSortedConfig({ key, direction });
    }

    const listData = () => {
        return currentItems.map((item, index) => {
            return (
                <li key={index} className="whiteBox" onClick={() => linkInfo(item)}>
                    <p>• Nombre de la empresa: {item.empresaNombre}</p>
                    <p>• Deuda del mes: ${item.deuda}</p>
                </li>
            )
        })
    }

    const iconChange = (data) => {
        if (sortedConfig && sortedConfig.key === data) {
            if (sortedConfig.direction === "asc") {
                return "bi bi-caret-up-fill";
            }
        }
        return "bi bi-caret-down-fill";
    }



    return (
        <>
            <div className="listaEmpresas">
                <h3>Listado de empresas
                    <button type="button" className="thButton" onClick={() => requestSort("deuda")}>
                        <i className={iconChange("deuda")}></i>
                    </button>
                </h3>
                <hr />
                <ul>
                    {listData()}
                    {/*listado.map((item, index) => (
                        <li key={index} className="whiteBox" onClick={() => linkInfo(item)}>
                            <p>• Nombre de la empresa: {item.empresaNombre}</p>
                            <p>• Deuda del mes: ${item.deuda}</p>
                        </li>
                    ))*/}
                </ul>
                <Pagination currentPage={currentPage} pageNumbers={pageNumbers} paginate={paginate} adelante={paginateFront} atras={paginateBack} />
            </div>

        </>
    );

};



export default withRouter(ListadoEmpresas);
