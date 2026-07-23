import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/types/api";

interface UserToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: string | null;
}

interface UserState {
  userInfo: UserProfile | null;
  userToken: UserToken;
  actions: {
    setAuth: (payload: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      user: UserProfile;
    }) => void;
    setUserInfo: (user: UserProfile) => void;
    clearUserInfoAndToken: () => void;
  };
}

const emptyToken: UserToken = {
  accessToken: "",
  refreshToken: "",
  expiresAt: null,
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userInfo: null,
      userToken: emptyToken,
      actions: {
        setAuth: ({ accessToken, refreshToken, expiresIn, user }) => {
          const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
          set({
            userInfo: user,
            userToken: { accessToken, refreshToken, expiresAt },
          });
        },
        setUserInfo: (user) => set({ userInfo: user }),
        clearUserInfoAndToken: () =>
          set({ userInfo: null, userToken: emptyToken }),
      },
    }),
    {
      name: "ecommerce-admin-auth",
      partialize: (state) => ({
        userInfo: state.userInfo,
        userToken: state.userToken,
      }),
    },
  ),
);

export const useUserInfo = () => useUserStore((s) => s.userInfo);
export const useUserToken = () => useUserStore((s) => s.userToken);
export const useUserActions = () => useUserStore((s) => s.actions);
export default useUserStore;
