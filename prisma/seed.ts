import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Admin User
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@aicuradiagnostics.com' },
    update: {
      passwordHash: adminPasswordHash,
      name: 'Super Admin',
    },
    create: {
      email: 'admin@aicuradiagnostics.com',
      name: 'Super Admin',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log(`✅ Admin user seeded: ${adminUser.email}`);

  // 2. Packages
  const packagesData = [
    {
      title: 'Full Body Checkup - Comprehensive',
      slug: 'full-body-checkup-comprehensive',
      category: 'Full Body Checkup',
      testCount: 85,
      originalPrice: 4999,
      discountedPrice: 1999,
      description: 'Comprehensive health evaluation covering 85 parameters including Lipid, Liver, Kidney, Thyroid, CBC, and Diabetes profiles.',
      includedTests: [
        'Complete Blood Count (CBC)',
        'Lipid Profile (8 tests)',
        'Liver Function Test (LFT - 11 tests)',
        'Kidney Function Test (KFT - 10 tests)',
        'Thyroid Profile (T3, T4, TSH)',
        'Fasting Blood Sugar (FBS)',
        'HbA1c (Glycated Hemoglobin)',
        'Urine Routine & Microscopic',
        'Vitamin D3 & Vitamin B12',
      ],
      benefits: ['Free Home Sample Collection', 'Reports within 24 Hours', 'Free Doctor Consultation'],
      preparation: 'Fasting required for 10-12 hours prior to sample collection.',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
      isPopular: true,
      badgeText: 'BEST VALUE (60% OFF)',
      isPublished: true,
    },
    {
      title: 'Senior Citizen Health Package - Male',
      slug: 'senior-citizen-health-package-male',
      category: 'Senior Care',
      testCount: 72,
      originalPrice: 5999,
      discountedPrice: 2499,
      description: 'Specially designed for senior men, including cardiac risk markers, PSA for prostate health, and bone health checks.',
      includedTests: [
        'Complete Blood Count',
        'Lipid Profile Complete',
        'Liver & Kidney Function',
        'Prostate Specific Antigen (PSA)',
        'HbA1c & Fasting Glucose',
        'Vitamin D3 & Calcium',
        'Electrocardiogram (ECG)',
        'Uric Acid',
      ],
      benefits: ['Priority Sample Collection', 'Geriatric Specialist Review', 'Detailed Health Summary'],
      preparation: 'Fasting 10-12 hours. Avoid alcohol 24 hours prior.',
      imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600',
      isPopular: false,
      badgeText: 'SENIOR SPECIAL',
      isPublished: true,
    },
    {
      title: 'Senior Citizen Health Package - Female',
      slug: 'senior-citizen-health-package-female',
      category: 'Senior Care',
      testCount: 75,
      originalPrice: 5999,
      discountedPrice: 2499,
      description: 'Comprehensive health screening tailored for senior women covering bone density markers, thyroid function, and cardiac risk.',
      includedTests: [
        'Complete Blood Count',
        'Lipid Profile Complete',
        'Liver & Kidney Function',
        'Thyroid Profile Complete',
        'HbA1c & Fasting Glucose',
        'Vitamin D3, B12 & Calcium',
        'Urine Analysis Complete',
        'Iron Profile',
      ],
      benefits: ['Priority Home Sample Collection', 'Free Doctor Consultation'],
      preparation: 'Fasting 10-12 hours required.',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
      isPopular: false,
      badgeText: 'POPULAR FOR WOMEN',
      isPublished: true,
    },
    {
      title: 'Diabetes Monitoring Profile',
      slug: 'diabetes-monitoring-profile',
      category: 'Specialized Care',
      testCount: 15,
      originalPrice: 1999,
      discountedPrice: 899,
      description: 'Focused profile for diabetic patients to monitor blood sugar control, kidney involvement, and lipid balance.',
      includedTests: [
        'HbA1c (Glycated Hemoglobin)',
        'Fasting Blood Glucose',
        'Post Prandial Glucose (PPBS)',
        'Microalbuminuria (Urine)',
        'Lipid Profile Mini',
        'Serum Creatinine',
      ],
      benefits: ['Same-day Digital Reports', 'Diabetes Care Guide PDF'],
      preparation: 'Fasting 10 hours for FBS; 2 hours after meals for PPBS.',
      imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600',
      isPopular: true,
      badgeText: '55% OFF',
      isPublished: true,
    },
    {
      title: 'Thyroid & Vitamin Screening',
      slug: 'thyroid-vitamin-screening',
      category: 'Vitamins & Hormones',
      testCount: 8,
      originalPrice: 2499,
      discountedPrice: 1199,
      description: 'Essential screening for fatigue, weight changes, and hair loss — checks thyroid hormone levels and Vitamin D3/B12.',
      includedTests: ['T3 Total', 'T4 Total', 'TSH (Ultrasensitive)', 'Vitamin D3 (25-OH)', 'Vitamin B12 (Cyanocobalamin)'],
      benefits: ['Fast 12-Hour Reporting', 'Interpretation Assistance'],
      preparation: 'No specific fasting required, morning sample recommended.',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
      isPopular: false,
      badgeText: 'ESSENTIAL CARE',
      isPublished: true,
    },
  ];

  for (const pkg of packagesData) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }
  console.log(`✅ ${packagesData.length} packages seeded`);

  // 3. Diagnostic Tests
  const testsData = [
    {
      name: 'Complete Blood Count (CBC)',
      code: 'TEST-CBC-01',
      category: 'Hematology',
      price: 350,
      originalPrice: 500,
      sampleType: 'Whole Blood (EDTA)',
      fastingRequired: false,
      reportTurnaround: 'Same Day (6 Hours)',
      description: 'Evaluates overall health and detects a wide range of disorders including anemia and infection.',
      isActive: true,
    },
    {
      name: 'Thyroid Profile Total (T3, T4, TSH)',
      code: 'TEST-THY-02',
      category: 'Endocrinology',
      price: 550,
      originalPrice: 800,
      sampleType: 'Serum',
      fastingRequired: false,
      reportTurnaround: 'Same Day (8 Hours)',
      description: 'Measures thyroid hormone levels to assess thyroid gland function.',
      isActive: true,
    },
    {
      name: 'HbA1c (Glycated Hemoglobin)',
      code: 'TEST-HBA1C-03',
      category: 'Diabetology',
      price: 450,
      originalPrice: 650,
      sampleType: 'Whole Blood (EDTA)',
      fastingRequired: false,
      reportTurnaround: '4 Hours',
      description: 'Reflects average blood sugar levels over the past 2 to 3 months.',
      isActive: true,
    },
    {
      name: 'Lipid Profile Complete',
      code: 'TEST-LIP-04',
      category: 'Biochemistry',
      price: 650,
      originalPrice: 950,
      sampleType: 'Serum',
      fastingRequired: true,
      reportTurnaround: 'Same Day',
      description: 'Measures cholesterol and triglyceride levels to assess cardiovascular risk.',
      isActive: true,
    },
    {
      name: 'Vitamin D3 (25-Hydroxy)',
      code: 'TEST-VITD-05',
      category: 'Vitamins',
      price: 899,
      originalPrice: 1400,
      sampleType: 'Serum',
      fastingRequired: false,
      reportTurnaround: '24 Hours',
      description: 'Determines vitamin D level for bone health and immune function.',
      isActive: true,
    },
    {
      name: 'Liver Function Test (LFT)',
      code: 'TEST-LFT-06',
      category: 'Biochemistry',
      price: 750,
      originalPrice: 1100,
      sampleType: 'Serum',
      fastingRequired: true,
      reportTurnaround: '12 Hours',
      description: 'Assesses liver proteins, enzymes, and bilirubin levels.',
      isActive: true,
    },
  ];

  for (const test of testsData) {
    await prisma.diagnosticTest.upsert({
      where: { code: test.code },
      update: test,
      create: test,
    });
  }
  console.log(`✅ ${testsData.length} diagnostic tests seeded`);

  // 4. Blogs
  const blogsData = [
    {
      title: 'Understanding Your Full Body Checkup Report: A Step-by-Step Guide',
      slug: 'understanding-full-body-checkup-report',
      excerpt: 'Learn how to read key health parameters like HbA1c, Lipid profile, and CBC without confusion.',
      content: `
        <p>Receiving your lab report can feel overwhelming with complex medical jargon and numerical reference ranges. Here is a clear guide on how to interpret key markers:</p>
        <h3>1. Lipid Profile</h3>
        <p>Look at your Total Cholesterol, HDL (good cholesterol), and LDL (bad cholesterol). Target LDL under 100 mg/dL for optimal heart health.</p>
        <h3>2. HbA1c & Fasting Glucose</h3>
        <p>HbA1c measures 3-month sugar averages. Below 5.7% is normal; 5.7% - 6.4% indicates prediabetes; 6.5%+ indicates diabetes.</p>
        <h3>3. Thyroid Profile</h3>
        <p>TSH is the primary indicator. High TSH often indicates an underactive thyroid (hypothyroidism).</p>
      `,
      coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      readTime: '5 min read',
      author: 'Dr. Ananya Sharma',
      isPublished: true,
    },
    {
      title: 'Top 5 Essential Health Screenings for Seniors Over 60',
      slug: 'top-5-essential-health-screenings-for-seniors',
      excerpt: 'Preventative care in senior years is critical for longevity and maintaining an active lifestyle.',
      content: `
        <p>Regular health checkups after age 60 can detect potential conditions early, preventing complications and ensuring independence.</p>
        <ul>
          <li><strong>Cardiac Evaluation:</strong> ECG, Lipid Profile, and Blood Pressure monitoring.</li>
          <li><strong>Bone Density & Vitamins:</strong> Vitamin D3, Calcium, and DEXA scans.</li>
          <li><strong>Kidney & Liver Function:</strong> Routine KFT and LFT blood work.</li>
          <li><strong>Prostate Health (Men):</strong> Annual PSA test.</li>
          <li><strong>HbA1c:</strong> Diabetes screening.</li>
        </ul>
      `,
      coverImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800',
      readTime: '4 min read',
      author: 'Dr. Rajesh Verma',
      isPublished: true,
    },
    {
      title: 'Why Vitamin D Deficiencies Are Rising & How to Test',
      slug: 'why-vitamin-d-deficiencies-are-rising',
      excerpt: 'Indoor lifestyles have made Vitamin D deficiency extremely common in urban populations.',
      content: `
        <p>More than 70% of urban Indians have insufficient Vitamin D levels. Symptoms include fatigue, bone pain, muscle weakness, and frequent infections.</p>
        <p>A simple 25-Hydroxy Vitamin D blood test can determine your exact levels so your doctor can prescribe appropriate dosage supplementation.</p>
      `,
      coverImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
      readTime: '3 min read',
      author: 'AiCura Medical Team',
      isPublished: true,
    },
  ];

  for (const blog of blogsData) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: blog,
      create: blog,
    });
  }
  console.log(`✅ ${blogsData.length} blogs seeded`);

  // 5. Testimonials
  const testimonialsData = [
    {
      patientName: 'Sunita Reddy',
      location: 'Hyderabad',
      comment: 'The home sample collection service was prompt and gentle. Reports arrived on WhatsApp within 18 hours. Highly recommended!',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      isFeatured: true,
    },
    {
      patientName: 'Ramesh Patel',
      location: 'Bengaluru',
      comment: 'Booked the Senior Citizen package for my parents. Phlebotomist was very professional and patient. The free doctor consultation call was very insightful.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      isFeatured: true,
    },
    {
      patientName: 'Priya Mukherjee',
      location: 'Kolkata',
      comment: 'Very competitive pricing for full body packages compared to other labs, and NABL accredited accuracy. Extremely satisfied!',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      isFeatured: true,
    },
  ];

  await prisma.testimonial.deleteMany();
  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`✅ ${testimonialsData.length} testimonials seeded`);

  // 6. FAQs
  const faqsData = [
    {
      question: 'How do I prepare for a home sample collection?',
      answer: 'If your test requires fasting (e.g. Full Body, Lipid Profile, FBS), do not consume food or beverages except plain water for 10-12 hours prior to collection. Keep your doctor prescription ready if applicable.',
      displayOrder: 1,
      isActive: true,
    },
    {
      question: 'Are home sample collection charges extra?',
      answer: 'Home collection is FREE for all health packages and test orders above ₹499.',
      displayOrder: 2,
      isActive: true,
    },
    {
      question: 'How quickly will I receive my test reports?',
      answer: 'Routine blood tests (CBC, Glucose, Thyroid) are delivered within 6 to 12 hours. Comprehensive packages take 18-24 hours.',
      displayOrder: 3,
      isActive: true,
    },
    {
      question: 'Is AiCura Diagnostics lab NABL accredited?',
      answer: 'Yes, all our diagnostic laboratories follow strict NABL quality standards and ISO certifications for 100% test accuracy.',
      displayOrder: 4,
      isActive: true,
    },
  ];

  await prisma.fAQ.deleteMany();
  for (const f of faqsData) {
    await prisma.fAQ.create({ data: f });
  }
  console.log(`✅ ${faqsData.length} FAQs seeded`);

  // 7. Campaigns
  const campaign1 = await prisma.campaign.upsert({
    where: { slug: 'monsoon-health-check' },
    update: {
      name: 'Monsoon Preventive Health Drive 2026',
      title: 'Stay Safe This Monsoon — Special 60% OFF Full Body Checkups',
      subtitle: 'Protect your family from vector-borne diseases & seasonal infections.',
      description: 'Comprehensive 85-parameter health checkup at just ₹1,999 with free home sample collection across all major cities.',
      heroImageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
      ctaText: 'Claim 60% Discount Now',
      seoTitle: 'Monsoon Special Health Checkup 60% OFF | AiCura Diagnostics',
      seoDescription: 'Book Monsoon Special Full Body Checkup at ₹1,999. Includes 85 tests, free home sample collection & free doctor consultation.',
      isActive: true,
    },
    create: {
      name: 'Monsoon Preventive Health Drive 2026',
      slug: 'monsoon-health-check',
      title: 'Stay Safe This Monsoon — Special 60% OFF Full Body Checkups',
      subtitle: 'Protect your family from vector-borne diseases & seasonal infections.',
      description: 'Comprehensive 85-parameter health checkup at just ₹1,999 with free home sample collection across all major cities.',
      heroImageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
      ctaText: 'Claim 60% Discount Now',
      seoTitle: 'Monsoon Special Health Checkup 60% OFF | AiCura Diagnostics',
      seoDescription: 'Book Monsoon Special Full Body Checkup at ₹1,999. Includes 85 tests, free home sample collection & free doctor consultation.',
      isActive: true,
      sections: {
        create: [
          {
            title: 'Why Monsoon Screenings are Crucial',
            content: 'High humidity during monsoon increases bacterial and viral infections. Early detection helps manage immunity levels, lipid balance, and liver parameters.',
            displayOrder: 1,
          },
          {
            title: 'What Is Included in ₹1,999 Package',
            content: 'Complete Blood Count, Liver Function Test, Kidney Profile, Lipid Profile, Thyroid T3/T4/TSH, HbA1c, and Vitamin D3.',
            displayOrder: 2,
          },
        ],
      },
    },
  });

  const campaign2 = await prisma.campaign.upsert({
    where: { slug: 'senior-care-special' },
    update: {
      name: 'Senior Citizen Care Campaign',
      title: 'Empower Senior Health with Tailored Diagnostics',
      subtitle: 'Comprehensive annual health evaluation for elderly parents.',
      description: 'Specially created packages for seniors including prostate screening, bone density markers, and cardiac risk assessment.',
      heroImageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1200',
      ctaText: 'Book Senior Care Package',
      seoTitle: 'Senior Citizen Health Package Discount | AiCura Diagnostics',
      seoDescription: 'Book Senior Citizen Full Body Checkup with priority home collection and geriatric specialist review.',
      isActive: true,
    },
    create: {
      name: 'Senior Citizen Care Campaign',
      slug: 'senior-care-special',
      title: 'Empower Senior Health with Tailored Diagnostics',
      subtitle: 'Comprehensive annual health evaluation for elderly parents.',
      description: 'Specially created packages for seniors including prostate screening, bone density markers, and cardiac risk assessment.',
      heroImageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1200',
      ctaText: 'Book Senior Care Package',
      seoTitle: 'Senior Citizen Health Package Discount | AiCura Diagnostics',
      seoDescription: 'Book Senior Citizen Full Body Checkup with priority home collection and geriatric specialist review.',
      isActive: true,
      sections: {
        create: [
          {
            title: 'Hassle-Free Senior Care',
            content: 'Gentle phlebotomists trained for senior care with painless needle technology and priority reporting.',
            displayOrder: 1,
          },
        ],
      },
    },
  });
  console.log('✅ Campaigns seeded');

  // 8. Sample Customers & Enquiries
  const customer1 = await prisma.customer.create({
    data: {
      fullName: 'Vikram Malhotra',
      phone: '9876543210',
      email: 'vikram.m@example.com',
      address: 'Plot 42, Jubilee Hills',
      city: 'Hyderabad',
      pincode: '500033',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      fullName: 'Sneha Kapoor',
      phone: '9123456789',
      email: 'sneha.k@example.com',
      address: 'B-104, Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
    },
  });

  const fullBodyPkg = await prisma.package.findUnique({ where: { slug: 'full-body-checkup-comprehensive' } });

  await prisma.enquiry.create({
    data: {
      type: 'HOME_COLLECTION',
      customerId: customer1.id,
      campaignId: campaign1.id,
      status: 'NEW',
      message: 'Please schedule home collection for morning 7:30 AM.',
      preferredDate: '2026-09-20',
      preferredTime: '07:30 AM',
      tests: {
        create: [{ testName: 'Complete Blood Count (CBC)' }, { testName: 'Thyroid Profile' }],
      },
    },
  });

  if (fullBodyPkg) {
    await prisma.enquiry.create({
      data: {
        type: 'PACKAGE',
        customerId: customer2.id,
        campaignId: campaign1.id,
        status: 'CONTACTED',
        message: 'Need 2 packages for me and my spouse.',
        package: {
          create: {
            packageId: fullBodyPkg.id,
            quantity: 2,
          },
        },
      },
    });
  }

  await prisma.enquiry.create({
    data: {
      type: 'CONTACT',
      customerId: customer1.id,
      status: 'COMPLETED',
      message: 'Inquiring about franchise opportunities in Gachibowli.',
    },
  });

  console.log('✅ Sample customers & enquiries seeded');

  // Hero Banner Carousel Seed
  const heroBannersData = [
    {
      title: 'Full Body Health Checkup - 60% OFF',
      subtitle: 'Comprehensive 85-parameter health evaluation with NABL accredited lab reports & free doctor consultation.',
      badgeText: 'BEST VALUE PACKAGE',
      buttonText: 'Explore Packages',
      buttonLink: '/packages',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1920',
      mobileImageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
      displayOrder: 0,
      isActive: true,
    },
    {
      title: '100% Doorstep Home Sample Collection',
      subtitle: 'Painless sample collection by certified phlebotomists delivered at your convenient time slot.',
      badgeText: 'FREE HOME COLLECTION',
      buttonText: 'Book Home Collection',
      buttonLink: '/home-collection',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1920',
      mobileImageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
      displayOrder: 1,
      isActive: true,
    },
    {
      title: 'Specialized Senior Citizen Health Care',
      subtitle: 'Cardiac, diabetes, bone density & vital organ screening tailored for elderly parents.',
      badgeText: 'SENIOR CITIZEN SPECIAL',
      buttonText: 'View Senior Packages',
      buttonLink: '/packages',
      imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1920',
      mobileImageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800',
      displayOrder: 2,
      isActive: true,
    },
  ];

  await prisma.heroBanner.deleteMany();
  for (const banner of heroBannersData) {
    await prisma.heroBanner.create({ data: banner });
  }
  console.log(`✅ ${heroBannersData.length} Hero Carousel Banners seeded`);

  console.log('🎉 Database seeding completed successfully!');
}

main()

  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
