import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import ListadoUsuarios from './ListadoUsuarios';
import { default as LogAcciones } from '../components/LogAcciones'
import InfoUsuarios from './InfoUsuarios';
import { refresh } from '../util/FuncionesBroadcast';

const DatosUsuarios = ({ history }) => {
  const [listado, setListado] = useState([]);


  useEffect(() => {
    try {
      fetch('/api/usuarios', {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (!res.ok) {
          return res.text().then(text => { throw new Error(text) })
        }
        else {
          Promise.all([res.json()])
            .then(([body]) => {
              setListado(body);
            });

        }
      })
        .catch(err => {
          if (err.toString().includes('"status":500')) {
            console.log("Error: Token inválido o error interno");
          }
          else  
          console.log(err);
        });
    } catch (error) {
      alert("Token inválido.");
      refresh();
    }
  }, []);

  return (
    <>
      <div className="seccion">
        <div className="item">
          <h3>Datos Usuarios</h3>
          <hr />
          <InfoUsuarios />
          {/*<ListadoUsuarios history={history} usuarios={listado} />*/}
        </div>
        <div>
          <LogAcciones />
        </div>
      </div>
    </>
  );
};

DatosUsuarios.propTypes = {};

export default withRouter(DatosUsuarios);