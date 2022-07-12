import React, { useState, useEffect, Component } from 'react';
import { withRouter } from 'react-router-dom';
import { useHistory, useLocation } from "react-router-dom";




const UpdateEmpresa = () => {
    const location = useLocation();
    const history = useHistory();
    const empresa = JSON.parse(location.state.empresa);

    const [nombreUpdate, setNombre] = useState(empresa.empresaNombre);
    const [emailUpdate, setEmail] = useState(empresa.empresaMail);
    const [cnpjUpdate, setCnpj] = useState(empresa.empresaCnpj);
    const [tazaUpdate, setTaza] = useState(empresa.tazaClicks);
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
        setMensajeError('');
        const reqBody = {
            nombre: empresa.empresaNombre,
            nombreUpdate,
            emailUpdate,
            cnpjUpdate,
            tazaUpdate
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
                return res.text().then(
                    res => {
                        setMensajeError(`Empresa "${res}" actualizada correctamente`);
                    }
                );
            }
        })
            .catch(err => {
                setMensajeError(err.toString());
            });


    };

    return (
        <>
            <div className="seccion registroBox">
                <h2>Update de empresas</h2>
                <label htmlFor="txtNom"><b>Nombre de empresa</b></label>
                <input className="texto" type="text" onChange={handleChangeNombre} placeholder={nombreUpdate} value={nombreUpdate}
                    name="txtNom" />
                <label htmlFor="txtMail"><b>Email de contacto</b></label>
                <input className="texto" type="text" onChange={handleChangeEmail} placeholder={emailUpdate} value={emailUpdate}
                    name="txtMail" />
                <label htmlFor="txtCnpj"><b>CNPJ</b></label>
                <input className="texto" type="text" onChange={handleChangeCnpj} placeholder={cnpjUpdate} value={cnpjUpdate}
                    name="txtCnpj" />
                <label htmlFor="txtTaza"><b>Taza por click</b></label>
                <input className="texto" type="number" onChange={handleChangeTaza} placeholder={tazaUpdate} value={tazaUpdate}
                    name="txtTaza" />

                <input type="button" value="Actualizar" onClick={btnUpdate} className="btnRegistro" />
                <p className="mensaje-error">{mensajeError}</p>
            </div>
        </>
    );
};

export default withRouter(UpdateEmpresa);
