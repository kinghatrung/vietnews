import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';

import articleRouter from './routes/articleRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import commentRouter from './routes/commentRouter.js';
import newsRouter from './routes/newsRouter.js';
import roleRouter from './routes/roleRouter.js';
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import uploadRouter from './routes/uploadRouter.js';
import statusRouter from './routes/statusRouter.js';
import recommendRouter from './routes/recommendRouter.js';
import notificationRouter from './routes/notificationRouter.js';
import geminiRouter from './routes/geminiRouter.js';

import { connect } from './config/connect.js';

const app = express();
const __dirname = path.resolve();

const port = process.env.PORT || 1302;

// CONNECT DATABASE
connect();

app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: `${process.env.BASE_URL}`,
      credentials: true,
    })
  );
}

// ROUTES
app.use('/api/article', articleRouter);
app.use('/api/category', categoryRouter);
app.use('/api/comments', commentRouter);
app.use('/api/news', newsRouter);
app.use('/api/roles', roleRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/status', statusRouter);
app.use('/api/recommend', recommendRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/gemini', geminiRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../Client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/dist/index.html'));
  });
}

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
