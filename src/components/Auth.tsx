import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useStore } from '@/store'; 
import LoginForm from '@/pages/Login';

const Auth = (WrappedComponent: React.FC) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();
    const { user } = useStore(); 
    console.log(user)
    useEffect(() => {
      if (!user) {
        router.replace('/Login');
      }
    }, [user, router]);
    console.log(user)
    return user? <WrappedComponent {...props} /> :null;
  };

  return AuthComponent;
};

export default Auth;