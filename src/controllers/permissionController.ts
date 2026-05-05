import { Request, Response } from 'express';
import { getAllPermissions, assignPermissionToRole } from '../models/permissionModel';

export const listPermissions = async (req: Request, res: Response) => {
  const permissions = await getAllPermissions();
  res.render('layouts/main', {
    title: 'Permission Management',
    body: '../permissions/list',
    permissions
  });
};

export const assignPermission = async (req: Request, res: Response) => {
  const { role_id, permission_id } = req.body;
  await assignPermissionToRole(parseInt(role_id), parseInt(permission_id));
  res.redirect('/permissions');
};
