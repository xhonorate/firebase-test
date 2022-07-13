import FirebaseAuth from '../firebase/components/auth/FirebaseAuth'
import NextLink from 'next/link';

const Auth = () => {
    return (
        <div>
            <div>
                <FirebaseAuth />
                <NextLink href="/"><a>Go Home</a></NextLink>
            </div>
        </div>
    )
}

export default Auth