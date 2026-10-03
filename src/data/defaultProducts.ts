import { Product } from '../types';

export const sampleImagePresets = [
  {
    name: 'স্ট্যাথোস্কোপ',
    url: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'মেডিকেল বই',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'বিপি মেশিন',
    url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'ল্যাব কোট',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'ডায়াগনস্টিক সেট',
    url: 'https://images.unsplash.com/photo-1583912267670-6575ad362e4b?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'সার্জিক্যাল কিট',
    url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'থার্মোমিটার / পালস অক্সিমিটার',
    url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80'
  }
];

export const defaultProducts: Product[] = [
  {
    id: 1,
    name: "IQRA & Genesis Series Exam Books",
    category: "books",
    price: "৬৫০ - ১,৫০০",
    rawPrice: 950,
    stock: "in-stock",
    icon: "BookOpen",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    badge: "জনপ্রিয়",
    description: "FCPS Part-1, BCS Medical, এবং Residency পরীক্ষার জন্য বিশেষভাবে প্রস্তুতকৃত আপডেটেড প্রশ্নব্যাংক ও বিস্তারিত ব্যাখ্যাসহ সম্পূর্ণ প্রস্তুতিমূলক বই।",
    features: [
      "লেটেস্ট কারিকুলাম ও এডিশন",
      "অধ্যায়ভিত্তিক বিগত বছরের প্রশ্ন ও ব্যাখ্যা",
      "হাই-ইল্ড ক্লিনিক্যাল পার্লস ও সামারি চার্ট"
    ]
  },
  {
    id: 2,
    name: "3M Littmann Classic III Stethoscope",
    category: "instruments",
    price: "১১,৫০০",
    rawPrice: 11500,
    stock: "in-stock",
    icon: "Stethoscope",
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&auto=format&fit=crop&q=80",
    badge: "১০০% অরিজিনাল",
    description: "আসল থ্রি-এম লিটম্যান ক্ল্যাসিক থ্রি স্ট্যাথোস্কোপ। উচ্চ একোস্টিক সেনসিটিভিটি এবং ডুয়াল টিউনযোগ্য ডায়াফ্রাম যা চিকিৎসকদের এক নম্বর পছন্দ।",
    features: [
      "দ্বিমুখী টিউনযোগ্য ডায়াফ্রাম (প্রাপ্তবয়স্ক ও পেডিয়াট্রিক)",
      "নেক্সট-জেনারেশন সফট-সিলিং ইয়ারটিপস",
      "স্টেইনলেস স্টিল ফিনিশিং ও ৫ বছরের ওয়ারেন্টি কার্ড"
    ]
  },
  {
    id: 3,
    name: "Digital & Analog BP Machine Set",
    category: "diagnostics",
    price: "২,২০০",
    rawPrice: 2200,
    stock: "in-stock",
    icon: "Activity",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&auto=format&fit=crop&q=80",
    badge: "নির্ভুল রিডিং",
    description: "রক্তচাপ (Blood Pressure) নিখুঁতভাবে পরিমাপের জন্য জাপানিজ সেন্সরযুক্ত প্রিমিয়াম ডিজিটাল ও ডাবল টিউব অ্যানালগ স্ফিগমোম্যানোমিটার।",
    features: [
      "অটোমেটিক ইনফ্লেশন ও ইরেগুলার হার্টবিট ডিটেকশন",
      "লার্জ এলসিডি ডিসপ্লে ব্যাকলাইট সহ",
      "অ্যাডজাস্টেবল ওয়াইড রেঞ্জ আর্ম কাফ (২২-৪২ সেমি)"
    ]
  },
  {
    id: 4,
    name: "Professional Medical Lab Coat & Apron",
    category: "apparel",
    price: "৮৫০",
    rawPrice: 850,
    stock: "in-stock",
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
    badge: "প্রিমিয়াম ফেব্রিক",
    description: "মেডিকেল শিক্ষার্থী, ইন্টার্ন ও চিকিৎসকদের জন্য ১০০% প্রিমিয়াম সুতি কাপড়ের আরামদায়ক, টেকসই ও অ্যান্টি-রিঙ্কেল ল্যাব কোট।",
    features: [
      "গভীর তিনটি পকেট (স্টেথো ও ডায়েরি রাখার উপযুক্ত)",
      "উন্নত মানের বোতাম ও নিখুঁত সেলাই",
      "সাইজ: S, M, L, XL, XXL ও কাস্টমাইজ সুবিধা"
    ]
  },
  {
    id: 5,
    name: "Otoscope & Ophthalmoscope Diagnostic Kit",
    category: "diagnostics",
    price: "৪,৫০০",
    rawPrice: 4500,
    stock: "in-stock",
    icon: "Eye",
    image: "https://images.unsplash.com/photo-1583912267670-6575ad362e4b?w=600&auto=format&fit=crop&q=80",
    badge: "ক্লিনিক্যাল সেট",
    description: "কান, নাক ও চোখের প্রাথমিক শারীরিক পরীক্ষার জন্য অপটিক ফাইবার এলইডি লাইটযুক্ত কমপ্যাক্ট ডায়াগনস্টিক সেট।",
    features: [
      "৩এক্স ম্যাগনিফাইং অপটিক্যাল লেন্স",
      "রি-ইউজেবল বিভিন্ন সাইজের ইয়ার স্পেকুলা",
      "হার্ড কেরি কেস সহ পোর্টেবল ডিজাইন"
    ]
  },
  {
    id: 6,
    name: "MRCP / Davidson / Harrison Textbooks",
    category: "books",
    price: "২,৮০০",
    rawPrice: 2800,
    stock: "in-stock",
    icon: "GraduationCap",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=600&auto=format&fit=crop&q=80",
    badge: "ইম্পোর্টেড",
    description: "ডেভিডসন মেডিসিন, হ্যারিসন, বেইলি অ্যান্ড লাভ এবং এমআরসিপি পরীক্ষার আন্তর্জাতিক মানের অরিজিনাল কালার প্রিন্ট টেক্সটবুক।",
    features: [
      "সম্পূর্ণ রঙিন হাই-কোয়ালিটি আর্ট পেপার",
      "আন্তর্জাতিক সর্বশেষ সংস্করণ",
      "ক্লিনিক্যাল প্র্যাকটিস ও রেসিডেন্সির জন্য আবশ্যক"
    ]
  },
  {
    id: 7,
    name: "Surgical Minor OT Dissection Kit",
    category: "instruments",
    price: "১,৪৫০",
    rawPrice: 1450,
    stock: "in-stock",
    icon: "Scissors",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&auto=format&fit=crop&q=80",
    badge: "জার্মান স্টিল",
    description: "মেডিকেল ইন্টার্ন ও ওয়ার্ড ডিউটির জন্য প্রিমিয়াম স্টেইনলেস স্টিলের ১০ পিস মাইনর সার্জিক্যাল ইনস্ট্রুমেন্ট সেট।",
    features: [
      "নিডল হোল্ডার, আর্টারি ফোর্সেপস ও মেয়ো সিজার",
      "বিপি হ্যান্ডেল উইথ অতিরিক্ত ব্লেডস",
      "প্রিমিয়াম জিপার লেদার কেস"
    ]
  },
  {
    id: 8,
    name: "Pulse Oximeter & Infrared Thermometer Combo",
    category: "diagnostics",
    price: "১,১৫০",
    rawPrice: 1150,
    stock: "in-stock",
    icon: "Thermometer",
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80",
    badge: "কম্বো অফার",
    description: "রক্তের অক্সিজেন মাত্রা (SpO2) ও পালস রেট পরিমাপের ফিঙ্গারটিপ পালস অক্সিমিটার এবং নন-কন্টাক্ট ইনফ্রারেড থার্মোমিটার প্যাকেজ।",
    features: [
      "অলিড ডিসপ্লে সহ দ্রুত ফলাফল",
      "১ সেকেন্ডে নন-কন্টাক্ট শরীরের তাপমাত্রা রিডিং",
      "অটোমেটিক পাওয়ার অফ ব্যাটারি সাশ্রয়ী সিস্টেম"
    ]
  },
  {
    id: 9,
    name: "Medical Neurological Hammer & Tuning Fork",
    category: "instruments",
    price: "৯৫০",
    rawPrice: 950,
    stock: "stock-out",
    icon: "Wrench",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80",
    badge: "পরীক্ষা কিট",
    description: "ক্লিনিক্যাল এক্সামিনেশনের জন্য টেলিস্কোপিক নার্ভ হাতুড়ি (T-shape reflex hammer) এবং ১২৮/২৫৬/৫১২ হার্টজের টিউনিং ফর্ক।",
    features: [
      "সঠিক ভারসাম্য ও ওয়েটেড ব্যালান্স",
      "স্নায়বিক পরীক্ষা ও সংবেদনশীলতা নির্ণয়ে পারফেক্ট",
      "মরিচারোধী টেকসই অ্যালুমিনিয়াম অ্যালোয়"
    ]
  }
];

