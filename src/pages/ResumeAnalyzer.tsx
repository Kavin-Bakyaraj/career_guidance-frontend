import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, XCircle, FileText, Award, File, Trash2 } from 'lucide-react';
import axios from 'axios';

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeResume = async () => {
    if ((!resumeFile && uploadMode === 'file') || (!resumeText && uploadMode === 'text')) {
      return;
    }
    
    setLoading(true);
    try {
      let response;
      
      if (uploadMode === 'file' && resumeFile) {
        // Create form data to send file
        const formData = new FormData();
        formData.append('resume', resumeFile);
        
        response = await axios.post(
          'https://career-guiding-backend.vercel.app/api/analyze-resume/', 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Send resume text
        response = await axios.post('https://career-guiding-backend.vercel.app/api/analyze-resume/', {
          resumeText: resumeText
        });
      }

      if (response.data.success) {
        setAnalysis(response.data.analysis);
      } else {
        console.error('Error analyzing resume:', response.data.error);
        alert('Failed to analyze resume. Please try again.');
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('An error occurred while analyzing your resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Resume Analyzer</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex border-b mb-6">
          <button 
            className={`px-4 py-2 ${uploadMode === 'file' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setUploadMode('file')}
          >
            Upload Resume
          </button>
          <button 
            className={`px-4 py-2 ${uploadMode === 'text' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setUploadMode('text')}
          >
            Paste Resume Text
          </button>
        </div>
        
        {uploadMode === 'file' ? (
          <div className="mb-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${resumeFile ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              
              {!resumeFile ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload size={48} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    Drag & drop your resume file here or{' '}
                    <button 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-sm text-gray-500">Supports PDF, DOCX, and TXT files</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <File size={48} className="text-green-600" />
                  </div>
                  <div className="text-gray-700 font-medium">{resumeFile.name}</div>
                  <div className="text-sm text-gray-500">{(resumeFile.size / 1024).toFixed(2)} KB</div>
                  <button 
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800 mx-auto"
                    onClick={removeFile}
                  >
                    <Trash2 size={16} />
                    <span>Remove</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Paste your resume text below:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-64"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Copy and paste your resume content here..."
            ></textarea>
          </div>
        )}
        
        <div className="flex justify-center">
          <button
            onClick={analyzeResume}
            disabled={loading || (uploadMode === 'file' ? !resumeFile : !resumeText)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center space-x-2"
          >
            <FileText size={20} />
            <span>{loading ? 'Analyzing...' : 'Analyze Resume'}</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="text-gray-600">Analyzing your resume...</div>
        </div>
      )}

      {analysis && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skills Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.technical && analysis.skills.technical.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {!analysis.skills.technical?.length && (
                    <p className="text-gray-500 text-sm italic">No technical skills detected</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.soft && analysis.skills.soft.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {!analysis.skills.soft?.length && (
                    <p className="text-gray-500 text-sm italic">No soft skills detected</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {analysis.ats_compatibility_score !== undefined && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">ATS Compatibility</h2>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      analysis.ats_compatibility_score >= 80 ? 'bg-green-600' : 
                      analysis.ats_compatibility_score >= 60 ? 'bg-yellow-500' : 'bg-red-600'
                    }`}
                    style={{ width: `${analysis.ats_compatibility_score}%` }}
                  ></div>
                </div>
                <span className="text-lg font-semibold">
                  {analysis.ats_compatibility_score}%
                </span>
              </div>
              <div className="mt-4 flex items-center">
                <Award className="text-blue-600 mr-2" size={20} />
                <span className="text-gray-700">
                  {analysis.ats_compatibility_score >= 80 ? 'Excellent ATS compatibility' :
                   analysis.ats_compatibility_score >= 60 ? 'Good ATS compatibility' : 'Needs improvement for ATS'}
                </span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommendations</h2>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start text-gray-600">
                  <XCircle size={18} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;