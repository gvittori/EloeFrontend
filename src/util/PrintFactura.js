const PrintFactura = (data) => {
    const listaClicks = () => {
        var stringLista = "";
        data.clicks.forEach(click => {
            stringLista +=`<li>
                <p>• Data e horario: ${click.fechaHora}</p>
                <p>• URL: ${click.clickUrl}</p>
                <p>• Origen: ${click.paisOrigen}</p>
            </li>`;
        });
        return stringLista;
    }

    let facturaPDF =
        `<h1>${data.nombre}</h1>
    <p>CNPJ: ${data.CNPJ}</p>
    <p>Limite Total: R$ ${data.limiteTotal}</p>

    <p>Essa e a sua fatura do mes do ${data.fecha.toLocaleString('pt-BR', { month: 'long' })}</p>

    <div>
        Valor: R$ ${data.deudaTotal}
    </div>
    <div>
        Vencimiento: ${data.vencimiento.toLocaleString('pt-BR')}
    </div>
    <p><strong>Resumo:</strong></p>
    <div className="facturaResumen">
        <p>Total de cliques: ${data.clicks.length}</p>
        <p>Taxa por clique: R$ ${data.tazaPorClick}</p>

        <strong>Valor Total: R$ ${data.deudaTotal}</strong>
    </div>
    <div>
        Detalhe:
        <ul>
            ${listaClicks()}
        </ul>
    </div>
    `;
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>Factura</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(facturaPDF);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

export default PrintFactura