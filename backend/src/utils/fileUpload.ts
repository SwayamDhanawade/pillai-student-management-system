import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
const THUMBNAIL_DIR = path.join(process.cwd(), 'public/thumbnails');
const THUMBNAIL_SIZE = 150;

export async function saveBase64File(base64Data: string, fileName: string): Promise<string | null> {
  try {
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      console.error('Invalid base64 image format');
      return null;
    }

    const ext = matches[1].toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!allowedExtensions.includes(ext)) {
      console.error('Invalid file type:', ext);
      return null;
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    if (!fs.existsSync(THUMBNAIL_DIR)) {
      fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
    }

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);
    const thumbnailPath = path.join(THUMBNAIL_DIR, uniqueName);
    
    const buffer = Buffer.from(matches[2], 'base64');
    
    // Save original image
    fs.writeFileSync(filePath, buffer);
    
    // Create thumbnail
    await sharp(buffer)
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    return `/uploads/${uniqueName}`;
  } catch (error) {
    console.error('Error saving file:', error);
    return null;
  }
}

export async function deleteFile(photoUrl: string | null): Promise<void> {
  if (!photoUrl) return;
  
  try {
    const fileName = path.basename(photoUrl);
    const filePath = path.join(process.cwd(), 'public', photoUrl);
    const thumbnailPath = path.join(THUMBNAIL_DIR, fileName);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}