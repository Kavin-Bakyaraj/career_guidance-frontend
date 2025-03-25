import React, { useState } from 'react';
import { Search, BookOpen, Youtube, Code, ExternalLink, Loader } from 'lucide-react';
import axios from 'axios';

const LearningHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const searchResources = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/learning-resources/', {
        searchTerm: searchTerm,
        skills: [searchTerm] // You can expand this to include more user skills
      });
      
      if (response.data.success) {
        setResources(response.data.resources);
      } else {
        console.error('Failed to fetch resources');
      }
    } catch (error) {
      console.error('Error fetching learning resources:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchResources();
    }
  };

  const filterResources = () => {
    if (!resources) return [];
    
    if (activeTab === 'all') {
      return [
        ...(resources.videos || []).map((video: any) => ({ ...video, type: 'video' })),
        ...(resources.courses || []).map((course: any) => ({ ...course, type: 'course' })),
        ...(resources.repositories || []).map((repo: any) => ({ ...repo, type: 'repository' }))
      ];
    } else if (activeTab === 'videos') {
      return resources.videos || [];
    } else if (activeTab === 'courses') {
      return resources.courses || [];
    } else if (activeTab === 'repositories') {
      return resources.repositories || [];
    }
    
    return [];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Learning Hub</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex space-x-4">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for courses, tutorials, and resources..."
          />
          <button
            onClick={searchResources}
            disabled={loading}
            className="px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <Search size={20} />
            )}
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </div>

      {resources && (
        <>
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 -mb-px text-sm font-medium ${
                activeTab === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              All Resources
            </button>
            
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 -mb-px text-sm font-medium ${
                activeTab === 'videos'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Videos
            </button>
            
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 -mb-px text-sm font-medium ${
                activeTab === 'courses'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Courses
            </button>
            
            <button
              onClick={() => setActiveTab('repositories')}
              className={`px-4 py-2 -mb-px text-sm font-medium ${
                activeTab === 'repositories'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Repositories
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filterResources().map((resource: any, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {resource.type === 'video' || resource.videoId ? (
                      <Youtube size={24} className="text-red-600 mt-1" />
                    ) : resource.type === 'course' || resource.platform ? (
                      <BookOpen size={24} className="text-blue-600 mt-1" />
                    ) : (
                      <Code size={24} className="text-green-600 mt-1" />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{resource.title}</h2>
                      <div className="text-gray-600 mt-1">
                        {resource.platform || resource.language || ''}
                      </div>
                      {resource.description && (
                        <p className="text-gray-600 mt-2 line-clamp-2">{resource.description}</p>
                      )}
                      {resource.stars && (
                        <div className="text-gray-500 mt-2">⭐ {resource.stars} stars</div>
                      )}
                    </div>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <span>View</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
                
                {resource.thumbnail && (
                  <div className="mt-4">
                    <img 
                      src={resource.thumbnail} 
                      alt={resource.title} 
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            ))}
            
            {filterResources().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No resources found in this category. Try another category or search term.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LearningHub;