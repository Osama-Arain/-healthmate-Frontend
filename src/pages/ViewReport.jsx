import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fileAPI, insightAPI } from '../utils/api';
import { 
  FileText, ArrowLeft, Download, Trash2, AlertCircle, 
  CheckCircle, XCircle, Apple, Home 
} from 'lucide-react';
import toast from 'react-hot-toast';

const ViewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english'); // 'english' or 'urdu'

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [fileResponse, insightResponse] = await Promise.all([
        fileAPI.getOne(id),
        insightAPI.getByFile(id)
      ]);
      setFile(fileResponse.data.data);
      setInsight(insightResponse.data.data);
} catch (error) {
toast.error('Failed to fetch report');
} finally {
setLoading(false);
}
};const handleDelete = async () => {
if (window.confirm('Are you sure you want to delete this report?')) {
try {
await fileAPI.delete(id);
toast.success('Report deleted successfully');
navigate('/dashboard');
} catch (error) {
toast.error('Failed to delete report');
}
}
};if (loading) {
return (
<div className="min-h-screen flex items-center justify-center">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
</div>
);
}if (!file) {
return (
<div className="min-h-screen flex items-center justify-center">
<div className="text-center">
<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
<p className="text-xl text-gray-600">Report not found</p>
</div>
</div>
);
}const getSeverityColor = (severity) => {
switch (severity) {
case 'critical': return 'text-red-600 bg-red-100';
case 'high': return 'text-orange-600 bg-orange-100';
case 'low': return 'text-yellow-600 bg-yellow-100';
default: return 'text-gray-600 bg-gray-100';
}
};return (
<div className="min-h-screen bg-gray-50 py-8">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
{/* Header */}
<div className="mb-6 flex items-center justify-between">
<button
onClick={() => navigate('/dashboard')}
className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
>
<ArrowLeft className="w-5 h-5" />
<span>Back to Dashboard</span>
</button>
<div className="flex space-x-2">          href={file.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
       <a >
          <Download className="w-5 h-5" />
          <span>Download</span>
        </a>
        <button
          onClick={handleDelete}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          <Trash2 className="w-5 h-5" />
          <span>Delete</span>
        </button>
      </div>
    </div>    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* File Preview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Preview</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">File Name</p>
            <p className="font-medium text-gray-900">{file.fileName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Report Type</p>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {file.fileType.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Report Date</p>
            <p className="font-medium text-gray-900">
              {new Date(file.reportDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Uploaded On</p>
            <p className="font-medium text-gray-900">
              {new Date(file.uploadedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>        {/* File Display */}
        <div className="mt-6">
          {file.mimeType === 'application/pdf' ? (
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">PDF Document</p>                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              <a>
                Open in new tab
              </a>
            </div>
          ) : (
            <img
              src={file.fileUrl}
              alt="Report"
              className="w-full rounded-lg border border-gray-300"
            />
          )}
        </div>
      </div>      {/* AI Analysis */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">AI Analysis</h2>
          {/* Language Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setLanguage('english')}
              className={`px-4 py-2 rounded-md ${
                language === 'english'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('urdu')}
              className={`px-4 py-2 rounded-md ${
                language === 'urdu'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              اردو
            </button>
          </div>
        </div>        {!insight ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
            <p className="text-gray-600">No AI analysis available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {language === 'english' 
                    ? insight.summary.english 
                    : insight.summary.romanUrdu}
                </p>
              </div>
            </div>            {/* Abnormal Values */}
            {insight.abnormalValues && insight.abnormalValues.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                  Abnormal Values
                </h3>
                <div className="space-y-3">
                  {insight.abnormalValues.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${getSeverityColor(item.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{item.parameter}</p>
                          <p className="text-sm mt-1">
                            Your Value: <strong>{item.value}</strong>
                          </p>
                          <p className="text-sm">
                            Normal Range: {item.normalRange}
                          </p>
                        </div>
                        {item.severity === 'critical' ? (
                          <XCircle className="w-6 h-6" />
                        ) : (
                          <AlertCircle className="w-6 h-6" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}            {/* Doctor Questions */}
            {insight.doctorQuestions && insight.doctorQuestions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Questions to Ask Your Doctor
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {insight.doctorQuestions.map((question, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}            {/* Food Recommendations */}
            {insight.foodRecommendations && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <Apple className="w-5 h-5 mr-2 text-green-500" />
                  Food Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Foods to Avoid */}
                  {insight.foodRecommendations.avoid && 
                   insight.foodRecommendations.avoid.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-medium text-red-900 mb-2">❌ Avoid</h4>
                      <ul className="space-y-1 text-sm text-red-800">
                        {insight.foodRecommendations.avoid.map((food, index) => (
                          <li key={index}>• {food}</li>
                        ))}
                      </ul>
                    </div>
                  )}                  {/* Recommended Foods */}
                  {insight.foodRecommendations.recommended && 
                   insight.foodRecommendations.recommended.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">✅ Recommended</h4>
                      <ul className="space-y-1 text-sm text-green-800">
                        {insight.foodRecommendations.recommended.map((food, index) => (
                          <li key={index}>• {food}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}            {/* Home Remedies */}
            {insight.homeRemedies && insight.homeRemedies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <Home className="w-5 h-5 mr-2 text-purple-500" />
                  Home Remedies
                </h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {insight.homeRemedies.map((remedy, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span className="text-gray-700">{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important:</strong> {insight.disclaimer}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
);
};export default ViewReport;
    