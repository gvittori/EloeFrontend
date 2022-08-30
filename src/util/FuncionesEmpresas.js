import { withRouter, useHistory, Redirect } from 'react-router-dom';
import { decode } from './decode';
import { refresh } from './FuncionesBroadcast';




async function Eliminar(empresaCnpj) {
    try {
        const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
        const reqBody = {
            empresaCnpj,
            usuario
        }
        if (window.confirm("Deshabilitar empresa?")) {
            document.body.style.cursor = 'wait'
            const ok = await fetch('/api/empresas/delete', {
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
                    alert("Fallo en deshabilitación..."/*err.toString()*/);
                });
            //const data = await ok.json();
            if (ok) {
                alert("Empresa deshabilitada.")
            } else {
                alert("Empresa no deshabilitada.")
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
        const res = fetch('/api/empresas', {
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
    } catch (error) {
        alert("Token inválido.");
        refresh();
    }
}

async function Enviar(empresaCnpj) {
    try {
        const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
        if (window.confirm("Enviar factura de empresa seleccionada?")) {
            let condicion = false;
            if (window.confirm("Generar nueva factura en base de datos?")) {
                condicion = true;
            }
            const reqBody = {
                empresaCnpj,
                usuario,
                condicion
            }
            document.body.style.cursor = 'wait'
            const ok = await fetch('/api/empresas/enviar', {
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
            }).catch(err => {
                alert("Fallo en envío de factura..."/*err.toString()*/);
            });
            if (ok) {
                alert("Factura enviada.")
            } else {
                alert("Factura no enviada.")
            }
            document.body.style.cursor = 'default'
            return false
        }
    } catch (error) {
        alert("Token inválido");
    }



}


const Actualizar = (empresa, history) => {
    //const history = useHistory();
    history.push({
        pathname: '/UpdateEmpresa',
        //state: { empresa: JSON.stringify(empresa) }
    });
}


const Validar = () => {
    try {
        let obj = JSON.parse(sessionStorage.getItem("empresa"))
        if (
            obj.empresaNombre.length > 0 &&
            obj.empresaCnpj.length === 14 &&
            obj.empresaId > 0 &&
            obj.empresaMail.length > 0 &&
            obj.tazaClicks >= 0 &&
            obj.deuda >= 0 &&
            obj.totalAnual >= 0 &&
            obj.clicks.length >= 0 &&
            obj.clicksMes.length >= 0 &&
            (obj.activo === true || obj.activo === false)) {
            return obj
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}

export default withRouter({ Actualizar, Eliminar, Obtener, Validar, Enviar })


