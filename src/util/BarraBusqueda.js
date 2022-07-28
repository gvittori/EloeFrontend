import { useEffect, useState, useMemo } from "react";
const BarraBusqueda = ({options, data, func}) => {
    const [filtro, setFiltro] = useState(options[0]);
    const [busqueda, setBusqueda] = useState("");
    const [mensajeError, setMensajeError] = useState("");

    const handleChangeFiltro = ({ target: { value } }) => {
        setFiltro(value)
    }

    const handleChangeBusqueda = ({ target: { value } }) => {
        setBusqueda(value);
    }

    const buscar = () => {
        const reqBody = {
            filtro,
            busqueda
        }
        func(reqBody);
    }

    return (
        <>
            <label htmlFor="slcFiltro">Buscar por: </label>
            <select id="slcFiltro" defaultValue={options[0]} onChange={handleChangeFiltro}>
            {options.map((item, index) => (
                <option key={index} value={item}>{item}</option>
            ))}
            </select>
            <input type="text" onChange={handleChangeBusqueda}></input>
            <button onClick={() => buscar()}>Buscar</button>
            <p className="mensaje-error">{mensajeError}</p>
            <hr />
        </>
    )
}

export {BarraBusqueda}