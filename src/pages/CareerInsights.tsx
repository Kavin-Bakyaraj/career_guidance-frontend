import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, MapPin } from 'lucide-react';
import axios from 'axios';

const CareerInsights = () => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState('technology');
  const [region, setRegion] = useState('india');
  
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/career-trends/?industry=${industry}&region=${region}`);
        
        if (response.data.success) {
          const trendsData = response.data.trends;
          
          setInsights({
            trendData: trendsData.trend_data,
            statistics: {
              jobGrowth: trendsData.industry_insights.jobGrowth,
              averageSalary: trendsData.industry_insights.averageSalary,
              openPositions: trendsData.industry_insights.openPositions || '5,000+'
            },
            trending: {
              technologies: trendsData.trending_technologies,
              topics: trendsData.trending_topics,
              cities: trendsData.top_cities || []
            }
          });
        } else {
          console.error('Failed to fetch insights');
        }
      } catch (error) {
        console.error('Error fetching career insights:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, [industry, region]);

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIndustry(e.target.value);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-gray-600">Loading Indian market insights...</div>
      </div>
    );
  }

  // Format salary in Indian rupees
  const formatIndianSalary = (salary: string) => {
    if (salary.includes('$')) {
      // Convert USD to INR (approximate)
      const usdValue = parseInt(salary.replace(/[^0-9]/g, ''));
      const inrValue = usdValue * 75; // Approximate exchange rate
      
      // Format in Indian style (lakhs)
      if (inrValue >= 100000) {
        return `₹${(inrValue / 100000).toFixed(2)} Lakhs`;
      }
      return `₹${inrValue.toLocaleString('en-IN')}`;
    }
    return salary.includes('₹') ? salary : `₹${salary}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Indian Career Market Insights</h1>
        <div className="flex items-center">
          <label htmlFor="industry" className="mr-2 text-gray-700">Industry:</label>
          <select 
            id="industry"
            className="p-2 border border-gray-300 rounded-md"
            value={industry}
            onChange={handleIndustryChange}
          >
            <option value="technology">IT & Technology</option>
            <option value="data">Data Science</option>
            <option value="design">Design</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
            <option value="ecommerce">E-commerce</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-green-500" size={24} />
            <div>
              <div className="text-sm text-gray-600">Indian Job Growth</div>
              <div className="text-2xl font-bold text-gray-800">{insights.statistics.jobGrowth}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3">
            <DollarSign className="text-blue-500" size={24} />
            <div>
              <div className="text-sm text-gray-600">Average Salary (India)</div>
              <div className="text-2xl font-bold text-gray-800">
                {formatIndianSalary(insights.statistics.averageSalary)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3">
            <Users className="text-purple-500" size={24} />
            <div>
              <div className="text-sm text-gray-600">Open Positions in India</div>
              <div className="text-2xl font-bold text-gray-800">{insights.statistics.openPositions}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Indian Market Trends</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insights.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(insights.trendData[0] || {}).map((key, index) => {
                  if (key !== 'month') {
                    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];
                    return (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        name={key}
                        stroke={colors[index % colors.length]}
                        strokeWidth={2}
                      />
                    );
                  }
                  return null;
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">In-Demand Skills in India</h2>
          <div className="space-y-4">
            {insights.trending.technologies.map((tech: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{tech.name}</span>
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (tech.count / 50) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Emerging Trends in India</h2>
          <div className="flex flex-wrap gap-2">
            {insights.trending.topics.map((topic: any, index: number) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {topic.name.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            <MapPin className="inline-block mr-2" size={24} />
            Top Hiring Cities in India
          </h2>
          <div className="space-y-4">
            {insights.trending.cities && insights.trending.cities.map((city: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{city.name}</span>
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (city.score / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {(!insights.trending.cities || insights.trending.cities.length === 0) && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Bangalore</span>
                  <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Hyderabad</span>
                  <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Mumbai</span>
                  <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Delhi NCR</span>
                  <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Pune</span>
                  <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Indian Industry Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-lg text-gray-800 mb-2">Key Growth Sectors</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>IT Services & Software Development</li>
              <li>E-commerce & Digital Retail</li>
              <li>EdTech & Online Learning</li>
              <li>FinTech & Digital Payments</li>
              <li>Healthcare Technology</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-lg text-gray-800 mb-2">Emerging Opportunities</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Artificial Intelligence & ML</li>
              <li>Data Science & Analytics</li>
              <li>Cloud Computing Services</li>
              <li>Cybersecurity</li>
              <li>Digital Marketing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerInsights;