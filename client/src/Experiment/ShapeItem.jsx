import { Delete } from "@mui/icons-material"
import { TreeRow } from "../App/TreeRow"
import { ButtonTooltip } from "../Utils/ButtonTooltip"

export const ShapeItem = ({ data, setData }) => {
    // const fixedData = data?.name ? data : {...data, name: }
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
            {JSON.stringify(data)}
        </TreeRow>
    )
}