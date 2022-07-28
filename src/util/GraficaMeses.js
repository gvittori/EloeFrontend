import React from "react";
import { MDBContainer } from "mdbreact";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';

const GraficaMeses = ({ empresa }) => {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Novienmbre", "Diciembre"]
    const clickFecha = (mes) => {
        var arregloClicks = [];
        empresa.clicks.forEach(click => {
            var fecha = new Date(click.fechaHora);
            if (fecha.getMonth() + 1 === mes) {
                arregloClicks.push(click)
            }
        });
        return arregloClicks.length;
    }

    const arregloMeses = () => {
        var array = [];
        var i = 1;
        meses.forEach(mes => {
            array.push(clickFecha(i));
            i = i + 1;
        });
        return array;
    }

    const data = {
        labels: meses,
        datasets: [
            {
                label: "Empresa: " + empresa.empresaNombre,
                data: arregloMeses(),
                fill: true,
                backgroundColor: "rgba(6, 156,51, .3)",
                borderColor: "#02b844",
            }
        ]
    }

    return (
        <>
            <h3>Cantidad de clicks por meses</h3>
            <MDBContainer>
                <Line data={data} />
            </MDBContainer>
        </>

    );
}

export default GraficaMeses;