import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Multiselect from "react-widgets/Multiselect";
import "react-widgets/styles.css";
import { refresh } from '../util/FuncionesBroadcast';
import { decode } from '../util/decode';

const MailConfig = ({ history }) => {
    const [active, setActive] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    const [dias, setDias] = useState([])
    const listadoDias = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

    const elementDias =
        dias.map((dia) => (
            <div key={dia}>
                <label htmlFor={dia}>{dia} - </label>
                <input type="checkbox" onClick={() => console.log(dia)} id={dia} />
            </div>
        ));

    const [opcion, setOpcion] = useState("Ultimo");

    const handleChangeOpcion = ({ target: { value } }) => {
        setOpcion(value);
    }

    const guardarConfig = () => {
        try {
            const usuario = decode(localStorage.getItem('jwt').slice(1, -1)).sub;
            document.body.style.cursor = 'wait'
            const reqBody = {
                opcion,
                dias,
                usuario
            };
            fetch('/api/mail/setconfig', {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt').slice(1, -1)}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody)
            })
                .then(res => {
                    if (!res.ok) {
                        return res.text().then(text => { throw new Error("Token Inválido.") })
                    }
                    else {
                        return res.text().then(
                            res => {
                                document.body.style.cursor = 'default'
                                setMensajeError(`Día de envio seteado como: ${res}`);
                                refresh();
                            }
                        );
                    }
                })
                .catch(err => {
                    document.body.style.cursor = 'default'
                    setMensajeError(err.toString());
                })
        } catch (error) {
            alert("Token inválido.");
            refresh();
        }

    }

    const checkEnter = (e) => {
        const { key, keyCode } = e;
        if (keyCode === 13) {
            guardarConfig();
        }
    };


    return (
        <>
            <div className="flex-column registroBox">
                <h4>Configuración de día de envío de mails: </h4>
                <select defaultValue={opcion} onChange={handleChangeOpcion}>
                    <option value="Primero">Primer día del mes</option>
                    <option value="Ultimo">Ultimo día del mes</option>
                    <option value="Custom">Personalizado</option>
                </select>
                {opcion === "Custom" ?
                    <Multiselect
                        className='multiselect'
                        placeholder='Seleccione uno o multiples dias'
                        data={listadoDias}
                        onChange={dias => setDias(dias)}
                        onKeyDown={checkEnter}
                    />
                    : null}
                <input type="button" value="Guardar" className="btnRegistro" onClick={guardarConfig} />
                <p className="mensaje-error">{mensajeError}</p>
            </div>
        </>
    );
};

MailConfig.propTypes = {};

export default withRouter(MailConfig);