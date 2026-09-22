export interface HealthPackage {
  id: string;
  title: string;
  slug: string;
  category: string;
  testCount: number;
  originalPrice: number;
  discountedPrice: number;
  description: string;
  includedTests: string[];
  isPopular?: boolean;
  badgeText?: string;
  imageUrl?: string;
}

export interface DiagnosticTest {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  originalPrice?: number;
  sampleType: string;
  fastingRequired: boolean;
  reportTurnaround: string;
  description: string;
}

export interface HealthBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  readTime: string;
  publishedAt: string;
  author: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  location: string;
  comment: string;
  rating: number;
  avatarUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const INITIAL_PACKAGES: HealthPackage[] = [
  {
    id: "pkg-1",
    title: "Full Body Checkup",
    slug: "full-body-checkup",
    category: "Full Body",
    testCount: 75,
    originalPrice: 4500,
    discountedPrice: 2690,
    description: "Complete health assessment for you and your family.",
    includedTests: [
      "Complete Blood Count (CBC)",
      "Lipid Profile (Cholesterol & Triglycerides)",
      "Liver Function Test (LFT)",
      "Kidney Function Test (KFT)",
      "Fasting Blood Sugar (FBS)",
      "Thyroid Stimulating Hormone (TSH)",
      "Urine Routine Analysis"
    ],
    isPopular: true,
    badgeText: "Best Seller"
  },
  {
    id: "pkg-2",
    title: "Senior Citizen Package",
    slug: "senior-citizen-package",
    category: "Senior Health",
    testCount: 63,
    originalPrice: 4000,
    discountedPrice: 2399,
    description: "Stay healthy in every stage of senior life with comprehensive screening.",
    includedTests: [
      "Complete Blood Count (CBC)",
      "HbA1c (3-Month Sugar Average)",
      "Cardiac Risk Profile",
      "Vitamin D & Vitamin B12",
      "Bone Health Profile (Calcium, Phosphorus)",
      "Kidney & Liver Markers"
    ],
    isPopular: true,
    badgeText: "Recommended"
  },
  {
    id: "pkg-3",
    title: "Women's Health Package",
    slug: "womens-health-package",
    category: "Women Care",
    testCount: 40,
    originalPrice: 3200,
    discountedPrice: 1999,
    description: "Special care and hormonal/nutritional screening for her health.",
    includedTests: [
      "Complete Hemogram & Anemia Panel",
      "Comprehensive Thyroid Profile (T3, T4, TSH)",
      "Calcium & Iron Deficiency Markers",
      "Fasting Blood Glucose",
      "Lipid Profile"
    ],
    isPopular: true,
    badgeText: "Popular"
  },
  {
    id: "pkg-4",
    title: "Diabetes Care Package",
    slug: "diabetes-care-package",
    category: "Diabetes",
    testCount: 15,
    originalPrice: 1600,
    discountedPrice: 899,
    description: "Monitor your sugar levels and prevent diabetic complications.",
    includedTests: [
      "Fasting Blood Sugar (FBS)",
      "Post Prandial Blood Sugar (PPBS)",
      "HbA1c Glycated Hemoglobin",
      "Microalbuminuria Test",
      "Serum Creatinine"
    ],
    isPopular: false
  },
  {
    id: "pkg-5",
    title: "Vitamin Health Package",
    slug: "vitamin-health-package",
    category: "Vitamins",
    testCount: 25,
    originalPrice: 2000,
    discountedPrice: 1199,
    description: "Check your essential vitamins and immunity deficiency levels.",
    includedTests: [
      "Vitamin D3 (25-Hydroxy)",
      "Vitamin B12 (Cyanocobalamin)",
      "Serum Calcium",
      "Complete Blood Count (CBC)"
    ],
    isPopular: false
  }
];

