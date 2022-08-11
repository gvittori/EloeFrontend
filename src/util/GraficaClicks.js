import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

import { withRouter } from 'react-router-dom';

const GraficaClicks = ({listado}) => {
    Chart.register(...registerables);
    //const [empresas, setEmpresas] = useState(listado);
    /*
        useEffect(() => {
            fetch('/api/empresas', {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                    'Content-Type': 'application/json'
                }
            }).then((response) => Promise.all([response.json()]))
                .then(([body]) => {
                    setEmpresas(body);
                });
        }, []);*/

    const contarClicks = () => {
        let cant = 0;
        let data = [];
        listado.forEach((item) => {
            cant = item.clicks.length;
            data = [...data, cant];
        });
        return data;
    }
    const data = {
        labels: listado.map((item) => (item.empresaNombre)),
        datasets: [
            {
                label: '# de clicks por empresa',
                data: contarClicks(),
                fill: true,
                backgroundColor: "rgba(6, 156,51, .3)",
                borderColor: "#02b844",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(6, 156, 51)",
            },
        ],
    };
    return (
        <>{listado.length>0
            ? <div className='header'>
                <h3 className='title'>Total de clicks por empresa</h3>
                <hr/>
                <Bar data={data} /*options={options}*/ />
                <hr />
            </div>
            : <div><p>Cargando...</p></div>}
        </>
    );
}
export default withRouter(GraficaClicks);