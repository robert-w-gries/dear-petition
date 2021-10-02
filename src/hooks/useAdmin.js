import useAuth from './useAuth';

const useAdmin = () => {
  const { user } = useAuth();
  return user?.is_admin ?? false;
};

export default useAdmin;
