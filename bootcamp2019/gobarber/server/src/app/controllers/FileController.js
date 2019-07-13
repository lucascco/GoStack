import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const fileCreated = await File.create({ name, path });
    return res.json(fileCreated);
  }
}

export default new FileController();
