import { default as DynamicTable } from './DynamicTable.js'
import { renderToString } from 'react-dom/server'
import { Component } from 'react'
import { useHistory, withRouter, useParams } from 'react-router';
import Pago from '../components/Pago';


export default class PagoWindow extends Component {
    render() {
        let params = new URLSearchParams(document.location.search);
        const paymentId = params.get("paymentId");
        const token = params.get("token");
        const payerId = params.get("PayerID");
        return (
            <div>
                <Pago token={token} pagoId={paymentId}></Pago>
            </div>
        )
    }
}
