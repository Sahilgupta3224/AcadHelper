import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useStore } from '@/store'; 

const Auth = (WrappedComponent: React.FC) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();
    const { user } = useStore(); 
    useEffect(() => {
      if (!user) {
        router.replace('/Login');
      }
    }, [user, router]);
    return user? <WrappedComponent {...props} suppressHydrationWarning={true}/> :null;
  };

  return AuthComponent;
};

export default Auth;