import { BroadcastChannel } from 'broadcast-channel';
import * as funcionesEmp from './FuncionesEmpresas.js'
import * as funcionesUsr from '../util/FuncionesUsuarios'

const logoutChannel = new BroadcastChannel('logout');
const loginChannel = new BroadcastChannel('login');
const refreshChannel = new BroadcastChannel('refresh');

export const refresh = () => {
    refreshChannel.postMessage({type:"REFRESH"})
    window.location.reload();
}

export const setDataEmp = (object) => {
    refreshChannel.postMessage({type:"UPDATE_EMP", object:object});
    let emp = funcionesEmp.default.Validar();
    if(emp!==null && object!==null){
        if(emp.empresaId===object.empresaId){
            sessionStorage.setItem("empresa",JSON.stringify(object));
        }
    }
    window.location.reload();
}

export const setDataUsr = (object) => {
    refreshChannel.postMessage({type:"UPDATE_USR", object:object});
    let usr = funcionesUsr.default.Validar();
    if(usr!==null && object!==null){
        if(usr.usuId===object.usuId){
            sessionStorage.setItem("usr",JSON.stringify(object));
        }
    }
    window.location.reload();
}

export const refreshAllTabs = () => {
    refreshChannel.onmessage = (data) => {
        switch (data.type) {
            case "REFRESH": {
                refresh();
                refreshChannel.close();
                break;
            }
            case "UPDATE_EMP":{
                setDataEmp(data.object);
                refreshChannel.close();
                break;
            }
            case "UPDATE_USR":{
                setDataUsr(data.object);
                refreshChannel.close();
                break;
            }
            default: break;
        }
    }
}

export const login = () => {
    loginChannel.postMessage("Login")
    window.location.href = window.location.origin + "/";
}

export const loginAllTabs = () => {
    loginChannel.onmessage = () => {
        login();
        loginChannel.close();
    }
}


export const logout = () => {
    logoutChannel.postMessage("Logout")
    localStorage.setItem('jwt', '""');
    sessionStorage.clear();
    window.location.href = window.location.origin + "/";
}

export const logoutAllTabs = () => {
    logoutChannel.onmessage = () => {
        logout();
        logoutChannel.close();
    }
}