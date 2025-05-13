import { createContext, useState } from "react";

type IExperimentTreeNodesExpandedStore = {
  expandedNodes: string[],
  setExpandedNodes: (nodeNames: string[]) => void,
  addExpandedNode: (nodeName: string) => void,
  removeExpandedNode: (nodeName: string) => void,
};

export const ExperimentTreeNodesExpandedContext = createContext<IExperimentTreeNodesExpandedStore | null>(null);

export const ExperimentTreeNodesExpandedProvider = ({ children }) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const addExpandedNode = (newNode: string) => {
    setExpandedNodes(prev => [...prev.filter(x => x !== newNode), newNode]);
  };

  const removeExpandedNode = (newNode: string) => {
    setExpandedNodes(prev => prev.filter(x => x !== newNode));
  };

  return (
    <ExperimentTreeNodesExpandedContext.Provider
      value={{
        expandedNodes,
        setExpandedNodes,
        addExpandedNode,
        removeExpandedNode,
      }}
    >
      {children}
    </ExperimentTreeNodesExpandedContext.Provider>
  )
}