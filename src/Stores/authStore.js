import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({

      
      //State
      user: null,
      token: null,
      isAuthenticated: null,
      isLoading: null,
      error: null,

      // Actions

      setUser: (user) => ({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),

      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          // replacetimeout with api all in the future (reminder)!
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock podaci
          const mockUser = {
            id: "1",
            name: credentials.email.split("@")[0],
            email: credentials.email,
            role: "AGENT",
            avatar: null,
          };

          const mockToken = "mock-jwt-token-" + Date.now();

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });

          return { user: mockUser, token: mockToken };
        } catch (error) {
          set({ error: error.message || "Login Failed", isLoading: false });

          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          // replacetimeout with api all in the future (reminder)!
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const mockUser = {
            id: "1",
            name: userData.name,
            email: userData.email,
            role: "CUSTOMER",
            avatar: null,
          };

          const mockToken = "mock-jwt-token-" + Date.now();

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });

          return { user: mockUser, token: mockToken };
        } catch (error) {
          set({
            error: error.message || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      clearError: () => set({ error: null }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
