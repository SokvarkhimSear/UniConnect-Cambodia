export type Language = 'en' | 'kh';

export const dict = {
  en: {
    title: "UniConnect Cambodia",
    heroSlogan: "Your Gateway to Higher Education",
    heroSub: "Connect with current university students, explore top institutions, and get guidance on your applications.",
    searchPlaceholder: "Search for universities, majors, or mentors...",
    searchButton: "Search",
    featuredUnis: "Featured Universities",
    featuredUnisSub: "Discover top-rated institutions in Cambodia and find the right fit for your future.",
    viewAll: "View All",
    connectMentors: "Our Student Mentors",
    mentorSlogan: "Get real advice from students who have been exactly where you are.",
    location: "Location",
    students: "Students",
    applyNow: "How to Apply",
    viewInfo: "View Info",
    connect: "Connect & Ask",
    navHome: "Home",
    navUnis: "Universities",
    navMentors: "Mentors",
    navAbout: "About",
    toggleLang: "KH",
    langFull: "ភាសាខ្មែរ",
    majorMenu: "Major / Course",
    footerCopyright: "© 2026 UniConnect Cambodia. All rights reserved.",
    footerDisclaimer: "Empowering Grade 12 students across Cambodia."
  },
  kh: {
    title: "UniConnect កម្ពុជា",
    heroSlogan: "ផ្លូវឆ្ពោះទៅកាន់ការអប់រំកម្រិតឧត្តមសិក្សា",
    heroSub: "ស្វែងរកសាកលវិទ្យាល័យកំពូលៗ ភ្ជាប់ទំនាក់ទំនងជាមួយសិស្សច្បង និងទទួលបានការណែនាំសម្រាប់ការដាក់ពាក្យរបស់អ្នក។",
    searchPlaceholder: "ស្វែងរកសាកលវិទ្យាល័យ ជំនាញ ឬសិស្សច្បង...",
    searchButton: "ស្វែងរក",
    featuredUnis: "សាកលវិទ្យាល័យលេចធ្លោ",
    featuredUnisSub: "ស្វែងយល់ពីគ្រឹះស្ថានអប់រំឈានមុខគេនៅកម្ពុជា និងស្វែងរកជម្រើសដែលស័ក្តិសមបំផុតសម្រាប់អនាគតរបស់អ្នក។",
    viewAll: "មើលទាំងអស់",
    connectMentors: "សិស្សច្បងឆ្នើម",
    mentorSlogan: "ទទួលបានដំបូន្មានពិតប្រាកដពីសិស្សច្បង ដែលធ្លាប់ឆ្លងកាត់បទពិសោធន៍ផ្ទាល់។",
    location: "ទីតាំង",
    students: "និស្សិត",
    applyNow: "របៀបដាក់ពាក្យ",
    viewInfo: "ព័ត៌មានលម្អិត",
    connect: "សាកសួរព័ត៌មាន",
    navHome: "ទំព័រដើម",
    navUnis: "សាកលវិទ្យាល័យ",
    navMentors: "សិស្សច្បង",
    navAbout: "អំពីពួកយើង",
    toggleLang: "EN",
    langFull: "English",
    majorMenu: "ជំនាញខុសៗគ្នា",
    footerCopyright: "រក្សាសិទ្ធិ 2026 ដោយ UniConnect កម្ពុជា។",
    footerDisclaimer: "ផ្តល់ភាពអង់អាចដល់សិស្សថ្នាក់ទី១២ ទូទាំងប្រទេសកម្ពុជា។"
  }
};

