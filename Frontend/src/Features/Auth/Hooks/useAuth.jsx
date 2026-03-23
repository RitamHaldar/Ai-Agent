
import { getme, login, register, logout } from '../Services/auth.api'
import { useDispatch } from 'react-redux'
import { setLoading, setUser } from '../auth.slice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const handlelogin = async ({ username, email, password }) => {

        dispatch(setLoading(true))
        const resposne = await login({ username, email, password })
        dispatch(setUser(resposne.user))
        dispatch(setLoading(false))
        return resposne
    }
    const handleregister = async ({ username, email, password }) => {
        dispatch(setLoading(true))
        const resposne = await register({ username, email, password })
        dispatch(setLoading(false))
        return resposne
    }
    const handlegetme = async () => {
        let response = null
        try {
            dispatch(setLoading(true))
            response = await getme()

        }
        catch (err) {
        }
        finally {
            dispatch(setLoading(false))
        }
        if (response) {
            dispatch(setUser(response.user))
        }
    }
    const handlelogout = async () => {
        dispatch(setLoading(true))
        await logout()
        dispatch(setUser(null))
        dispatch(setLoading(false))
    }
    return { handleregister, handlelogin, handlegetme, handlelogout }
}
