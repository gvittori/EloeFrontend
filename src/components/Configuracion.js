import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import MailConfig from './MailConfig';

const Configuracion = ({ history }) => {
    return (
      <>
        <div className="seccion">
          <div className="flex-column">
            <div className='flex-row'>
              <h3>Configuracion</h3>
            </div>
            <MailConfig/>
          </div>
        </div>
      </>
    );
  };
  
  Configuracion.propTypes = {};
  
  export default withRouter(Configuracion);