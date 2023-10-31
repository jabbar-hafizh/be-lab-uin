import UploadController from './controllers/upload_controller.js'

export default app => {
  app.post('/upload', UploadController.upload)
}
