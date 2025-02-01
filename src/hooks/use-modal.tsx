import { useCallback, useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const setModalOpen = useCallback((open: boolean) => setIsOpen(open), []);

  return {
    isOpen,
    openModal,
    closeModal,
    setModalOpen,
  };
};
