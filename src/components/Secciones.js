import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import ItemSecciones from './ItemSecciones';
import { useLocalState } from '../util/useLocalStorage';
import { decode } from '../util/decode';

const Secciones = ({ history }) => {
  const [inactivo, setInactivo] = useState(true);
  const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;

  const btnLogout = () => {
    localStorage.setItem('jwt', '""');
    return <Redirect to='/Login' />
  };



  const checkDisponible = (disponible) => {
    const array = decode(localStorage.getItem('jwt').slice(1, -1)).roles;
    const otroArray = [...disponible];
    var resultado = otroArray.filter(r1 => array.some(r2 => r1 === r2.authority))
    if (otroArray.some(rol => rol === 'TODOS') || resultado.length > 0) {
      return true
    } else {
      return false
    }
  }
  const itemsListado = [
    { nombre: "Home", icono: "bi bi-house", to: "/", exact: true, disponible: ["TODOS"] },
    {
      nombre: "Registro", icono: "bi bi-person-plus", to: "", exact: true, disponible: ["ROLE_ADMIN", "ROLE_MANTENIMIENTO"],
      subMenus: [
        { nombre: "Usuarios", to: "/RegistroUsuarios" },
        { nombre: "Empresas", to: "/RegistroEmpresas" },
        { nombre: "Roles", to: "/RegistroRoles" },
      ],
    },
    {
      nombre: "Datos clientes", icono: "bi bi-people-fill", to: "", exact: true, disponible: ["ROLE_ADMIN", "ROLE_MANTENIMIENTO"],
      subMenus: [
        { nombre: "Información", to: "/ClientesInfo" },
        { nombre: "Lista de facturas", to: "/ClientesFacturas" },
      ],
    },
    {
      nombre: "Datos usuarios", icono: "bi bi-person-badge", to: "", exact: true, disponible: ["ROLE_ADMIN"],
      subMenus: [
        { nombre: "Información", to: "/UsuariosInfo" },
        { nombre: "Lista de acciones", to: "/UsuariosAcciones" },
      ],
    },
    { nombre: "Configuración", icono: "bi bi-gear", to: "/Configuracion", exact: true, disponible: ["TODOS"] },
    { nombre: "Logout", icono: "bi bi-box-arrow-right", to: "/Login", exact: true, click: btnLogout, disponible: ["TODOS"] }
  ]

  const listItemSetInactivo = () => {
    if(inactivo){
      setInactivo(false);
    }
  }


  return (
    <>
      <div className={`menuSecciones ${inactivo ? "inactivo" : ""}`}>
        <div className="top">
          <button onClick={() => setInactivo(!inactivo)} className="iconoMenu">
            <i className="bi bi-list"></i>
          </button>
          <button onClick={() => setInactivo(!inactivo)} className="iconoIzquierda">
            <i className="bi bi-arrow-left-circle"></i>
          </button>
        </div>
        <hr className="lineaTop"></hr>
        <div className={`menuText menuText-ltr ${inactivo ? "inactivo" : ""}`}>
          <p>Logeado como: {usuario}</p>
        </div>
        <hr className="lineaTop"></hr>
        <div className="listado">
          <ul>
            {itemsListado.map((item, index) => (
              checkDisponible(item.disponible) ?
                (<ItemSecciones
                  key={index}
                  nombre={item.nombre}
                  icono={item.icono}
                  to={item.to}
                  exact={item.exact}
                  onClick={item.click}
                  subMenus={item.subMenus}
                  inactivo={inactivo}
                  open={listItemSetInactivo}/>) : null
            ))}
          </ul>
        </div>
      </div>
    </>);
};



export default Secciones;