export const INITIAL_TESTS: DiagnosticTest[] = [
  {
    id: "t-1",
    name: "Complete Blood Count (CBC)",
    code: "CBC01",
    category: "Blood Tests",
    price: 350,
    originalPrice: 500,
    sampleType: "Blood",
    fastingRequired: false,
    reportTurnaround: "6 Hours",
    description: "Evaluates overall health and detects a wide range of disorders including anemia, infection, and leukemia."
  },
  {
    id: "t-2",
    name: "HbA1c (Glycated Hemoglobin)",
    code: "HBA1C",
    category: "Diabetes",
    price: 450,
    originalPrice: 600,
    sampleType: "Blood",
    fastingRequired: false,
    reportTurnaround: "12 Hours",
    description: "Measures average blood sugar levels over the past 2-3 months to assess diabetes management."
  },
  {
    id: "t-3",
    name: "Thyroid Profile Total (T3, T4, TSH)",
    code: "THY03",
    category: "Thyroid",
    price: 550,
    originalPrice: 800,
    sampleType: "Blood",
    fastingRequired: true,
    reportTurnaround: "24 Hours",
    description: "Checks thyroid gland function and helps diagnose hyperthyroidism or hypothyroidism."
  },
  {
    id: "t-4",
    name: "Vitamin D3 (25-Hydroxy)",
    code: "VITD3",
    category: "Vitamins",
    price: 990,
    originalPrice: 1500,
    sampleType: "Blood",
    fastingRequired: false,
    reportTurnaround: "24 Hours",
    description: "Determines Vitamin D deficiency necessary for strong bones and robust immune function."
  },
  {
    id: "t-5",
    name: "Lipid Profile Comprehensive",
    code: "LIP05",
    category: "Heart Health",
    price: 650,
    originalPrice: 950,
    sampleType: "Blood",
    fastingRequired: true,
    reportTurnaround: "12 Hours",
    description: "Measures cholesterol levels (HDL, LDL, VLDL) and triglycerides to evaluate cardiovascular risk."
  },
  {
    id: "t-6",
    name: "Liver Function Test (LFT)",
    code: "LFT06",
    category: "Organ Function",
    price: 600,
    originalPrice: 900,
    sampleType: "Blood",
    fastingRequired: true,
    reportTurnaround: "12 Hours",
    description: "Assesses liver enzyme levels, bilirubin, and protein markers to evaluate liver health."
  }
];

export const INITIAL_BLOGS: HealthBlog[] = [
  {
    id: "b-1",
    title: "What Does a CBC Test Tell You?",
    slug: "what-does-a-cbc-test-tell-you",
    excerpt: "Understand the key parameters of a Complete Blood Count and why doctors recommend it for routine checkups.",
    content: "A Complete Blood Count (CBC) is one of the most common diagnostic blood tests. It measures red blood cells, white blood cells, hemoglobin, hematocrit, and platelets...",
    coverImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800",
    readTime: "5 min read",
    publishedAt: "Sep 01, 2026",
    author: "Dr. Ananya Sharma, Pathologist"
  },
  {
    id: "b-2",
    title: "Why Regular Testing Helps You Stay Healthy",
    slug: "why-regular-testing-helps-you-stay-healthy",
    excerpt: "Discover how preventative diagnostic screenings detect asymptomatic conditions early before they become critical.",
    content: "Routine diagnostic tests act as an early warning system for your body. Conditions like high cholesterol, early-stage diabetes, and thyroid imbalance rarely exhibit symptoms early on...",
    coverImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800",
    readTime: "4 min read",
    publishedAt: "Aug 28, 2026",
    author: "AiCura Health Team"
  },
  {
    id: "b-3",
    title: "Simple Lifestyle Changes For a Healthier You",
    slug: "simple-lifestyle-changes-for-a-healthier-you",
    excerpt: "Actionable daily habits to complement your clinical diagnostic reports and boost long-term vitality.",
    content: "Pairing accurate diagnostic insights with actionable lifestyle adjustments empowers long-term wellness. Simple habits like 30 minutes of daily brisk walking and adequate hydration...",
    coverImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800",
    readTime: "6 min read",
    publishedAt: "Aug 20, 2026",
    author: "Dr. Rajesh Menon"
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    patientName: "Suresh K.",
    location: "Kochi",
    comment: "The home collection was very convenient and the staff were professional. Reports were delivered on time.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "t-2",
    patientName: "Priya B.",
    location: "Ernakulam",
    comment: "Excellent service and polite staff. The entire process was smooth from booking to report.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "t-3",
    patientName: "Amit R.",
    location: "Kochi",
    comment: "Affordable packages and accurate reports. Highly recommended for home sample collection!",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How does home sample collection work?",
    answer: "Once you book a home sample collection online or over phone, our certified phlebotomist visits your doorstep at your chosen time slot adhering to strict safety & hygiene protocols. Your samples are safely transported in temperature-controlled kits to our NABL-certified lab."
  },
  {
    id: "faq-2",
    question: "When will I get my reports?",
    answer: "Most routine test reports (CBC, Sugar, Lipid Profile) are delivered within 6 to 12 hours via email & WhatsApp. Specialized tests like Vitamin panels or Hormones are delivered within 24 hours."
  },
  {
    id: "faq-3",
    question: "Do you accept doctor prescriptions?",
    answer: "Yes! You can upload your prescription directly on our home page or booking page. Our medical team will review the prescription and schedule your sample collection accordingly."
  },
  {
    id: "faq-4",
    question: "Are the tests covered under insurance?",
    answer: "We provide official itemized GST tax invoices with lab accreditation numbers which can be submitted to your health insurance provider for reimbursement."
  },
  {
    id: "faq-5",
    question: "What payment methods do you accept?",
    answer: "We accept Cash on Collection, UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking."
  },
  {
    id: "faq-6",
    question: "In which areas is home collection available?",
    answer: "Home sample collection is currently active across Kochi, Ernakulam, Aluva, Kakkanad, Tripunithura, and surrounding regional locations within 25 km."
  }
];
