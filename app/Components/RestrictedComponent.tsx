import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Props {
    children: React.ReactNode;
  }
  

  const RestrictedComponent: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleRestrictedAction = () => {
    if (!isAuthenticated) {
      // Save the current URL to return to after login
      localStorage.setItem('returnUrl', window.location.pathname);
      router.push('/login'); // Redirect to login page
    } else {
      // Perform the restricted action
    }
  };

  const handleLogin = () => {
    // After successful login, return to the previous action
    const returnUrl = localStorage.getItem('returnUrl');
    router.push(returnUrl || '/'); // Redirect to the previous URL or homepage
  };

  return (
    <>
    <div className='modal '>
      {!isAuthenticated && <p>Please login to access this feature.</p>}
      <button onClick={handleRestrictedAction}>Restricted Action</button>
      <button onClick={handleLogin}>Login</button>
    </div>
    {children}
    </>
  );
};

export default RestrictedComponent;
