import { ReactNode } from "react";
import { useChosenTrial } from "../Context/useChosenTrial";
import { INamed } from "../types/types";
import { TreeRow } from "./TreeRow";


export const TreeRowOnChosen = (props: {
  data: INamed;
  components: ReactNode;
  children?: ReactNode;
  boldName?: boolean;
  validateName?: (val: string) => string;
}) => {
  const { changeChosen } = useChosenTrial();
  return (
    <TreeRow
      onRename={newName => changeChosen(props.data.name, newName)}
      {...props} />
  );
};
