import { Zoom, toast } from "react-toastify";

export const toastError = (error) => {
  toast.error(error, {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Zoom,
  });
};

export const toastSuccess = (success) => {
  toast.success(success, {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Zoom,
  });
};
