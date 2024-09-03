import { Delete } from "@mui/icons-material"
import { TreeRow } from "../App/TreeRow"
import { ButtonTooltip } from "../Utils/ButtonTooltip"
import { SelectProperty } from "../Property/SelectProperty"
import { Case, SwitchCase } from "../Utils/SwitchCase"
import { Stack, TextField } from "@mui/material"

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
            <SelectProperty
                label="Type"
                data={data.type || "Polyline"}
                setData={type => setData({ ...data, type })}
                options={[
                    { name: "Polygon" },
                    { name: "Polyline" },
                    { name: "Circle" },
                ]}
            // tooltipTitle="Where can this attribute's value be changed"
            />
            <SwitchCase test={data.type || "Polyline"}>
                <Case value={"Circle"}>
                    <TextField
                        label="Radius"
                        value={data.radius || 0}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                    <TextField
                        label="Center X"
                        value={(data?.center || [])[0] || 0}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                    <TextField
                        label="Center Y"
                        value={(data?.center || [])[1] || 0}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                </Case>
                <Case isDefault={true}>
                    <Stack direction='column'>
                        {data?.coordinates?.map((coords, i) => (
                            <Stack direction='row'>
                                <TextField
                                    label="X"
                                    value={(coords || [])[0] || 0}
                                    InputLabelProps={{ shrink: true }}
                                    size="small"
                                />
                                <TextField
                                    label="Y"
                                    value={(coords || [])[1] || 0}
                                    InputLabelProps={{ shrink: true }}
                                    size="small"
                                />
                            </Stack>
                        ))}
                    </Stack>
                </Case>
            </SwitchCase>
        </TreeRow>
    )
}