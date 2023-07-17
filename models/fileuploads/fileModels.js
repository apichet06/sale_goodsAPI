const fs = require('fs');
const path = require('path');


class FileHelper {
  static async uploadFile(file, u_id, folder) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const folderPath = `uploads/${folder}/${year}${month}`;
    const modifiedFileName = `${u_id}${path.extname(file.originalname)}`;
    const filePath = path.join(folderPath, modifiedFileName);
    fs.mkdirSync(folderPath, { recursive: true });
    fs.renameSync(file.path, filePath);

    return filePath;
  }
}

module.exports = FileHelper;