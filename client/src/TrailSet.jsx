export const TrailSet = ({ name, data }) => {
    return (
        <ListItemCollapsable
            name={name}
            components={
                <>
                </>
            }
        >
            <List component="div" disablePadding>
                {/* <ListItem>
                    <TextField
                        variant="outlined"
                        label="Description"
                        InputLabelProps={{ shrink: true }}
                        value={data.description}
                        onChange={e => setData({ ...data, description: e.target.value })}
                    />
                </ListItem>
                {
                    (data.trailSet || []).map(e => (
                        <TrailSet
                            key={e.name}
                            name={e.name}
                            data={e.data}
                        />
                    ))
                } */}
            </List>
        </ListItemCollapsable>
    )
}