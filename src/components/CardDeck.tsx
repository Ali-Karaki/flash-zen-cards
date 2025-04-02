
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/use-toast";
import { ArrowLeft, ArrowRight, RefreshCcw, BookmarkPlus, BookmarkMinus } from "lucide-react";
import Flashcard from "./Flashcard";
import { kFlashcards, Flashcard as FlashcardType } from "../data/flashcards";
import { useLocalStorage, resetLocalStorage } from "../hooks/useLocalStorage";

const CardDeck = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [seenCards, setSeenCards] = useLocalStorage<string[]>("seenCards", []);
  const [markedForReview, setMarkedForReview] = useLocalStorage<string[]>("reviewLater", []);
  
  // Initialize with unseen cards or reset if all have been seen
  useEffect(() => {
    let unseenCards = kFlashcards.filter(card => !seenCards.includes(card.id));
    
    // If all cards have been seen, just use the full deck
    if (unseenCards.length === 0 && seenCards.length > 0) {
      unseenCards = [...kFlashcards];
    }
    
    // Start with a random unseen card
    if (unseenCards.length > 0) {
      const randomIndex = kFlashcards.findIndex(card => card.id === unseenCards[0].id);
      setCurrentCardIndex(randomIndex >= 0 ? randomIndex : 0);
    }
  }, [seenCards]);

  const handleNext = () => {
    // Mark current card as seen
    if (!seenCards.includes(kFlashcards[currentCardIndex].id)) {
      setSeenCards([...seenCards, kFlashcards[currentCardIndex].id]);
    }
    
    // Move to next card
    setCurrentCardIndex((prevIndex) => {
      if (prevIndex >= kFlashcards.length - 1) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const handlePrevious = () => {
    setCurrentCardIndex((prevIndex) => {
      if (prevIndex <= 0) {
        return kFlashcards.length - 1;
      }
      return prevIndex - 1;
    });
  };

  const handleReviewLater = (id: string) => {
    if (markedForReview.includes(id)) {
      setMarkedForReview(markedForReview.filter((cardId) => cardId !== id));
      toast({
        title: "Removed from review",
        description: "Card has been removed from your review list",
      });
    } else {
      setMarkedForReview([...markedForReview, id]);
      toast({
        title: "Marked for review",
        description: "Card has been added to your review list",
      });
    }
  };

  const handleReset = () => {
    resetLocalStorage();
    setSeenCards([]);
    setMarkedForReview([]);
    setCurrentCardIndex(0);
    toast({
      title: "Progress reset",
      description: "All progress has been cleared",
    });
  };

  const currentCard = kFlashcards[currentCardIndex];
  const isMarkedForReview = markedForReview.includes(currentCard.id);
  const progressPercentage = (seenCards.length / kFlashcards.length) * 100;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="mb-8 w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Progress: {seenCards.length}/{kFlashcards.length} cards
          </span>
          <span className="text-sm text-gray-500">
            Card {currentCardIndex + 1} of {kFlashcards.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <Flashcard 
        card={currentCard} 
        onReviewLater={handleReviewLater}
        isMarkedForReview={isMarkedForReview}
      />

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Button 
          variant="outline"
          onClick={handlePrevious}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
        
        <Button 
          variant={isMarkedForReview ? "secondary" : "outline"}
          onClick={() => handleReviewLater(currentCard.id)}
          className="flex items-center gap-2"
        >
          {isMarkedForReview ? (
            <>
              <BookmarkMinus className="h-4 w-4" />
              Remove from review
            </>
          ) : (
            <>
              <BookmarkPlus className="h-4 w-4" />
              Review later
            </>
          )}
        </Button>
      </div>

      <Button 
        variant="ghost"
        onClick={handleReset}
        className="mt-8 text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
      >
        <RefreshCcw className="h-4 w-4" />
        Reset progress
      </Button>

      {markedForReview.length > 0 && (
        <div className="mt-8 p-4 border rounded-lg w-full">
          <h3 className="font-medium mb-2">Marked for review ({markedForReview.length}):</h3>
          <ul className="space-y-1">
            {markedForReview.map(id => {
              const card = kFlashcards.find(c => c.id === id);
              return card ? (
                <li key={id} className="text-sm text-gray-600 truncate">
                  • {card.question}
                </li>
              ) : null;
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CardDeck;
