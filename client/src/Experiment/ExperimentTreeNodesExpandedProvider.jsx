import { createContext, useState } from "react"

export const ExperimentTreeNodesExpandedContext = createContext();

export const ExperimentTreeNodesExpandedProvider = ({ children }) => {
    const [expandedNodes, setExpandedNodes] = useState([]);

    const addExpandedNode = (newNode) => {
        setExpandedNodes(prev => [...prev.filter(x => x !== newNode), newNode]);
    };

    const removeExpandedNode = (newNode) => {
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