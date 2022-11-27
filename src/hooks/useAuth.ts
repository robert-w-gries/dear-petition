import { useMemo } from 'react';
import { useAppSelector } from '/src/store';

export const useAuth = () => {
  const user = useAppSelector((state) => state.auth.user);
  return useMemo(() => ({ user }), [user]);
};

export const useIsAdmin = () => {
  const { user } = useAuth();
  return !!user?.is_admin;
};
