import {useEffect, useState} from "react"
import { Redirect } from 'react-router-dom';

function useLocalState(defaultValue, key){
    const [value, setValue] = useState(() => {
        const localStorageValue = localStorage.getItem(key);
        try {
            return localStorageValue !== null ? JSON.parse(localStorageValue) : defaultValue;
        } catch (error) {
            return defaultValue;
        }
        
    });

    useEffect(() => {
        localStorage.setItem(key,JSON.stringify(value))
    },[key,value]);

    return [value, setValue]
}

export {useLocalState}