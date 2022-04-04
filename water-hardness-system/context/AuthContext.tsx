import React, { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios'
type User = null | true;

export const AuthContext = React.createContext<{
  user: User;
  login: (email: String, password: String) => void;
  logout: () => void;
  register:(firstName:String,lastname:String,email:String,password:String)=>Promise<any>
}>({
  user: null,
  login: () => {},
  logout: () => {},
  register:()=>{}
});

interface AuthProviderProps {}

export const AuthProvider: React.FC<AuthProviderProps> = ({children})=> {
    const [user, setUser] = useState<User>(null)
    return <AuthContext.Provider value = {{
    user,
    login: (email, password)=>{
      console.log(email,password)
      axios.post("http://127.0.0.1:3000/user/signin", {email, password}).then((response)=>{
        if(response.data.status==="SUCCESSED")
           setUser(true)
      }).catch((e)=>{
        console.log(e)
      })
    },
    logout: ()=>{
        setUser(null)
    },
    register:(firstName,lastName,email,password)=>{
      return axios.post("http://127.0.0.1:3000/user/signup",{firstName,lastName,email,password})
    }
  }}>
     {children}
  </AuthContext.Provider>
}
