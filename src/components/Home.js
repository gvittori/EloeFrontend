import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import GraficaClicks from '../util/GraficaClicks';
import ListadoEmpresas from './ListadoEmpresas';
import * as funciones from '../util/FuncionesEmpresas.js'

const Home = ({ history }) => {
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

  const promedioGananciasMes = () =>{
    return (gananciasMensuales()/listado.length);
  }

  const promedioGananciasAño = () =>{
    return (gananciasAnuales()/listado.length);
  }


  return (
    <>
      <div className="seccion">
        <div>
          <h2>Información general</h2>
          {listado.length > 0
            ? <div>
              <h4>Cantidad de empresas registradas: {listado.length}</h4>
              <h4>Ganancias del mes: ${gananciasMensuales()}</h4>
              <h4>Ganancias del año: ${gananciasAnuales()}</h4>
              <h4>Promedio de ganancias mensuales: ${promedioGananciasMes()}</h4>
              <h4>Promedio de ganancias anuales: ${promedioGananciasAño()}</h4>
              <ListadoEmpresas listado={listado} />
            </div>
            : <div><p>Cargando...</p></div>}
        </div>
        <div>
          <GraficaClicks listado={listado} />
        </div>
      </div>


    </>
  );
};

Home.propTypes = {};
export default withRouter(Home);
