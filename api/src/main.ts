import express from 'express';

import usersRouter from './routes/users';
import userPasswordRoute from './routes/userPassword';

const app = express();

app.use(express.json());

app.use(usersRouter);
app.use(userPasswordRoute);

export default app;
