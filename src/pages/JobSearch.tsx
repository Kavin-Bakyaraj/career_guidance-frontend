import React, { useState } from 'react';
import { Search, MapPin, Building, ExternalLink, Briefcase } from 'lucide-react';
import axios from 'axios';

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('India');
  const [experience, setExperience] = useState('all');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchJobs = async () => {
    if (!searchTerm) return;
    
    setLoading(true);
    try {
      const skills = searchTerm.split(',').map(skill => skill.trim());
      const response = await axios.post('http://localhost:8000/api/job-matches/', {
        skills: skills,
        location: location,
        experience: experience
      });

      if (response.data.success) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Job Search</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="skills" className="block text-sm font-medium mb-1">Skills</label>
            <input
              id="skills"
              type="text"
              className="w-full p-3 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Python, React, Java"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
            <select
              id="location"
              className="w-full p-3 border rounded-md"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="India">All India</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Pune">Pune</option>
            </select>
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium mb-1">Experience</label>
            <select
              id="experience"
              className="w-full p-3 border rounded-md"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="fresher">Fresher (0-1 years)</option>
              <option value="junior">Junior (1-3 years)</option>
              <option value="mid">Mid-level (3-5 years)</option>
              <option value="senior">Senior (5+ years)</option>
            </select>
          </div>
        </div>
        <button
          onClick={searchJobs}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full md:w-auto"
          disabled={loading || !searchTerm}
        >
          {loading ? 'Searching...' : 'Search Jobs'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center my-8">Loading jobs...</div>
      ) : jobs.length > 0 ? (
        <div className="space-y-6">
          {jobs.map((job, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Building size={16} className="mr-2" />
                      {job.company}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      {job.location}
                    </div>
                    {job.salary && (
                      <div className="flex items-center text-gray-600">
                        <Briefcase size={16} className="mr-2" />
                        {job.salary}
                      </div>
                    )}
                    {job.experience && (
                      <div className="text-gray-600">
                        Experience: {job.experience}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
                  >
                    Apply Now <ExternalLink size={16} className="ml-2" />
                  </a>
                </div>
              </div>
              <p className="mt-4 text-gray-600">{job.description}</p>
            </div>
          ))}
        </div>
      ) : searchTerm && !loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No job listings found. Try different skills or location.</p>
        </div>
      ) : null}
    </div>
  );
};

export default JobSearch;