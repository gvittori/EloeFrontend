import React from "react";
import { Redirect } from "react-router-dom";
import { useLocalState } from "./useLocalStorage";



const PrivateRoute = ({ children, allowedRoles }) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    if (jwt.length > 0) {
        var tokenDecodificado = decode(jwt);
        if (!esVencido(jwt)) {
            var roles = tokenDecodificado.roles;
            if (contieneRol(roles, allowedRoles)) {
                return children
            } else {
                return <Redirect to="/" />
            }
        }
    }
    return <Redirect to="/Login" />

    /*if (!esValido(jwt)) {
        return <Redirect to="/Login" />
    } else if (contieneRol(roles, allowedRoles)) {
        return children
    } else {
        return <Redirect to="/" />
    }*/
    /*return esValido(jwt)
        ? contieneRol(roles, allowedRoles)
            ? children 
            : <Redirect to="/" />
        : <Redirect to="/Login" />*/
}

const esVencido = (token) => {
    var vencido = false;
    var fecha = new Date();
    if (parseInt(fecha.getTime().toString().slice(0, -3)) > token.exp) {
        vencido = true;
        localStorage.setItem('jwt', '""');
        localStorage.setItem('roles', '""');
        localStorage.setItem('username', '""');
    }
    return vencido;
}



/*const esValido = (token) => {
    var valido = true;
    if (token.length <= 0) {
        valido = false;
    } else {
        var tokenDecodificado = decode(token);
        var fecha = new Date();
        if (parseInt(fecha.getTime().toString().slice(0, -3)) > tokenDecodificado.exp) {
            valido = false;
            localStorage.setItem('jwt', '""');
            localStorage.setItem('roles', '""');
            localStorage.setItem('username', '""');
        }
    }
    return valido;
}*/

const contieneRol = (roles, allowedRoles) => {
    var contiene = false;
    roles.forEach(rol => {
        allowedRoles.forEach(allowedRol => {
            if (rol.authority === allowedRol) {
                contiene = true;
            }
        });
    });
    return contiene;
}

const decode = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};




export default PrivateRoute