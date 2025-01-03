import React, { useContext, useEffect } from 'react';
import { experimentContext } from '../Context/ExperimentProvider';

export const UndoInterceptor = () => {
    const { undoOperation, redoOperation } = useContext(experimentContext);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key.toLowerCase() === 'z') {
                event.preventDefault();
                event.stopPropagation();
                if (event.shiftKey) {
                    redoOperation();
                } else {
                    undoOperation();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return null; // This component doesn't render any UI
};
