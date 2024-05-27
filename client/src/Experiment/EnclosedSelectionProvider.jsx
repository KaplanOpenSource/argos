import { createContext, useState } from "react"

export const EnclosingListSelectionContext = createContext();

export const EnclosingListSelectionProvider = ({ noSelection = false, children }) => {
    const [selectionOnEnclosingUuids, setSelectionOnEnclosingUuids] = useState(noSelection ? undefined : []);
    return (
        <EnclosingListSelectionContext.Provider
            value={{
                selectionOnEnclosingUuids,
                setSelectionOnEnclosingUuids: noSelection ? () => { } : setSelectionOnEnclosingUuids,
            }}
        >
            {children}
        </EnclosingListSelectionContext.Provider>
    )
}