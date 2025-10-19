    import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vitalsAPI } from '../utils/api';
import { Activity, Heart, Droplet, Weight, Thermometer } from 'lucide-react';
import toast from 'react-hot-toast';

const AddVitals = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    bloodPressure: {
      systolic: '',
      diastolic: ''
    },
    bloodSugar: {
      value: '',
      unit: 'mg/dL',
      testType: 'random'
    },
    weight: {
      value: '',
      unit: 'kg'
    },
    heartRate: '',
    temperature: {
      value: '',
      unit: 'celsius'
    },
    oxygenLevel: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Clean up empty values
    const cleanData = { date: formData.date };

    if (formData.bloodPressure.systolic && formData.bloodPressure.diastolic) {
      cleanData.bloodPressure = {
        systolic: Number(formData.bloodPressure.systolic),
        diastolic: Number(formData.bloodPressure.diastolic)
      };
    }

    if (formData.bloodSugar.value) {
      cleanData.bloodSugar = {
        value: Number(formData.bloodSugar.value),
        unit: formData.bloodSugar.unit,
        testType: formData.bloodSugar.testType
      };
    }

    if (formData.weight.value) {
      cleanData.weight = {
        value: Number(formData.weight.value),
        unit: formData.weight.unit
      };
    }

    if (formData.heartRate) {
      cleanData.heartRate = Number(formData.heartRate);
    }

    if (formData.temperature.value) {
      cleanData.temperature = {
        value: Number(formData.temperature.value),
        unit: formData.temperature.unit
      };
    }

    if (formData.oxygenLevel) {
      cleanData.oxygenLevel = Number(formData.oxygenLevel);
    }

    if (formData.notes) {
      cleanData.notes = formData.notes;
    }

    try {
      await vitalsAPI.add(cleanData);
      toast.success('Vitals added successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add vitals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Add Vitals</h1>
            <p className="text-gray-600 mt-2">Apne health vitals manually track karein</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Blood Pressure */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Heart className="w-5 h-5 text-red-500" />
                <h3 className="font-medium text-gray-900">Blood Pressure</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Systolic (Upper)</label>
                  <input
                    type="number"
                    name="bloodPressure.systolic"
                    value={formData.bloodPressure.systolic}
                    onChange={handleChange}
                    placeholder="120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Diastolic (Lower)</label>
                  <input
                    type="number"
                    name="bloodPressure.diastolic"
                    value={formData.bloodPressure.diastolic}
                    onChange={handleChange}
                    placeholder="80"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Blood Sugar */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Droplet className="w-5 h-5 text-blue-500" />
                <h3 className="font-medium text-gray-900">Blood Sugar</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Value</label>
                  <input
                    type="number"
                    name="bloodSugar.value"
                    value={formData.bloodSugar.value}
                    onChange={handleChange}
                    placeholder="95"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Unit</label>
                  <select
                    name="bloodSugar.unit"
                    value={formData.bloodSugar.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mg/dL">mg/dL</option>
                    <option value="mmol/L">mmol/L</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Test Type</label>
                  <select
                    name="bloodSugar.testType"
                    value={formData.bloodSugar.testType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fasting">Fasting</option>
                    <option value="random">Random</option>
                    <option value="post_meal">Post Meal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Weight */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Weight className="w-5 h-5 text-green-500" />
                <h3 className="font-medium text-gray-900">Weight</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Value</label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight.value"
                    value={formData.weight.value}
                    onChange={handleChange}
                    placeholder="70"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Unit</label>
                  <select
                    name="weight.unit"
                    value={formData.weight.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  placeholder="72"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature.value"
                  value={formData.temperature.value}
                  onChange={handleChange}
                  placeholder="98.6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oxygen Level (%)
                </label>
                <input
                  type="number"
                  name="oxygenLevel"
                  value={formData.oxygenLevel}
                  onChange={handleChange}
                  placeholder="98"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Koi aur information..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  <span>Save Vitals</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVitals;