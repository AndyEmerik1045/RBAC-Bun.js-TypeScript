import { Request, Response } from 'express';
import { getAllRoles, createRole, deleteRole } from '../models/roleModel';

export const listRoles = async (req: Request, res: Response) => {
  const roles = await getAllRoles();
  res.render('layouts/main', {
    title: 'Role Management',
    body: '../roles/list',
    roles
  });
};

export const storeRole = async (req: Request, res: Response) => {
  await createRole(req.body.name);
  res.redirect('/roles');
};

export const removeRole = async (req: Request, res: Response) => {
  await deleteRole(parseInt(req.params.id));
  res.redirect('/roles');
};
