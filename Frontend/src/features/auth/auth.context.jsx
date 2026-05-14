import {createContext,useState,useEffect} from 'react'
import { getMe } from './services/auth.api'

export const AuthContext = createContext()

export function AuthProvider({children}){
    const [user,setUser] = useState(null)
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                console.log("No active session")
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    return(
        <AuthContext.Provider value={{user,setUser,loading,setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}


    