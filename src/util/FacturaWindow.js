import { default as DynamicTable } from '../util/DynamicTable.js'
import { renderToString } from 'react-dom/server'
import { useState } from 'react'
import { useHistory, withRouter } from 'react-router';

const FacturaWindow = ({data}) => {
    const fechaMes = new Date();
    const fechaV = new Date();
    return (
        <>
        {data!==null?<div className='seccion flex-column facturaDiv'>
                <h1>Eloe Energy</h1>
                <hr />
                <div className='flex-column centerBox whiteBox'>
                    <h2>{data.empresaNombre}</h2>
                    <p>• CNPJ: {data.empresaCnpj}</p>
                    <p>• Limite Total: R$ 1000</p>
                </div>
                <h3>Essa e a sua fatura do mes do {fechaMes.toLocaleString('pt-BR', { month: 'long' })}</h3>
                <hr />
                <div className='flex-row'>
                    <div className='centerBox whiteBox'>
                        Valor: R$ {data.deuda}
                    </div>
                    <div className='centerBox whiteBox'>
                        Vencimiento: {new Date(fechaV.setMonth(fechaV.getMonth() + 1)).toLocaleString('pt-BR')}
                    </div>
                </div>
                <strong>Resumo:</strong>
                <hr />
                <div className="flex-column centerBox whiteBox">
                    <p>• Total de cliques: {data.clicksMes.length}</p>
                    <p>• Taxa por clique: R$ {data.tazaClicks}</p>
                    <h3>• Valor Total: R$ {data.deuda}</h3>
                </div>
                <strong>Detalhe:</strong>
                <hr />
                <div>
                    <DynamicTable TableData={data.clicksMes} pdf={true}/>
                </div>
            </div>:<h3>No hay empresa</h3>}
            
        </>
    )


/*    
    const history = useHistory();
    const [data, setData] = useState(JSON.parse(sessionStorage.getItem("printEmp")));
    if (data === null) {
        history.push("/");
    } else {
        const fechaMes = new Date();
        const fechaV = new Date();
        return (
            <>
                <div className='seccion flex-column facturaDiv'>
                    <h1>Eloe Energy</h1>
                    <hr />
                    <div className='flex-column centerBox whiteBox'>
                        <h2>{data.empresaNombre}</h2>
                        <p>• CNPJ: {data.empresaCnpj}</p>
                        <p>• Limite Total: R$ 1000</p>
                    </div>
                    <h3>Essa e a sua fatura do mes do {fechaMes.toLocaleString('pt-BR', { month: 'long' })}</h3>
                    <hr />
                    <div className='flex-row'>
                        <div className='centerBox whiteBox'>
                            Valor: R$ {data.deuda}
                        </div>
                        <div className='centerBox whiteBox'>
                            Vencimiento: {new Date(fechaV.setMonth(fechaV.getMonth() + 1)).toLocaleString('pt-BR')}
                        </div>
                    </div>
                    <strong>Resumo:</strong>
                    <hr />
                    <div className="flex-column centerBox whiteBox">
                        <p>• Total de cliques: {data.clicksMes.length}</p>
                        <p>• Taxa por clique: R$ {data.tazaClicks}</p>
                        <h3>• Valor Total: R$ {data.deuda}</h3>
                    </div>
                    <strong>Detalhe:</strong>
                    <hr />
                    <div>
                        <DynamicTable TableData={data.clicksMes} />
                    </div>
                </div>
            </>
        )
    }
*/
}




export default /*withRouter(*/FacturaWindow//)

/*<ul>
            ${listaClicks()}
        </ul>*/