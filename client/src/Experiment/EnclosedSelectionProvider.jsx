import { createContext, useState } from "react"

export const EnclosingListSelectionContext = createContext();

export const EnclosingListSelectionProvider = ({ children }) => {
    const [selectionOnEnclosingUuids, setSelectionOnEnclosingUuids] = useState([]);
    return (
        <EnclosingListSelectionContext.Provider
            value={{
                selectionOnEnclosingUuids,
                setSelectionOnEnclosingUuids,
            }}
        >
            {children}
        </EnclosingListSelectionContext.Provider>
    )
}