import React, { useState, useEffect, Component } from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select'
import { decode } from '../util/decode';
import Multiselect from "react-widgets/Multiselect";
import { refresh } from '../util/FuncionesBroadcast';



const RegistroUsuarios = ({ history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState([]);
  const [mensajeError, setMensajeError] = useState('');
  const [listaRoles, setListaRoles] = useState([]);

  useEffect(() => {
    try {
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
        })
    } catch (error) {
      alert("Token inválido.");
      refresh();
    }

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
    try {
      const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
      setMensajeError('');
      let msj = "";
      if (username.length == 0) {
        msj += `Error: Ingrese nombre de usuario\n`;
      }
      if (username.length > 30) {
        msj += `Error: Nombre de usuario no puede exceder 30 caractéres\n`;
      }
      if (password.length == 0) {
        msj += `Error: Ingrese contraseña de usuario\n`;
      }
      if (roles.length == 0) {
        msj += `Error: Seleccione rol de usuario\n`;
      }
      if (msj.length > 0) {
        setMensajeError(msj);
      }
      else {
        document.body.style.cursor = 'wait'
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
          body: JSON.stringify(reqBody)
        }).then(res => {
          if (!res.ok) {
            return res.text().then(text => { throw new Error(text) })
          }
          else {
            return res.text().then(
              res => {
                document.body.style.cursor = 'default'
                setMensajeError(`Usuario "${res}" agregado correctamente`);
                refresh();
              }
            );
          }
        })
          .catch(err => {
            document.body.style.cursor = 'default';
            if (err.toString().includes('"status":500')) {
              setMensajeError("Error: Token inválido o error interno");
            }
            else setMensajeError(err.toString());
          });
      }
    } catch (error) {
      alert("Token inválido.");
      refresh();
    }

  };

  const checkClick = (item) => {
    if (!roles.includes(item)) {
      roles.push(item);
    } else {
      setRoles(current =>
        current.filter(rol => {
          return rol !== item;
        }),
      );
    }
  }

  const checkEnter = (e) => {
    const { key, keyCode } = e;
    if (keyCode === 13) {
      btnRegistrar();
    }
  };

  return (
    <>
      <div className="seccion registroBox">
        <h2>Registro de usuarios</h2>
        <hr />
        <label htmlFor="txtUsu"><b>Nombre de usuario</b></label>
        <input className="texto" type="text" placeholder="Ingrese el usuario..." onChange={handleChangeUsername} onKeyDown={checkEnter}
          name="txtUsu" />
        <label htmlFor="txtPass"><b>Contraseña</b></label>
        <input className="texto" type="password" placeholder="Ingrese la contraseña..." onChange={handleChangePassword} onKeyDown={checkEnter}
          name="txtPass" />
        <label htmlFor="slcTipo"><b>Tipo de usuario</b></label>
        {listaRoles.length > 0 ?
          <Multiselect
            className='multiselect'
            placeholder='Seleccione uno o multiples roles'
            dataKey="rolId"
            textField="authority"
            data={listaRoles}
            onChange={roles => setRoles(roles)}
            onKeyDown={checkEnter} /> : <p>Cargando roles..</p>}

        {/*listaRoles.length > 0 ? listaRoles.map((item, index) => (
          <div key={index} >
            <label htmlFor={item.authority}>{item.authority} - </label>
            <input type="checkbox" onClick={() => checkClick(item)} id={item.authority} />
          </div>
        )) : <p>Cargando roles...</p>*/}
        {/*<select className='select'name="slcTipo" onChange={handleChangeRoles} defaultValue={'Default'}>
        <option value="Default" disabled>Seleccione un rol</option>
          {listaRoles.map((item, index) => (
              <option key={index} value={JSON.stringify(item)}>{item.authority}</option>
          ))}
          </select>*/}
        <input type="button" value="Registrar" onClick={btnRegistrar} className="btnRegistro" />
        <p className="mensaje-error">{mensajeError}</p>
      </div>
    </>
  );
};

RegistroUsuarios.propTypes = {};

export default withRouter(RegistroUsuarios);
