import { TypesInfoBox } from "./TypesInfoBox"

export const DevicePlanner = ({ }) => {
    return (
        <div
            style={{
                position: 'relative',
                margin: '10px',
                zIndex: 1000
            }}
        >
            <TypesInfoBox
                entities={[]}
                shownEntityItems={[]}
                shownEntityTypes={[]}
                showTableOfType={true}
            />
        </div>
    )
}