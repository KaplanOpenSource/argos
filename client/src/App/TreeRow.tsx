import { Box } from "@mui/material";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { ReactNode } from "react";
import { useChosenTrial } from "../Context/useChosenTrial";
import { useExperiments } from "../Context/useExperiments";
import { INamed } from "../types/types";
import { TextFieldDebounce } from "../Utils/TextFieldDebounce";

export const TreeRow = ({
  data,
  setData,
  onRename,
  components,
  children,
  boldName = false,
  validateName = (_val) => '',
}: {
  data: INamed,
  setData?: (newData: INamed) => any, // optional for legacy usages
  onRename?: (newName: string) => any, // optional to allow legacy not to change
  components: ReactNode,
  children?: ReactNode,
  boldName?: boolean,
  validateName?: (val: string) => string,
}) => {
  const { } = useExperiments();
  const { name } = data;

  if (!data) {
    return null;
  }

  const BOLD_PROPS = {
    InputProps: {
      style: {
        fontWeight: 'bold',
      },
    }
  };

  const handleChange = (val: string) => {
    if (onRename) {
      onRename(val);
    } else if (setData) {
      setData({ ...data, name: val });
    }
  }

  return (
    <TreeItem
      key={data.trackUuid!}
      nodeId={data.trackUuid!}
      label={
        <div style={{ pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'all', display: 'inline-block' }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
            }}>
              <TextFieldDebounce
                sx={{ padding: '5px' }}
                variant="outlined"
                size="small"
                label="Name"
                InputLabelProps={{ shrink: true }}
                value={name}
                onChange={handleChange}
                disabled={!onRename && !setData}
                {...(boldName ? BOLD_PROPS : {})}
                validate={validateName}
              />
              {components}
            </Box>
          </div>
        </div>
      }
    >
      {children}
    </TreeItem>
  )
}

export const TreeRowOnChosen = (props: {
  data: INamed,
  components: ReactNode,
  children?: ReactNode,
  boldName?: boolean,
  validateName?: (val: string) => string,
}) => {
  const { changeChosen } = useChosenTrial();
  return (
    <TreeRow
      onRename={newName => changeChosen(props.data.name, newName)}
      {...props}
    />
  )
}