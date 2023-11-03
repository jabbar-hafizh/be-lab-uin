// import the multer module before configuring it to use the disc storage engine
import crypto from 'crypto'
import multer, { diskStorage } from 'multer'
import { promisify } from 'util'

const maxSize = 2 * 1024 * 1024
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + '/public/fileuploads/')
  },
  filename: (req, file, cb) => {
    file.originalname = crypto.randomUUID() + file.originalname
    console.log(file.originalname)
    cb(null, file.originalname)
  }
})

async function fileFilter(req, file, callback) {
  if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype.toLowerCase())) {
    callback(null, true) // Accept the file
  } else {
    callback('Invalid file type. Only JPEG, JPG, or PNG files are allowed.', false)
  }
}

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter
}).single('file')

// create the exported middleware object
const uploadFileMiddleware = promisify(uploadFile)
export default uploadFileMiddleware
