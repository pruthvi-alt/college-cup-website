import { useState } from 'react';

const Tournaments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingTournaments = [
    {
      id: 1,
      name: 'Inter-College Cricket Championship',
      sport: 'Cricket',
      date: '2024-09-15',
      time: '09:00 AM',
      venue: 'Main Sports Ground',
      participants: 8,
      maxParticipants: 12,
      status: 'open'
    },
    {
      id: 2,
      name: 'Basketball League Finals',
      sport: 'Basketball',
      date: '2024-09-20',
      time: '02:00 PM',
      venue: 'Indoor Sports Complex',
      participants: 6,
      maxParticipants: 8,
      status: 'open'
    },
    {
      id: 3,
      name: 'Football Championship',
      sport: 'Football',
      date: '2024-09-25',
      time: '10:00 AM',
      venue: 'Football Stadium',
      participants: 10,
      maxParticipants: 10,
      status: 'full'
    }
  ];

  const ongoingTournaments = [
    {
      id: 4,
      name: 'Table Tennis Singles',
      sport: 'Table Tennis',
      date: '2024-08-28',
      time: 'All Day',
      venue: 'Recreation Center',
      currentRound: 'Quarter Finals',
      status: 'ongoing'
    }
  ];

  const getSportIcon = (sport) => {
    const icons = {
      'Cricket': '🏏',
      'Basketball': '🏀',
      'Football': '⚽',
      'Table Tennis': '🏓',
      'Tennis': '🎾',
      'Volleyball': '🏐'
    };
    return icons[sport] || '🏆';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'open': 'bg-green-100 text-green-800',
      'full': 'bg-red-100 text-red-800',
      'ongoing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tournaments</h1>
          <p className="text-lg text-gray-600">Discover and participate in exciting sports competitions</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
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
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-6 py-2 rounded-md font-medium transition duration-300 ${
                activeTab === 'ongoing'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Ongoing
            </button>
          </div>
        </div>

        {/* Tournament Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'upcoming' && upcomingTournaments.map((tournament) => (
            <div key={tournament.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">{getSportIcon(tournament.sport)}</div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(tournament.status)}`}>
                  {tournament.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tournament.name}</h3>
              <p className="text-gray-600 mb-4">{tournament.sport}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">📅</span>
                  <span>{tournament.date} at {tournament.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">📍</span>
                  <span>{tournament.venue}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">👥</span>
                  <span>{tournament.participants}/{tournament.maxParticipants} teams</span>
                </div>
              </div>
              
              <button 
                className={`w-full py-2 px-4 rounded-lg font-medium transition duration-300 ${
                  tournament.status === 'full'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={tournament.status === 'full'}
              >
                {tournament.status === 'full' ? 'Tournament Full' : 'Register Team'}
              </button>
            </div>
          ))}

          {activeTab === 'ongoing' && ongoingTournaments.map((tournament) => (
            <div key={tournament.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">{getSportIcon(tournament.sport)}</div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(tournament.status)}`}>
                  {tournament.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tournament.name}</h3>
              <p className="text-gray-600 mb-4">{tournament.sport}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">📅</span>
                  <span>{tournament.date} - {tournament.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">📍</span>
                  <span>{tournament.venue}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">🎯</span>
                  <span>Current: {tournament.currentRound}</span>
                </div>
              </div>
              
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition duration-300">
                View Live Scores
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {((activeTab === 'upcoming' && upcomingTournaments.length === 0) ||
          (activeTab === 'ongoing' && ongoingTournaments.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {activeTab} tournaments
            </h3>
            <p className="text-gray-600">Check back later for exciting competitions!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
