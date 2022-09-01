import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import GraficaClicks from '../util/GraficaClicks';
import ListadoEmpresas from './ListadoEmpresas';
import * as funciones from '../util/FuncionesEmpresas.js'
import { usePageTracking } from "react-event-tracker";




const Home = ({ props, history }) => {
  /*usePageTracking({
    page: "Home",
  });*/

  const [listado, setListado] = useState([]);
  useEffect(() => {
    funciones.default.Obtener().then(result => setListado(result));
  }, []);


  const gananciasMensuales = () => {
    var total = 0;
    listado.forEach(e => {
      total += e.deuda;
    });
    return total;
  }

  const gananciasAnuales = () => {
    var total = 0;
    listado.forEach(e => {
      total += e.totalAnual;
    });
    return total;
  }

  const promedioGananciasMes = () => {
    return Math.ceil((gananciasMensuales() / listado.length));
  }

  const promedioGananciasAño = () => {
    return Math.ceil((gananciasAnuales() / listado.length));
  }



  return (
    <>
      <div className="seccion">
        <div className="flex-column">
          <h2>Información general</h2>
          <hr />
        </div>
        {listado.length > 0
          ? <div className="flex-row">
            <div className='flex-column centerBox homeBox'>
              <h4>• Cantidad de empresas registradas: {listado.length}</h4>
              <h4>• Ganancias del mes: ${gananciasMensuales()}</h4>
              <h4>• Ganancias del año: ${gananciasAnuales()}</h4>
              <h4>• Promedio de ganancias mensuales: ${promedioGananciasMes()}</h4>
              <h4>• Promedio de ganancias anuales: ${promedioGananciasAño()}</h4>
            </div>
            <ListadoEmpresas listado={listado} num={4}/>
          </div>
          : <div><p>Cargando...</p></div>}
        <div className="flex-column">
          <GraficaClicks listado={listado} />
        </div>
      </div>


    </>
  );
};

Home.propTypes = {};
export default withRouter(Home);
