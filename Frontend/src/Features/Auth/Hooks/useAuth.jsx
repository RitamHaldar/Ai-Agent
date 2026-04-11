
import { getme, login, register, logout } from '../Services/auth.api'
import { useDispatch } from 'react-redux'
import { setLoading, setUser, setErr } from '../auth.slice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const handlelogin = async ({ username, email, password }) => {
        try {
            dispatch(setErr(null))
            dispatch(setLoading(true))
            const resposne = await login({ username, email, password })
            dispatch(setUser(resposne.user))
            return resposne
        } catch (err) {
            dispatch(setErr(err.response?.data?.message || 'Login failed. Please try again.'));
        } finally {
            dispatch(setLoading(false))
        }
    }
    const handleregister = async ({ username, email, password }) => {
        try {
            dispatch(setErr(null))
            dispatch(setLoading(true))
            const resposne = await register({ username, email, password })
            return resposne
        } catch (err) {
            dispatch(setErr(err.response?.data?.message || 'Registration failed. Please try again.'));
        } finally {
            dispatch(setLoading(false))
        }
    }
    const handlegetme = async () => {
        let response = null
        try {
            dispatch(setErr(null))
            dispatch(setLoading(true))
            response = await getme()

        }
        catch (err) {
            dispatch(setErr(null));
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
