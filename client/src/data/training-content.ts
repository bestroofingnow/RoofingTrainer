// Interactive training content for all modules
export const interactiveContent: Record<string, any> = {
  // Day 1: Welcome & Roofing Basics
  "welcome": {
    sections: [
      {
        id: "mission",
        title: "Best Roofing Now Mission",
        type: "content" as const,
        content: "Welcome to Best Roofing Now! Our mission is to provide homeowners with reliable, high-quality roofing solutions while helping families navigate insurance claims after storm damage. As an appointment setter, you're the first point of contact and a crucial part of our success."
      },
      {
        id: "company-values",
        title: "Company Values Activity",
        type: "activity" as const,
        content: "Learn our core values through interactive flashcards",
        activity: {
          type: "flashcards",
          data: {
            cards: [
              { question: "What is our #1 priority?", answer: "Customer satisfaction and helping families recover from storm damage" },
              { question: "How do we handle insurance claims?", answer: "We guide homeowners through the entire process, advocating for maximum coverage" },
              { question: "What makes us different?", answer: "Local expertise, storm damage specialists, and comprehensive support" }
            ]
          }
        }
      },
      {
        id: "knowledge-check",
        title: "Mission Knowledge Check",
        type: "knowledge_check" as const,
        content: "Test your understanding of our mission",
        knowledgeCheck: {
          question: "What is Best Roofing Now's primary service focus?",
          options: [
            "General roofing repairs",
            "Storm damage restoration and insurance claims",
            "New construction roofing",
            "Commercial roofing only"
          ],
          correct: 1,
          explanation: "We specialize in storm damage restoration and helping homeowners navigate insurance claims to get the coverage they deserve."
        }
      }
    ]
  },
  
  "basics": {
    sections: [
      {
        id: "roof-components",
        title: "Roof Components",
        type: "activity" as const,
        content: "Learn the essential parts of a roofing system",
        activity: {
          type: "flashcards",
          data: {
            cards: [
              { question: "What are shingles?", answer: "The outer layer that protects against weather - asphalt, wood, metal, or tile" },
              { question: "What is underlayment?", answer: "Waterproof barrier installed under shingles to prevent leaks" },
              { question: "What are gutters for?", answer: "Channel water away from the roof and foundation" },
              { question: "What is flashing?", answer: "Metal strips that seal joints and prevent water penetration" },
              { question: "What is the decking?", answer: "Structural foundation (plywood/OSB) that shingles are attached to" }
            ]
          }
        }
      },
      {
        id: "damage-types",
        title: "Common Storm Damage",
        type: "activity" as const,
        content: "Identify different types of storm damage",
        activity: {
          type: "scenario",
          data: {
            scenario: {
              title: "Damage Assessment",
              context: "You're speaking with a homeowner after a storm. Help identify potential damage types.",
              steps: [
                {
                  situation: "Homeowner says: 'I found some small round dents on my gutters'",
                  choices: [
                    "That's definitely hail damage - insurance should cover this",
                    "Small dents aren't usually covered by insurance",
                    "You'd need a professional inspection to determine coverage"
                  ]
                },
                {
                  situation: "Homeowner mentions: 'Several shingles are missing from my roof'",
                  choices: [
                    "That's clear wind damage - schedule an inspection immediately",
                    "A few missing shingles isn't a big concern",
                    "That could be from normal wear and tear"
                  ]
                }
              ]
            }
          }
        }
      }
    ]
  },

  "attic": {
    sections: [
      {
        id: "attic-inspection",
        title: "Virtual Attic Inspection",
        type: "activity" as const,
        content: "Learn what to look for during attic inspections",
        activity: {
          type: "scenario",
          data: {
            scenario: {
              title: "Attic Damage Detection",
              context: "You're guiding a homeowner through what to look for in their attic after a storm.",
              steps: [
                {
                  situation: "In the attic, what are the main signs of roof damage to look for?",
                  choices: [
                    "Water stains, wet insulation, daylight coming through",
                    "Just check for animals or pests",
                    "Only look at the electrical wiring"
                  ]
                },
                {
                  situation: "The homeowner sees dark stains on the wood. What do you tell them?",
                  choices: [
                    "Those are water stains indicating potential leaks - needs professional inspection",
                    "Dark stains are normal and nothing to worry about",
                    "Clean them up with bleach and they'll be fine"
                  ]
                }
              ]
            }
          }
        }
      }
    ]
  },

  // Day 2: Insurance & Regulations
  "insurance": {
    sections: [
      {
        id: "insurance-basics",
        title: "Insurance Fundamentals",
        type: "content" as const,
        content: "Understanding homeowner's insurance is crucial for helping families maximize their coverage. Insurance policies vary, but most cover sudden and accidental damage from storms, including wind, hail, and falling objects."
      },
      {
        id: "coverage-types",
        title: "Coverage Types",
        type: "activity" as const,
        content: "Learn different types of insurance coverage",
        activity: {
          type: "flashcards",
          data: {
            cards: [
              { question: "What is ACV?", answer: "Actual Cash Value - replacement cost minus depreciation" },
              { question: "What is RCV?", answer: "Replacement Cost Value - full cost to replace without depreciation" },
              { question: "What is a deductible?", answer: "Amount homeowner pays out-of-pocket before insurance kicks in" },
              { question: "What does dwelling coverage include?", answer: "Structure of the home including roof, walls, and attached structures" }
            ]
          }
        }
      }
    ]
  },

  "regulations": {
    sections: [
      {
        id: "nc-regulations",
        title: "North Carolina Claim Regulations",
        type: "content" as const,
        content: "North Carolina has specific regulations protecting homeowners during the claims process. Homeowners have rights including the ability to choose their own contractor and receive fair compensation for covered damages."
      },
      {
        id: "homeowner-rights",
        title: "Homeowner Rights Quiz",
        type: "knowledge_check" as const,
        content: "Test knowledge of homeowner rights",
        knowledgeCheck: {
          question: "In North Carolina, who has the right to choose the contractor for insurance repairs?",
          options: [
            "The insurance company chooses",
            "The homeowner has the right to choose",
            "The adjuster decides",
            "It must be the cheapest bid"
          ],
          correct: 1,
          explanation: "North Carolina law gives homeowners the right to choose their own contractor for insurance repairs. Insurance companies cannot require use of preferred contractors."
        }
      }
    ]
  },

  "vocabulary": {
    sections: [
      {
        id: "damage-terms",
        title: "Roof Damage Vocabulary",
        type: "activity" as const,
        content: "Master the vocabulary used in roofing and insurance",
        activity: {
          type: "flashcards",
          data: {
            cards: [
              { question: "Granule loss", answer: "When hail or wind removes protective granules from shingles" },
              { question: "Exposed mat", answer: "When shingle backing shows through after granule loss" },
              { question: "Creasing", answer: "Fold or bend in shingle from impact damage" },
              { question: "Tear", answer: "Rip in shingle material from wind or impact" },
              { question: "Thermal shock", answer: "Damage from rapid temperature changes" }
            ]
          }
        }
      }
    ]
  },

  // Day 3: Scripts & Psychology
  "compliance": {
    sections: [
      {
        id: "tcpa-rules",
        title: "TCPA Compliance Rules",
        type: "content" as const,
        content: "The Telephone Consumer Protection Act (TCPA) regulates telemarketing calls. We must respect Do Not Call lists, call only during permitted hours (9 AM - 9 PM local time), and maintain consent records."
      },
      {
        id: "compliance-scenarios",
        title: "Compliance Scenarios",
        type: "activity" as const,
        content: "Practice handling compliance situations",
        activity: {
          type: "scenario",
          data: {
            scenario: {
              title: "TCPA Compliance",
              context: "Navigate common compliance situations during cold calls.",
              steps: [
                {
                  situation: "It's 9:15 PM and you have more numbers to call. What do you do?",
                  choices: [
                    "Stop calling - TCPA prohibits calls after 9 PM local time",
                    "Make one more quick call",
                    "Keep calling until 10 PM"
                  ]
                },
                {
                  situation: "Someone asks to be put on your 'do not call list'. How do you respond?",
                  choices: [
                    "Immediately honor the request and document it in CRM",
                    "Try to convince them to hear you out first",
                    "Explain they'll miss out on a great opportunity"
                  ]
                }
              ]
            }
          }
        }
      }
    ]
  },

  "psychology": {
    sections: [
      {
        id: "call-psychology",
        title: "Psychology of Cold Calling",
        type: "content" as const,
        content: "Successful cold calling is about building trust quickly. People buy from those they know, like, and trust. Your goal is to be helpful, not pushy. Listen more than you talk, and focus on their needs, not your product."
      },
      {
        id: "trust-building",
        title: "Trust Building Techniques",
        type: "activity" as const,
        content: "Learn techniques to build trust quickly",
        activity: {
          type: "roleplay",
          data: {
            roleplay: {
              title: "Building Rapport",
              phases: [
                {
                  title: "Opening",
                  description: "Practice your opening line that includes your name, company, and a benefit to the homeowner"
                },
                {
                  title: "Finding Common Ground",
                  description: "Ask about their experience with the recent storm and show empathy"
                },
                {
                  title: "Establishing Credibility",
                  description: "Mention local knowledge, licenses, and recent work in their neighborhood"
                }
              ]
            }
          }
        }
      }
    ]
  },

  "hackathon": {
    sections: [
      {
        id: "script-framework",
        title: "6R Framework",
        type: "content" as const,
        content: "Our proven 6R framework: Research (know the area), Relate (build rapport), Reason (why you're calling), Request (ask for inspection), Respond (handle objections), Record (document everything)."
      },
      {
        id: "script-practice",
        title: "Script Writing Workshop",
        type: "activity" as const,
        content: "Practice crafting scripts using the 6R framework",
        activity: {
          type: "scenario",
          data: {
            scenario: {
              title: "Script Development",
              context: "Create opening scripts for different situations using the 6R framework.",
              steps: [
                {
                  situation: "Write an opening for a post-storm call in a neighborhood you've helped before",
                  choices: [
                    "Hi, this is [Name] with Best Roofing Now. We've been helping your neighbors on Maple Street after the recent storm. I'm calling to see if your roof sustained any damage that needs inspection.",
                    "Hi, we're doing roofs in your area. Interested?",
                    "Hi, there's been storm damage reported in your neighborhood. We need to inspect your roof immediately."
                  ]
                }
              ]
            }
          }
        }
      }
    ]
  },

  // Day 4: Objection Handling
  "objections": {
    sections: [
      {
        id: "common-objections",
        title: "Common Objections",
        type: "content" as const,
        content: "The most common objections are: 'I'm not interested', 'I already have a roofer', 'I don't see any damage', 'I need to think about it', and 'How much will it cost?'. Each requires a specific response strategy."
      },
      {
        id: "objection-practice",
        title: "Objection Handling Dojo",
        type: "activity" as const,
        content: "Practice responding to common objections",
        activity: {
          type: "scenario",
          data: {
            scenario: {
              title: "Objection Handling",
              context: "Practice your responses to common objections using proven techniques.",
              steps: [
                {
                  situation: "Homeowner says: 'I'm not interested in any roofing services right now.'",
                  choices: [
                    "I understand, but storm damage isn't always visible from the ground. A free inspection could save you thousands if there's hidden damage your insurance would cover.",
                    "That's fine, thanks for your time.",
                    "You should be interested - your neighbors all needed new roofs."
                  ]
                },
                {
                  situation: "Homeowner says: 'I already have a roofer I work with.'",
                  choices: [
                    "That's great! Having a trusted roofer is important. I'm just calling because we've found storm damage in your area that homeowners didn't know about. A quick second opinion could help you maximize your insurance coverage.",
                    "Our company is better than whoever you're using.",
                    "Okay, I'll call back later."
                  ]
                }
              ]
            }
          }
        }
      }
    ]
  },

  "crm": {
    sections: [
      {
        id: "crm-basics",
        title: "CRM System Training",
        type: "content" as const,
        content: "Our CRM system tracks all homeowner interactions, appointment details, and follow-up requirements. Accurate data entry is crucial for team coordination and compliance."
      },
      {
        id: "data-entry",
        title: "CRM Data Entry Practice",
        type: "activity" as const,
        content: "Practice proper CRM documentation",
        activity: {
          type: "scenario",
          data: {
            scenario: {
              title: "CRM Documentation",
              context: "Learn what information to capture in each call record.",
              steps: [
                {
                  situation: "After a successful call that resulted in an appointment, what information should you record?",
                  choices: [
                    "Contact info, appointment time, damage concerns mentioned, best callback time, and any special instructions",
                    "Just the appointment time",
                    "Name and phone number only"
                  ]
                }
              ]
            }
          }
        }
      }
    ]
  },

  // Day 5: Ethics & Certification
  "ethics": {
    sections: [
      {
        id: "ethical-practices",
        title: "Ethical Business Practices",
        type: "content" as const,
        content: "We operate with complete honesty and integrity. Never promise coverage that insurance companies haven't approved. Always be truthful about damage assessments and never pressure homeowners into unnecessary services."
      },
      {
        id: "ethics-scenarios",
        title: "Ethics Decision Making",
        type: "activity" as const,
        content: "Practice making ethical decisions",
        activity: {
          type: "scenario",
          data: {
            scenario: {
              title: "Ethical Decisions",
              context: "Navigate ethical dilemmas in roofing sales.",
              steps: [
                {
                  situation: "A homeowner asks if you can guarantee their insurance will cover a full roof replacement. What do you say?",
                  choices: [
                    "I can't guarantee coverage - that's up to your insurance company and adjuster. But I can provide a thorough inspection and help document any damage we find.",
                    "Yes, I guarantee your insurance will cover everything.",
                    "Insurance companies always cover storm damage, so don't worry."
                  ]
                }
              ]
            }
          }
        }
      }
    ]
  },

  "kpis": {
    sections: [
      {
        id: "kpi-math",
        title: "KPI Mathematics",
        type: "content" as const,
        content: "Understanding your numbers is crucial for success. Key metrics include: Contact Rate (contacts ÷ dials), Appointment Rate (appointments ÷ contacts), and Show Rate (showed appointments ÷ scheduled appointments)."
      },
      {
        id: "compensation",
        title: "Compensation Structure",
        type: "activity" as const,
        content: "Learn how your performance translates to earnings",
        activity: {
          type: "scenario",
          data: {
            scenario: {
              title: "Performance Calculation",
              context: "Calculate your performance metrics and compensation.",
              steps: [
                {
                  situation: "You made 100 dials, reached 25 people, and set 5 appointments. What's your contact rate?",
                  choices: [
                    "25% (25 contacts ÷ 100 dials)",
                    "20% (20 contacts ÷ 100 dials)",
                    "5% (5 appointments ÷ 100 dials)"
                  ]
                }
              ]
            }
          }
        }
      }
    ]
  },

  "graduation": {
    sections: [
      {
        id: "congratulations",
        title: "Congratulations!",
        type: "content" as const,
        content: "Congratulations on completing the Best Roofing Now training program! You're now equipped with the knowledge, scripts, and techniques needed to succeed as a professional appointment setter. Remember: be helpful, be honest, and focus on serving homeowners' needs."
      },
      {
        id: "next-steps",
        title: "Your Next Steps",
        type: "activity" as const,
        content: "Prepare for your first day on the calls",
        activity: {
          type: "flashcards",
          data: {
            cards: [
              { question: "What's your first step each morning?", answer: "Review storm data and neighborhood assignments in CRM" },
              { question: "How do you prepare for calls?", answer: "Research the area, check recent storm activity, and review scripts" },
              { question: "What's your daily goal?", answer: "Quality conversations leading to scheduled inspections" }
            ]
          }
        }
      }
    ]
  }
};