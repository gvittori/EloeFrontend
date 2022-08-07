import React, { useState, useEffect, Component } from 'react';
import { withRouter } from 'react-router-dom';
import  Select from 'react-select';
import { decode } from '../util/decode';



const RegistroEmpresas = ({ history }) => {
  const [empresaNombre, setNombre] = useState('');
  const [empresaMail, setMail] = useState('');
  const [empresaCnpj, setCnpj] = useState('');
  const [tazaClicks, setTazaClicks] = useState(0);
  const [mensajeError, setMensajeError] = useState('');


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
    const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
    setMensajeError('');
    if(empresaNombre.length == 0){
        setMensajeError(`Error: Ingrese nombre de empresa`);
    } else
    if(empresaMail.length == 0){
        setMensajeError(`Error: Ingrese Email de contacto`);
    } else
    if(empresaCnpj.length < 14){
        setMensajeError(`Error: Ingrese CNPJ valido`);
    } else 
    if(tazaClicks <= 0){
        setMensajeError(`Error: Ingrese valor de taza por click`);
    } 
    else {
        const reqBody = {
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
          body:JSON.stringify(reqBody)
        }).then(res => 
            {
            if(!res.ok) {
              return res.text().then(text => { throw new Error(text) })
             }
            else {
             return res.text().then(
                res => {
                    setMensajeError(`Empresa "${res}" agregado correctamente`);
                }
             );
           }    
          })
          .catch(err => {
            setMensajeError(err.toString());
          }) 
    }

  };

  return (   
    <>
      <div className="seccion registroBox">
      <h2>Registro de empresas</h2>
        <label htmlFor="txtNom"><b>Nombre de empresa</b></label>
        <input className="texto" type="text" placeholder="Ingrese nombre de empresa..." onChange={handleChangeNombre} 
            name="txtNom"/>
        <label htmlFor="txtMail"><b>Email de contacto</b></label>
        <input className="texto" type="text" placeholder="Ingrese Email de contacto..." onChange={handleChangeMail}
            name="txtMail"/>
        <label htmlFor="txtCnpj"><b>CNPJ</b></label>
        <input className="texto" type="text" placeholder="Ej: 11122233304444" onChange={handleChangeCnpj}
            name="txtCnpj"/>
        <label htmlFor="txtTaza"><b>Taza por click</b></label>
        <input className="texto" type="number" placeholder="Ingrese taza por click..." onChange={handleChangeTazaClicks}
            name="txtTaza"/>
        <input type="button" value="Registrar" onClick={btnRegistrar} className="btnRegistro"/>
        <p className="mensaje-error">{mensajeError}</p>
      </div>
    </>
  );
};

RegistroEmpresas.propTypes = {};

export default withRouter(RegistroEmpresas);