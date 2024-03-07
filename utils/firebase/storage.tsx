import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "./config";
import { v4 as uuidv4 } from "uuid";
import { addRental } from "./firestore";

export const uploadRentalImage = async (
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
    // file.forEach(async (file: any) => {
    //   const uploadTask = await uploadBytesResumable(storageRef, file);
    //   const downloadURL = await getDownloadURL(uploadTask.ref);
    //   UrlList.push(downloadURL);
    //   console.log("File available at", downloadURL);
    //   // uploadTask.on(
    //   //   "state_changed",
    //   //   (snapshot) => {
    //   //     const progress =
    //   //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //   //     console.log("Upload is " + progress + "% done");
    //   //   },
    //   //   (error) => {
    //   //     console.log(error);
    //   //   },
    //   //   async () => {
    //   //     // Handle successful uploads on complete
    //   //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    //   //     getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
    //   //       console.log("File available at", downloadURL);
    //   //       UrlList.push(downloadURL);
    //   //     });
    //   //     //  await addRental(
    //   //     //    rentalUid,
    //   //     //    carName,
    //   //     //    carPrice,
    //   //     //    UrlList,
    //   //     //    carModel,
    //   //     //    carYear.toString(),
    //   //     //    carMake,
    //   //     //    carSeats.toString(),
    //   //     //    carDescription,
    //   //     //    carFuel
    //   //     //  );
    //   //   }
    //   // );
    // });
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
      carNumberPlate
    );
    // const uploadTask = uploadBytesResumable(storageRef, file);

    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const progress =
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log("Upload is " + progress + "% done");
    //   },
    //   (error) => {
    //     console.log(error);
    //   },
    //   async() => {
    //     // Handle successful uploads on complete
    //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    //     getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
    //       console.log("File available at", downloadURL);
    //      UrlList.push(downloadURL);
    //     });
    //      await addRental(
    //        rentalUid,
    //        carName,
    //        carPrice,
    //        UrlList,
    //        carModel,
    //        carYear.toString(),
    //        carMake,
    //        carSeats.toString(),
    //        carDescription,
    //        carFuel
    //      );
    //   }
    // );
    return true;
  }
  return false;

  // ... existing code ...
};
