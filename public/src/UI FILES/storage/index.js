import { firebaseApp } from "app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const storage = getStorage(firebaseApp);

// Maximum file size in bytes (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
];

export interface UploadProgress {
  progress: number;
  downloadUrl?: string;
  error?: string;
}

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`;
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return "Invalid file type. Please upload a PDF, Word, Excel, or image file.";
  }

  return null;
}

export function uploadFile(
  file: File,
  path: string,
  onProgress: (progress: UploadProgress) => void
): () => void {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress({ progress });
    },
    (error) => {
      onProgress({ progress: 0, error: error.message });
    },
    async () => {
      try {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        onProgress({ progress: 100, downloadUrl });
      } catch (error: any) {
        onProgress({ progress: 0, error: error.message });
      }
    }
  );

  // Return a function to cancel the upload if needed
  return () => uploadTask.cancel();
}

export async function deleteFile(path: string): Promise<{ error: string | null }> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export function getFileNameFromPath(path: string): string {
  return path.split("/").pop() || "";
}

export function generateStoragePath(userId: string, eventId: string, fileName: string): string {
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "-");
  return `events/${eventId}/budgets/${userId}/${Date.now()}-${sanitizedFileName}`;
}
