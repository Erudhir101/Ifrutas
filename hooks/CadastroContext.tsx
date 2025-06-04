import React, { createContext, useState, useContext, ReactNode } from "react";
import { UserType } from "./AuthContext";

interface CadastroData {
  fullName: string;
  email: string;
  password: string;
  userType: UserType;
  endereco: string;
  telefone: string;
  ident: string;
}

interface CadastroContextType {
  cadastroData: CadastroData;
  setCadastroData: React.Dispatch<React.SetStateAction<CadastroData>>;
  resetCadastroData: () => void;
}

const CadastroContext = createContext<CadastroContextType | undefined>(
  undefined,
);

interface CadastroProviderProps {
  children: ReactNode;
}

export const CadastroProvider: React.FC<CadastroProviderProps> = ({
  children,
}) => {
  const [cadastroData, setCadastroData] = useState<CadastroData>({
    fullName: "",
    email: "",
    password: "",
    userType: null,
    endereco: "",
    telefone: "",
    ident: "",
  });

  const resetCadastroData = () => {
    setCadastroData({
      fullName: "",
      email: "",
      password: "",
      userType: null,
      endereco: "",
      telefone: "",
      ident: "",
    });
  };

  return (
    <CadastroContext.Provider
      value={{ cadastroData, setCadastroData, resetCadastroData }}
    >
      {children}
    </CadastroContext.Provider>
  );
};

export const useCadastro = () => {
  const context = useContext(CadastroContext);
  if (context === undefined) {
    throw new Error("useCadastro must be used within a CadastroProvider");
  }
  return context;
};
