/**
 * `SwitchCase` picks one child element and renders only it.  
 * The chosen child has a prop `value` that is equal to the value of `test` on `SwitchCase`.  
 * If no child is chosen, pick the first child that has a prop `isDefault={true}`.  
 * The `Case` element is used to formulate this.  
 */
export const SwitchCase = ({ test, children }) => {
    const childrenWrapped = children instanceof Array ? children : [children];
    for (const child of childrenWrapped) {
        if (child.props.value === test) {
            return child;
        }
    }
    for (const child of childrenWrapped) {
        if (child.props.isDefault) {
            return child;
        }
    }
    return undefined;
};

export const Case = ({ children, value, isDefault = false }) => {
    return children; // I don't want do add container around my cases ! 
};