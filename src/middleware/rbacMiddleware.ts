import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req.session as any)?.user;

    if (!user) return res.redirect('/login');

    const [rows] = await pool.query(`
      SELECT p.name FROM users u
      JOIN roles r ON u.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE u.id = ?
    `, [user.id]);

    const permissions = (rows as any[]).map(row => row.name);

    if (permissions.includes(requiredPermission)) {
      next();
    } else {
      res.status(403).send('Forbidden: insufficient permissions');
    }
  };
};
