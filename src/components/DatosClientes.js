import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import InfoEmpresas from './InfoEmpresas';
import InfoFacturas from './InfoFacturas';

const DatosClientes = ({ history }) => {
  
    return (
      <>
        <div className="seccion">
          <div className="flex-column">
            <h3>Datos Clientes</h3>
          </div>
          <hr/>
          <div className='flex-row'>
            <InfoEmpresas/>
          </div>
        </div>
      </>
    );
  };
  
  DatosClientes.propTypes = {};
  
  export default withRouter(DatosClientes);