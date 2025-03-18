import React, { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import type { Active, UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";

import { SortableOverlay } from "./SortableOverlay";
import { DragHandle, SortableItem } from "./SortableItem";
import { Box } from "@mui/material";

interface BaseItem {
  id: UniqueIdentifier;
}

interface Props<T extends BaseItem> {
  items: T[];
  onChange(items: T[]): void;
  renderItem(item: T, isSelected: boolean): ReactNode;
}

export function SortableList<T extends BaseItem>({
  items,
  onChange,
  renderItem
}: Props<T>) {
  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items]
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const [selectedItems, setSelectedItems] = useState<UniqueIdentifier[]>([]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
          if (over && (active?.id !== over?.id || selectedItems.length > 0)) {
            const next = [...items];
            const overIndex = next.findIndex(({ id }) => id === over.id);
            const activeIndexBefore = next.findIndex(({ id }) => id === active.id);
            next.splice(overIndex, 0, ...next.splice(activeIndexBefore, 1));
            const idms = selectedItems.filter(x => x !== active.id);
            const moved = next.filter(x => idms.includes(x.id));
            const stay = next.filter(x => !idms.includes(x.id));
            const activeIndexAfter = stay.findIndex(({ id }) => id === active.id);
            stay.splice(activeIndexAfter + 1, 0, ...moved);
            onChange(stay);
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items}>
        <Box 
            role="application"
        >
          {items.map((item) => (
            <Box key={item.id} 
                onClick={e => {
                    if (selectedItems.includes(item.id)) {
                        setSelectedItems(selectedItems.filter(x => x !== item.id));
                    } else {
                        setSelectedItems([...selectedItems, item.id]);
                    }
                }}
            >
                {renderItem(item, selectedItems.includes(item.id))}
            </Box>
          ))}
        </Box>
      </SortableContext>
      <SortableOverlay>
        {activeItem
            ? (
                renderItem(activeItem, selectedItems.includes(activeItem.id))
            )
            : null}
      </SortableOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
