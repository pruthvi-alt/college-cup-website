const Features = () => {
  const features = [
    {
      icon: '🏆',
      title: 'Multiple Sports',
      description: 'Cricket, Football, Basketball, and more exciting sports',
      bgColor: 'bg-blue-100'
    },
    {
      icon: '📊',
      title: 'Live Scores',
      description: 'Real-time updates and live scoring for all matches',
      bgColor: 'bg-green-100'
    },
    {
      icon: '🎖️',
      title: 'Awards',
      description: 'Recognition and prizes for top performing teams',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Tournament Features</h3>
          <p className="text-lg text-gray-600">Experience the best of inter-college sports competition</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
              <div className={`${feature.bgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
