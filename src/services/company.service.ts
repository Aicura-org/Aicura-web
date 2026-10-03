import { prisma } from '@/lib/prisma';
import { CreateCompanyDetailsInput, UpdateCompanyDetailsInput } from '@/types';

export const CompanyService = {
  async listCompanyDetails(options?: { isActive?: boolean }) {
    const where: any = {};
    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    return prisma.companyDetails.findMany({
      where,
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  },

  async getCompanyDetailsById(id: string) {
    return prisma.companyDetails.findUnique({
      where: { id },
    });
  },

  async getPrimaryCompanyDetails() {
    const primary = await prisma.companyDetails.findFirst({
      where: { isPrimary: true, isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (primary) return primary;

    return prisma.companyDetails.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  },

  async createCompanyDetails(input: CreateCompanyDetailsInput) {
    const count = await prisma.companyDetails.count();
    const shouldBePrimary = input.isPrimary ?? (count === 0);

    if (shouldBePrimary) {
      await prisma.companyDetails.updateMany({
        data: { isPrimary: false },
      });
    }

    return prisma.companyDetails.create({
      data: {
        companyName: input.companyName.trim(),
        branchName: input.branchName?.trim() || null,
        address: input.address.trim(),
        city: input.city?.trim() || null,
        state: input.state?.trim() || null,
        pincode: input.pincode?.trim() || null,
        mobileNumber: input.mobileNumber.trim(),
        alternatePhone: input.alternatePhone?.trim() || null,
        whatsappNumber: input.whatsappNumber.trim(),
        email: input.email?.trim() || null,
        mapLink: input.mapLink.trim(),
        workingHours: input.workingHours?.trim() || null,
        websiteUrl: input.websiteUrl?.trim() || null,
        taxNumber: input.taxNumber?.trim() || null,
        isPrimary: shouldBePrimary,
        isActive: input.isActive ?? true,
      },
    });
  },

  async updateCompanyDetails(id: string, input: UpdateCompanyDetailsInput) {
    const existing = await prisma.companyDetails.findUnique({ where: { id } });
    if (!existing) return null;

    if (input.isPrimary) {
      await prisma.companyDetails.updateMany({
        where: { id: { not: id } },
        data: { isPrimary: false },
      });
    }

    return prisma.companyDetails.update({
      where: { id },
      data: {
        ...(input.companyName !== undefined && { companyName: input.companyName.trim() }),
        ...(input.branchName !== undefined && { branchName: input.branchName ? input.branchName.trim() : null }),
        ...(input.address !== undefined && { address: input.address.trim() }),
        ...(input.city !== undefined && { city: input.city ? input.city.trim() : null }),
        ...(input.state !== undefined && { state: input.state ? input.state.trim() : null }),
        ...(input.pincode !== undefined && { pincode: input.pincode ? input.pincode.trim() : null }),
        ...(input.mobileNumber !== undefined && { mobileNumber: input.mobileNumber.trim() }),
        ...(input.alternatePhone !== undefined && { alternatePhone: input.alternatePhone ? input.alternatePhone.trim() : null }),
        ...(input.whatsappNumber !== undefined && { whatsappNumber: input.whatsappNumber.trim() }),
        ...(input.email !== undefined && { email: input.email ? input.email.trim() : null }),
        ...(input.mapLink !== undefined && { mapLink: input.mapLink.trim() }),
        ...(input.workingHours !== undefined && { workingHours: input.workingHours ? input.workingHours.trim() : null }),
        ...(input.websiteUrl !== undefined && { websiteUrl: input.websiteUrl ? input.websiteUrl.trim() : null }),
        ...(input.taxNumber !== undefined && { taxNumber: input.taxNumber ? input.taxNumber.trim() : null }),
        ...(input.isPrimary !== undefined && { isPrimary: input.isPrimary }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
  },

  async deleteCompanyDetails(id: string) {
    const existing = await prisma.companyDetails.findUnique({ where: { id } });
    if (!existing) return null;

    const deleted = await prisma.companyDetails.delete({
      where: { id },
    });

    // If deleted record was primary, assign another primary if available
    if (existing.isPrimary) {
      const next = await prisma.companyDetails.findFirst({
        orderBy: { createdAt: 'asc' },
      });
      if (next) {
        await prisma.companyDetails.update({
          where: { id: next.id },
          data: { isPrimary: true },
        });
      }
    }

    return deleted;
  },
};
