import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import ListadoUsuarios from './ListadoUsuarios';


const DatosUsuarios = ({ history }) => {
  const [listado, setListado] = useState([]);
  useEffect(() => {
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
            console.log(err);
        });
}, []);

    return (
      <>
        <div className="seccion">
          <div className="item">
            <h3>Datos Usuarios</h3>
            <hr/>
            <ListadoUsuarios history={history} usuarios={listado}/>
          </div>     
        </div>
      </>
    );
  };
  
  DatosUsuarios.propTypes = {};
  
  export default withRouter(DatosUsuarios);