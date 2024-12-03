import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@mui/material';

function SortableItem({ id, item, renderItem }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {renderItem(item)}
        </Box>
    );
}

export function SortableList({ items, setItems, renderItem }) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((previtems) => {
                const oldIndex = previtems.findIndex(x => x.id === active.id);
                const newIndex = previtems.findIndex(x => x.id === over.id);

                return arrayMove(previtems, oldIndex, newIndex);
            });
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                {items.map(t => <SortableItem key={t.id} id={t.id} item={t} renderItem={renderItem} />)}
            </SortableContext>
        </DndContext>
    );
}