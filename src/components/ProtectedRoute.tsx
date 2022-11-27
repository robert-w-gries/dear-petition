import { useEffect } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { useAuth } from '~/src/hooks/useAuth';
import { useLazyCheckLoginQuery } from '~/src/service/api';
import { loggedIn } from '~/src/slices/auth';
import { useAppDispatch } from '~/src/store';

function ProtectedRoute({
  children,
  isAdminOnly,
  ...props
}: { isAdminOnly?: boolean } & RouteProps) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [checkLogin, { data, isFetching, isUninitialized }] = useLazyCheckLoginQuery();
  const isWaiting = isUninitialized || isFetching;

  useEffect(() => {
    if (!user && isUninitialized) {
      checkLogin({});
    }
  }, [user, isUninitialized]);

  useEffect(() => {
    if (data?.user) {
      dispatch(loggedIn(data.user));
    }
  }, [data]);

  // Spin until user information provided or we are redirected
  // Note: extra render needed before loggedIn dispatch is propogated to useAuth()
  if (!user && (isWaiting || data?.user)) {
    return null;
  }

  if (isAdminOnly && !user?.is_admin) {
    return (
      <Route {...props}>
        <Redirect to={{ pathname: '/' }} />
      </Route>
    );
  }

  return <Route {...props}>{user ? children : <Redirect to={{ pathname: '/login' }} />}</Route>;
}

export default ProtectedRoute;
