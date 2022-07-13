import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import InfoEmpresas from './InfoEmpresas';

const DatosClientes = ({ history }) => {
  
    return (
      <>
        <div className="seccion">
          <div className="item">
            <h3>Datos Clientes</h3>
            <hr/>
            <InfoEmpresas/>
          </div>
        </div>
      </>
    );
  };
  
  DatosClientes.propTypes = {};
  
  export default withRouter(DatosClientes);