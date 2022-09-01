import { withRouter, useHistory } from 'react-router-dom';
import { decode } from './decode';
import { refresh } from './FuncionesBroadcast';

async function Eliminar(username) {
    try {
        const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
        const reqBody = {
            username,
            usuario
        }
        if (window.confirm("Deshabilitar usuario?")) {
            document.body.style.cursor = 'wait'
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
                    if (err.toString().includes('"status":500')) {
                        alert("Fallo en deshabilitación: Token inválido o error interno.");
                    }
                    else alert("Fallo en deshabilitación: " + err.toString());
                });
            //const data = await ok.json();
            if (ok) {
                alert("Usuario deshabilitado.")
            } else {
                alert("Usuario no deshabilitado.")
            }
            document.body.style.cursor = 'default'
            return ok;
        }
    } catch (error) {
        alert("Token invalido");
    }

}

async function Obtener() {
    try {
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
                body.forEach(usr => {
                    delete usr["password"];
                })
                return body;
            });
        return res;
    } catch (error) {
        alert("Token inválido.");
        refresh();
    }

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
            (obj.accountNonExpired === true || obj.accountNonExpired === false) &&
            (obj.accountNonLocked === true || obj.accountNonLocked === false) &&
            (obj.activo === true || obj.activo === false) &&
            (obj.credentialsNonExpired === true || obj.credentialsNonExpired === false) &&
            (obj.enabled === true || obj.enabled === false) &&
            obj.username.length > 0 &&
            obj.usuId > 0 &&
            //obj.password.length>0&&
            obj.authorities.length > 0 &&
            obj.roles.length > 0
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


