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