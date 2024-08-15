import React from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import NavMobile from "../../components/NavMenu/NavMobile";
import { useCallback } from "react";
import Acc from "../../components/AccMod/Acc";
import { app } from "../../firebase";
import { api } from "../../main";
import { updateUser } from "../../app/userSlice";
import AdminMobile from "../../components/NavMenu/AdminNav";
import "../style/acc.css";
import Loader from "../../components/Preloader/Loader";
import { toastError, toastSuccess } from "../../components/toastify/toastMes";

const URL = "/api/auth";

const Account = () => {
  const { user } = useSelector((state) => state.user);
  const isAdmin = user && user?.va1 === import.meta.env.VITE_VAL;

  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    contact: user.contact,
    photoUrl: "",
    currentPassword: "",
    password: "",
  });
  /* IMAGE CONTENT */
  const [image, setImageFile] = useState(null);
  const [imagePercent, setImagePercentage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);

  /* IMAGE CONTENT */

  /* HANDLE SET IMAGE */
  const handleSetImage = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const ext = file["name"].split(".").pop();
      const extensions = ["JPG", "JPEG", "PNG", "jpeg", "jpg", "png"];
      if (!extensions.includes(ext)) {
        toastError("Invalid image file type");
        setImageUpload(null);
        return;
      }
    }
    const sizeInMb = getFileSizeInMb(file);
    if (sizeInMb > 4) {
      alert("Please upload an image with size less than 3MB");
      toastError("Upload an image less than 4MB");
      setImageUpload(null);
      return;
    }
    const fileContent = await readFileAsBase64(file);
    setImageUpload(fileContent);
  };
  /* HANDLE SET IMAGE */

  /* HANDLE INPUTS */
  const handleInputs = (e) => {
    switch (e.target.name) {
      case "currentPassword":
        setForm((prevForm) => ({
          ...prevForm,
          currentPassword: e.target.value,
        }));
        break;
      case "password":
        setForm((prevForm) => ({ ...prevForm, password: e.target.value }));
        break;
      case "firstName":
        setForm((prevForm) => ({ ...prevForm, firstName: e.target.value }));
        break;
      case "lastName":
        setForm((prevForm) => ({ ...prevForm, lastName: e.target.value }));
        break;
      case "username":
        setForm((prevForm) => ({ ...prevForm, username: e.target.value }));
        break;
      case "contact":
        setForm((prevForm) => ({ ...prevForm, contact: e.target.value }));
        break;
      default:
        console.log("default");
    }
  };

  /* HANDLE INPUTS */

  /* DISPATCH */
  const dispatch = useDispatch();
  /* DISPATCH */

  /* CONTACT HANDLING */

  /* CONTACT HANDLING */

  // REQUEST
  const mutation = useMutation({
    mutationKey: "updateUser",
    mutationFn: (data) => {
      return api.put(`${URL}/update`, data);
    },
  });

  /* HANDLE CHANGE */
  const handleChange = useCallback((e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }, []);
  /* HANDLE CHANGE */
  /* HANDLE SUBMIT */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        if (form.currentPassword !== form.password) {
          toastError("Mismatching password");
          return;
        }
        if (image) {
          const storage = getStorage(app);
          const fileName = new Date().getTime + image.name;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, image);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImagePercentage(Math.round(progress));
            },
            () => {
              setImageError(true);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                const res = await mutation.mutateAsync({
                  ...form,
                  photoUrl: downloadURL,
                });
                dispatch(updateUser(res.data));
                toastSuccess("Updated");
              } catch (error) {
                toastError("Failed");
              }
            }
          );
        } else {
          const res = await mutation.mutateAsync(form);
          dispatch(updateUser(res.data));
          toastSuccess("Updated");
        }
      } catch (error) {
        console.log(error || error?.message);
        toastError("Something went wrong");
      }
    },
    [form, image]
  );
  /* HANDLE SUBMIT */
  return (
    <div className="x-t-pages">
      {
        // Preloader
        mutation.isPending && <Loader />
      }
      <div className="x-ac-header t-hea">
        <h4>Profile Account </h4>
        {isAdmin ? <AdminMobile /> : <NavMobile />}
      </div>
      <Acc
        firstName={form.firstName}
        lastName={form.lastName}
        contact={form.contact}
        currentPassword={form.currentPassword}
        password={form.password}
        handleInputs={handleInputs}
        handleInputChange={(e) => handleChange(e)}
        setImage={(e) => handleSetImage(e)}
        profile={imageUpload || user.profile}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Account;

function getFileSizeInMb(file) {
  const fileSizeInByte = file?.size;
  const fileSizeInMb = fileSizeInByte / 1024 / 1024;
  return Math.round(fileSizeInMb * 100) / 100;
}

const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
