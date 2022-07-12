import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

const Configuracion = ({ history }) => {
    return (
      <>
        <div className="seccion">
          <div className="item">
            <p>Configuracion</p>
          </div>
        </div>
      </>
    );
  };
  
  Configuracion.propTypes = {};
  
  export default withRouter(Configuracion);