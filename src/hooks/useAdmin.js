import { useEffect, useState } from 'react';
import { USER } from '../constants/authConstants';
import Axios from '../service/axios';

const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState();
  useEffect(() => {
    const user = localStorage.getItem(USER);
    if (user && user.is_admin !== undefined) {
      setIsAdmin(user.is_admin);
    } else {
      Axios.get('/users/').then(({ data }) => setIsAdmin(data?.results[0].is_admin ?? false));
    }
  });
  return isAdmin;
};

export default useAdmin;
