import { useEffect, useState, useMemo } from "react";
import Pagination from "./Pagination";

function DynamicTable({ TableData, reset }) {
  const [sortedConfig, setSortedConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  let sortedItems = [...TableData];
  useMemo(() => {
    if (sortedConfig !== null) {
      sortedItems.sort((a, b) => {
        if (sortedConfig.direction === "asc") {
          return a[sortedConfig.key].localeCompare(b[sortedConfig.key]);
        } else {
          return b[sortedConfig.key].localeCompare(a[sortedConfig.key]);
        }
      });
      return sortedItems;
    }
  }, [sortedItems, sortedConfig]);

  useEffect(()=>{
    if(TableData.length<=itemsPerPage){
      setCurrentPage(1);
    }
  },[TableData])

  // get table column
  const column = Object.keys(sortedItems[0]);

  // get table heading data
  const ThData = () => {

    return column.map((data) => {
      return <th key={data} >
        <button type="button" onClick={() => requestSort(data)}>{data}</button>
      </th>
    })
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {setCurrentPage(pageNumber)};

  

  return (
    <>
      {sortedItems !== null ? <>
        <table className="table">
          <thead>
            <tr>{ThData()}</tr>
          </thead>
          <tbody>
            {tdData()}
          </tbody>
        </table>
        <Pagination itemsPerPage={itemsPerPage} totalItems={TableData.length} paginate={paginate} />
      </>
        : <p>Cargando...</p>}

    </>
  )
}
export default DynamicTable;