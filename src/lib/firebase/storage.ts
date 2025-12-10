import app from "./config";

let storageInstance: any = null;

const getStorage = async () => {
  if (typeof window === "undefined") {
    throw new Error("Storage is only available on the client side");
  }
  
  if (!storageInstance) {
    const { getStorage } = await import("firebase/storage");
    storageInstance = getStorage(app);
  }
  
  return storageInstance;
};

export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storage = await getStorage();
  const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

export const deleteImage = async (path: string): Promise<void> => {
  const storage = await getStorage();
  const { ref, deleteObject } = await import("firebase/storage");
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

