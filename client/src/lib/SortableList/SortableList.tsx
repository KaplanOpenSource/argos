import type { Active, Over, UniqueIdentifier } from "@dnd-kit/core";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import type { ReactNode } from "react";
import React, { useMemo, useState } from "react";

import { Box } from "@mui/material";
import { DragHandle, SortableItem } from "./SortableItem";
import { SortableOverlay } from "./SortableOverlay";

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
  const [lastSelectedClick, setLastSelectedClick] = useState<UniqueIdentifier | null>(null);

  const betweenIds = (id0: UniqueIdentifier, id1: UniqueIdentifier): UniqueIdentifier[] => {
    const i0 = items.findIndex(x => x.id === id0);
    const i1 = items.findIndex(x => x.id === id1);
    if (Math.min(i0, i1) <= -1) return [];
    return items.slice(Math.min(i0, i1), Math.max(i0, i1) + 1).map(x => x.id);
  }

  const moveItems = (over: Over | null, active: Active) => {
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
  }

  const handleSelectClick = (itemId: UniqueIdentifier, shiftKey: boolean = false) => {
    if (shiftKey && lastSelectedClick) {
      const range = betweenIds(lastSelectedClick, itemId);
      const selectedWithout = selectedItems.filter(x => !range.includes(x));
      if (selectedItems.includes(lastSelectedClick)) {
        setSelectedItems([...selectedWithout, ...range]);
      } else {
        setSelectedItems(selectedWithout);
      }
    } else {
      if (selectedItems.includes(itemId)) {
        setSelectedItems(selectedItems.filter(x => x !== itemId));
      } else {
        setSelectedItems([...selectedItems, itemId]);
      }
    }
    setLastSelectedClick(itemId);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        moveItems(over, active);
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items}>
        <Box role="application">
          {items.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <Box key={item.id}
                onClick={e => handleSelectClick(item.id, e.shiftKey)}
              >
                {renderItem(item, isSelected)}
              </Box>
            )
          })}
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
