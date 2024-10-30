"use client"
import {createContext,useContext,useState} from 'react'


const AppContext=createContext('Hello') 



export function AppWrapper({children}:{
    children:React.ReactNode 
})
{
    let [state,setState]=useState("hello")
    return (
        <AppContext.Provider value={state}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppWrapper(){
    return useContext(AppContext)
}