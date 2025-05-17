// DrawerContext.js
import { createContext, useContext, useState } from "react";

const DrawerContext = createContext();

export const useDrawer = () => useContext(DrawerContext);

export const DrawerProvider = ({ children }) => {
  const [notmobileOpen, setNotMobileOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <DrawerContext.Provider
      value={{
        notmobileOpen,
        mobileOpen,
        // if needed
        setNotMobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
