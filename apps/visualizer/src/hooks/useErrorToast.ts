import { type ErrorCode, getErrorMessage } from "@cmumaps/common";
import { useNavigate } from "@tanstack/react-router";

import { useEffect } from "react";
import { toast } from "react-toastify";

/**
 * Toast the error message based on url param error code.
 * @param errorCode - The error code to toast
 * @note For it to work when not in StrictMode, we need to put this hook where
 * the toast container is mounted.
 */
const useErrorToast = (errorCode?: ErrorCode) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!errorCode) return;
    toast.error(getErrorMessage(errorCode));
    navigate({ to: ".", search: {}, replace: true });
  }, [errorCode, navigate]);
};

export default useErrorToast;
