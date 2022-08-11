import { withRouter, useHistory } from 'react-router-dom';
import { decode } from '../util/decode';

async function Eliminar(empresaNombre) {
    const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
    const reqBody ={
        empresaNombre,
        usuario
    }
    if (window.confirm("Deshabilitar empresa?")) {
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
                alert(err.toString());
            });
        const data = await ok.json();
        alert("Empresa deshabilitada...")
        return data;
    }
}

async function Obtener() {
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
}

const Actualizar = (empresa, history) => {
    //const history = useHistory();
    var empresa = {
        ...empresa
    }
    history.push({
        pathname: '/UpdateEmpresa',
        state: { empresa: JSON.stringify(empresa) }
    });
}

export default withRouter({ Actualizar, Eliminar, Obtener })


