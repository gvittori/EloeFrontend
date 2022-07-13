import { withRouter, useHistory } from 'react-router-dom';

async function Eliminar(empresaNombre) {
    if (window.confirm("Eliminar empresa?")) {
        const ok = await fetch('/api/empresas/delete', {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empresaNombre).slice(1, -1)
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


