import React from "react";
import { MDBContainer } from "mdbreact";
import { Bar } from "react-chartjs-2";


const GraficaSemanas = ({ empresa }) => {

  const semanas = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"]
  const clickFecha = (semana) => {
    var arregloClicks = [];

    empresa.clicksMes.forEach(click => {
      var fecha = new Date(click.fechaHora);
      var date = fecha.getDate();
      var day = fecha.getDay();
      var weekOfMonth = Math.ceil((date - 1 - day) / 7);
      console.log(weekOfMonth);
      if (weekOfMonth === semana) {
        arregloClicks.push(click)
      }
    });
    return arregloClicks.length;
  }



  const arregloSemanas = () => {
    var array = [];
    var i = 1;
    semanas.forEach(semana => {
      array.push(clickFecha(i));
      i = i + 1;
    });
    return array;
  }
  const data = {
    labels: semanas,
    datasets: [
      {
        label: "Empresa: " + empresa.empresaNombre,
        data: arregloSemanas(),
        fill: true,
        backgroundColor: "rgba(6, 156,51, .3)",
        borderColor: "#02b844",
      }
    ]
  }

  return (
    <>
      <h3>Cantidad de clicks por semana</h3>
      {empresa.clicksMes.length>0?<MDBContainer>
        <Bar data={data}
          style={{ maxHeight: '600px' }}
        />
      </MDBContainer>:<h4>No hubo clicks generados este mes</h4>}     
    </>
  );
}

export default GraficaSemanas;