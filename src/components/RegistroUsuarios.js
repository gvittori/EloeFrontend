import React, { useState, useEffect, Component } from 'react';
import { withRouter } from 'react-router-dom';
import  Select from 'react-select'
import { decode } from '../util/decode';



const RegistroUsuarios = ({ history }) => {
  const disponible = "ROLE_ADMIN";
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState(null);
  const [mensajeError, setMensajeError] = useState('');
  const [listaRoles, setListaRoles]= useState([]);

  useEffect(() => {

      fetch('/api/roles', {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => Promise.all([response.json()]))
        .then(([body]) => {
          setListaRoles(body);
        });
    }, []);


  const handleChangeUsername = ({ target: { value } }) => {
    setUsername(value);
  };

  const handleChangePassword = ({ target: { value } }) => {
    setPassword(value);
  };

  const handleChangeRoles = ({ target: { value } }) => {
    let obj = JSON.parse(value);
    setRoles([obj]);  
  };




  const btnRegistrar = () => {
    const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
    setMensajeError('');
    if(username.length == 0){
        setMensajeError(`Error: Ingrese nombre de usuario`);
    } else
    if(password.length == 0){
        setMensajeError(`Error: Ingrese contraseña de usuario`);
    } else
    if(roles.length == 0){
        setMensajeError(`Error: Seleccione rol de usuario`);
    } else {
        const reqBody = {
            username,
            password,
            roles,
            usuario
        };
        fetch('/api/usuarios/create', {
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
                  setMensajeError(`Usuario "${res}" agregado correctamente`);
              }
           );
         }    
        })
        .catch(err => {
          setMensajeError(err.toString());
        });
    }

  };

  return (   
    <>
      <div className="seccion registroBox">
      <h2>Registro de usuarios</h2>
        <label htmlFor="txtUsu"><b>Nombre de usuario</b></label>
        <input className="texto" type="text" placeholder="Ingrese el usuario..." onChange={handleChangeUsername} 
            name="txtUsu"/>
        <label htmlFor="txtPass"><b>Contraseña</b></label>
        <input className="texto" type="password" placeholder="Ingrese la contraseña..." onChange={handleChangePassword}
            name="txtPass"/>
        <label htmlFor="slcTipo"><b>Tipo de usuario</b></label>
        <select className='select'name="slcTipo" onChange={handleChangeRoles} defaultValue={'Default'}>
        <option value="Default" disabled>Seleccione un rol</option>
          {listaRoles.map((item, index) => (
              <option key={index} value={JSON.stringify(item)}>{item.authority}</option>
          ))}
        </select>
        <input type="button" value="Registrar" onClick={btnRegistrar} className="btnRegistro"/>
        <p className="mensaje-error">{mensajeError}</p>
      </div>
    </>
  );
};

RegistroUsuarios.propTypes = {};

export default withRouter(RegistroUsuarios);
