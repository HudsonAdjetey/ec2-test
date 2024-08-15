import React, { useCallback, useState } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useMutation } from "@tanstack/react-query";
import { app } from "../../firebase";
import { api } from "../../main";
import ConfirmModal from "../AlertModal/ConfirmModal";
import Loader from "../Preloader/Loader";
import { toastError, toastSuccess } from "../toastify/toastMes";

const Set = () => {
  const [image, setImageFile] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [imagePercent, setImagePercentage] = useState(0);
  const [imageError, setImageError] = useState(false);

  const handleSetImage = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const ext = file["name"].split(".").pop();
      const extensions = [
        "JPG",
        "JPEG",
        "PNG",
        "jpeg",
        "jpg",
        "png",
        "svg",
        "SVG",
      ];
      if (!extensions.includes(ext)) {
        toastError("Please upload a valid image file");
        setImageUpload(null);
        return;
      }
    }
    const sizeInMb = getFileSizeInMb(file);
    if (sizeInMb > 3) {
      toastError("Choose less than 4MB sized image");
      setImageUpload(null);
      return;
    }
    const fileContent = await readFileAsBase64(file);
    setImageUpload(fileContent);
  };
  // console.log(imageUpload);
  const URL = `/api/course`;
  const mutation = useMutation({
    mutationFn: async (body) => {
      const res = await api.put(`${URL}/banner-upload`, body);
      return res;
    },
  });
  const [isAlert, setIsAlert] = useState(false);

  const handleIsAlert = () => {
    setIsAlert(!isAlert);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
            toastError("Failed");
          },

          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const res = await mutation.mutateAsync({
                bannerURL: downloadURL,
              });
              setIsAlert(!isAlert);
              toastSuccess("Banner Uploaded Successfully!");
            } catch (error) {
              toastError("Failed");
              console.log(error);
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
      setIsAlert(!isAlert);
      toastError("Failed to Upload Banner");
    }
  };

  return (
    <div className="content__whole profile__page settings">
      {mutation.isPending && <Loader />}

      {/* USER'S ACCOUNT */}
      <div className="compactContent">
        <p className="compact_t-ma">User's Account</p>
        <div className="do-input">
          <input type="text" id="usernameComp" placeholder="Username" />
          <input type="text" id="roleComp" value={"Admin"} readOnly />
        </div>

        <div className="do-input">
          <input
            type="password"
            id="previousPas"
            placeholder="Previous Password"
          />

          <input
            type="password"
            id="currentPas"
            placeholder="Current Password"
          />
        </div>
      </div>
      {/* USER'S ACCOUNT */}

      {/* MANAGE ACCOUNT */}
      <div className="compactContent">
        <p className="compact_t-ma">
          Manage Account (unavailable for this version)
        </p>
        <div className="toggle__fields">
          <p className="toggle__text">
            <span className="first__text">Allow user management system</span>
            <span className="last__text">
              Grant writeable permissions to editors.
            </span>
          </p>
          <Toggle defaultChecked={false} />
        </div>

        <div className="toggle__fields">
          <p className="toggle__text">
            <span className="first__text">Assign Pass key to Guest Users</span>
            <span className="last__text">
              Generate a pass key that expires after a user logs out.
            </span>
          </p>
          <Toggle defaultChecked={false} />
        </div>

        <div className="toggle__fields">
          <p className="toggle__text">
            <span className="first__text">Allow push notification</span>
            <span className="last__text">
              Push and read messages from your members.
            </span>
          </p>
          <Toggle defaultChecked={false} />
        </div>
      </div>
      {/* MANAGE ACCOUNT */}

      {/* BANNER ACCOUNT */}
      <div className="compactContent">
        <p className="compact_t-ma">Banner Images</p>

        <div className="image__upload-container">
          <label htmlFor="uploadImage">Upload Banner</label>
          <input
            type="file"
            name="imageUpload"
            id="uploadImage"
            style={{ display: "none" }}
            accept="jpg/img, png/img, jpeg/img, JPG/img, PNG/img, JPEG/img, svg/img, SVG/img"
            onChange={handleSetImage}
          />
          <p>Banner should be 1920x230 in px</p>
        </div>
      </div>
      {/* BANNER ACCOUNT */}
      <div className="update__btn">
        <button onClick={handleIsAlert}>Update Settings</button>
      </div>

      {isAlert && (
        <ConfirmModal
          msg={"Confirm to update banner"}
          cancelConfirm={handleIsAlert}
          acceptConfirm={handleSubmit}
        />
      )}
    </div>
  );
};

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

export default Set;
