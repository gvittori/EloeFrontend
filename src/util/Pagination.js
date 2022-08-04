import React, { useState, useEffect } from 'react';
const Pagination = ({currentPage, pageNumbers, paginate, adelante, atras }) => {
    const [clickKey, setKey] = useState(0);
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        let el;
        let edge = clickKey;
        if(clickKey<=0){
            edge=1;
        }
        if(clickKey>pageNumbers.length){
            edge=pageNumbers.length;
        }
        pageNumbers.forEach(num => {
            el = document.getElementById(num);
            if (parseInt(el.id) === edge) {
                el.className = "page-link active";
            } else {
                el.className = "page-link";
            }
        });
    }, [changed])

    const liClickFront = () => {
        setKey(currentPage+1);
        setChanged(!changed);
        adelante()
    }

    const liClickBack = () => {
        setKey(currentPage-1);
        setChanged(!changed);
        atras();
    }

    const handleClick = event => {
        let num = parseInt(event.currentTarget.id);
        setKey(num);
        setChanged(!changed);
        paginate(num);
    };

    return (
        <nav>
            <ul className="pagination">
                <li className="page-arrow">
                    <a onClick={() => liClickBack()} href="#/" className="page-link">
                        ←
                    </a>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <a id={number} onClick={handleClick} href="#/" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
                <li className="page-arrow">
                    <a onClick={() => liClickFront()} href="#/" className="page-link">
                        →
                    </a>
                </li>
            </ul>
        </nav>

    )
}
export default Pagination