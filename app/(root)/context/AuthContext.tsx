"use client"
import { useContext, createContext, useState, useEffect, ReactNode } from "react";
import { logIn } from "../actions/logIn";
import { useRouter } from "next/navigation";
import { signUp } from "../actions/signUp";

interface AuthContextProps {
  user: boolean | null;
  login: (email: string, password: string) => Promise<string>;
  logout: () => void;
  signup: (email: string, password: string, userName: string) => Promise<string>;
  setCartItemNumber: React.Dispatch<React.SetStateAction<number>>;
  cartItemNumber: number;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}: AuthContextProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<boolean | null>(null);
  const [cartItemNumber, setCartItemNumber] = useState(0);

  // sign up
  const signup = async (
    email: string,
    password: string,
    userName: string
  ): Promise<string> => {
    const {accessToken,status} = await signUp(email, password, userName);
    if (status === 200) {
      localStorage.setItem("accessToken", accessToken);
      setUser(true);
      router.push("/");
      return "User Successfully Created";
    } else if (status === 400) {
      return "Email already in use";
    } else {
      return "Something went wrong"
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<string> => {
    const { message, result, accessToken } = await logIn(email, password);
    if (result) {
      localStorage.setItem("accessToken", accessToken);
      router.push("/");
      setUser(result);
      return "hi";
    } else {
      return message;
    }
  };

  const logout = (): void => {
    localStorage.removeItem("accessToken");
    setUser(false);
  };

  useEffect(() => {
    const isUser = localStorage.getItem("accessToken");
    const isCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const len = isCart.length;
    isUser && setUser(true);
    if (isCart) {
      setCartItemNumber(len);
    }
  }, []);

  const contextValue: AuthContextProps = {
    user,
    login,
    logout,
    signup,
    setCartItemNumber,
    cartItemNumber,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useUserAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useuseUserAuth must be used within an AuthContextProvider");
  }
  return context;
};
