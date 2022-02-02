import React, { useState } from 'react';

type User = null | true;

export const AuthContext = React.createContext<{
  user: User;
  login: () => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {}
});

interface AuthProviderProps {}

export const AuthProvider: React.FC<AuthProviderProps> = ({children})=> {
    const [user, setUser] = useState<User>(null)
    return <AuthContext.Provider value = {{
    user,
    login: ()=>{
        setUser(true)
    },
    logout: ()=>{
        setUser(null)
    }
  }}>
     {children}
  </AuthContext.Provider>
}
