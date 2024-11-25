import {create} from "zustand/react";

interface UserState {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
}

export const useUserStore = create<UserState>()((set) => ({
    isLoggedIn: false,
    setIsLoggedIn: (value) => set({ isLoggedIn: value }),
}));