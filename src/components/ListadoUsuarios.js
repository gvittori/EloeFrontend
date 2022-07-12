import React, { useState, useEffect } from 'react';
import ItemUsuario from './ItemUsuario';
import { useLocalState } from '../util/useLocalStorage';
import { withRouter } from 'react-router-dom';

const ListadoUsuarios = ({ history }) => {
    const disponible = "TODOS";
    const [listado, setListado] = useState([]);
    useEffect(() => {
        fetch('/api/usuarios', {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text) })
            }
            else {
                Promise.all([res.json()])
                    .then(([body]) => {
                        setListado(body);
                    });

            }
        })
            .catch(err => {
                console.log(err);
            });



    }, []);

    const decode = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    };


    const checkNombre = (username) => {
        if (decode(localStorage.getItem('jwt').slice(1, -1)).sub === username) {
            return true;
        } else {
            return false;
        }
    }

    const actualizar = (username, roles) => {
        var usuario = {
            username,
            roles
        }
        history.push({
            pathname: '/UpdateUsuario',
            state: { usuario: JSON.stringify(usuario) }
        });
    }

    const handleChangeListado = (username) => {
        const nuevoListado = listado.map((item) => {
            if (item.username != username) {
                return item;
            }
        });
        setListado(nuevoListado.filter(element => {
            return element !== undefined;
        }));
    }

    const eliminar = (username) => {
        if (window.confirm("Eliminar usuario?")) {
            //console.log(JSON.stringify(username).slice(1,-1));
            fetch('/api/usuarios/delete', {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(username).slice(1, -1)
            }).then(res => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(text) })
                }
                else {
                    return res.text().then(
                        res => {
                            alert(`Usuario eliminado correctamente`);
                            handleChangeListado(username);
                        }
                    );
                }
            })
                .catch(err => {
                    alert(err.toString());
                });
        }

    }


    return (
        <>{listado.length>0?<div className="listaUsuarios">
        <h3>Listado de usuarios</h3>
        <ul>
            {listado.map((item, index) => (
                !checkNombre(item.username) ?
                    (<li key={index}>
                        <ItemUsuario
                            username={item.username}
                            roles={item.roles} />
                        <button onClick={() => actualizar(item.username, item.roles)}>Actualizar datos</button>
                        <button onClick={() => eliminar(item.username)}>Eliminar usuario</button>
                        <hr />
                    </li>
                    ) : null
            ))
            }
        </ul>
    </div>:<div><p>Cargando...</p></div>}
            
        </>
    );

};



export default withRouter(ListadoUsuarios);
