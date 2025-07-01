import React, { createContext, useContext } from 'react';

type IPopupSwitchStore = {
  switchToPopup: (key: string) => void;
  isPopupSwitchedTo: (key: string) => boolean;
};

export const PopupSwitchContext = createContext<IPopupSwitchStore | null>(null);

export const usePopupSwitch = () => useContext(PopupSwitchContext)!;

export const PopupSwitchProvider = ({ children }) => {
  const [popupSwitch, setPopupSwitch] = React.useState<string>();

  const switchToPopup = (key: string | undefined) => {
    setPopupSwitch(key);
  }

  const isPopupSwitchedTo = (key: string | undefined) => {
    if (popupSwitch === key) {
      setPopupSwitch(undefined);
      return true;
    }
    return false;
  }

  return (
    <PopupSwitchContext.Provider value={{
      switchToPopup,
      isPopupSwitchedTo
    }}>
      {children}
    </PopupSwitchContext.Provider>
  )
}
