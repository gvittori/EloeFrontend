import React, { useState, useEffect } from 'react';
const Pagination = ({ currentPage, pageNumbers, paginate, adelante, atras }) => {
    const [clickKey, setKey] = useState(0);
    const [changed, setChanged] = useState(false);
    const totalPages = pageNumbers.length;
    let maxLength = 7; 


    const getPageItems = () => {
        if(maxLength<=5){
            maxLength=6;
        }
        let sideWidth = maxLength < 9 ? 1 : 2;
        let leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
        let rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
        if (totalPages <= maxLength) {
            // no breaks in list
            return range(1, totalPages);
        }
        if (currentPage <= maxLength - sideWidth - 1 - rightWidth) {
            // no break on left of page
            return range(1, maxLength - sideWidth - 1)
                .concat(0, range(totalPages - sideWidth + 1, totalPages));
        }
        if (currentPage >= totalPages - sideWidth - 1 - rightWidth) {
            // no break on right of page
            return range(1, sideWidth)
                .concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
        }
        // Breaks on both sides
        return range(1, sideWidth)
            .concat(0, range(currentPage - leftWidth, currentPage + rightWidth),
                0, range(totalPages - sideWidth + 1, totalPages));
    }

    const [pageItems, setPageItems] = useState(getPageItems());



    useEffect(() => {
        let el;
        let edge = clickKey;
        if (clickKey <= 0) {
            edge = 1;
        }
        if (clickKey > pageNumbers.length) {
            edge = pageNumbers.length;
        }
        setPageItems(getPageItems());
        pageItems.forEach(num => {
            el = document.getElementById(num);
            if(el!==null){
                if (parseInt(el.id) === edge) {
                    el.className = "page-link active";
                } else {
                    el.className = "page-link";
                }
            }
        });
    }, [changed])

    function range(start, end) {
        return Array.from(Array(end - start + 1), (_, i) => i + start);
    }

    

    const liClickFront = () => {
        setKey(currentPage + 1);
        adelante();
        setChanged(!changed);
    }

    const liClickBack = () => {
        setKey(currentPage - 1);
        atras();
        setChanged(!changed);
        
    }

    const liClickFirst = () => {
        setKey(1);
        paginate(1);
        setChanged(!changed);
        
    }

    const liClickLast = () => {
        setKey(totalPages);
        paginate(totalPages);
        setChanged(!changed);
    }

    const handleClick = event => {
        let num = parseInt(event.currentTarget.id);
        setKey(num);
        paginate(num);
        setPageItems(getPageItems());
        setChanged(!changed);
    };

    return (
        <nav>
            <ul className="pagination">
                <li className="page-item">
                    <a href="#/" onClick={() => liClickFirst()} className="page-link">
                        «
                    </a>
                </li>
                <li className="page-item">
                    <a href="#/" onClick={() => liClickBack()} className="page-link">
                        ←
                    </a>
                </li>
                {pageItems.map((number,index) => (
                    number != 0 ?
                        <li key={number} id={`li${number}`} className={"page-item"}>
                            <a id={number} onClick={handleClick} href="#/" className="page-link">
                                {number}
                            </a>
                        </li> :
                        <li key={number+"-"+index}className={"page-item"}>
                            <a className="page-link inactive">
                                ...
                            </a>
                        </li>
                ))}
                <li className="page-item">
                    <a onClick={() => liClickFront()} href="#/" className="page-link">
                        →
                    </a>
                </li>
                <li className="page-item">
                    <a href="#/" onClick={() => liClickLast()} className="page-link">
                        »
                    </a>
                </li>
            </ul>
        </nav>

    )
}
export default Pagination