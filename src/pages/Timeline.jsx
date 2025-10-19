import { useState, useEffect } from 'react';
import { fileAPI, vitalsAPI } from '../utils/api';
import { FileText, Activity, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Timeline = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'reports', 'vitals'

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const [filesResponse, vitalsResponse] = await Promise.all([
        fileAPI.getAll(),
        vitalsAPI.getAll()
      ]);

      // Combine and sort by date
      const combined = [
        ...filesResponse.data.data.map(item => ({
          ...item,
          type: 'report',
          date: item.reportDate
        })),
        ...vitalsResponse.data.data.map(item => ({
          ...item,
          type: 'vital',
          date: item.date
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setTimeline(combined);
    } catch (error) {
      toast.error('Failed to fetch timeline');
    } finally {
      setLoading(false);
    }
  };

  const filteredTimeline = timeline.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'reports') return item.type === 'report';
    if (filter === 'vitals') return item.type === 'vital';
    return true;
  });

  // Group by month
  const groupedTimeline = filteredTimeline.reduce((acc, item) => {
    const date = new Date(item.date);
    const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Health Timeline</h1>
          <p className="text-gray-600 mt-2">Apni puri health history chronological order mein</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('reports')}
              className={`px-4 py-2 rounded-md ${
                filter === 'reports'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Reports Only
            </button>
            <button
              onClick={() => setFilter('vitals')}
              className={`px-4 py-2 rounded-md ${
                filter === 'vitals'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Vitals Only
            </button>
          </div>
        </div>

        {/* Timeline */}
        {Object.keys(groupedTimeline).length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No records found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTimeline).map(([monthYear, items]) => (
              <div key={monthYear}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{monthYear}</h2>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={`${item.type}-${item._id}-${index}`}>
                      {item.type === 'report' ? (
                        <Link
                          to={`/report/${item._id}`}
                          className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                              <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">{item.fileName}</h3>
                                <span className="text-sm text-gray-500">
                                  {new Date(item.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Type: {item.fileType.replace('_', ' ').toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="bg-white rounded-lg shadow p-6">
                          <div className="flex items-start space-x-4">
                            <div className="bg-green-100 p-3 rounded-full">
                              <Activity className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Vitals Record</h3>
                                <span className="text-sm text-gray-500">
                                  {new Date(item.date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                                {item.bloodPressure && (
                                  <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full">
                                    BP: {item.bloodPressure.systolic}/{item.bloodPressure.diastolic}
                                  </span>
                                )}
                                {item.bloodSugar && (
                                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                    Sugar: {item.bloodSugar.value} {item.bloodSugar.unit}
                                  </span>
                                )}
                                {item.weight && (
                                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                                    Weight: {item.weight.value} {item.weight.unit}
                                  </span>
                                )}
                                {item.heartRate && (
                                  <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                                    HR: {item.heartRate} bpm
                                  </span>
                                )}
                              </div>
                              {item.notes && (
                                <p className="mt-2 text-sm text-gray-600 italic">
                                  Note: {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
