import React, { useState, useEffect, Component } from 'react';
import { withRouter } from 'react-router-dom';
import { useHistory, useLocation } from "react-router-dom";
import { decode } from '../util/decode';
import { refresh, setDataEmp } from '../util/FuncionesBroadcast';
import * as funciones from '../util/FuncionesEmpresas.js'
import DropdownList from "react-widgets/DropdownList";

const UpdateEmpresa = () => {
    const location = useLocation();
    const history = useHistory();
    const [empresa, setEmpresa] = useState(funciones.default.Validar());
    const [inProgress, setInProgress] = useState(false);

    const refreshEmp = (lista)=>{
        if(empresa!==null){
            let emp = lista.find((emp) => emp.empresaId == empresa.empresaId);
            if(emp!==undefined){
                setEmpresa(emp);
            }
        }
    }

    const [listado, setListado] = useState([]);
    useEffect(() => {
        funciones.default.Obtener().then(result => { refreshEmp(result); setListado(result); })
    }, [])

    const [nombreUpdate, setNombre] = useState("");
    const [emailUpdate, setEmail] = useState("");
    const [cnpjUpdate, setCnpj] = useState("");
    const [tazaUpdate, setTaza] = useState("");
    //let ver = false;
    const [ver, setVer] = useState(false);

    useEffect(() => {
        if (empresa) {
            setNombre(empresa.empresaNombre);
            setEmail(empresa.empresaMail);
            setCnpj(empresa.empresaCnpj);
            setTaza(empresa.tazaClicks);
        } else {
            setVer(true);
        }
    }, [empresa])

    const [mensajeError, setMensajeError] = useState('');


    const handleChangeNombre = ({ target: { value } }) => {
        setNombre(value);
    };

    const handleChangeEmail = ({ target: { value } }) => {
        setEmail(value);
    };

    const handleChangeCnpj = ({ target: { value } }) => {
        setCnpj(value);
    };

    const handleChangeTaza = ({ target: { value } }) => {
        setTaza(value);
    };

    const btnUpdate = () => {
        try {
            const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
            setMensajeError('');
            let msj = "";
            if (empresa === null || empresa.empresaCnpj === null) {
                msj += `Error: Seleccione una empresa\n`;
                setMensajeError(msj);
            } else {
                if (nombreUpdate.length > 30) {
                    msj += `Error: Nombre de empresa no puede exceder 30 caractéres\n`;
                }
                if (emailUpdate.length > 50) {
                    msj += `Error: Error: Email no puede exceder 50 caractéres\n`;
                }
                /*const valido =  cnpjUpdate.replace(/\D/g, '');
                if (cnpjUpdate.length !== 14 || cnpjUpdate!==valido) {
                    msj += `Error: Ingrese CNPJ valido\n`;
                }*/
                if (tazaUpdate < 0) {
                    msj += `Error: Valor de taza inválido\n`;
                }
                if (msj.length > 0) {
                    setMensajeError(msj);
                } else {
                    document.body.style.cursor = 'wait'
                    setInProgress(true);
                    const reqBody = {
                        cnpj: empresa.empresaCnpj,
                        nombreUpdate,
                        emailUpdate,
                        cnpjUpdate,
                        tazaUpdate,
                        usuario
                    };
                    fetch('/api/empresas/update', {
                        method: 'PUT',
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
                            return res.json().then(
                                res => {
                                    document.body.style.cursor = 'default'
                                    setInProgress(false);
                                    setEmpresa(res);
                                    setMensajeError(`Empresa "${res.empresaNombre}" actualizada correctamente`);
                                    if (!ver) { sessionStorage.setItem("empresa", JSON.stringify(res)); }
                                    funciones.default.Obtener().then(result => { setListado(result) })
                                    setDataEmp(res);
                                }
                            );
                        }
                    })
                        .catch(err => {
                            document.body.style.cursor = 'default'
                            setInProgress(false);
                            if (err.toString().includes('"status":500')) {
                                setMensajeError("Error: Token inválido o error interno");
                            }
                            else setMensajeError(err.toString());
                        });

                }
            }
        } catch (error) {
            setInProgress(false);
            alert("Token inválido.")
            refresh();
        }
    };

    const checkEnter = (e) => {
        const { key, keyCode } = e;
        if (keyCode === 13) {
            btnUpdate();
        }
    };

    const handleChangeEmpresa = (value/*{ target: { value } }*/) => {
        setEmpresa(value);
        setMensajeError("");
        /*let obj = JSON.parse(value);
        setEmpresa(obj);
        setMensajeError("");*/
    };


    return (
        <>
            {inProgress ?
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
                : null}
            <div className="seccion registroBox">
                <h2>Update de empresas</h2>
                <hr />
                <label htmlFor="slcTipo"><b>Listado de empresas: </b></label>
                {listado.length > 0 ?
                    <div className='dropdown'>
                        <DropdownList
                            placeholder='Seleccione una empresa'
                            dataKey="empresaId"
                            textField="empresaNombre"
                            data={listado}
                            filter='contains'
                            onChange={value => handleChangeEmpresa(value)}
                        />
                    </div>
                    : <div><p>Cargando empresas...</p></div>}
                <hr />

                <label htmlFor="txtNom"><b>Nombre de empresa</b></label>
                <input className="texto" type="text" onChange={handleChangeNombre} placeholder={nombreUpdate} value={nombreUpdate} onKeyDown={checkEnter}
                    name="txtNom" />
                <label htmlFor="txtMail"><b>Email de contacto</b></label>
                <input className="texto" type="text" onChange={handleChangeEmail} placeholder={emailUpdate} value={emailUpdate} onKeyDown={checkEnter}
                    name="txtMail" />
                <label htmlFor="txtCnpj"><b>CNPJ</b></label>
                <input className="texto" type="text" onChange={handleChangeCnpj} placeholder={cnpjUpdate} value={cnpjUpdate} onKeyDown={checkEnter}
                    name="txtCnpj" />
                <label htmlFor="txtTaza"><b>Taza por click</b></label>
                <input className="texto" type="number" onChange={handleChangeTaza} placeholder={tazaUpdate} value={tazaUpdate} onKeyDown={checkEnter}
                    name="txtTaza" />

                <input type="button" value="Actualizar" disabled={empresa === null ? true : false} onClick={btnUpdate} className="btnRegistro" />
                <p className="mensaje-error">{mensajeError}</p>
            </div>
        </>
    );
};

export default withRouter(UpdateEmpresa);

/*<select className='select' name="slcTipo" onChange={handleChangeEmpresa} defaultValue={empresa ? JSON.stringify(empresa) : 'Default'}>
                    <option value="Default" disabled>Seleccione una empresa</option>
                    {listado.map((item, index) => (
                        <option key={index} value={JSON.stringify(item)}>{item.empresaNombre}</option>
                    ))}
                </select> */