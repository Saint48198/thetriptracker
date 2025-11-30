import express from 'express';

import usersRouter from './routes/users';

const app = express();

app.use(express.json());

// Mount so the path is exactly /users/:id
app.use(usersRouter);

export default app;
