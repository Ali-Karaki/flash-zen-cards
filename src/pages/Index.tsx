
import CardDeck from "../components/CardDeck";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Flash Zen Cards</h1>
          <p className="text-gray-600">Flip through cards to review and learn</p>
        </header>
        
        <main>
          <CardDeck />
        </main>
        
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>Flash Zen Cards © 2023</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
