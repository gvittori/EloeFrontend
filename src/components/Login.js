import React, { useState, useEffect } from 'react';
import { withRouter, Link, useLocation, useHistory } from 'react-router-dom';
import { login } from '../util/FuncionesBroadcast';
import { useLocalState } from '../util/useLocalStorage';
import Titulo from './Titulo';

const Login = () => {
  const history = useHistory();
  const location = useLocation();
  //const from = location.state?.from?.pathname || "/";

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [jwt, setJwt] = useLocalState("", "jwt");

  useEffect(() => {
    if (jwt.length !== 0) {
      history.push('/');
    }
  }, []);

  const handleChangeUsername = ({ target: { value } }) => {
    setUsername(value);
  };

  const handleChangePassword = ({ target: { value } }) => {
    setPassword(value);
  };

  const btnClick = () => {
    if (!jwt) {
      if (username.length === 0) {
        setMensajeError("Ingrese nombre de usuario");
      } else if (password.length === 0) {
        setMensajeError("Ingrese una contraseña");
      } else {
        document.body.style.cursor = 'wait'
        const reqBody = {
          username,
          password,
        };
        fetch('api/auth/login', {
          headers: {
            "Content-Type": "application/json"
          },
          method: "post",
          body: JSON.stringify(reqBody)
        })
          .then(res => {
            if (!res.ok) {
              return res.text().then(text => { throw new Error(text) })
            }
            else {
              Promise.all([res.json(), res.headers])
                .then(([body, headers]) => {
                  setJwt(headers.get("authorization"));
                  document.body.style.cursor = 'default'
                  login();    
                });
            }
          })
          .catch(err => {
            setMensajeError("Credenciales invalidas");
            document.body.style.cursor = 'default'
          });
      }


    };


    /*setMensajeError('');

    var lista = JSON.parse(localStorage.getItem("usuarios"));
    
    lista.forEach(usu => {
      if (body.usuario === usu.usuario && body.password === usu.password) {
        sessionStorage.setItem('token', body.usuario);
        sessionStorage.setItem('userId', body.password);
        sessionStorage.setItem('tipo', usu.tipo);
        history.push('/');
      } else {
        setMensajeError("Nombre de usuario o contraseña incorrectos");
      }
    });*/


  };


  const checkEnter = (e) => {
    const { key, keyCode } = e;
    if (keyCode === 13) {
      btnClick();
    }
  };

  return (
    <>
      <div className='flex-column'>
        <div className="titulo">
          <Titulo />
        </div>
        <div className="loginBox">
          <label htmlFor="txtUsu"><b>Nombre de usuario</b></label>
          <input className="texto"
            type="text"
            placeholder="Ingrese el usuario..."
            onChange={handleChangeUsername}
            onKeyDown={checkEnter}
            name="txtUsu" />
          <label htmlFor="txtPass"><b>Contraseña</b></label>
          <input className="texto"
            type="password"
            placeholder="Ingrese la contraseña..."
            onChange={handleChangePassword}
            onKeyDown={checkEnter}
            name="txtPass" />
          <input type="button" value="Entrar" onClick={btnClick} className="btnRegistro" />
          <p className="mensaje-error">{mensajeError}</p>
        </div>
      </div>
    </>
  );
};

Login.propTypes = {};
export default withRouter(Login);
