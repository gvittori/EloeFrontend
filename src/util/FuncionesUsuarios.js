import { withRouter, useHistory } from 'react-router-dom';
import { decode } from '../util/decode';

async function Eliminar(username) {
    const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
    const reqBody = {
        username,
        usuario
    }
    if (window.confirm("Deshabilitar usuario?")) {
        const ok = await fetch('/api/usuarios/delete', {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text) })
            }
            else {
                return res
            }
        })
            .catch(err => {
                alert(err.toString());
            });
        const data = await ok.json();
        alert("Usuario deshabilitado.");
        return data;
    }
}

async function Obtener() {
    const res = fetch('/api/usuarios', {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => Promise.all([response.json()]))
        .then(([body]) => {
            return body;
        });
    return res;
}

const Actualizar = (usuario, history) => {
    //const history = useHistory();
    history.push({
        pathname: '/UpdateUsuario',
        //state: { usuario: JSON.stringify(usuario) }
    });
}

const Validar = () => {
    try {
        let obj = JSON.parse(sessionStorage.getItem("usr"));
        if (
            (obj.accountNonExpired===true||obj.accountNonExpired===false)&&
            (obj.accountNonLocked===true||obj.accountNonLocked===false)&&
            (obj.activo===true||obj.activo===false)&&
            (obj.credentialsNonExpired===true||obj.credentialsNonExpired===false)&&
            (obj.enabled===true||obj.enabled===false)&&
            obj.username.length>0&&
            obj.usuId>0&&
            obj.password.length>0&&
            obj.authorities.length>0&&
            obj.roles.length>0
           ) {
            return obj
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}

export default withRouter({ Actualizar, Eliminar, Obtener, Validar })


