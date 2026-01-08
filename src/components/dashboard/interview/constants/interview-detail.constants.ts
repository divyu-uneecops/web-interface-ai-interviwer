import { InterviewDetailData } from "../interfaces/interview-detail.interface";

// Mock interview detail data
export const mockInterviewDetailData: Record<string, InterviewDetailData> = {
  "1": {
    overallScore: 87,
    grade: "A",
    recommendation: "Strong candidate - Recommended for next round",
    percentile: "Top 15% of candidates",
    criteriaScores: [
      {
        name: "Technical skills",
        score: 85,
        description: "Strong React knowledge, excellent problem-solving",
        industryAverage: 80,
      },
      {
        name: "Communication",
        score: 85,
        description: "Clear articulation, good structure in responses",
        industryAverage: 80,
      },
      {
        name: "Problem solving",
        score: 85,
        description: "Methodical approach, considers edge cases",
        industryAverage: 80,
      },
      {
        name: "Culture fit",
        score: 85,
        description: "Aligns with company values, collaborative mindset",
        industryAverage: 80,
      },
    ],
    feedback: {
      strengths: [
        "Excellent understanding of React hooks and performance optimization",
        "Strong architectural thinking for scalable applications",
        "Good knowledge of testing best practices",
        "Clear communication and well-structured answers",
      ],
      areasForGrowth: [
        "Could deepen knowledge of advanced state management patterns",
        "Limited experience with micro-frontend architecture",
        "Consider exploring more design pattern applications",
      ],
    },
    transcript: [
      {
        question:
          "Can you describe your experience with React and how you've used hooks in production applications?",
        response:
          "I've been working with React for about 4 years now, and hooks have been a game-changer. In my current role, I've used hooks extensively...",
        duration: "00:02:35",
        status: "completed",
      },
      {
        question:
          "Can you describe your experience with React and how you've used hooks in production applications?",
        response:
          "I've been working with React for about 4 years now, and hooks have been a game-changer. In my current role, I've used hooks extensively... I've been working with React for about 4 years now, and hooks have been a game-changer. In my current role, I've used hooks extensively...",
        duration: "00:02:35",
        status: "completed",
      },
      {
        question:
          "Can you describe your experience with React and how you've used hooks in production applications?",
        response:
          "I've been working with React for about 4 years now, and hooks have been a game-changer. In my current role, I've used hooks extensively... I've been working with React for about 4 years now, and hooks have been a game-changer. In my current role, I've used hooks extensively...",
        duration: "00:02:35",
        status: "skipped",
      },
    ],
  },
  // Add more mock data for other interviews
  "2": {
    overallScore: 92,
    grade: "A+",
    recommendation: "Exceptional candidate - Highly recommended",
    percentile: "Top 10% of candidates",
    criteriaScores: [
      {
        name: "Technical skills",
        score: 95,
        description: "Expert-level knowledge, innovative solutions",
        industryAverage: 80,
      },
      {
        name: "Communication",
        score: 90,
        description: "Excellent presentation and clarity",
        industryAverage: 80,
      },
      {
        name: "Problem solving",
        score: 90,
        description: "Creative solutions, thorough analysis",
        industryAverage: 80,
      },
      {
        name: "Culture fit",
        score: 93,
        description: "Perfect alignment with team values",
        industryAverage: 80,
      },
    ],
    feedback: {
      strengths: [
        "Outstanding technical expertise",
        "Excellent problem-solving approach",
        "Strong leadership qualities",
      ],
      areasForGrowth: [
        "Could benefit from more experience in distributed systems",
      ],
    },
    transcript: [
      {
        question: "Tell me about a challenging project you've worked on.",
        response: "I led a team to rebuild our core application...",
        duration: "00:03:15",
        status: "completed",
      },
    ],
  },
};
