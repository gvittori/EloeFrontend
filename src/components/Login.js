import React, { useState, useEffect } from 'react';
import { withRouter, Link, useLocation, useHistory } from 'react-router-dom';
import { useLocalState } from '../util/useLocalStorage';

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
                history.push("/");
              });
          }
        })
        .catch(err => {
          setMensajeError("Credenciales invalidas");
        });

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


  return (
    <>
      <div className="loginBox">
        <label htmlFor="txtUsu"><b>Nombre de usuario</b></label>
        <input className="texto"
          type="text"
          placeholder="Ingrese el usuario..."
          onChange={handleChangeUsername}
          name="txtUsu" />
        <label htmlFor="txtPass"><b>Contraseña</b></label>
        <input className="texto"
          type="password"
          placeholder="Ingrese la contraseña..."
          onChange={handleChangePassword}
          name="txtPass" />
        <input type="button" value="Entrar" onClick={btnClick} className="btnLogin" />
        <p className="mensaje-error">{mensajeError}</p>
      </div>
    </>
  );
};

Login.propTypes = {};
export default withRouter(Login);
