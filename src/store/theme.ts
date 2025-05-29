import { create } from "zustand";

export interface UserProps {
  email: string | null;
  createdAt: string | null;
  username: string | null;
  profile_picture_url: string | null;
  accessToken: string | null;
  emailVerified: boolean;
}

interface AuthStoreState {
  user: UserProps;
  upsertUser: (data: Partial<UserProps>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: {
    email: null,
    createdAt: null,
    username: null,
    profile_picture_url: null,
    accessToken: null,
    emailVerified: false,
  },
  upsertUser: (data) =>
    set((state) => {
      const existingUser = state.user;

      if (existingUser) {
        // Update the existing item with the partial item data
        return {
          user: { ...state.user, ...data },
        };
      } else {
        // Add the new item
        return {
          user: {
            ...state.user,
            data,
          },
        };
      }
    }),
  logout: () =>
    set({
      user: {
        email: "",
        createdAt: "",
        username: "",
        profile_picture_url: "",
        accessToken: "",
        emailVerified: false,
      },
    }),
}));
