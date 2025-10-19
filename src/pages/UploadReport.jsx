import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileAPI, insightAPI } from '../utils/api';
import { Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadReport = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    fileType: 'blood_test',
    reportDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Show preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);

    try {
      // Upload file
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('fileType', formData.fileType);
      uploadFormData.append('reportDate', formData.reportDate);

      const uploadResponse = await fileAPI.upload(uploadFormData);
      const fileId = uploadResponse.data.data._id;

      toast.success('File uploaded successfully!');

      // Generate AI insight
      toast.loading('Generating AI analysis...', { id: 'ai-analysis' });
      await insightAPI.generate(fileId);
      toast.success('AI analysis complete!', { id: 'ai-analysis' });

      // Navigate to report view
      navigate(`/report/${fileId}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Upload Medical Report</h1>
            <p className="text-gray-600 mt-2">Apni medical report upload karein aur AI analysis hasil karein</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File (PDF or Image)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <img src={preview} alt="Preview" className="mx-auto h-32 w-auto mb-4" />
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                  {file && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                name="fileType"
                value={formData.fileType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="blood_test">Blood Test</option>
                <option value="xray">X-Ray</option>
                <option value="ultrasound">Ultrasound</option>
                <option value="prescription">Prescription</option>
                <option value="mri">MRI</option>
                <option value="ct_scan">CT Scan</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Report Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Date
              </label>
              <input
                type="date"
                name="reportDate"
                value={formData.reportDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading & Analyzing...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Upload Report</span>
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Gemini AI aapki report ko analyze karega aur simple Urdu + English mein explain karega. 
              Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;