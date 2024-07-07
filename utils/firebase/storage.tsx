import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "./config";
import { v4 as uuidv4 } from "uuid";
import {
  addRental,
  updateUserCoverPicture,
  updateUserProfilePicture,
} from "./firestore";

export const uploadRentalImage = async (
  userID: any,
  file: any[],
  rentalUid: any,
  {
    carName,
    carPrice,
    carModel,
    carYear,
    carMake,
    carSeats,
    carDescription,
    carFuel,
    carNumberPlate,
    addressLine1,
    addressLine2,
    category,
  }: any
) => {
  const storageUID = uuidv4();
  // ... existing code ...

  if (file.length > 0) {
    console.log("File: ", file);
    const storage = getStorage();
    // const storageRef = ref(storage, `rentals/${rentalUid}/`);
    let UrlList: any = [];
    for (const doc of file) {
      const storageRef = ref(storage, `rentals/${rentalUid}/${doc.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, doc);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      UrlList.push(downloadURL);
      console.log("File available at", downloadURL);
    }

    console.log("UrlList: ", UrlList);
    await addRental(
      rentalUid,
      carName,
      carPrice,
      UrlList,
      carModel,
      carYear.toString(),
      carMake,
      carSeats.toString(),
      carDescription,
      carFuel,
      carNumberPlate,
      addressLine1,
      addressLine2,
      userID,
      category
    );

    return true;
  }
  return false;

  // ... existing code ...
};
export const uploadProfileImage = async (file: any, userID: any) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${userID}/profile/${file.name}`);
  const uploadTask = await uploadBytesResumable(storageRef, file);
  const downloadURL = await getDownloadURL(uploadTask.ref);
  console.log("File available at", downloadURL);

  return await updateUserProfilePicture(userID, downloadURL);
};
export const uploadCoverImage = async (file: any, userID: any) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${userID}/cover/${file.name}`);
  const uploadTask = await uploadBytesResumable(storageRef, file);
  const downloadURL = await getDownloadURL(uploadTask.ref);
  // console.log("File available at", downloadURL);

  return await updateUserCoverPicture(userID, downloadURL);
};
export const uploadID = async (files: any[], userID: any) => {
  const storage = getStorage();
  const downloadURLs: any = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const storageRef = ref(storage, `${userID}/NationalID/${file.name}`);
    const uploadTask = await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);

    // Identify front or back based on index
    const label = i === 0 ? "front" : "back";
    downloadURLs[label] = downloadURL;

    // console.log(`File (${label}) available at`, downloadURL);
  }

  return downloadURLs;
};
export const deleteProfileDirectory = async (userID: any) => {
  const storage = getStorage();
  const directoryRef = ref(storage, `${userID}/profile`);

  try {
    const res = await listAll(directoryRef);
    res.items.forEach((fileRef) => {
      deleteObject(fileRef);
    });
    updateUserProfilePicture(userID, "");
    console.log("Profile picture deleted successfully");
    return {
      status: "success",
      message: "Profile picture deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting profile directory: ", error);
    return {
      status: "error",
      message: "Error deleting profile directory.",
    };
  }
};
export const deleteCoverImageDirectory = async (userID: any) => {
  const storage = getStorage();
  const directoryRef = ref(storage, `${userID}/cover`);

  try {
    const res = await listAll(directoryRef);
    res.items.forEach((fileRef) => {
      deleteObject(fileRef);
    });
    updateUserProfilePicture(userID, "");
    console.log("Cover picture deleted successfully");
    return {
      status: "success",
      message: "Cover picture deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting cover directory: ", error);
    return {
      status: "error",
      message: "Error deleting cover directory.",
    };
  }
};
