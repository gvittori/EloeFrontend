import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import InfoEmpresas from './InfoEmpresas';
import Secciones from './Secciones';

const Reportes = ({ history }) => {

    return (
      <>
        <div className="seccion">
          <div className="item">
            <p>Reportes</p>
            <hr/>
            <InfoEmpresas/>
          </div>
          
        </div>
      </>
    );
  };
  
  Reportes.propTypes = {};
  
  export default withRouter(Reportes);