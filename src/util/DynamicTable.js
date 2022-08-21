import { useEffect, useState, useMemo } from "react";
import Pagination from "./Pagination";

function DynamicTable({ TableData, num, facturas, update, inProgress }) {
  const [sortedConfig, setSortedConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(num === undefined ? TableData.length : num);

  let sortedItems = [...TableData];
  useMemo(() => {
    if (sortedConfig !== null) {
      sortedItems.sort((a, b) => {
        if (isNaN(+a[sortedConfig.key])) {
          if (sortedConfig.direction === "asc") {
            return a[sortedConfig.key].localeCompare(b[sortedConfig.key]);
          } else {
            return b[sortedConfig.key].localeCompare(a[sortedConfig.key]);
          }
        } else {
          if (sortedConfig.direction === "asc") {
            return a[sortedConfig.key] - b[sortedConfig.key];
          } else {
            return b[sortedConfig.key] - a[sortedConfig.key];
          }
        }

      });
      return sortedItems;
    }
  }, [sortedItems, sortedConfig]);

  useEffect(() => {
    if (TableData.length <= itemsPerPage) {
      setCurrentPage(1);
    }
  }, [TableData])


  // get table column
  const column = Object.keys(sortedItems[0]);

  // get table heading data
  const ThData = () => {
    return (
      <>
        {
          column.map((data) => {
            return <th key={data} className="dynamicTh">
              <span>{data.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1).join(" ")}</span>
              <button type="button" className="thButton" onClick={() => requestSort(data)}>
                <i className={iconChange(data)}></i>
              </button>
            </th>
          })
        }
        {facturas ?
          <>
            <th className="dynamicTh">Cambiar estado</th>
          </>
          : null}
      </>
    )
  }

  const iconChange = (data) => {
    if (sortedConfig && sortedConfig.key === data) {
      if (sortedConfig.direction === "asc") {
        return "bi bi-caret-up-fill";
      }
    }
    return "bi bi-caret-down-fill";
  }

  const cambioEstado = (data) => {
    update(data)
  }



  // get table row data
  const tdData = () => {
    return currentItems.map((data, index) => {
      return (
        <tr key={index}>
          {
            column.map((v, index) => {
              return <td key={index}>{data[v]}</td>
            })
          }
          {facturas ?
            <>
              <td><button disabled={inProgress?true:false} className="btnRegistro td" onClick={() => cambioEstado(data)}>Actualizar</button></td>
            </>
            : null}
        </tr>
      )
    })
  }




  const requestSort = (key) => {
    let direction = 'asc';
    if (sortedConfig !== null) {
      if (sortedConfig.key === key && sortedConfig.direction === 'asc') {
        direction = 'desc';
      }
    }
    setSortedConfig({ key, direction });
  }

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(TableData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => { setCurrentPage(pageNumber) };

  const paginateFront = () => { setCurrentPage(currentPage + 1 <= pageNumbers.length ? currentPage + 1 : currentPage) };
  const paginateBack = () => { setCurrentPage(currentPage - 1 > 0 ? currentPage - 1 : currentPage) };



  return (
    <>
      {sortedItems !== null ?
        <>
          <table className="table">
            <thead>
              <tr>{ThData()}</tr>
            </thead>
            <tbody>
              {tdData()}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} pageNumbers={pageNumbers} paginate={paginate} adelante={paginateFront} atras={paginateBack} />
        </>
        : <p>Cargando...</p>}

    </>
  )
}
export default DynamicTable;