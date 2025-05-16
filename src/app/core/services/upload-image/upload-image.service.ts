import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  cloudinaryConfig = environment.cloudinary;
  image_url = '';

  constructor() { }

  // Convert a URI to a File object
  async uriToFile(uri: string, fileName: string): Promise<File> {
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log('Error al subir la imagen:' , blob);
      return new File([blob], fileName, { type: blob.type });
    }

  // Upload a File to Cloudinary
  async uploadImage(file: File) {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.cloudinaryConfig.uploadPreset);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      this.image_url = data.secure_url;
      console.log('Imagen subida con éxito:', this.image_url);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
    return this.image_url;
  }
}