import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { plainTextToHtml } from '../src/lib/blog-content';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const blogsData = [
  {
    title: 'Understanding Your Full Body Checkup Report: A Step-by-Step Guide',
    slug: 'understanding-full-body-checkup-report',
    excerpt: 'Learn how to read key health parameters like HbA1c, Lipid profile, and CBC without confusion.',
    content: [
      'Receiving your lab report can feel overwhelming with complex medical jargon and numerical reference ranges. Here is a clear guide on how to interpret key markers:',
      '',
      '1. Lipid Profile',
      'Look at your Total Cholesterol, HDL (good cholesterol), and LDL (bad cholesterol). Target LDL under 100 mg/dL for optimal heart health.',
      '',
      '2. HbA1c & Fasting Glucose',
      'HbA1c measures 3-month sugar averages. Below 5.7% is normal; 5.7% - 6.4% indicates prediabetes; 6.5%+ indicates diabetes.',
      '',
      '3. Thyroid Profile',
      'TSH is the primary indicator. High TSH often indicates an underactive thyroid (hypothyroidism).',
    ].join('\n'),
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    readTime: '5 min read',
    author: 'Dr. Ananya Sharma',
    isPublished: true,
  },
  {
    title: 'Top 5 Essential Health Screenings for Seniors Over 60',
    slug: 'top-5-essential-health-screenings-for-seniors',
    excerpt: 'Preventative care in senior years is critical for longevity and maintaining an active lifestyle.',
    content: [
      'Regular health checkups after age 60 can detect potential conditions early, preventing complications and ensuring independence.',
      '',
      '• Cardiac Evaluation: ECG, Lipid Profile, and Blood Pressure monitoring.',
      '• Bone Density & Vitamins: Vitamin D3, Calcium, and DEXA scans.',
      '• Kidney & Liver Function: Routine KFT and LFT blood work.',
      '• Prostate Health (Men): Annual PSA test.',
      '• HbA1c: Diabetes screening.',
    ].join('\n'),
    coverImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800',
    readTime: '4 min read',
    author: 'Dr. Rajesh Verma',
    isPublished: true,
  },
  {
    title: 'Why Vitamin D Deficiencies Are Rising & How to Test',
    slug: 'why-vitamin-d-deficiencies-are-rising',
    excerpt: 'Indoor lifestyles have made Vitamin D deficiency extremely common in urban populations.',
    content: [
      'More than 70% of urban Indians have insufficient Vitamin D levels. Symptoms include fatigue, bone pain, muscle weakness, and frequent infections.',
      '',
      'A simple 25-Hydroxy Vitamin D blood test can determine your exact levels so your doctor can prescribe appropriate dosage supplementation.',
    ].join('\n'),
    coverImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    readTime: '3 min read',
    author: 'AiCura Medical Team',
    isPublished: true,
  },
];

async function main() {
  console.log('🌱 Starting blogs seed...');

  let seededCount = 0;
  for (const blog of blogsData) {
    const formattedContent = plainTextToHtml(blog.content);
    const existing = await prisma.blog.findUnique({
      where: { slug: blog.slug },
    });

    if (!existing) {
      await prisma.blog.create({
        data: {
          ...blog,
          content: formattedContent,
        },
      });
      seededCount++;
    } else {
      await prisma.blog.update({
        where: { slug: blog.slug },
        data: {
          content: formattedContent,
        },
      });
    }
  }

  console.log(`✅ Blogs seed completed (${seededCount} new, ${blogsData.length} total checked).`);
}

main()
  .catch((e) => {
    console.error('❌ Error during blogs seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
