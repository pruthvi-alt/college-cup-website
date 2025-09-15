import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to College Cup
          </h2>
          <p className="text-xl md:text-2xl mb-8">
            The Ultimate Inter-College Sports Championship
          </p>
          <div className="space-x-4">
            <Link
              to="/teams"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Register Team
            </Link>
            <Link
              to="/tournaments"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              View Schedule
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
