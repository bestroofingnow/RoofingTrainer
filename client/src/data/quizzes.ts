// Quiz data for all training modules
interface Quiz {
  id: number;
  title: string;
  moduleId: number;
  timeLimit: number;
  passingScore: number;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

export const quizzes: Quiz[] = [
  {
    id: 1,
    title: "Day 1 Knowledge Check",
    moduleId: 1,
    timeLimit: 10,
    passingScore: 80,
    questions: [
      {
        id: 1,
        question: "What is Best Roofing Now's primary service focus?",
        options: [
          "General home repairs",
          "Storm damage restoration and insurance claims",
          "New construction only",
          "Commercial roofing only"
        ],
        correctAnswer: 1,
        explanation: "Best Roofing Now specializes in storm damage restoration and helping homeowners navigate insurance claims."
      },
      {
        id: 2,
        question: "What are the protective granules on shingles called when they're removed by hail?",
        options: [
          "Thermal damage",
          "Granule loss",
          "Weather stripping",
          "Surface coating"
        ],
        correctAnswer: 1,
        explanation: "Granule loss occurs when hail or wind removes the protective granules from shingles."
      },
      {
        id: 3,
        question: "What should you look for in an attic inspection after a storm?",
        options: [
          "Only electrical damage",
          "Paint color changes",
          "Water stains, wet insulation, and daylight coming through",
          "Temperature changes only"
        ],
        correctAnswer: 2,
        explanation: "Water stains, wet insulation, and daylight penetration are key indicators of roof damage."
      },
      {
        id: 4,
        question: "What is the purpose of roof underlayment?",
        options: [
          "Decorative appearance",
          "Waterproof barrier under shingles",
          "Structural support",
          "Insulation only"
        ],
        correctAnswer: 1,
        explanation: "Underlayment serves as a waterproof barrier installed under shingles to prevent leaks."
      },
      {
        id: 5,
        question: "When you see round dents on gutters after a storm, this likely indicates:",
        options: [
          "Normal wear and tear",
          "Hail damage",
          "Installation defects",
          "Sun damage"
        ],
        correctAnswer: 1,
        explanation: "Round dents on gutters are a clear sign of hail damage that insurance typically covers."
      }
    ]
  },
  {
    id: 2,
    title: "ACV vs RCV Role Play",
    moduleId: 2,
    timeLimit: 10,
    passingScore: 80,
    questions: [
      {
        id: 1,
        question: "What does ACV stand for in insurance terms?",
        options: [
          "Average Cost Value",
          "Actual Cash Value",
          "Annual Coverage Value",
          "Adjusted Claim Value"
        ],
        correctAnswer: 1,
        explanation: "ACV stands for Actual Cash Value, which is replacement cost minus depreciation."
      },
      {
        id: 2,
        question: "What is the main difference between ACV and RCV?",
        options: [
          "ACV includes depreciation, RCV doesn't",
          "RCV includes depreciation, ACV doesn't",
          "They are the same thing",
          "ACV is always higher than RCV"
        ],
        correctAnswer: 0,
        explanation: "ACV includes depreciation (Actual Cash Value = Replacement Cost - Depreciation), while RCV is the full replacement cost."
      },
      {
        id: 3,
        question: "In North Carolina, who has the right to choose the contractor for insurance repairs?",
        options: [
          "The insurance adjuster",
          "The homeowner",
          "The insurance company",
          "The cheapest bidder automatically"
        ],
        correctAnswer: 1,
        explanation: "North Carolina law gives homeowners the right to choose their own contractor for insurance repairs."
      },
      {
        id: 4,
        question: "What type of coverage includes the structure of the home and attached structures?",
        options: [
          "Personal property coverage",
          "Liability coverage",
          "Dwelling coverage",
          "Medical payments coverage"
        ],
        correctAnswer: 2,
        explanation: "Dwelling coverage includes the structure of the home including roof, walls, and attached structures."
      },
      {
        id: 5,
        question: "When explaining insurance to a homeowner, you should:",
        options: [
          "Guarantee full coverage approval",
          "Promise specific dollar amounts",
          "Explain that coverage depends on the adjuster's assessment",
          "Tell them insurance never covers storm damage"
        ],
        correctAnswer: 2,
        explanation: "Always be honest that coverage depends on the insurance adjuster's assessment - never guarantee specific outcomes."
      }
    ]
  },
  {
    id: 3,
    title: "Script Assessment",
    moduleId: 3,
    timeLimit: 15,
    passingScore: 80,
    questions: [
      {
        id: 1,
        question: "According to TCPA rules, what are the permitted calling hours?",
        options: [
          "8 AM to 8 PM local time",
          "9 AM to 9 PM local time",
          "10 AM to 10 PM local time",
          "Any time during business days"
        ],
        correctAnswer: 1,
        explanation: "TCPA prohibits calls before 9 AM or after 9 PM local time."
      },
      {
        id: 2,
        question: "When someone asks to be put on your 'do not call list', you should:",
        options: [
          "Try to convince them first",
          "Immediately honor the request and document it",
          "Call back in 30 days",
          "Transfer them to a manager"
        ],
        correctAnswer: 1,
        explanation: "You must immediately honor Do Not Call requests and document them in your CRM system."
      },
      {
        id: 3,
        question: "What does the 'R' in the 6R framework stand for?",
        options: [
          "Research, Relate, Reason, Request, Respond, Record",
          "Review, React, Reply, Resolve, Report, Repeat",
          "Reach, Remind, Recommend, Resolve, Return, Review",
          "Ready, Ring, Rapport, Results, Recap, Retry"
        ],
        correctAnswer: 0,
        explanation: "The 6R framework: Research (know the area), Relate (build rapport), Reason (why calling), Request (inspection), Respond (objections), Record (document)."
      },
      {
        id: 4,
        question: "The psychology of cold calling emphasizes:",
        options: [
          "Talking more than listening",
          "Building trust quickly by listening and focusing on their needs",
          "Using high-pressure tactics",
          "Avoiding personal connections"
        ],
        correctAnswer: 1,
        explanation: "Successful cold calling is about building trust quickly by listening more than talking and focusing on the homeowner's needs."
      },
      {
        id: 5,
        question: "Which opening line follows best practices?",
        options: [
          "Hi, we're doing roofs in your area. Interested?",
          "Hi, this is [Name] with Best Roofing Now. We've been helping your neighbors after the recent storm.",
          "Hi, you need a roof inspection immediately.",
          "Is this the homeowner? I'm calling about damage."
        ],
        correctAnswer: 1,
        explanation: "A good opening includes your name, company, and a benefit or local connection to build immediate relevance."
      }
    ]
  },
  {
    id: 4,
    title: "Objection Handling Assessment",
    moduleId: 4,
    timeLimit: 20,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "When a homeowner says 'I'm not interested', the best response is:",
        options: [
          "Okay, thanks for your time.",
          "You should be interested - your neighbors all needed new roofs.",
          "I understand, but storm damage isn't always visible from the ground. A free inspection could save you thousands.",
          "Can I call you back next week?"
        ],
        correctAnswer: 2,
        explanation: "Acknowledge their position while providing value - hidden damage can lead to expensive problems if not caught early."
      },
      {
        id: 2,
        question: "If a homeowner says 'I already have a roofer', you should:",
        options: [
          "Tell them your company is better",
          "Acknowledge that's great and offer a second opinion to maximize insurance coverage",
          "Hang up immediately",
          "Argue about why they should switch"
        ],
        correctAnswer: 1,
        explanation: "Respect their existing relationship while positioning yourself as a helpful second opinion for insurance claims."
      },
      {
        id: 3,
        question: "What information must be recorded in CRM after scheduling an appointment?",
        options: [
          "Just the appointment time",
          "Name and phone number only",
          "Contact info, appointment time, damage concerns, best callback time, and special instructions",
          "Only their address"
        ],
        correctAnswer: 2,
        explanation: "Comprehensive CRM documentation ensures smooth handoff to inspectors and better customer service."
      },
      {
        id: 4,
        question: "When handling the objection 'How much will this cost?', you should:",
        options: [
          "Quote a specific price immediately",
          "Explain that insurance typically covers storm damage, and you'll help them through the process",
          "Avoid the question",
          "Say it's always free"
        ],
        correctAnswer: 1,
        explanation: "Focus on insurance coverage for storm damage rather than quoting prices, as legitimate storm damage is typically covered."
      },
      {
        id: 5,
        question: "The key to successful objection handling is:",
        options: [
          "Having a rehearsed response for every objection",
          "Arguing until they agree",
          "Listening to understand their concern and providing relevant value",
          "Changing the subject quickly"
        ],
        correctAnswer: 2,
        explanation: "Effective objection handling requires truly listening to understand the concern, then addressing it with relevant value."
      }
    ]
  },
  {
    id: 5,
    title: "Certification Exam",
    moduleId: 5,
    timeLimit: 45,
    passingScore: 80,
    questions: [
      {
        id: 1,
        question: "What should you NEVER do regarding insurance coverage?",
        options: [
          "Explain the claims process",
          "Guarantee specific coverage amounts or approval",
          "Offer to help document damage",
          "Provide inspection services"
        ],
        correctAnswer: 1,
        explanation: "Never guarantee insurance coverage or specific amounts - only the adjuster can determine coverage."
      },
      {
        id: 2,
        question: "Your Contact Rate is calculated as:",
        options: [
          "Appointments ÷ Contacts",
          "Contacts ÷ Dials",
          "Dials ÷ Contacts",
          "Shows ÷ Appointments"
        ],
        correctAnswer: 1,
        explanation: "Contact Rate = Contacts Made ÷ Total Dials, showing how effective you are at reaching people."
      },
      {
        id: 3,
        question: "The most important metric for appointment setters is:",
        options: [
          "Total dials made",
          "Length of calls",
          "Quality appointments that show up",
          "Number of callbacks"
        ],
        correctAnswer: 2,
        explanation: "Quality appointments that actually show up drive revenue - focus on quality over quantity."
      },
      {
        id: 4,
        question: "When you identify potential storm damage during a call, you should:",
        options: [
          "Schedule an inspection to properly assess and document it",
          "Immediately quote a price",
          "Tell them it's definitely covered by insurance",
          "Suggest they ignore it"
        ],
        correctAnswer: 0,
        explanation: "Professional inspection is needed to properly assess and document damage for insurance claims."
      },
      {
        id: 5,
        question: "The foundation of ethical roofing sales is:",
        options: [
          "Making the most sales possible",
          "Honesty, integrity, and helping homeowners with legitimate needs",
          "Avoiding insurance companies",
          "Finding damage even if none exists"
        ],
        correctAnswer: 1,
        explanation: "Ethical sales means operating with complete honesty and only helping homeowners with legitimate storm damage."
      },
      {
        id: 6,
        question: "Before making calls each day, you should:",
        options: [
          "Just start dialing",
          "Review storm data and neighborhood assignments in CRM",
          "Skip preparation to save time",
          "Only check your schedule"
        ],
        correctAnswer: 1,
        explanation: "Preparation is key - review storm data and assignments to have relevant, informed conversations."
      },
      {
        id: 7,
        question: "When documenting a 'Not Interested' response, you should:",
        options: [
          "Delete the contact",
          "Mark as DNC",
          "Document the response and schedule appropriate follow-up per company guidelines",
          "Never call them again"
        ],
        correctAnswer: 2,
        explanation: "'Not interested' doesn't mean 'do not call' - document properly and follow up according to company guidelines."
      },
      {
        id: 8,
        question: "The purpose of offering a free inspection is to:",
        options: [
          "Get inside every house",
          "Find damage where none exists",
          "Help homeowners identify legitimate storm damage they may not see",
          "Pressure them into buying"
        ],
        correctAnswer: 2,
        explanation: "Free inspections help homeowners identify legitimate storm damage that isn't visible from the ground."
      },
      {
        id: 9,
        question: "Your role as an appointment setter is to:",
        options: [
          "Close roofing sales",
          "Perform roof inspections",
          "Connect homeowners with inspection services for potential storm damage",
          "Handle insurance claims"
        ],
        correctAnswer: 2,
        explanation: "Appointment setters connect homeowners with professional inspectors who can assess storm damage."
      },
      {
        id: 10,
        question: "The most important factor in cold calling success is:",
        options: [
          "Making the most calls possible",
          "Using high-pressure tactics",
          "Building trust and providing genuine value to homeowners",
          "Reading scripts word-for-word"
        ],
        correctAnswer: 2,
        explanation: "Success comes from building trust quickly and focusing on providing genuine value to homeowners' real needs."
      }
    ]
  }
];