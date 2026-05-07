import express from 'express';
import session from 'express-session';
import 'dotenv/config';
import path from 'path';
import authRoutes from './routers/authRoutes';
import userRoutes from './routers/userRoutes';
import roleRoutes from './routers/roleRoutes';
import permissionRoutes from './routers/permissionRoutes';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'rahasia123',
  resave: false,
  saveUninitialized: false,
}));

app.use('/', authRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/permissions', permissionRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
