# AiCura Diagnostics — Next.js CMS & Diagnostic Platform

A production-ready Next.js 15 healthcare diagnostic lab platform built with TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, and Cloudinary.

---

## 🌟 Key Features

### 1. **Prisma ORM & PostgreSQL Database**
- Fully typed data layer powered by Prisma ORM.
- Entities: `AdminUser`, `Package`, `Campaign`, `CampaignSection`, `Customer`, `Enquiry`, `EnquiryTest`, `EnquiryPackage`, `DiagnosticTest`, `Blog`, `Testimonial`, `FAQ`.
- Customer upserting by phone number (prevents duplicate customer records).
- Strict relational constraints and indexes.

### 2. **Dynamic Campaign System (`/campaign/[slug]`)**
- Create marketing promotional drives from the Admin CMS.
- Custom hero banners, headlines, sub-taglines, CTA text, and content sections.
- Automatic campaign attribution on incoming patient enquiries.
- Dedicated campaign SEO metadata (`seoTitle`, `seoDescription`).

### 3. **Centralized Enquiry Management**
- Filter enquiries by **Type** (`HOME_COLLECTION`, `PACKAGE`, `CONTACT`), **Status** (`NEW`, `CONTACTED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`), campaign source, date range, or customer name/phone search.
- Doctor prescription upload support.
- Real-time status updates from the admin table.

### 4. **JWT-Based Admin Authentication**
- Secure HTTP-only cookie session storage using `jose` and `bcryptjs`.
- Automatic session validation via `/api/auth/me`.

### 5. **Cloudinary Image Storage**
- Image upload service for packages and campaigns strictly requiring Cloudinary.

---

## 🚀 Getting Started

### 1. **Prerequisites**
- Node.js (v20+ recommended)
- PostgreSQL (Local or Supabase PostgreSQL instance)

### 2. **Environment Setup**
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure your local PostgreSQL connection string in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET="your_jwt_secret_key_here_min_32_chars"

# Cloudinary Configuration (REQUIRED for Image Storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. **Database Migration & Seeding**

```bash
# Validate Prisma schema
npx prisma validate

# Generate Prisma Client
npm run prisma:generate

# Run Database Migrations (Create local PostgreSQL tables)
npx prisma migrate dev --name init

# Seed Database with Admin User, Packages, Tests, Blogs, FAQs & Campaigns
npm run prisma:seed
```

---

## 🔐 Default Admin Credentials

After running `npm run prisma:seed`:

- **Admin Login URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@aicuradiagnostics.com`
- **Password**: `admin123`

---

## 📡 RESTful API Endpoint Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate admin user & set HTTP-only cookie | No |
| `POST` | `/api/auth/logout` | Clear admin authentication cookie | No |
| `GET` | `/api/auth/me` | Fetch current admin profile | Yes |
| `GET` | `/api/packages` | List health checkup packages | No (Public only published) |
| `POST` | `/api/packages` | Create new health package | Yes (Admin) |
| `GET` | `/api/packages/[id]` | Fetch package details by ID/slug | No |
| `PATCH` | `/api/packages/[id]` | Update package or toggle publish status | Yes (Admin) |
| `DELETE` | `/api/packages/[id]` | Delete package | Yes (Admin) |
| `GET` | `/api/campaigns` | List marketing campaigns | No |
| `POST` | `/api/campaigns` | Create marketing campaign drive | Yes (Admin) |
| `GET` | `/api/campaigns/[id]` | Fetch campaign details | No |
| `PATCH` | `/api/campaigns/[id]` | Update campaign details | Yes (Admin) |
| `DELETE` | `/api/campaigns/[id]` | Delete campaign drive | Yes (Admin) |
| `POST` | `/api/campaigns/[id]/sections` | Add content section to campaign | Yes (Admin) |
| `GET` | `/api/enquiries` | Fetch enquiries list with filters & stats | Yes (Admin) |
| `POST` | `/api/enquiries` | Submit new patient enquiry | No |
| `GET` | `/api/enquiries/[id]` | Get enquiry detail | Yes (Admin) |
| `PATCH` | `/api/enquiries/[id]` | Update enquiry status (`NEW`, `COMPLETED`, etc.) | Yes (Admin) |
| `POST` | `/api/upload` | Upload image to Cloudinary | Yes (Admin) |
| `GET` | `/api/tests` | Search diagnostic tests catalogue | No |
| `GET` | `/api/blogs` | Fetch blogs list or single article by slug | No |
| `GET` | `/api/testimonials` | Fetch featured patient reviews | No |

---

## 🛠 Project Structure

```
AiCura-Diagnostics/
├── prisma/
│   ├── schema.prisma       # Prisma database models & relations
│   └── seed.ts             # Complete database seed script
├── src/
│   ├── app/
│   │   ├── admin/          # Admin CMS pages (Dashboard, Packages, Campaigns, Enquiries)
│   │   ├── api/            # Next.js App Router REST API endpoints
│   │   ├── campaign/       # Dynamic public campaign landing page [slug]
│   │   ├── packages/       # Public health packages listing page
│   │   ├── tests-services/ # Public diagnostic tests search catalogue
│   │   └── home-collection/# Home collection booking page
│   ├── components/
│   │   ├── admin/          # Admin Layout & Drawer components
│   │   ├── campaign/       # Campaign enquiry form component
│   │   ├── home/           # Homepage sections (Hero, Packages, Blogs, FAQs)
│   │   ├── layout/         # Header, Footer, WhatsApp button
│   │   └── ui/             # Enquire Modal component
│   ├── lib/
│   │   ├── api-response.ts # Standardized HTTP response helpers
│   │   ├── auth.ts         # JWT sign/verify & bcrypt password helpers
│   │   ├── prisma.ts       # Singleton Prisma Client instance
│   │   └── validation.ts   # Server-side validation functions
│   ├── services/           # Service layer for database CRUD operations
│   └── types/              # Domain interfaces & API types
├── prisma.config.ts        # Prisma 7 configuration file
└── README.md
```
