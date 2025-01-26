import React, { useState } from 'react';
import { AlertCircle, Check, Download, Github, RefreshCw, XCircle } from 'lucide-react';

const RazorPagesAnalyser = () => {
  const [githubUrl, setGithubUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [downloadReady, setDownloadReady] = useState(false);

  const validateGithubUrl = (url) => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/([\w-]+)\/([\w.-]+)\/?$/;
    return githubRegex.test(url);
  };

  const handleUrlChange = (e) => {
    setGithubUrl(e.target.value);
    setError(null); // Clear any previous errors
  };

  const handleAnalyse = async (e) => {
    e.preventDefault();

    if (!githubUrl || !validateGithubUrl(githubUrl)) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    setIsLoading(true);
    setStatus(null);
    setError(null);
    setDownloadReady(false);

    try {
      const response = await fetch('http://localhost:5000/analyse', {
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
        throw new Error(data.message || 'Failed to analyze repository');
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
      a.download = 'Razor-Pages-Analysis.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download the analysis report');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-teal-50 to-gray-100 p-5 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-2xl mx-auto pb-12">
        <div className="mb-6 text-center">
          <h1 className="text-teal-700 text-2xl font-semibold">
            Razor Pages Analyser
          </h1>
          <p className="text-gray-600 mt-2">
            Analyse Razor Pages projects from GitHub repositories
          </p>
        </div>

        <form onSubmit={handleAnalyse} className="flex flex-col gap-5">
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
                ${
                  error
                    ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
                    : 'border-teal-700 focus:border-teal-800 focus:ring-2 focus:ring-teal-100'
                }`}
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 -md bg-red-50 text-red-600 border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-2 p-3 -md bg-green-50 text-green-600 border border-green-200">
              <Check className="h-4 w-4" />
              <span>Analysis completed successfully!</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!githubUrl || isLoading}
              className="flex-1 bg-teal-700 text-white -md p-4 flex items-center justify-center gap-2 
                disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 hover:bg-teal-800"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                'Analyze'
              )}
            </button>

            {status && (
              <button
                type="button"
                onClick={() => setGithubUrl('')}
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
              <span>Download Analysis Report</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RazorPagesAnalyser;
