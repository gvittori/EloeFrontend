import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import RegistroUsuarios from './RegistroUsuarios';
import RegistroEmpresas from './RegistroEmpresas';
import RegistroRoles from './RegistroRoles';

const Registros = ({ history }) => {
    return (
        <>
            <div className="seccion">
                <div className="flex-column">
                    <h3>Registros</h3>
                </div>
                <hr/>
                <div className="flex-row">
                    <RegistroUsuarios />
                    <RegistroEmpresas />
                    <RegistroRoles />
                </div>

            </div>
        </>
    );
};

Registros.propTypes = {};

export default withRouter(Registros);