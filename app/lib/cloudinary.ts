import { v2 as cloudinary } from 'cloudinary';

// Konfiguracja Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Funkcja do uploadu obrazów
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'trawers/courses',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!.secure_url);
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Błąd podczas uploadu obrazu:', error);
    throw new Error('Nie udało się przesłać obrazu');
  }
};

// Funkcja do uploadu wideo
export const uploadVideo = async (file: File): Promise<string> => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'trawers/courses/videos',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!.secure_url);
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Błąd podczas uploadu wideo:', error);
    throw new Error('Nie udało się przesłać wideo');
  }
};

// Funkcja do uploadu dokumentów (PDF, DOCX, etc.)
export const uploadDocument = async (file: File): Promise<string> => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'trawers/documents',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!.secure_url);
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Błąd podczas uploadu dokumentu:', error);
    throw new Error('Nie udało się przesłać dokumentu');
  }
};

// Uniwersalna funkcja do uploadu plików
export const uploadFile = async (file: File): Promise<string> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  // Określ typ pliku na podstawie rozszerzenia
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(fileExtension || '')) {
    return uploadImage(file);
  } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(fileExtension || '')) {
    return uploadVideo(file);
  } else {
    return uploadDocument(file);
  }
};

// Funkcja do usuwania plików z Cloudinary
export const deleteFile = async (publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Błąd podczas usuwania pliku:', error);
    throw new Error('Nie udało się usunąć pliku');
  }
};

export default cloudinary; 