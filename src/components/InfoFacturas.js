import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import DynamicTable from '../util/DynamicTable';

const InfoFacturas = () => {
    const [facturas, setFacturas] = useState([]);

    useEffect(() => {
        fetch('/api/facturas', {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                'Content-Type': 'application/json'
            },
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text) })
            }
            else {
                Promise.all([res.json()])
                    .then(([body]) => {
                        setFacturas(body);
                    });
            }
        })
    });

    return (
        <>
        <div className='flex-column'>
            <h3>Listado de facturas</h3>
            <hr />
            {facturas.length>0?
            <div>
                <DynamicTable TableData={facturas}/>
            </div>:<p>Cargando...</p>}
        </div>
        </>
    )

}

InfoFacturas.propTypes = {};
export default withRouter(InfoFacturas);