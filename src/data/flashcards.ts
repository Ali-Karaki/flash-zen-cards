
export interface FollowUp {
  question: string;
  answer: string;
  id: string;
}

export interface Flashcard {
  question: string;
  answer: string;
  followUps: FollowUp[];
  id: string;
}

export const kFlashcards: Flashcard[] = [
  {
    question: "What is React?",
    answer: "React is a JavaScript library for building user interfaces, particularly single-page applications.",
    followUps: [
      {
        question: "Who maintains React?",
        answer: "Facebook (Meta) maintains React.",
        id: "f1-1",
      },
      {
        question: "What year was React released?",
        answer: "React was first released in 2013.",
        id: "f1-2",
      },
    ],
    id: "card1",
  },
  {
    question: "What is a React component?",
    answer: "A component is a reusable piece of code that returns React elements describing what should appear on the screen.",
    followUps: [
      {
        question: "What are the two types of components in React?",
        answer: "Function components and Class components.",
        id: "f2-1",
      }
    ],
    id: "card2",
  },
  {
    question: "What is JSX?",
    answer: "JSX is a syntax extension for JavaScript that looks similar to HTML and allows you to write HTML in React.",
    followUps: [
      {
        question: "Is JSX required to use React?",
        answer: "No, JSX is not required but it makes React code more readable and expressive.",
        id: "f3-1",
      },
      {
        question: "How is JSX processed?",
        answer: "JSX is compiled to React.createElement() calls by tools like Babel.",
        id: "f3-2",
      }
    ],
    id: "card3",
  },
  {
    question: "What is the virtual DOM?",
    answer: "The Virtual DOM is a lightweight copy of the actual DOM in memory that React uses to improve performance.",
    followUps: [
      {
        question: "Why is the virtual DOM more efficient?",
        answer: "It allows React to batch updates and minimize direct manipulation of the real DOM, which is slow and resource-intensive.",
        id: "f4-1",
      }
    ],
    id: "card4",
  },
  {
    question: "What are hooks in React?",
    answer: "Hooks are functions that let you use state and other React features without writing a class component.",
    followUps: [
      {
        question: "Name two commonly used hooks.",
        answer: "useState and useEffect are the two most commonly used hooks.",
        id: "f5-1",
      },
      {
        question: "When were hooks introduced?",
        answer: "Hooks were introduced in React 16.8 (February 2019).",
        id: "f5-2",
      }
    ],
    id: "card5",
  },
];
