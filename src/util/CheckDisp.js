const CheckDisp = (disponible) => {
    if(disponible.includes("TODOS") || localStorage.getItem('roles').includes(disponible)){
        return true;
    } else {
        return false;
    }
}

export default CheckDisp