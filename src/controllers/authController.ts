import { Request, Response } from 'express';
import pool from '../config/database';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

export const showLogin = (req: Request, res: Response) => {
  res.render('auth/login', { title: 'Login', error: null });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );

  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render('auth/login', {
      title: 'Login',
      error: 'Username atau password salah'
    });
  }

  (req.session as any).user = { id: user.id, role_id: user.role_id };
  res.redirect('/users');
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
