import { create } from "zustand";

const useUIStore = create((set) => ({


    // state
    sidebatOpen: true,
    theme: "light",
    notifications: [],
    modal: {
        isOpen: false,
        title: '',
        content: null,
        onConfirm: null,
        onCancel: null
    },

    toggleSidebar: () => set((state) => ({ sidebatOpen : !state.sidebatOpen })),

    setSidebarOpen: (isOpen) => set({ sidebatOpen: isOpen }),

    setTheme: (theme) => set({ theme }),

    toggleTheme: () => set((state) => ({
        theme: state.theme === "light" ? "dark" : "light"
    })),

    //Notifications

    addNotofications: (notification) => {
        const id = Date.now();

        set((state) => ({
            notifications: [...state.notifications, 
                {id,
                 type:'info',
                 read: false,
                 createdAt: new Date().toISOString(),
                 ...notification,   
                }
            ]
        }))

        return id;
    },

    removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })),
  
  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    })),
  
  markAllNotificationsAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    })),
  
  clearNotifications: () => set({ notifications: [] }),
  
  // Modal actions
  openModal: ({ title, content, onConfirm, onCancel }) =>
    set({
      modal: {
        isOpen: true,
        title,
        content,
        onConfirm,
        onCancel,
      }
    }),
  
  closeModal: () =>
    set({
      modal: {
        isOpen: false,
        title: '',
        content: null,
        onConfirm: null,
        onCancel: null,
      }
    }),

}));

export default useUIStore