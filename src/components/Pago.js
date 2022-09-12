import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';

function Pago(/*{ token, pagoId }*/) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    let history = useHistory();
    let params = new URLSearchParams(document.location.search);
    const paymentId = params.get("paymentId");
    const token = params.get("token");
    const payerId = params.get("PayerID");

    /*if (localStorage.getItem("jwt").length > 2) {
        history.push('/');
    } else {*/


    useEffect(() => {
        let reqBody = {
            paymentId,
            payerId
        }
        if (paymentId !== null && payerId !== null) {
            try {
                if (paymentId.length > 0 && payerId.length > 0) {
                    fetch('/api/facturas/pagos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(reqBody)
                    }).then(res => {
                        if (!res.ok) {
                            return res.text().then(text => { throw new Error(text) })
                        }
                        else {
                            setLoading(false);
                        }
                    })
                        .catch(err => {
                            setLoading(false);
                            setError(true);
                            console.log(err.toString());
                        });
                } else {
                    setLoading(false);
                    setError(true);
                }
            } catch (error) {
                setError(true);
                alert("ERROR");
            }
        } else {
            setLoading(false);
            setError(true);
        }
    }, [])

    return (
        <div className='center-screen'>
            {loading ?
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
                :
                <div className="pagoBox">
                    {!error ?
                        <>
                            <div>
                                <div className="iconBox">
                                    <i className="bi bi-check-lg"></i>
                                </div>
                            </div>
                            <div className='pagoText'>
                                <h2>Confirmación</h2>
                                <p>Pago realizado correctamente</p>
                            </div>
                            <h4>Puede cerrar esta ventana</h4>
                        </>
                        :
                        <>
                            <div className="iconBox error">
                                <i className="bi bi-x-lg"></i>
                            </div>
                            <div className='pagoText'>
                                <h2>Se produjo un error</h2>
                                <p>Intenté nuevamente o comuníquese con atención al cliente</p>
                            </div>
                        </>}
                </div>
            }

        </div>
    );
}

export default withRouter(Pago);
