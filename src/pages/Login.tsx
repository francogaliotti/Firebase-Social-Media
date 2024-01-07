import { useNavigate } from 'react-router-dom'
import { auth, provider } from '../config/Firebase'
import { signInWithPopup } from 'firebase/auth'

const Login = () => {
    const navigate = useNavigate();
    const signInWithGoogle = async () => {
        const res = await signInWithPopup(auth, provider);
        navigate('/')
    }

    return (
        <div>
            <p>
                Sign in with google to continue
            </p>
            <button onClick={signInWithGoogle}>Sign in with google</button>
        </div>
    )
}

export default Login