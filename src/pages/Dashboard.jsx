    import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fileAPI, vitalsAPI } from '../utils/api';
import { FileText, Activity, Upload, Plus, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [filesResponse, vitalsResponse] = await Promise.all([
        fileAPI.getAll(),
        vitalsAPI.getAll()
      ]);
      setFiles(filesResponse.data.data);
      setVitals(vitalsResponse.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Apni sehat ka pura record yahan dekhen</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900">{files.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Vitals Recorded</p>
                <p className="text-3xl font-bold text-gray-900">{vitals.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Health Score</p>
                <p className="text-3xl font-bold text-gray-900">85%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/upload"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Upload className="w-12 h-12" />
              <div>
                <h3 className="text-xl font-bold">Upload Report</h3>
                <p className="text-blue-100">Nayi medical report upload karein</p>
              </div>
            </div>
          </Link>

          <Link
            to="/add-vitals"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Plus className="w-12 h-12" />
              <div>
                <h3 className="text-xl font-bold">Add Vitals</h3>
                <p className="text-green-100">BP, Sugar, Weight track karein</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Reports</h2>
          </div>
          <div className="p-6">
            {files.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Koi report nahi hai. Pehli report upload karein!
              </p>
            ) : (
              <div className="space-y-4">
                {files.slice(0, 5).map((file) => (
                  <Link
                    key={file._id}
                    to={`/report/${file._id}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="w-10 h-10 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{file.fileName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(file.reportDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {file.fileType.replace('_', ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Vitals */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Vitals</h2>
          </div>
          <div className="p-6">
            {vitals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Koi vitals nahi hain. Pehla record add karein!
              </p>
            ) : (
              <div className="space-y-4">
                {vitals.slice(0, 5).map((vital) => (
                  <div
                    key={vital._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(vital.date).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                        {vital.bloodPressure && (
                          <span>BP: {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}</span>
                        )}
                        {vital.bloodSugar && (
                          <span>Sugar: {vital.bloodSugar.value} {vital.bloodSugar.unit}</span>
                        )}
                        {vital.weight && (
                          <span>Weight: {vital.weight.value} {vital.weight.unit}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;