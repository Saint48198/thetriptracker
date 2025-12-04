import express from 'express';
import cookieParser from 'cookie-parser';

import userTokenRouter from './routes/userToken';
import usersRouter from './routes/users';
import userPasswordRoute from './routes/userPassword';
import changePasswordRouter from './routes/changePassword';
import attractions from './routes/attractions';
import attractionsById from './routes/attractionsById';
import login from './routes/login';


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(usersRouter);
app.use(userPasswordRoute);
app.use(changePasswordRouter);
app.use(userTokenRouter);
app.use(attractions);
app.use(attractionsById);
app.use(login);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
