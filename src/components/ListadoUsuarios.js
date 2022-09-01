import React, { useState, useEffect } from 'react';
import ItemUsuario from './ItemUsuario';
import { useLocalState } from '../util/useLocalStorage';
import { withRouter } from 'react-router-dom';
import { decode } from '../util/decode';
import { refresh } from '../util/FuncionesBroadcast';

const ListadoUsuarios = ({ history }) => {
    const disponible = "TODOS";
    const [listado, setListado] = useState([]);
    useEffect(() => {
        try {
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
                    if (err.toString().includes('"status":500')) {
                        console.log("Error: Token inválido o error interno");
                    }
                    else
                        console.log(err);
                });
        } catch (error) {
            alert("Token inválido.");
            refresh();
        }
    }, []);

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
        try {
            const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
            const reqBody = {
                username,
                usuario
            }
            if (window.confirm("Eliminar usuario?")) {
                fetch('/api/usuarios/delete', {
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
                        return res.text().then(
                            res => {
                                alert(`Usuario eliminado correctamente`);
                                handleChangeListado(username);
                            }
                        );
                    }
                })
                    .catch(err => {
                        if (err.toString().includes('"status":500')) {
                            alert("Error: Token inválido o error interno");
                        }
                        else
                            alert(err.toString());
                    });
            }
        } catch (error) {
            alert("Token inválido");
            refresh();
        }


    }


    return (
        <>{listado.length > 0 ? <div className="listaUsuarios">
            <h3>Listado de usuarios</h3>
            <ul>
                {listado.map((item, index) => (
                    !checkNombre(item.username) ?
                        (<li key={index}>
                            <ItemUsuario
                                username={item.username}
                                roles={item.roles} />
                            <button onClick={() => actualizar(item.username, item.roles)}>Actualizar datos</button>
                            <button onClick={() => eliminar(item.username)}>Deshabilitar usuario</button>
                            <hr />
                        </li>
                        ) : null
                ))
                }
            </ul>
        </div> : <div><p>Cargando...</p></div>}

        </>
    );

};



export default withRouter(ListadoUsuarios);
