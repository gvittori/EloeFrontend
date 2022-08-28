import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Titulo from './components/Titulo';
import Login from './components/Login';
import Home from './components/Home';
import Reportes from './components/Reportes';
import DatosUsuarios from './components/DatosUsuarios';
import DatosClientes from './components/DatosClientes';
import Configuracion from './components/Configuracion';
import PageNotFound from './components/PageNotFound';
import Secciones from './components/Secciones';
import PrivateRoute from './util/PrivateRoute';
import UpdateUsuario from './components/UpdateUsuario';
import UpdateEmpresa from './components/UpdateEmpresa';
import Registros from './components/Registros';
import RegistroUsuarios from './components/RegistroUsuarios';
import RegistroEmpresas from './components/RegistroEmpresas';
import RegistroRoles from './components/RegistroRoles';
import InfoEmpresas from './components/InfoEmpresas';
import InfoFacturas from './components/InfoFacturas';
import FacturaWindow from './util/FacturaWindow'
import PagoWindow from './util/PagoWindow'
import { default as LogAcciones } from './components/LogAcciones'
import InfoUsuarios from './components/InfoUsuarios';
import { useSiteTracking } from "react-event-tracker";

const trackingConfig = {
  siteData: {
    site: "EloeApp",
  },
  pageTracking: {
    trackPageView: ({ siteData, pageData }) => {
      console.log(JSON.stringify(siteData) + " | " + JSON.stringify(pageData));
    },
  },
  eventTracking: {
    trackEvent: ({ siteData, pageData, eventData }) => {
      console.log(JSON.stringify(eventData));
    },
  },
};

const App = () => {

  /*
    const usuarios = [
      {usuario:"Usuario1", password:"asdasd", tipo: "Admin"},
      {usuario:"Usuario2", password:"qweqwe", tipo: "Admin"}
    ]
  
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  
  
    if (sessionStorage.getItem('token') === null && sessionStorage.getItem('userId') === null && sessionStorage.getItem('tipo') === null) {
      sessionStorage.setItem('token', null);
      sessionStorage.setItem('userId', null);
      sessionStorage.setItem('tipo', null);
    }*/
  const { SiteTracking } = useSiteTracking(trackingConfig);

  const roles1 = ["ROLE_ADMIN", "ROLE_USER", "ROLE_MANTENIMIENTO"];
  const roles2 = ["ROLE_ADMIN", "ROLE_MANTENIMIENTO"];
  const roles3 = ["ROLE_ADMIN"];

  return (
    <SiteTracking>
      <div className="App">

        <div className="App-content">
          <Router>
            <Switch>
              <Route path={"/"} exact><PrivateRoute allowedRoles={roles1} homeRoles={roles1}><Secciones /><Home /></PrivateRoute>
              </Route>

              <Route path={"/Login"} exact><Login /></Route>
              <Route path={"/RegistroUsuarios"} exact><PrivateRoute allowedRoles={roles2} homeRoles={roles1}><Secciones /><RegistroUsuarios /></PrivateRoute></Route>

              <Route path={"/RegistroEmpresas"} exact><PrivateRoute allowedRoles={roles2} homeRoles={roles1}><Secciones /><RegistroEmpresas /></PrivateRoute></Route>

              <Route path={"/RegistroRoles"} exact><PrivateRoute allowedRoles={roles2} homeRoles={roles1}><Secciones /><RegistroRoles /></PrivateRoute></Route>

              <Route path={"/ClientesInfo"} exact><PrivateRoute allowedRoles={roles2} homeRoles={roles1}><Secciones /><InfoEmpresas /></PrivateRoute></Route>

              <Route path={"/ClientesFacturas"} exact><PrivateRoute allowedRoles={roles3} homeRoles={roles1}><Secciones /><InfoFacturas /></PrivateRoute></Route>

              <Route path={"/UsuariosInfo"} exact><PrivateRoute allowedRoles={roles3} homeRoles={roles1}><Secciones /><InfoUsuarios /></PrivateRoute></Route>

              <Route path={"/UsuariosAcciones"} exact><PrivateRoute allowedRoles={roles3} homeRoles={roles1}><Secciones /> <LogAcciones /></PrivateRoute></Route>

              <Route path={"/Configuracion"} exact><PrivateRoute allowedRoles={roles1} homeRoles={roles1}><Secciones /><Configuracion /></PrivateRoute></Route>

              <Route path={"/UpdateUsuario"} exact><PrivateRoute allowedRoles={roles2} homeRoles={roles1} ><Secciones /><UpdateUsuario /></PrivateRoute></Route>

              <Route path={"/UpdateEmpresa"} exact><PrivateRoute allowedRoles={roles2} homeRoles={roles1}><Secciones /><UpdateEmpresa /></PrivateRoute></Route>

              {/*<Route path={"/facturaWindow"} exact><PrivateRoute allowedRoles={roles2} homeRoles={roles1}><FacturaWindow /></PrivateRoute></Route>*/}

              <Route path={"/Pago"} exact><PagoWindow/></Route>

              <Route path={"*"} exact><PrivateRoute allowedRoles={roles1} homeRoles={roles1}><Secciones /><Home /></PrivateRoute>
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
    </SiteTracking>
  );

}


export default App;