import React, { useState, useEffect, Component } from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import { decode } from '../util/decode';
import { refresh } from '../util/FuncionesBroadcast';



const RegistroEmpresas = ({ history }) => {
  const [empresaId, setId] = useState('');
  const [empresaNombre, setNombre] = useState('');
  const [empresaMail, setMail] = useState('');
  const [empresaCnpj, setCnpj] = useState('');
  const [tazaClicks, setTazaClicks] = useState(0);
  const [mensajeError, setMensajeError] = useState('');


  const handleChangeId = ({ target: { value } }) => {
    setId(value);
  };

  const handleChangeNombre = ({ target: { value } }) => {
    setNombre(value);
  };

  const handleChangeMail = ({ target: { value } }) => {
    setMail(value);
  };

  const handleChangeCnpj = ({ target: { value } }) => {
    setCnpj(value);
  };

  const handleChangeTazaClicks = ({ target: { value } }) => {
    setTazaClicks(value);
  };



  const btnRegistrar = () => {
    try {
      const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
      setMensajeError('');
      let msj = "";
      if (empresaId < 0 || empresaId > 2147483647) {
        msj += "Error: Id de empresa inválido\n";
      }
      if (empresaNombre.length == 0) {
        msj += `Error: Ingrese nombre de empresa\n`;
      }
      if (empresaNombre.length > 30) {
        msj += `Error: Nombre de empresa no puede exceder 30 caractéres\n`;
      }
      if (empresaMail.length == 0) {
        msj += `Error: Ingrese Email de contacto\n`;
      }
      if (empresaMail.length > 50) {
        msj += `Error: Error: Email no puede exceder 50 caractéres\n`;
      }
      const valido = empresaCnpj.replace(/\D/g, '');
      if (empresaCnpj.length !== 14 || empresaCnpj !== valido) {
        msj += `Error: Ingrese CNPJ valido\n`;
      }
      if (tazaClicks <= 0) {
        msj += `Error: Ingrese valor de taza por click\n`;
      }
      if (msj.length > 0) {
        setMensajeError(msj);
      } else {
        document.body.style.cursor = 'wait'
        const reqBody = {
          empresaId,
          empresaNombre,
          empresaMail,
          empresaCnpj,
          tazaClicks,
          usuario
        };
        fetch('/api/empresas/create', {
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
            return res.text().then(text => { throw new Error("Token inválido") })
          }
          else {
            return res.text().then(
              res => {
                document.body.style.cursor = 'default'
                setMensajeError(`Empresa "${res}" agregado correctamente`);
                refresh();
              }
            );
          }
        })
          .catch(err => {
            document.body.style.cursor = 'default'
            setMensajeError(err.toString());
          })
      }
    } catch (error) {
      alert("Token Inválido");
      refresh();
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
        <h2>Registro de empresas</h2>
        <hr />
        <label htmlFor="txtId"><b>ID de empresa (opcional)</b></label>
        <input className="texto" type="number" placeholder="Ingrese ID de empresa..." onChange={handleChangeId} onKeyDown={checkEnter}
          name="txtNom" />
        <label htmlFor="txtNom"><b>Nombre de empresa</b></label>
        <input className="texto" type="text" placeholder="Ingrese nombre de empresa..." onChange={handleChangeNombre} onKeyDown={checkEnter}
          name="txtNom" />
        <label htmlFor="txtMail"><b>Email de contacto</b></label>
        <input className="texto" type="text" placeholder="Ingrese Email de contacto..." onChange={handleChangeMail} onKeyDown={checkEnter}
          name="txtMail" />
        <label htmlFor="txtCnpj"><b>CNPJ</b></label>
        <input className="texto" type="text" placeholder="Ej: 11122233304444" onChange={handleChangeCnpj}
          name="txtCnpj" onKeyDown={checkEnter} />
        <label htmlFor="txtTaza"><b>Taza por click</b></label>
        <input className="texto" type="number" placeholder="Ingrese taza por click..." onChange={handleChangeTazaClicks} onKeyDown={checkEnter}
          name="txtTaza" />
        <input type="button" value="Registrar" onClick={btnRegistrar} className="btnRegistro" />
        <p className="mensaje-error">{mensajeError}</p>
      </div>
    </>
  );
};

RegistroEmpresas.propTypes = {};

export default withRouter(RegistroEmpresas);