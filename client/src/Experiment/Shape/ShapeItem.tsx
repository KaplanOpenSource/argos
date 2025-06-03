import { Delete } from "@mui/icons-material"
import { TreeRowOnChosen } from "../../App/TreeRow"
import { ButtonTooltip } from "../../Utils/ButtonTooltip"
import { ShapeEditContent } from "./ShapeEditContent"

export const ShapeItem = ({ data, setData }) => {
  return (
    <TreeRowOnChosen
      data={data}
      components={
        <>
          <ButtonTooltip
            tooltip="Delete shape"
            onClick={() => setData(undefined)}
          >
            <Delete />
          </ButtonTooltip>
        </>
      }
    >
      <ShapeEditContent
        data={data}
        setData={setData}
      />
    </TreeRowOnChosen>
  )
}