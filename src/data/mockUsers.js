// src/data/mockUsers.js
// This is an alternative to UserSuggestion.js with the same data structure
// You can use either file depending on your preference

const mockUsers = [
  {
    id: "1",
    initials: "SJ",
    name: "Sarah Johnson",
    username: "sarahj",
    role: "Content Creator",
    location: "Paris, France",
    joined: "2025",
    bio: "✨ Travel blogger | Photography enthusiast | Coffee lover | Always exploring new cultures",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    posts: [
      {
        id: "1-1",
        text: "Just finished an amazing trip to the Swiss Alps! The views were absolutely breathtaking. Can't wait to share all my photos.",
        timestamp: "2025-02-08T10:30:00Z",
      },
      {
        id: "1-2",
        text: "New blog post is live! 5 hidden gems in Paris that tourists rarely discover. Link in bio! 📍",
        timestamp: "2025-02-05T14:22:00Z",
      },
      {
        id: "1-3",
        text: "Coffee shop recommendation: Le Petit Noir in Montmartre. Best espresso in the city, hands down! ☕",
        timestamp: "2025-02-01T09:15:00Z",
      },
    ],
  },
  {
    id: "2",
    initials: "MC",
    name: "Michael Chen",
    username: "mchen",
    role: "Data Analyst",
    location: "Toronto, Canada",
    joined: "2024",
    bio: "📊 Data-driven insights | Python & R developer | ML enthusiast | Tech speaker",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    posts: [
      {
        id: "2-1",
        text: "Just published my latest research on predictive analytics. The results are fascinating! Here's a 5-min summary...",
        timestamp: "2025-02-09T16:45:00Z",
      },
      {
        id: "2-2",
        text: "Python tip: Always profile your code before optimizing. You'd be surprised where the bottlenecks really are!",
        timestamp: "2025-02-06T11:20:00Z",
      },
      {
        id: "2-3",
        text: "Speaking at the Toronto Data Science Meetup next month. Topic: Machine Learning in Production. Who's interested? 🎤",
        timestamp: "2025-02-02T08:30:00Z",
      },
    ],
  },
  {
    id: "3",
    initials: "EG",
    name: "Emma Garcia",
    username: "emmag",
    role: "UI/UX Designer",
    location: "Madrid, Spain",
    joined: "2026",
    bio: "🎨 Designing digital experiences | Figma expert | Design systems advocate | Always learning",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    posts: [
      {
        id: "3-1",
        text: "Completed a redesign of an e-commerce platform. The new checkout flow reduced cart abandonment by 23%! 🚀",
        timestamp: "2025-02-07T13:10:00Z",
      },
      {
        id: "3-2",
        text: "Design trend alert: Glassmorphism is fading, but micro-interactions are HERE TO STAY. What are you seeing in your projects?",
        timestamp: "2025-02-04T15:50:00Z",
      },
      {
        id: "3-3",
        text: "Just launched my design system guide! Free for the community. Check it out and let me know your thoughts 💙",
        timestamp: "2025-01-31T10:00:00Z",
      },
    ],
  },
  {
    id: "4",
    initials: "JD",
    name: "James Davidson",
    username: "jamesdav",
    role: "Full Stack Developer",
    location: "London, UK",
    joined: "2024",
    bio: "💻 React & Node.js specialist | Open source contributor | Tech blogger | Guitar player 🎸",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    posts: [
      {
        id: "4-1",
        text: "Just open-sourced my new state management library. It's 3x faster than Redux for large applications. GitHub link in bio!",
        timestamp: "2025-02-09T12:15:00Z",
      },
      {
        id: "4-2",
        text: "Hot take: Not everything needs a framework. Sometimes vanilla JS is the best solution. Here's why...",
        timestamp: "2025-02-03T09:45:00Z",
      },
      {
        id: "4-3",
        text: "Code review tip: Always ask 'why' before asking 'why not'. Understanding intent improves code quality!",
        timestamp: "2025-01-28T14:30:00Z",
      },
    ],
  },
  {
    id: "5",
    initials: "LM",
    name: "Lisa Martinez",
    username: "lisamart",
    role: "Product Manager",
    location: "San Francisco, USA",
    joined: "2025",
    bio: "🚀 Building products users love | Data-driven decisions | Startup survivor | Coffee & ideas",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    posts: [
      {
        id: "5-1",
        text: "Product launch tomorrow! 🎉 We've been working on this for 6 months. So grateful to my amazing team. Here's what's coming...",
        timestamp: "2025-02-10T07:30:00Z",
      },
      {
        id: "5-2",
        text: "Best product management advice I ever got: Your users are smarter than you think. Listen to them. Really listen.",
        timestamp: "2025-02-05T16:20:00Z",
      },
      {
        id: "5-3",
        text: "Hiring a Senior PM in SF! If you love building products and mentoring juniors, DM me your resume 📩",
        timestamp: "2025-02-01T11:00:00Z",
      },
    ],
  },
];

export default mockUsers;
