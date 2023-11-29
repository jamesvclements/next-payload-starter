"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export interface Store {
  isModalOpen: boolean;
  filters: string[];
}

interface StoreContextType {
  store: Store;
  setStore: Dispatch<SetStateAction<any>> /* todo – type this */;
}

const initialStore: Store = {
  isModalOpen: false,
  filters: [],
};

const StoreContext = createContext<StoreContextType>({
  store: initialStore,
  setStore: () => {},
});

export const useStore = () => {
  const currentContext = useContext(StoreContext);
  return currentContext;
};

export const useModal = () => {
  const { store, setStore } = useStore();
  const openModal = (activeLensId?: string) => {
    console.log(`Opening modal with lens id ${activeLensId}...`);
    setStore({
      ...store,
      isModalOpen: true,
    });
  };
  const closeModal = () => setStore({ ...store, isModalOpen: false });
  return {
    openModal,
    closeModal,
    isModalOpen: store.isModalOpen,
  };
};

export const useFilters = () => {
  const { store, setStore } = useStore();
  const setActiveFilters = (tagFilters: Store["filters"]) =>
    setStore({ ...store, tagFilters });

  const toggleTag = (tagId: string) => {
    if (store.filters.includes(tagId)) {
      setActiveFilters(store.filters.filter((id) => id !== tagId));
    } else {
      setActiveFilters([...store.filters, tagId]);
    }
  };

  const clearTags = () => setActiveFilters([]);

  return { activeFilters: store.filters, toggleTag, clearTags };
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store, setStore] = useState(initialStore);

  return (
    <StoreContext.Provider value={{ store, setStore }}>
      {children}
    </StoreContext.Provider>
  );
};
