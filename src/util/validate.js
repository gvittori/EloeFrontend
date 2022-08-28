import { decode } from "./decode";

export const validate = (token) => {
    try {
        let token = decode(localStorage.getItem('jwt').slice(1, -1))
        if (
            obj.empresaNombre.length > 0 &&
            obj.empresaCnpj.length === 14 &&
            obj.empresaId > 0 &&
            obj.empresaMail.length > 0 &&
            obj.tazaClicks >= 0 &&
            obj.deuda >= 0 &&
            obj.totalAnual >= 0 &&
            obj.clicks.length >= 0 &&
            obj.clicksMes.length >= 0 &&
            (obj.activo === true || obj.activo === false)) {
            return obj
        } else {
            return null
        }
    } catch (error) {
        return null
    }
};