export const universities = [
  {
    id: 1,
    name: { en: "Royal University of Phnom Penh", kh: "សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ" },
    abbr: "RUPP",
    location: { en: "Phnom Penh", kh: "រាជធានីភ្នំពេញ" },
    type: { en: "Public", kh: "រដ្ឋ" },
    students: "20,000+",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description: {
      en: "The oldest and one of the largest public universities in Cambodia, offering diverse programs from science to arts.",
      kh: "ជាសាកលវិទ្យាល័យរដ្ឋចំណាស់ជាងគេ និងធំជាងគេមួយនៅកម្ពុជា ដែលផ្តល់ជូនកម្មវិធីសិក្សាជាច្រើនចាប់ពីវិទ្យាសាស្ត្ររហូតដល់សិល្បៈ។"
    }
  },
  {
    id: 2,
    name: { en: "Institute of Technology of Cambodia", kh: "វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា" },
    abbr: "ITC",
    location: { en: "Phnom Penh", kh: "រាជធានីភ្នំពេញ" },
    type: { en: "Public", kh: "រដ្ឋ" },
    students: "10,000+",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
    description: {
      en: "The premier engineering and technology institute in Cambodia.",
      kh: "វិទ្យាស្ថានវិស្វកម្ម និងបច្ចេកវិទ្យាឈានមុខគេនៅកម្ពុជា។"
    }
  },
  {
    id: 3,
    name: { en: "National University of Management", kh: "សាកលវិទ្យាល័យជាតិគ្រប់គ្រង" },
    abbr: "NUM",
    location: { en: "Phnom Penh", kh: "រាជធានីភ្នំពេញ" },
    type: { en: "Public", kh: "រដ្ឋ" },
    students: "15,000+",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    description: {
      en: "Specializing in business administration, economics, and management studies.",
      kh: "ឯកទេសផ្នែករដ្ឋបាលធុរកិច្ច សេដ្ឋកិច្ច និងការសិក្សាគ្រប់គ្រង។"
    }
  },
  {
    id: 4,
    name: { en: "Paragon International University", kh: "សាកលវិទ្យាល័យអន្តរជាតិ ផារ៉ាហ្គន" },
    abbr: "ParagonU",
    location: { en: "Phnom Penh", kh: "រាជធានីភ្នំពេញ" },
    type: { en: "Private", kh: "ឯកជន" },
    students: "2,000+",
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800",
    description: {
      en: "A leading private international university focused on STEM and Business programs in English.",
      kh: "សាកលវិទ្យាល័យអន្តរជាតិឯកជនឈានមុខគេ ដែលផ្តោតលើកម្មវិធីសិក្សាផ្នែក STEM និងធុរកិច្ច ជាភាសាអង់គ្លេស។"
    }
  }
];

export const mentors = [
  {
    id: 1,
    name: { en: "Sokha Vorn", kh: "វន សុខា" },
    university: "RUPP",
    major: { en: "Computer Science", kh: "វិទ្យាសាស្ត្រកុំព្យូទ័រ" },
    year: { en: "Year 3", kh: "ឆ្នាំទី៣" },
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400",
    quote: { 
      en: "I can help you prepare for the RUPP entrance exam!", 
      kh: "ខ្ញុំអាចជួយអ្នកត្រៀមខ្លួនសម្រាប់ការប្រឡងចូលរៀននៅ RUPP បាន!" 
    }
  },
  {
    id: 2,
    name: { en: "Sreynich Chea", kh: "ជា ស្រីនិច" },
    university: "ITC",
    major: { en: "Civil Engineering", kh: "វិស្វកម្មសំណង់ស៊ីវិល" },
    year: { en: "Year 4", kh: "ឆ្នាំទី៤" },
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    quote: { 
      en: "Engineering is tough but rewarding. DM me to learn about ITC life.", 
      kh: "វិស្វកម្មគឺពិបាក ប៉ុន្តែវាមានតម្លៃដ៏ធំធេង។ សួរខ្ញុំបានអំពីជីវិតនៅ ITC។" 
    }
  },
  {
    id: 3,
    name: { en: "Piseth Meas", kh: "មាស ពិសិដ្ឋ" },
    university: "NUM",
    major: { en: "International Business", kh: "ធុរកិច្ចអន្តរជាតិ" },
    year: { en: "Year 2", kh: "ឆ្នាំទី២" },
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    quote: { 
      en: "Passionate about business and entrepreneurship. Let's chat!", 
      kh: "ខ្ញុំចូលចិត្តផ្នែកធុរកិច្ច និងសហគ្រិនភាព។ តោះពិភាក្សាគ្នា!" 
    }
  }
];
