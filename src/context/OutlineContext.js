import {createContext, useContext} from "react";
export const OutlineContext = createContext({ outline: [], setOutline: () => {} });
export const useOutline = () => useContext(OutlineContext);
