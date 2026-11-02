import React, { useReducer } from "react";
// FIXED: Import from the correct path
import { initialState, reducer } from "../../Utility/reducer"; // Adjust path based on your structure
// OR if reducer.jsx is in the same directory:
// import { initialState, reducer } from "./reducer";

export const DataContext = React.createContext();

export default function DataProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    return (
        <DataContext.Provider value={{ state, dispatch }}>
            {children}
        </DataContext.Provider>
    );
}