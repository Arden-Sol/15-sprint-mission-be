import express from 'express';
import { router } from './routes/index.js';
import { logger } from './middlewares/logger.js';
import { cors } from './middlewares/cors.js';
import { errorHandler } from './middlewares/error-handler.js';
import { connectDB } from './db/Products.js';
const PORT = 5001;
const app = express();

await connectDB();

app.use(cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(logger);

app.use('/', router);

app.use(errorHandler);

app.listen(PORT, () => console.log(`서버가 실행중: ${PORT}`));
