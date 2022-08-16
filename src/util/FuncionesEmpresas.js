import { withRouter, useHistory } from 'react-router-dom';
import { decode } from '../util/decode';

async function Eliminar(empresaCnpj) {
    const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
    const reqBody ={
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
                alert(err.toString());
            });
        const data = await ok.json();
        alert("Empresa deshabilitada...")
        document.body.style.cursor = 'default'
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

export default withRouter({ Actualizar, Eliminar, Obtener, Validar })


