import multer, { FileFilterCallback } from 'multer';
import path from 'path';

export function makeId(length:number):string {
    let result = [];
    const characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

export function validateSubName(name: string): boolean {
  // Check length: minimum 3, maximum 21 characters
  if (name.length < 3 || name.length > 21) {
    return false;
  }
  
  // Check allowed characters: letters, numbers, and underscore
  const allowedChars = /^[A-Za-zА-Яa-я0-9_]+$/;
  return !!name.match(allowedChars);
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: 'public/images',
    filename: (_, file, cb) => {
      const name = makeId(15);
      cb(null, name + path.extname(file.originalname)); // ex. adwdwqeq + .png
    }
  }),
  fileFilter: (_, file: any, cb: FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype == 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('File is not an image'));
    }
  }
});