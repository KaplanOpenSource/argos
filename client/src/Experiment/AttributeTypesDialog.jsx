import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeSublist } from "../App/TreeSublist";
import { AttributeType } from "./AttributeType";
import { changeByName } from "../Utils/utils";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { VALUE_TYPE_DEFAULT } from "./AttributeValue";

export const AttributeTypesDialog = ({ data, setData, isOfDevice }) => {
    return (
        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            disableSelection
            defaultExpanded={[data.trackUuid + '_' + 'attributeTypes']}
        >
            <TreeSublist
                parentKey={data.trackUuid}
                data={data}
                fieldName='attributeTypes'
                nameTemplate='New Attribute Type'
                setData={setData}
                newDataCreator={() => {
                    return {
                        type: VALUE_TYPE_DEFAULT,
                    }
                }}
            >
                {
                    (data.attributeTypes || []).map(itemData => (
                        <AttributeType
                            key={itemData.trackUuid || Math.random() + ""}
                            data={itemData}
                            setData={newData => {
                                setData({
                                    ...data,
                                    attributeTypes: changeByName(data.attributeTypes, itemData.name, newData)
                                });
                            }}
                            isOfDevice={isOfDevice}
                        />
                    ))
                }
            </TreeSublist>
        </TreeView>
    )
}