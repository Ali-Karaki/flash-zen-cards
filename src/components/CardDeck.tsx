
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, ArrowRight, RefreshCcw, BookmarkPlus, BookmarkMinus, Shuffle } from "lucide-react";
import Flashcard from "./Flashcard";
import { useLocalStorage, resetLocalStorage } from "../hooks/useLocalStorage";
import { kFlashcards } from "@/data/flashCardsWithIDs";

const CardDeck = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [reviewCardIndex, setReviewCardIndex] = useState<number>(0);
  const [seenCards, setSeenCards] = useLocalStorage<string[]>("seenCards", []);
  const [markedForReview, setMarkedForReview] = useLocalStorage<string[]>("reviewLater", []);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Get unseen cards
  const unseenCards = kFlashcards.filter(card => !seenCards.includes(card.id));
  
  // Get cards marked for review
  const reviewCards = kFlashcards.filter(card => markedForReview.includes(card.id));
  
  // Initialize with unseen cards or reset if all have been seen
  useEffect(() => {
    if (unseenCards.length > 0) {
      setCurrentCardIndex(0);
    }
  }, [seenCards, unseenCards.length]);
  
  // Reset card flip state when changing cards or tabs
  useEffect(() => {
    setIsFlipped(false);
  }, [currentCardIndex, reviewCardIndex, activeTab]);
  
  const handleNext = () => {
    if (activeTab === "all" && unseenCards.length > 0) {
      // Mark current card as seen
      if (!seenCards.includes(unseenCards[currentCardIndex].id)) {
        setSeenCards([...seenCards, unseenCards[currentCardIndex].id]);
      }
      
      // Move to next unseen card
      if (currentCardIndex < unseenCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setCurrentCardIndex(0);
      }
    } else if (activeTab === "review" && reviewCards.length > 0) {
      // Move to next review card
      setReviewCardIndex((prevIndex) => {
        if (prevIndex >= reviewCards.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    }
  };

  const handlePrevious = () => {
    if (activeTab === "all" && unseenCards.length > 0) {
      setCurrentCardIndex((prevIndex) => {
        if (prevIndex <= 0) {
          return unseenCards.length - 1;
        }
        return prevIndex - 1;
      });
    } else if (activeTab === "review" && reviewCards.length > 0) {
      setReviewCardIndex((prevIndex) => {
        if (prevIndex <= 0) {
          return reviewCards.length - 1;
        }
        return prevIndex - 1;
      });
    }
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
    setReviewCardIndex(0);
    setActiveTab("all");
    toast({
      title: "Progress reset",
      description: "All progress has been cleared",
    });
  };
  
  const handleShuffle = () => {
    // Only shuffle unseen cards
    if (unseenCards.length > 1) {
      const newSeenCards = [...seenCards];
      // Mark all currently unseen cards as seen except the current one
      unseenCards.forEach((card, index) => {
        if (index !== currentCardIndex && !newSeenCards.includes(card.id)) {
          newSeenCards.push(card.id);
        }
      });
      // Randomly select a new card to view next
      const remainingCards = kFlashcards.filter(card => !newSeenCards.includes(card.id));
      if (remainingCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingCards.length);
        const randomCard = remainingCards[randomIndex];
        const newIndex = unseenCards.findIndex(card => card.id === randomCard.id);
        setCurrentCardIndex(newIndex >= 0 ? newIndex : 0);
      }
      setSeenCards(newSeenCards);
      toast({
        title: "Cards shuffled",
        description: "The order of unseen cards has been randomized",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsFlipped(false);
  };

  // Determine current card based on active tab
  const currentCard = activeTab === "all" 
    ? (unseenCards.length > 0 ? unseenCards[currentCardIndex] : null) 
    : (reviewCards.length > 0 ? reviewCards[reviewCardIndex] : null);
  
  const isMarkedForReview = currentCard ? markedForReview.includes(currentCard.id) : false;
  const progressPercentage = (seenCards.length / kFlashcards.length) * 100;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="mb-4 w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Progress: {seenCards.length}/{kFlashcards.length} cards
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-6">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">All Questions ({unseenCards.length})</TabsTrigger>
          <TabsTrigger value="review" className="flex-1">To Review ({reviewCards.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {unseenCards.length > 0 ? (
            <>
              <div className="text-sm text-gray-500 mb-2 text-right">
                Card {currentCardIndex + 1} of {unseenCards.length}
              </div>
              <Flashcard 
                card={currentCard!} 
                onReviewLater={handleReviewLater}
                isMarkedForReview={isMarkedForReview}
                isFlipped={isFlipped}
                setIsFlipped={setIsFlipped}
              />
            </>
          ) : (
            <div className="p-8 text-center border rounded-lg">
              <h3 className="text-xl font-semibold mb-4">You've seen all cards. Reset to start over.</h3>
              <Button onClick={handleReset} variant="default">Reset Progress</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="review" className="mt-4">
          {reviewCards.length > 0 ? (
            <>
              <div className="text-sm text-gray-500 mb-2 text-right">
                Card {reviewCardIndex + 1} of {reviewCards.length}
              </div>
              <Flashcard 
                card={currentCard!} 
                onReviewLater={handleReviewLater}
                isMarkedForReview={true}
                isFlipped={isFlipped}
                setIsFlipped={setIsFlipped}
              />
            </>
          ) : (
            <div className="p-8 text-center border rounded-lg">
              <h3 className="text-lg">No cards marked for review.</h3>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <Button 
          variant="outline"
          onClick={handlePrevious}
          className="flex items-center gap-2"
          disabled={!currentCard}
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleNext}
          className="flex items-center gap-2"
          disabled={!currentCard}
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
        
        <Button 
          variant={isMarkedForReview ? "secondary" : "outline"}
          onClick={() => currentCard && handleReviewLater(currentCard.id)}
          className="flex items-center gap-2"
          disabled={!currentCard}
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
        
        {activeTab === "all" && unseenCards.length > 1 && (
          <Button 
            variant="outline"
            onClick={handleShuffle}
            className="flex items-center gap-2"
          >
            <Shuffle className="h-4 w-4" />
            Shuffle
          </Button>
        )}
      </div>

      <Button 
        variant="ghost"
        onClick={handleReset}
        className="mt-6 text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
      >
        <RefreshCcw className="h-4 w-4" />
        Reset progress
      </Button>
    </div>
  );
};

export default CardDeck;
