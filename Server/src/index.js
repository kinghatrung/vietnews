const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const articleRouter = require('./routes/articleRouter');
const categoryRouter = require('./routes/categoryRouter');
const commentRouter = require('./routes/commentRouter');
const newsRouter = require('./routes/newsRouter');
const roleRouter = require('./routes/roleRouter');
const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const uploadRouter = require('./routes/uploadRouter');
const statusRouter = require('./routes/statusRouter');
const recommendRouter = require('./routes/recommendRouter');
const notificationRouter = require('./routes/notificationRouter');
const commentRoutes = require('./routes/commentRouter');
const geminiRouter = require('./routes/geminiRouter');

const app = express();

const db = require('./config/connect');
const port = 1302;

app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.BASE_URL}`,
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: '50mb' }));

// CONNECT DATABASE
db.connect();

// ROUTES
app.use('/api/article', articleRouter);
app.use('/api/category', categoryRouter);
app.use('/api/comment', commentRouter);
app.use('/api/news', newsRouter);
app.use('/api/roles', roleRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/status', statusRouter);
app.use('/api/recommend', recommendRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/comments', commentRoutes);
app.use('/api/gemini', geminiRouter);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
