import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PrintFactura from '../util/PrintFactura';

const EmpresaItem = (props) => {
    const fecha = new Date();
    const { nombre, mail, clicks, deuda, taza, cnpj } = props;
    const [data, setData] = useState(
        {   
            "nombre":nombre,
            "CNPJ": cnpj,
            "limiteTotal": "1000",
            "clicks":clicks,
            "tazaPorClick": taza,
            "vencimiento": new Date(fecha.setMonth(fecha.getMonth()+1)),
            "deudaTotal": deuda,
            "fecha": fecha
        });

    return (
        <li>
            <div>
                <p>• Nombre de la empresa: {nombre}</p>
                <p>• CNPJ: {cnpj}</p>
                <p>• Email de contacto: {mail}</p>
                <p>• Cantidad de clicks: {clicks.length}</p>
                <p>• Deuda del mes: {deuda}</p>
            </div>
            <button onClick={() => PrintFactura(data)}>Imprimir factura</button>
            <br></br>
        </li>
    );

};


export default EmpresaItem;