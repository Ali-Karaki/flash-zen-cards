
import { useState } from "react";
import { Flashcard as FlashcardType } from "../data/flashcards";

interface FlashcardProps {
  card: FlashcardType;
  onReviewLater: (id: string) => void;
  isMarkedForReview: boolean;
}

const Flashcard = ({ card, onReviewLater, isMarkedForReview }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`flashcard ${isFlipped ? "flashcard-flipped" : ""}`} 
      onClick={handleFlip}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-6">{card.question}</h2>
            <div className="flex-grow">
              {card.followUps.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Follow-up Questions:</h3>
                  <ul className="space-y-2">
                    {card.followUps.map((followUp) => (
                      <li key={followUp.id} className="text-gray-700">
                        {followUp.question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-400 mt-auto pt-4">Click to flip</div>
          </div>
        </div>
        <div className="flashcard-back">
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-lg font-semibold mb-2">Answer:</h3>
              <p className="text-gray-700 mb-6">{card.answer}</p>
            </div>
            
            {card.followUps.length > 0 && (
              <div className="mt-2">
                <h3 className="text-lg font-semibold mb-2">Follow-up Answers:</h3>
                <ul className="space-y-4">
                  {card.followUps.map((followUp) => (
                    <li key={followUp.id} className="text-gray-700">
                      <div className="font-medium">{followUp.question}</div>
                      <div className="mt-1">{followUp.answer}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-sm text-gray-400 mt-auto pt-4">Click to flip back</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
