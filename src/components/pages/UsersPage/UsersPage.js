import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PageBase from '../PageBase';
import useAdmin from '../../../hooks/useAdmin';

const UsersPage = () => {
  const isAdmin = useAdmin();
  if (isAdmin === false) {
    return <Route render={() => <Redirect to="/" />} />;
  }
  return (
    <PageBase>
      <h1>Users</h1>
      <div>
        <div>User1</div>
        <div>User2</div>
      </div>
    </PageBase>
  );
};

export default UsersPage;
