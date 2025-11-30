import express from 'express';
import cookieParser from 'cookie-parser';

import userTokenRouter from './routes/userToken';
import usersRouter from './routes/users';
import userPasswordRoute from './routes/userPassword';
import changePasswordRouter from './routes/changePassword';


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(usersRouter);
app.use(userPasswordRoute);
app.use(changePasswordRouter);
app.use(userTokenRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
