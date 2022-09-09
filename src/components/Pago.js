function Pago(/*{ token, pagoId }*/) {
    let params = new URLSearchParams(document.location.search);
    const paymentId = params.get("paymentId");
    const token = params.get("token");
    const payerId = params.get("PayerID");

    //const ejecutarPago = () => {
    let reqBody = {
        paymentId,
        payerId
    }
    console.log(reqBody);
    try {
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
                console.log("OKAY")
            }
        })
            .catch(err => {
                console.log(err.toString());
            });

    } catch (error) {
        alert("ERROR");
    }


    //let miToken = generarToken();
    //const pago = obtenerPago();

    //ejecutarPago();


    return (
        <>
            <div>
                <p>Pago realizado correctamente</p>
            </div>
        </>
    );
}

export default Pago;
