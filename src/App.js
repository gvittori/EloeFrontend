import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Titulo from './components/Titulo';
import Login from './components/Login';
import Home from './components/Home';
import RegistroUsuarios from './components/RegistroUsuarios';
import Reportes from './components/Reportes';
import DatosUsuarios from './components/DatosUsuarios';
import DatosClientes from './components/DatosClientes';
import Configuracion from './components/Configuracion';
import PageNotFound from './components/PageNotFound';
import Secciones from './components/Secciones';
import PrivateRoute from './util/PrivateRoute';
import RegistroEmpresas from './components/RegistroEmpresas';
import RegistroRoles from './components/RegistroRoles';
import UpdateUsuario from './components/UpdateUsuario';
import UpdateEmpresa from './components/UpdateEmpresa';
import InfoEmpresas from './components/InfoEmpresas';

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

  const roles1 = ["ROLE_ADMIN", "ROLE_USER", "ROLE_MANTENIMIENTO"];
  const roles2 = ["ROLE_ADMIN", "ROLE_MANTENIMIENTO"];
  const roles3 = ["ROLE_ADMIN"];

  return (
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
            <Route path={"/Registro"} exact><PrivateRoute allowedRoles={roles2}><Secciones /><RegistroUsuarios /><RegistroEmpresas /><RegistroRoles /></PrivateRoute></Route>
            {/*<Route path={"/Reportes"} exact><PrivateRoute allowedRoles={roles1}><Secciones /><Reportes /></PrivateRoute></Route>*/}
            <Route path={"/DatosClientes"} exact><PrivateRoute allowedRoles={roles2}><Secciones /><DatosClientes /></PrivateRoute></Route>
            <Route path={"/DatosUsuarios"} exact><PrivateRoute allowedRoles={roles3}><Secciones /><DatosUsuarios /></PrivateRoute></Route>
            <Route path={"/Configuracion"} exact><PrivateRoute allowedRoles={roles1}><Secciones /><Configuracion /></PrivateRoute></Route>
            <Route path={"/UpdateUsuario"} exact><PrivateRoute allowedRoles={roles2}><Secciones /><UpdateUsuario /></PrivateRoute></Route>
            <Route path={"/UpdateEmpresa"} exact><PrivateRoute allowedRoles={roles2}><Secciones /><UpdateEmpresa /></PrivateRoute></Route>
          </Switch>
        </Router>
      </div>
    </div>
  );

}

export default App;
