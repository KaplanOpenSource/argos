import { create } from 'zustand';

type ShowImagePlacementStore = {
  showImagePlacement: boolean, // a state variable to control the visibility of the image placement
  setShowImagePlacement: (val: boolean) => void,
};

export const useShowImagePlacement = create<ShowImagePlacementStore>()((set, get) => ({
  showImagePlacement: false,
  setShowImagePlacement: (val: boolean) => {
    set({ showImagePlacement: val })
  },
}))
