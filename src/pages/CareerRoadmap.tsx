import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, ChevronDown, ChevronUp, Youtube, BookOpen } from 'lucide-react';

const CareerRoadmap = () => {
  const [currentSkills, setCurrentSkills] = useState<string>('');
  const [careerGoal, setCareerGoal] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('beginner');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({});

  const togglePhase = (index: number) => {
    setOpenPhases(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const generateRoadmap = async () => {
    if (!careerGoal) {
      setError('Please enter a career goal');
      return;
    }

    setLoading(true);
    setError('');
    setRoadmap(null);

    try {
      const response = await axios.post('https://career-guiding-backend.vercel.app/api/generate-roadmap/', {
        skills: currentSkills.split(',').map(skill => skill.trim()).filter(Boolean),
        goal: careerGoal,
        experienceLevel: experienceLevel
      });

      if (response.data.success) {
        setRoadmap(response.data.roadmap);
        
        // Open the first phase by default
        if (response.data.roadmap.phases && response.data.roadmap.phases.length > 0) {
          setOpenPhases({ 0: true });
        }
      } else {
        setError(response.data.error || 'Failed to generate roadmap');
      }
    } catch (err: any) {
      console.error('Error generating roadmap:', err);
      setError(err.response?.data?.error || 'An error occurred while generating roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Career Roadmap Generator</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="currentSkills" className="block text-sm font-medium text-gray-700 mb-1">
              Current Skills
            </label>
            <input
              type="text"
              id="currentSkills"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="e.g. java, blender, python, game development"
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">Separate multiple skills with commas</p>
          </div>
          
          <div>
            <label htmlFor="careerGoal" className="block text-sm font-medium text-gray-700 mb-1">
              Career Goal
            </label>
            <input
              type="text"
              id="careerGoal"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="e.g. game developer"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <select
              id="experienceLevel"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <button
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            onClick={generateRoadmap}
            disabled={loading || !careerGoal}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" size={20} />
                Generating Roadmap...
              </span>
            ) : (
              'Generate Roadmap'
            )}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {roadmap && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Career Path: {roadmap.career_goal}</h2>
            <p className="text-gray-600 mt-1">Estimated completion: {roadmap.estimated_completion}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {roadmap.required_skills.map((skill: string, index: number) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {roadmap.phases.map((phase: any, index: number) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => togglePhase(index)}
                  className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{phase.name}</h3>
                    <p className="text-gray-600">Duration: {phase.duration}</p>
                  </div>
                  {openPhases[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {openPhases[index] && (
                  <div className="p-6">
                    <h4 className="text-md font-medium text-gray-800 mb-2">Focus on:</h4>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                      {phase.skills.map((skill: string, skillIndex: number) => (
                        <li key={skillIndex} className="text-gray-600">{skill}</li>
                      ))}
                    </ul>
                    
                    <h4 className="text-md font-medium text-gray-800 mb-2">Recommended Resources:</h4>
                    
                    {phase.resources && (
                      <div className="space-y-3">
                        {phase.resources.videos && phase.resources.videos.length > 0 && (
                          <div>
                            <h5 className="flex items-center text-sm font-medium text-gray-700">
                              <Youtube size={16} className="mr-1 text-red-600" />
                              Videos:
                            </h5>
                            <ul className="pl-6 space-y-1">
                              {phase.resources.videos.map((video: any, videoIndex: number) => (
                                <li key={videoIndex}>
                                  <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                  >
                                    {video.title}
                                  </a>
                                </li>
                              )).slice(0, 2)}
                            </ul>
                          </div>
                        )}
                        
                        {phase.resources.courses && phase.resources.courses.length > 0 && (
                          <div>
                            <h5 className="flex items-center text-sm font-medium text-gray-700">
                              <BookOpen size={16} className="mr-1 text-green-600" />
                              Courses:
                            </h5>
                            <ul className="pl-6 space-y-1">
                              {phase.resources.courses.map((course: any, courseIndex: number) => (
                                <li key={courseIndex}>
                                  <a
                                    href={course.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                  >
                                    {course.title}
                                  </a>
                                </li>
                              )).slice(0, 2)}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerRoadmap;