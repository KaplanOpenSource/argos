// src/store/experimentTreeNodesExpandedStore.ts
import { create } from 'zustand';

interface ExperimentTreeNodesExpandedStore {
  expandedNodes: string[];
  setExpandedNodes: (nodeNames: string[]) => void;
  addExpandedNode: (nodeName: string) => void;
  removeExpandedNode: (nodeName: string) => void;
}

export const useExperimentTreeNodesExpandedStore = create<ExperimentTreeNodesExpandedStore>((set) => ({
  expandedNodes: [],

  setExpandedNodes: (nodeNames) => {
    set(() => ({ expandedNodes: [...nodeNames] }));
  },

  addExpandedNode: (nodeName) => {
    set((prev) => ({
      expandedNodes: [
        ...prev.expandedNodes.filter((x) => x !== nodeName),
        nodeName,
      ],
    }));
  },

  removeExpandedNode: (nodeName) => {
    set((prev) => ({
      expandedNodes: prev.expandedNodes.filter((x) => x !== nodeName),
    }));
  },
}));