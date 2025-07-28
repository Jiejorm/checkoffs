import Swal from "sweetalert";
export const checkInternetConnection = () => {
  if (!navigator.onLine) {
    Swal({
      allowOutsideClick: false,
      icon: "error",
      title: "Oops...",
      text: "Network connection lost!",
      footer: "Please check your internet connection and try again.",
    });
  }
};
