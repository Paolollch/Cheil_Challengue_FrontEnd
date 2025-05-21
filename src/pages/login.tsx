import LoginForm from '@/components/common/LoginForm';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { setToken } = useAuth();

  const handleLogin = (token: string) => {
    console.log('Token recibido:', token);
    setToken(token);
  };

  return (
    <div>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}
