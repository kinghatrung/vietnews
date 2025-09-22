import { Router } from 'express';
import uploadController from '../controllers/uploadController.js';

const uploadRouter = Router();

uploadRouter.post('/image_upload', uploadController.uploadImage);

export default uploadRouter;
