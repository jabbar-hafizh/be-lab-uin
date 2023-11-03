import uploadFileMiddleware from '../middlewares/multer.js'

const upload = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res)
    if (!req.file) {
      return res.status(400).send({ message: 'Upload a file please!' })
    }
    res.status(200).send({ message: 'OK', data: req.file.originalname })
  } catch (error) {
    res.status(500).send({ error })
  }
}

const UploadController = {
  upload
}

export default UploadController
