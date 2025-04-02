
import { Flashcard as FlashcardType } from "../data/flashcards";

interface FlashcardProps {
  card: FlashcardType | null;
  onReviewLater: (id: string) => void;
  isMarkedForReview: boolean;
  isFlipped: boolean;
  setIsFlipped: (isFlipped: boolean) => void;
}

const Flashcard = ({ 
  card, 
  onReviewLater, 
  isMarkedForReview, 
  isFlipped, 
  setIsFlipped 
}: FlashcardProps) => {
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // If card is null, render a placeholder
  if (!card) {
    return (
      <div className="flashcard flex items-center justify-center">
        <p className="text-gray-500">No card available</p>
      </div>
    );
  }

  return (
    <div 
      className={`flashcard ${isFlipped ? "flashcard-flipped" : ""}`} 
      onClick={handleFlip}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="flex flex-col h-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{card.question}</h2>
            <div className="flex-grow">
              {card.followUps.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Follow-up Questions:</h3>
                  <ul className="space-y-2 text-sm sm:text-base">
                    {card.followUps.map((followUp) => (
                      <li key={followUp.id} className="text-gray-700">
                        {followUp.question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 mt-auto pt-4">Click to flip</div>
          </div>
        </div>
        <div className="flashcard-back">
          <div className="flex flex-col h-full overflow-y-auto">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Answer:</h3>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">{card.answer}</p>
            </div>
            
            {card.followUps.length > 0 && (
              <div className="mt-2">
                <h3 className="text-base sm:text-lg font-semibold mb-2">Follow-up Answers:</h3>
                <ul className="space-y-4">
                  {card.followUps.map((followUp) => (
                    <li key={followUp.id} className="text-gray-700">
                      <div className="font-medium text-sm sm:text-base">{followUp.question}</div>
                      <div className="mt-1 text-sm sm:text-base">{followUp.answer}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-xs sm:text-sm text-gray-400 mt-auto pt-4">Click to flip back</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
