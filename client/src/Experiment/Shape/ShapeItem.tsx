import { Delete } from "@mui/icons-material"
import { TreeRow } from "../../App/TreeRow"
import { ButtonTooltip } from "../../Utils/ButtonTooltip"
import { ShapeEditContent } from "./ShapeEditContent"

export const ShapeItem = ({ data, setData }) => {
    return (
        <TreeRow
            data={data}
            setData={setData}
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
        </TreeRow>
    )
}