import { prisma } from '@/lib/prisma';
import { CreateEnquiryInput, EnquiryFilterParams, EnquiryStatus } from '@/types';

export const EnquiryService = {
  async createEnquiry(input: CreateEnquiryInput) {
    // 1. Find or create Customer by phone number
    const normalizedPhone = input.phone.replace(/\s+/g, '');
    let customer = await prisma.customer.findFirst({
      where: { phone: normalizedPhone },
    });

    if (customer) {
      // Update customer contact info if new info provided
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          fullName: input.fullName || customer.fullName,
          ...(input.email && { email: input.email }),
          ...(input.address && { address: input.address }),
          ...(input.city && { city: input.city }),
          ...(input.pincode && { pincode: input.pincode }),
        },
      });
    } else {
      customer = await prisma.customer.create({
        data: {
          fullName: input.fullName,
          phone: normalizedPhone,
          email: input.email || null,
          address: input.address || null,
          city: input.city || null,
          pincode: input.pincode || null,
        },
      });
    }

    // 2. Resolve Campaign ID if campaignSlug provided
    let campaignId = input.campaignId || null;
    if (!campaignId && input.campaignSlug) {
      const campaign = await prisma.campaign.findUnique({
        where: { slug: input.campaignSlug },
      });
      if (campaign) campaignId = campaign.id;
    }

    // 3. Create Enquiry with transaction for nested relations
    const enquiry = await prisma.enquiry.create({
      data: {
        type: input.type,
        customerId: customer.id,
        campaignId,
        status: 'NEW',
        message: input.message || null,
        prescriptionUrl: input.prescriptionUrl || null,
        preferredDate: input.preferredDate || null,
        preferredTime: input.preferredTime || null,
        ...(input.tests && input.tests.length > 0 && {
          tests: {
            create: input.tests.map((testName) => ({ testName })),
          },
        }),
        ...(input.packageId && {
          package: {
            create: {
              packageId: input.packageId,
              quantity: input.packageQuantity || 1,
            },
          },
        }),
      },
      include: {
        customer: true,
        campaign: {
          select: { id: true, name: true, slug: true },
        },
        tests: true,
        package: {
          include: {
            package: {
              select: { title: true, discountedPrice: true },
            },
          },
        },
      },
    });

    return enquiry;
  },

  async listEnquiries(params: EnquiryFilterParams = {}) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.type) where.type = params.type;
    if (params.status) where.status = params.status;
    if (params.campaignId) where.campaignId = params.campaignId;

    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    if (params.search && params.search.trim().length > 0) {
      const search = params.search.trim();
      where.OR = [
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
        { customer: { phone: { contains: search } } },
        { customer: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        include: {
          customer: true,
          campaign: {
            select: { id: true, name: true, slug: true },
          },
          tests: true,
          package: {
            include: {
              package: {
                select: { title: true, discountedPrice: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.enquiry.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  async getEnquiryById(id: string) {
    return prisma.enquiry.findUnique({
      where: { id },
      include: {
        customer: true,
        campaign: {
          select: { id: true, name: true, slug: true, title: true },
        },
        tests: true,
        package: {
          include: {
            package: true,
          },
        },
      },
    });
  },

  async updateEnquiryStatus(id: string, status: EnquiryStatus) {
    return prisma.enquiry.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        campaign: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  },

  async getDashboardStats() {
    const [
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      completedEnquiries,
      totalPackages,
      activeCampaigns,
      recentEnquiries,
    ] = await Promise.all([
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: 'NEW' } }),
      prisma.enquiry.count({ where: { status: 'CONTACTED' } }),
      prisma.enquiry.count({ where: { status: 'COMPLETED' } }),
      prisma.package.count({ where: { isPublished: true } }),
      prisma.campaign.count({ where: { isActive: true } }),
      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          campaign: { select: { name: true } },
        },
      }),
    ]);

    return {
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      completedEnquiries,
      totalPackages,
      activeCampaigns,
      recentEnquiries,
    };
  },
};
