import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeSublist } from "../App/TreeSublist";
import { VALUE_TYPE_DEFAULT } from '../types/ValueTypeEnum';
import { changeByName } from "../Utils/utils";
import { AttributeType } from "./AttributeType";

export const AttributeTypesDialog = ({ data, setData, isOfDevice, containers }) => {
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
        nameTemplate='Attribute'
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
              containers={containers}
            />
          ))
        }
      </TreeSublist>
    </TreeView>
  )
}