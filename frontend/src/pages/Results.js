import { useState } from 'react';

const Results = () => {
  const [activeTab, setActiveTab] = useState('recent');
  
  const recentMatches = [
    {
      id: 1,
      sport: 'Cricket',
      tournament: 'Inter-College Cricket Championship',
      team1: { name: 'Thunder Bolts', college: 'City University', score: 245, logo: '⚡' },
      team2: { name: 'Ocean Waves', college: 'Marine Institute', score: 198, logo: '🌊' },
      winner: 'Thunder Bolts',
      date: '2024-08-25',
      venue: 'Main Sports Ground',
      status: 'completed'
    },
    {
      id: 2,
      sport: 'Basketball',
      tournament: 'Basketball League Finals',
      team1: { name: 'Fire Dragons', college: 'State College', score: 78, logo: '🐉' },
      team2: { name: 'Golden Eagles', college: 'Tech University', score: 72, logo: '🦅' },
      winner: 'Fire Dragons',
      date: '2024-08-24',
      venue: 'Indoor Sports Complex',
      status: 'completed'
    },
    {
      id: 3,
      sport: 'Football',
      tournament: 'Football Championship',
      team1: { name: 'Ocean Waves', college: 'Marine Institute', score: 2, logo: '🌊' },
      team2: { name: 'Storm Riders', college: 'Mountain College', score: 1, logo: '⛈️' },
      winner: 'Ocean Waves',
      date: '2024-08-23',
      venue: 'Football Stadium',
      status: 'completed'
    }
  ];

  const liveMatches = [
    {
      id: 4,
      sport: 'Table Tennis',
      tournament: 'Table Tennis Singles',
      team1: { name: 'Lightning Strikes', college: 'Central University', score: 2, logo: '⚡' },
      team2: { name: 'Rapid Fire', college: 'Sports Academy', score: 1, logo: '🔥' },
      date: '2024-08-27',
      venue: 'Recreation Center',
      status: 'live',
      currentSet: 'Set 4 - 8:6'
    }
  ];

  const upcomingMatches = [
    {
      id: 5,
      sport: 'Cricket',
      tournament: 'Inter-College Cricket Championship',
      team1: { name: 'Fire Dragons', college: 'State College', logo: '🐉' },
      team2: { name: 'Golden Eagles', college: 'Tech University', logo: '🦅' },
      date: '2024-08-28',
      time: '09:00 AM',
      venue: 'Main Sports Ground',
      status: 'upcoming'
    },
    {
      id: 6,
      sport: 'Basketball',
      tournament: 'Basketball League Finals',
      team1: { name: 'Thunder Bolts', college: 'City University', logo: '⚡' },
      team2: { name: 'Ocean Waves', college: 'Marine Institute', logo: '🌊' },
      date: '2024-08-29',
      time: '02:00 PM',
      venue: 'Indoor Sports Complex',
      status: 'upcoming'
    }
  ];

  const getSportIcon = (sport) => {
    const icons = {
      'Cricket': '🏏',
      'Basketball': '🏀',
      'Football': '⚽',
      'Table Tennis': '🏓'
    };
    return icons[sport] || '🏆';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'completed': 'bg-gray-100 text-gray-800',
      'live': 'bg-red-100 text-red-800',
      'upcoming': 'bg-blue-100 text-blue-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const MatchCard = ({ match }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getSportIcon(match.sport)}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{match.tournament}</h3>
            <p className="text-sm text-gray-600">{match.sport}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(match.status)}`}>
          {match.status === 'live' ? '🔴 LIVE' : match.status}
        </span>
      </div>

      {/* Teams */}
      <div className="space-y-4 mb-4">
        {/* Team 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{match.team1.logo}</span>
            <div>
              <p className="font-medium text-gray-900">{match.team1.name}</p>
              <p className="text-sm text-gray-600">{match.team1.college}</p>
            </div>
          </div>
          {match.team1.score !== undefined && (
            <div className={`text-2xl font-bold ${match.winner === match.team1.name ? 'text-green-600' : 'text-gray-600'}`}>
              {match.team1.score}
            </div>
          )}
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center">
          <div className="border-t border-gray-200 flex-1"></div>
          <span className="px-4 text-gray-500 font-medium">VS</span>
          <div className="border-t border-gray-200 flex-1"></div>
        </div>

        {/* Team 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{match.team2.logo}</span>
            <div>
              <p className="font-medium text-gray-900">{match.team2.name}</p>
              <p className="text-sm text-gray-600">{match.team2.college}</p>
            </div>
          </div>
          {match.team2.score !== undefined && (
            <div className={`text-2xl font-bold ${match.winner === match.team2.name ? 'text-green-600' : 'text-gray-600'}`}>
              {match.team2.score}
            </div>
          )}
        </div>
      </div>

      {/* Match Details */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="mr-2">📅</span>
            <span>{match.date} {match.time && `at ${match.time}`}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">📍</span>
            <span>{match.venue}</span>
          </div>
        </div>
        
        {match.status === 'live' && match.currentSet && (
          <div className="mt-3 p-2 bg-red-50 rounded-lg">
            <p className="text-sm font-medium text-red-800">{match.currentSet}</p>
          </div>
        )}
        
        {match.status === 'completed' && match.winner && (
          <div className="mt-3 p-2 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800">🏆 Winner: {match.winner}</p>
          </div>
        )}
      </div>
    </div>
  );

  const getMatchesForTab = () => {
    switch (activeTab) {
      case 'recent':
        return recentMatches;
      case 'live':
        return liveMatches;
      case 'upcoming':
        return upcomingMatches;
      default:
        return recentMatches;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Match Results</h1>
          <p className="text-lg text-gray-600">Stay updated with the latest match results and live scores</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-6 py-2 rounded-md font-medium transition duration-300 ${
                activeTab === 'recent'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Recent Results
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-2 rounded-md font-medium transition duration-300 ${
                activeTab === 'live'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              🔴 Live Matches
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-md font-medium transition duration-300 ${
                activeTab === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {getMatchesForTab().map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

        {/* Empty State */}
        {getMatchesForTab().length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {activeTab === 'live' ? '📺' : activeTab === 'upcoming' ? '📅' : '🏆'}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab} matches
            </h3>
            <p className="text-gray-600">
              {activeTab === 'live' 
                ? 'No matches are currently in progress.' 
                : activeTab === 'upcoming'
                ? 'No upcoming matches scheduled.'
                : 'No recent match results available.'}
            </p>
          </div>
        )}

        {/* Quick Stats */}
        {activeTab === 'recent' && recentMatches.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{recentMatches.length}</div>
                <div className="text-gray-600">Matches Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {[...new Set(recentMatches.map(m => m.sport))].length}
                </div>
                <div className="text-gray-600">Sports Played</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {[...new Set([...recentMatches.map(m => m.team1.name), ...recentMatches.map(m => m.team2.name)])].length}
                </div>
                <div className="text-gray-600">Teams Participated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {[...new Set(recentMatches.map(m => m.venue))].length}
                </div>
                <div className="text-gray-600">Venues Used</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
