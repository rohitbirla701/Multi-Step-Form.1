import React from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trendingGames } from '@/utils/constants';
interface GameCardProps {
  id: string;
  title: string;
  provider: string;
  imageUrl: string;
}

const GameCard: React.FC<GameCardProps> = ({ title, provider, imageUrl }) => {
  return (
    <div className="p-2 bg-white rounded-sm shadow-normal border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback gradient background if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div className="p-3 text-center">
        <p>{provider}</p>
      </div>
    </div>
  );
};

// Sample data based on your existing mock data
const sampleGames = [
  {
    id: '1',
    title: 'AVIATOR',
    provider: 'CRASH88 Gaming',
    imageUrl: '/api/placeholder/300/200',
    category: 'Crash',
  },
  {
    id: '2',
    title: 'Hotator',
    provider: 'SPRIBE',
    imageUrl: '/api/placeholder/300/200',
    category: 'Slots',
  },
  {
    id: '3',
    title: 'JetX',
    provider: 'Smartsoft Gaming',
    imageUrl: '/api/placeholder/300/200',
    category: 'Crash',
  },
  {
    id: '4',
    title: 'HELICOPTER X',
    provider: 'Smartsoft Gaming',
    imageUrl: '/api/placeholder/300/200',
    category: 'Crash',
  },
  {
    id: '5',
    title: 'AERO',
    provider: 'Turbogames',
    imageUrl: '/api/placeholder/300/200',
    category: 'Crash',
  },
  {
    id: '6',
    title: 'Sky Girls',
    provider: 'BetGames',
    imageUrl: '/api/placeholder/300/200',
    category: 'Live',
  },
  {
    id: '7',
    title: 'CRASH',
    provider: 'CRASH88 Gaming',
    imageUrl: '/api/placeholder/300/200',
    category: 'Crash',
  },
  {
    id: '8',
    title: 'CRASH Football Edition',
    provider: 'Turbogames',
    imageUrl: '/api/placeholder/300/200',
    category: 'Crash',
  },
];

// Main component that displays the grid of game cards
const GamingCardGrid: React.FC = () => {
  return (
    <div className="p-6  min-h-screen">
      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {trendingGames.map((game) => (
          <GameCard
            title={game.title}
            key={game.id}
            id={game.id}
            provider={game.provider}
            imageUrl={game.imageUrl}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Items per page:</span>
          <select className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">1 - 10 of 1037</span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamingCardGrid;
