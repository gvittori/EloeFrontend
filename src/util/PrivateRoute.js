import React from "react";
import { Redirect } from "react-router-dom";
import { useLocalState } from "./useLocalStorage";
import { useHistory } from "react-router-dom";
import { decode } from '../util/decode';


const PrivateRoute = ({ children, allowedRoles }) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const history = useHistory();
    if (jwt.length > 0) {
        var tokenDecodificado = decode(jwt);
        if(tokenDecodificado !== null){
            if (!esVencido(tokenDecodificado)) {
                var roles = tokenDecodificado.roles;
                if (contieneRol(roles, allowedRoles)) {
                    return children
                } else {
                    return <Redirect to="/" />
                }
            }
        }   
    }
    return <Redirect to="/Login" />

    /*
    if (jwt.length > 0) {
        var tokenDecodificado = decode(jwt);
        if (tokenDecodificado !== null) {
            var val = esVencido(tokenDecodificado);
            if (!val) {
                var roles = tokenDecodificado.roles;
                if (contieneRol(roles, allowedRoles)) {
                    return children
                } else {
                    return <Redirect to="/" />
                }
            }else{
                asyncLocalStorage.setItem('jwt', '""').then(function () {history.push("/Login")});
            }
        }
    } else{
        asyncLocalStorage.setItem('jwt', '""').then(function () {history.push("/Login")});
    }*/
}

const asyncLocalStorage = {
    setItem: function (key, value) {
        return Promise.resolve().then(function () {
            localStorage.setItem(key, value);
        });
    },
    getItem: function (key) {
        return Promise.resolve().then(function () {
            return localStorage.getItem(key);
        });
    }
};

const esVencido = (token) => {
    var vencido = false;
    var fecha = new Date();
    if (parseInt(fecha.getTime().toString().slice(0, -3)) > token.exp) {
        vencido = true;
        localStorage.setItem('jwt', '""');
    }
    return vencido;
}

/*const esVencido = (token) => {
    var fecha = new Date().getTime().toString().slice(0, -3);
    var val = parseInt(fecha);
    if (val > token.exp) {
        return true;
    }
    return false;
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





export default PrivateRoute