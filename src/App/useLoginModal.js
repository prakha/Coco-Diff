import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginModalAction, setLoginModalType } from "../redux/reducers/UI";

export const useLoginModal = () => {
  const dispatch = useDispatch();
  const isLoginModalOpen = useSelector((state) => state.UI.loginModal);
  const modalType = useSelector((s) => s.UI.loginModalType);

  const setModalType = useCallback(
    (type) => {
      dispatch(setLoginModalType(type));
    },
    [dispatch]
  );
  const openLoginModal = useCallback(
    (type) => {
      if (type) {
        setModalType(type);
      }
      dispatch(setLoginModalAction(true));
    },
    [dispatch, setModalType]
  );

  const closeLoginModal = useCallback(() => {
    dispatch(setLoginModalAction(false));
  }, [dispatch]);

  const toggleLoginModal = useCallback(() => {
    dispatch(setLoginModalAction(isLoginModalOpen ? false : true));
  }, [dispatch, isLoginModalOpen]);

  return useMemo(
    () => ({
      openLoginModal,
      setModalType,
      modalType,
      closeLoginModal,
      toggleLoginModal,
      isLoginModalOpen,
    }),
    [
      closeLoginModal,
      isLoginModalOpen,
      modalType,
      openLoginModal,
      setModalType,
      toggleLoginModal,
    ]
  );
};
