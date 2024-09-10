import { Add, Delete } from "@mui/icons-material"
import { TreeRow } from "../App/TreeRow"
import { ButtonTooltip } from "../Utils/ButtonTooltip"
import { SelectProperty } from "../Property/SelectProperty"
import { Case, SwitchCase } from "../Utils/SwitchCase"
import { Stack, TextField } from "@mui/material"
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce"

export const ShapeItem = ({ data, setData }) => {
    const changeItem = (arr, index, newVal) => {
        return index < arr.length ? arr.map((x, i) => i === index ? newVal : x) : [...arr, newVal];
    }
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
            />
            <SwitchCase test={data.type || "Polyline"}>
                <Case value={"Circle"}>
                    <TextFieldDebounceOutlined
                        label="Radius"
                        value={data.radius || 0}
                        type='number'
                        onChange={v => setData({ ...data, radius: parseFloat(v) })}
                    />
                    <TextFieldDebounceOutlined
                        label="Center X"
                        value={(data?.center || [])[0] || 0}
                        type='number'
                        onChange={v => setData({ ...data, center: [parseFloat(v), data?.center?.at(1) || 0] })}
                    />
                    <TextFieldDebounceOutlined
                        label="Center Y"
                        value={(data?.center || [])[1] || 0}
                        type='number'
                        onChange={v => setData({ ...data, center: [data?.center?.at(0) || 0, parseFloat(v)] })}
                    />
                </Case>
                <Case isDefault={true}>
                    <>
                        <ButtonTooltip
                            tooltip="Add coordinate"
                            onClick={() => setData({ ...data, coordinates: changeItem(data?.coordinates || [], 1e10, [0, 0]) })}
                        >
                            <Add />
                        </ButtonTooltip>
                        <Stack direction='column'>
                            {data?.coordinates?.map((coords, i) => {
                                const x = (coords || [])[0] || 0;
                                const y = (coords || [])[1] || 0;
                                const setCoord = (newCoords) => {
                                    setData({ ...data, coordinates: changeItem(data?.coordinates || [], i, newCoords) })
                                }
                                return (
                                    <Stack direction='row'>
                                        <TextFieldDebounceOutlined
                                            label="X"
                                            value={x}
                                            type='number'
                                            onChange={v => setCoord([parseFloat(v), y])}
                                        />
                                        <TextFieldDebounceOutlined
                                            label="Y"
                                            value={y}
                                            type='number'
                                            onChange={v => setCoord([x, parseFloat(v)])}
                                        />
                                        <ButtonTooltip
                                            tooltip="Delete coordinate"
                                            onClick={() => setData({ ...data, coordinates: (data?.coordinates || []).filter((_, j) => j !== i) })}
                                        >
                                            <Delete />
                                        </ButtonTooltip>
                                    </Stack>
                                )
                            })}
                        </Stack>
                    </>
                </Case>
            </SwitchCase>
        </TreeRow>
    )
}