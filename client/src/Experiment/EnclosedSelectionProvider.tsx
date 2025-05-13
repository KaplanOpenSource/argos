import { createContext, useState } from "react";

type IEnclosingListSelectionStore = {
  selectionOnEnclosingUuids: string[] | undefined,
  setSelectionOnEnclosingUuids: (val?: string[] | undefined) => void,
};

export const EnclosingListSelectionContext = createContext<IEnclosingListSelectionStore | null>(null);

export const EnclosingListSelectionProvider = ({ noSelection = false, children }) => {
  const [selectionOnEnclosingUuids, setSelectionOnEnclosingUuids] = useState<string[] | undefined>(noSelection ? undefined : []);
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