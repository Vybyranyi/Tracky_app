import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkToken } from '../store/Auth/AuthSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, isAuth } = useSelector(state => state.auth);

  useEffect(() => {
    if (token) {
      // Перевіряємо токен кожну хвилину
      const interval = setInterval(() => {
        dispatch(checkToken());
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [dispatch, token]);

  return { isAuth, token };
};