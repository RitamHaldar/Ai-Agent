
import { getme, login, register } from '../Services/auth.api'
import { useDispatch } from 'react-redux'
import { setErr, setLoading, setUser } from '../auth.slice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const handlelogin = async ({ username, email, password }) => {

        dispatch(setLoading(true))
        const resposne = await login({ username, email, password })
        dispatch(setUser(resposne.user))
        dispatch(setLoading(false))
    }
    const handleregister = async ({ username, email, password }) => {
        dispatch(setLoading(true))
        const resposne = await register({ username, email, password })
        dispatch(setUser(resposne.user))
        dispatch(setLoading(false))
    }
    const handlegetme = async () => {
        try {
            dispatch(setLoading(true))
            const resposne = await getme()
            dispatch(setUser(resposne.user))
        }
        catch (err) {
            dispatch(setErr(err))
        }
        finally {
            dispatch(setLoading(false))
        }

    }
    return { handleregister, handlelogin, handlegetme }
}
