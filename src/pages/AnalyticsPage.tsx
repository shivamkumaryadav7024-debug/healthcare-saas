import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { initializeMockData } from '../store/patientSlice';
import { FiDollarSign, FiUsers, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import Card from '../components/Card';
import Loading from '../components/Loading';

interface ChartData {
  month: string;
  appointments: number;
  revenue: number;
}

const AnalyticsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { patients } = useAppSelector((state) => state.patient);
  const [loading, setLoading] = useState(true);
  const [chartData] = useState<ChartData[]>([
    { month: 'Jan', appointments: 245, revenue: 15000 },
    { month: 'Feb', appointments: 289, revenue: 18500 },
    { month: 'Mar', appointments: 267, revenue: 17000 },
    { month: 'Apr', appointments: 312, revenue: 20000 },
    { month: 'May', appointments: 298, revenue: 19000 },
    { month: 'Jun', appointments: 335, revenue: 21500 },
  ]);

  useEffect(() => {
    dispatch(initializeMockData());
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return <Loading message="Loading analytics..." />;
  }

  const activePatients = patients.filter((p) => p.status === 'Active').length;
  const malePatients = patients.filter((p) => p.gender === 'Male').length;
  const femalePatients = patients.filter((p) => p.gender === 'Female').length;
  const totalRevenue = 126500;
  const avgRevenuePerPatient = (totalRevenue / patients.length).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Analytics
          </h1>
          <p className="text-gray-600">Healthcare Platform Insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={<FiDollarSign size={28} className="text-green-600" />}
          />
          <Card
            title="Active Patients"
            value={activePatients}
            icon={<FiUsers size={28} className="text-blue-600" />}
          />
          <Card
            title="Avg Revenue/Patient"
            value={`$${avgRevenuePerPatient}`}
            icon={<FiTrendingUp size={28} className="text-purple-600" />}
          />
          <Card
            title="Total Appointments"
            value={patients.length * 8}
            icon={<FiCalendar size={28} className="text-orange-600" />}
          />
        </div>

        {/* Gender Distribution and Department Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gender Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Patient Gender Distribution
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Male</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {malePatients} ({((malePatients / patients.length) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(malePatients / patients.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Female</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {femalePatients} ({((femalePatients / patients.length) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-pink-500 h-2 rounded-full"
                    style={{
                      width: `${(femalePatients / patients.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Monthly Appointments Trend
            </h2>
            <div className="space-y-3">
              {chartData.map((data) => (
                <div key={data.month}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">
                      {data.month}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {data.appointments}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{
                        width: `${(data.appointments / 350) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Department Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Patients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Cardiology
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    45
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    $28,500
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      +12%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Orthopedics
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    38
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    $24,000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      +8%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Neurology
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    32
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    $20,800
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      +5%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Pediatrics
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    28
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    $18,200
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      +15%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
