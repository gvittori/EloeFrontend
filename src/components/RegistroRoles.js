import React, { useState, useEffect, Component } from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select'
import { decode } from '../util/decode';


const RegistroRoles = ({ history }) => {
  const [authority, setAuthority] = useState('');
  const [mensajeError, setMensajeError] = useState('');


  const handleChangeAuthority = ({ target: { value } }) => {
    setAuthority(value);
  };




  const btnRegistrar = () => {
    const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
    setMensajeError('');
    if (authority.length == 0) {
      setMensajeError(`Error: Ingrese nombre de rol`);
    }
    else {
      document.body.style.cursor = 'wait'
      const reqBody = {
        authority,
        usuario
      };
      fetch('/api/roles/create', {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
      })
        .then(res => {
          if (!res.ok) {
            return res.text().then(text => { throw new Error(text) })
          }
          else {
            return res.text().then(
              res => {
                document.body.style.cursor = 'default'
                setMensajeError(`Rol "${res}" agregado correctamente`);
              }
            );
          }
        })
        .catch(err => {
          document.body.style.cursor = 'default'
          setMensajeError(err.toString());
        })
    }
  };

  const checkEnter = (e) => {
    const { key, keyCode } = e;
    if (keyCode === 13) {
      btnRegistrar();
    }
  };

  return (
    <>
      <div className="seccion registroBox">
        <h2>Registro de roles</h2>
        <hr />
        <label htmlFor="txtNom"><b>Nombre de rol</b></label>
        <input className="texto" type="text" placeholder="Ingrese nombre de rol..." onChange={handleChangeAuthority} onKeyDown={checkEnter}
          name="txtNom" />
        <input type="button" value="Registrar" onClick={btnRegistrar} className="btnRegistro" />
        <p className="mensaje-error">{mensajeError}</p>
      </div>
    </>
  );
};

RegistroRoles.propTypes = {};

export default withRouter(RegistroRoles);