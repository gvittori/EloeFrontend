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
        <header className="titulo">
          <Titulo />
        </header>
        <div className="App-content">
          <Router>
            <Switch>
              <Route path={"/"} exact><PrivateRoute allowedRoles={roles1}><Secciones /><Home /></PrivateRoute>
              </Route>

              <Route path={"/Login"} exact><Login /></Route>
              <Route path={"/Registro/Usuarios"} exact><PrivateRoute allowedRoles={roles2}><Secciones /><RegistroUsuarios/></PrivateRoute></Route>

              <Route path={"/Registro/Empresas"} exact><PrivateRoute allowedRoles={roles2}><Secciones /><RegistroEmpresas/></PrivateRoute></Route>

              <Route path={"/Registro/Roles"} exact><PrivateRoute allowedRoles={roles2}><Secciones /><RegistroRoles/></PrivateRoute></Route>

              <Route path={"/Clientes/Info"} exact><PrivateRoute allowedRoles={roles2}><Secciones /><InfoEmpresas/></PrivateRoute></Route>

              <Route path={"/Clientes/Facturas"} exact><PrivateRoute allowedRoles={roles3}><Secciones /><InfoFacturas/></PrivateRoute></Route>

              <Route path={"/Usuarios/Info"} exact><PrivateRoute allowedRoles={roles3}><Secciones /><InfoUsuarios/></PrivateRoute></Route>

              <Route path={"/Usuarios/Acciones"} exact><PrivateRoute allowedRoles={roles3}><Secciones /> <LogAcciones/></PrivateRoute></Route>

              <Route path={"/Configuracion"} exact><PrivateRoute allowedRoles={roles1}><Secciones /><Configuracion /></PrivateRoute></Route>

              <Route path={"/UpdateUsuario"} exact><PrivateRoute allowedRoles={roles2}><Secciones /><UpdateUsuario /></PrivateRoute></Route>

              <Route path={"/UpdateEmpresa"} exact><PrivateRoute allowedRoles={roles2}><Secciones /><UpdateEmpresa /></PrivateRoute></Route>
            </Switch>
          </Router>
        </div>
      </div>
    </SiteTracking>
  );

}


export default App;
