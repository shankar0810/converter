import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Download, Github, RefreshCw, XCircle } from 'lucide-react';

const AngularConverter = () => {
  const [githubUrl, setGithubUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [urlValid, setUrlValid] = useState(true);
  const [repoName, setRepoName] = useState('');

  // Reset everything when starting a new conversion
  useEffect(() => {
    if (!isLoading) {
      setRepoName('');
    }
  }, [isLoading]);

  const validateGithubUrl = (url) => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/([\w-]+)\/([\w.-]+)\/?$/;
    return githubRegex.test(url);
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setGithubUrl(url);
    setUrlValid(url === '' || validateGithubUrl(url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!githubUrl || !validateGithubUrl(githubUrl)) {
      setError('Please enter a valid GitHub repository URL');
      setUrlValid(false);
      return;
    }
  
    setIsLoading(true);
    setStatus(null);
    setError(null);
    setDownloadReady(false);
  
    // Extract repository name from URL using regex
    const repoMatch = githubUrl.match(/^https?:\/\/(www\.)?github\.com\/([\w-]+)\/([\w.-]+)\/?$/);
    if (repoMatch) {
      console.log('Extracted repoName:', repoMatch[3]); // Log for debugging
      setRepoName(repoMatch[3]); // Set the repo name correctly
    } else {
      console.error('Failed to extract repoName from URL');
      setRepoName(''); // Reset repoName if extraction fails
    }
  
    // Proceed with the API call
    try {
      const response = await fetch('http://localhost:5000/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ github_url: githubUrl }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setStatus('success');
        setDownloadReady(true);
      } else {
        throw new Error(data.message || 'Failed to process repository');
      }
    } catch (err) {
      setError(err.message);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:5000/download');
      if (!response.ok) throw new Error('Download failed');
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
  
      // Use repoName from state or fallback to a default name
      const fileName = repoName ? `16-${repoName}.zip` : 'Angular-Project-16.zip';
      a.download = fileName;
  
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download the converted project');
    }
  };
  

  const handleReset = () => {
    setGithubUrl('');
    setStatus(null);
    setError(null);
    setDownloadReady(false);
    setRepoName('');
    setUrlValid(true);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-teal-50 to-gray-100 p-5 overflow-hidden">
     <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-2xl mx-auto pb-12">
        <div className="mb-6 text-center">
          <h1 className="text-teal-700 text-2xl font-semibold">
            AngularJS to Angular 16 Converter
          </h1>
          <p className="text-gray-600 mt-2">
            Convert your AngularJS projects to the latest Angular version
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Github size={20} />
            </div>
            <input
              type="url"
              placeholder="https://github.com/username/repository"
              value={githubUrl}
              onChange={handleUrlChange}
              className={`pl-10 w-full p-4 border-2 -lg outline-none transition-all duration-300 
                ${urlValid 
                  ? 'border-teal-700 focus:border-teal-800 focus:ring-2 focus:ring-teal-100' 
                  : 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'}`}
              required
            />
          </div>

          {!urlValid && (
            <div className="flex items-center gap-2 p-3 -md bg-red-50 text-red-600 border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <span>Please enter a valid GitHub repository URL</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 -md bg-red-50 text-red-600 border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-2 p-3 -md bg-green-50 text-green-600 border border-green-200">
              <Check className="h-4 w-4" />
              <span>Conversion completed successfully!</span>
            </div>
          )}

  

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!githubUrl || isLoading || !urlValid}
              className="flex-1 bg-teal-700 text-white -md p-4 flex items-center justify-center gap-2 
                disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 hover:bg-teal-800"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                'Convert to Angular 16'
              )}
            </button>

            {(status || error) && (
              <button
                type="button"
                onClick={handleReset}
                className="p-4 text-gray-500 hover:text-gray-700 -md border-2 border-gray-300 
                  hover:border-gray-400 transition-colors duration-300"
              >
                <XCircle />
              </button>
            )}
          </div>
        </form>

        {downloadReady && (
          <div className="mt-5">
            <button
              onClick={handleDownload}
              className="w-full bg-teal-800 text-white -md p-4 flex items-center justify-center 
                gap-2 hover:bg-teal-900 transition-colors duration-300"
            >
              <Download />
              <span>Download Converted Project</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AngularConverter;
