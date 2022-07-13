import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PrintFactura from '../util/PrintFactura';

const ItemEmpresa = (props) => {
    const fecha = new Date();
    const fechaV = new Date();
    const { nombre, mail, clicks, deuda, taza, cnpj, anual } = props;

    const filtroClicksMes = () => {
        const clicksFiltrados = [];
        clicks.forEach(click => {
            var clickFecha = new Date(click.fechaHora);
            if(clickFecha.getMonth()+1 === fecha.getMonth()+1){
                clicksFiltrados.push(click);
            }
        });
        return clicksFiltrados;
    }

    const clicksFiltrados = filtroClicksMes();
    const [data, setData] = useState(
        {
            "nombre": nombre,
            "CNPJ": cnpj,
            "limiteTotal": "1000",
            "clicks": clicksFiltrados,
            "tazaPorClick": taza,
            "vencimiento": new Date(fechaV.setMonth(fechaV.getMonth() + 1)),
            "deudaTotal": deuda,
            "fecha": fecha

        });

return (
    <>
        <div>
            <p>• Nombre de la empresa: {nombre}</p>
            <p>• CNPJ: {cnpj}</p>
            <p>• Email de contacto: {mail}</p>
            <p>• Clicks totales: {clicks.length}</p>
            <p>• Cantidad de clicks del mes: {clicksFiltrados.length}</p>
            <p>• Deuda del mes: {deuda}</p>
            <p>• Total anual: {anual}</p>
        </div>
        <button onClick={() => PrintFactura(data)}>Imprimir factura</button>
       
    </>
);

};


export default ItemEmpresa;