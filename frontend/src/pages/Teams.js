import { useState } from 'react';
import { useApiWithFallback } from '../hooks/useApi';
import apiService from '../services/api';

const Teams = () => {
  const [activeTab, setActiveTab] = useState('registered');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  // Fallback data in case API is not available
  const fallbackTeams = [
    {
      id: 1,
      name: 'Thunder Bolts',
      college: 'City University',
      sport: 'Cricket',
      captain: 'John Smith',
      members: 11,
      wins: 5,
      losses: 2,
      logo: '⚡'
    },
    {
      id: 2,
      name: 'Fire Dragons',
      college: 'State College',
      sport: 'Basketball',
      captain: 'Emma Johnson',
      members: 8,
      wins: 8,
      losses: 1,
      logo: '🐉'
    },
    {
      id: 3,
      name: 'Ocean Waves',
      college: 'Marine Institute',
      sport: 'Football',
      captain: 'Mike Wilson',
      members: 15,
      wins: 3,
      losses: 3,
      logo: '🌊'
    },
    {
      id: 4,
      name: 'Golden Eagles',
      college: 'Tech University',
      sport: 'Basketball',
      captain: 'Sarah Davis',
      members: 7,
      wins: 6,
      losses: 2,
      logo: '🦅'
    }
  ];

  // Fetch teams from API with fallback data
  const { data: teamsData, loading, error, usingFallback } = useApiWithFallback(
    () => apiService.getTeams(),
    fallbackTeams
  );

  const registeredTeams = teamsData || fallbackTeams;
  const topPerformers = [...registeredTeams]
    .sort((a, b) => (b.wins || 0) - (a.wins || 0))
    .slice(0, 3);

  const getSportIcon = (sport) => {
    const icons = {
      'Cricket': '🏏',
      'Basketball': '🏀',
      'Football': '⚽',
      'Table Tennis': '🏓'
    };
    return icons[sport] || '🏆';
  };

  const RegistrationForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Register New Team</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter team name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter college name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Select a sport</option>
              <option value="cricket">Cricket</option>
              <option value="basketball">Basketball</option>
              <option value="football">Football</option>
              <option value="table-tennis">Table Tennis</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Captain</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Captain's name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Members</label>
            <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Number of team members" />
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setShowRegistrationForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Register Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Teams</h1>
          <p className="text-lg text-gray-600">Discover participating teams and register your own</p>
          
          {/* API Status Indicator */}
          {usingFallback && (
            <div className="mt-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                ⚠️ Using demo data (API unavailable)
              </span>
            </div>
          )}
          
          <button
            onClick={() => setShowRegistrationForm(true)}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Register New Team
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('registered')}
              className={`px-6 py-2 rounded-md font-medium transition duration-300 ${
                activeTab === 'registered'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              All Teams
            </button>
            <button
              onClick={() => setActiveTab('top-performers')}
              className={`px-6 py-2 rounded-md font-medium transition duration-300 ${
                activeTab === 'top-performers'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Top Performers
            </button>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'registered' ? registeredTeams : topPerformers).map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{team.logo}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-600">{team.college}</p>
                  </div>
                </div>
                <div className="text-2xl">{getSportIcon(team.sport)}</div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Captain:</span>
                  <span className="font-medium">{team.captain}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Members:</span>
                  <span className="font-medium">{team.members}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sport:</span>
                  <span className="font-medium">{team.sport}</span>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{team.wins}</div>
                    <div className="text-sm text-gray-600">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{team.losses}</div>
                    <div className="text-sm text-gray-600">Losses</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {team.wins + team.losses > 0 ? Math.round((team.wins / (team.wins + team.losses)) * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-600">Win Rate</div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300">
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Stats Overview */}
        {activeTab === 'registered' && (
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Tournament Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{registeredTeams.length}</div>
                <div className="text-gray-600">Total Teams</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {[...new Set(registeredTeams.map(t => t.college))].length}
                </div>
                <div className="text-gray-600">Colleges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {[...new Set(registeredTeams.map(t => t.sport))].length}
                </div>
                <div className="text-gray-600">Sports</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {registeredTeams.reduce((sum, team) => sum + team.wins + team.losses, 0)}
                </div>
                <div className="text-gray-600">Matches Played</div>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form Modal */}
        {showRegistrationForm && <RegistrationForm />}
      </div>
    </div>
  );
};

export default Teams;
