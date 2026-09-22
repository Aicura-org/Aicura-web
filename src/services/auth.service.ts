import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, signJwt } from '@/lib/auth';
import { AdminUserProfile } from '@/types';

export const AuthService = {
  async login(email: string, password: string): Promise<{ token: string; user: AdminUserProfile } | null> {
    const user = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return null;
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await signJwt(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    };
  },

  async getAdminProfile(id: string): Promise<AdminUserProfile | null> {
    const user = await prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    return user;
  },

  async changePassword(adminId: string, currentPass: string, newPass: string): Promise<boolean> {
    const user = await prisma.adminUser.findUnique({ where: { id: adminId } });
    if (!user) return false;

    const isMatch = await verifyPassword(currentPass, user.passwordHash);
    if (!isMatch) return false;

    const newHash = await hashPassword(newPass);
    await prisma.adminUser.update({
      where: { id: adminId },
      data: { passwordHash: newHash },
    });

    return true;
  },
};
