import { create } from 'zustand';

const useRoomStore = create((set) => ({
  roomId: null,
  activeUsers: [],
  messages: [],
  whiteboard: null,

  setRoomId: (roomId) => set({ roomId }),
  setActiveUsers: (users) => set({ activeUsers: users }),
  addUser: (user) =>
    set((state) => ({
      activeUsers: [...state.activeUsers, user],
    })),
  removeUser: (userId) =>
    set((state) => ({
      activeUsers: state.activeUsers.filter((u) => u.userId !== userId),
    })),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setWhiteboard: (whiteboard) => set({ whiteboard }),
}));

export default useRoomStore;
