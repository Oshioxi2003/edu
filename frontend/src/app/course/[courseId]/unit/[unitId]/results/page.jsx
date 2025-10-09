'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { quizAPI } from '@/lib/api';
import { Card, CardBody, Button, Badge, Skeleton } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Link from 'next/link';

export default function UnitResultsPage({ params }) {
  const { courseId, unitId } = use(params);

  const { data: results, isLoading } = useQuery({
    queryKey: ['unit-results', unitId],
    queryFn: async () => {
      const response = await quizAPI.getUnitResults(unitId);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Skeleton className="h-64 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </div>
    );
  }

  const latestResult = results?.[0];
  const chartData = results?.slice(0, 10).reverse().map((result, index) => ({
    name: `Lần ${results.length - index}`,
    score: result.score_pct,
    correct: result.correct_count,
  })) || [];

  const scoreDistribution = [
    { range: '0-20%', count: results?.filter(r => r.score_pct < 20).length || 0 },
    { range: '20-40%', count: results?.filter(r => r.score_pct >= 20 && r.score_pct < 40).length || 0 },
    { range: '40-60%', count: results?.filter(r => r.score_pct >= 40 && r.score_pct < 60).length || 0 },
    { range: '60-80%', count: results?.filter(r => r.score_pct >= 60 && r.score_pct < 80).length || 0 },
    { range: '80-100%', count: results?.filter(r => r.score_pct >= 80).length || 0 },
  ];

  const bestScore = Math.max(...(results?.map(r => r.score_pct) || [0]));
  const averageScore = results?.length 
    ? (results.reduce((sum, r) => sum + r.score_pct, 0) / results.length).toFixed(1)
    : 0;
  const totalAttempts = results?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link href={`/course/${courseId}`} className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-4 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại khóa học
          </Link>
          <h1 className="text-4xl font-bold mb-2">Kết quả học tập</h1>
          <p className="text-xl text-primary-100">Theo dõi tiến bộ và phân tích chi tiết</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-3xl font-bold text-primary mb-1">{bestScore}%</div>
              <div className="text-sm text-gray-600">Điểm cao nhất</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-3xl font-bold text-primary mb-1">{averageScore}%</div>
              <div className="text-sm text-gray-600">Điểm trung bình</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-3xl font-bold text-primary mb-1">{totalAttempts}</div>
              <div className="text-sm text-gray-600">Lần làm bài</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="text-4xl mb-2">
                {latestResult?.score_pct >= 80 ? '🎉' : latestResult?.score_pct >= 60 ? '👍' : '💪'}
              </div>
              <div className="text-3xl font-bold text-primary mb-1">{latestResult?.score_pct || 0}%</div>
              <div className="text-sm text-gray-600">Lần gần nhất</div>
            </CardBody>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Over Time */}
          <Card>
            <CardBody>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tiến bộ theo thời gian</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Điểm']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#003A70" 
                    strokeWidth={3}
                    dot={{ fill: '#003A70', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Score Distribution */}
          <Card>
            <CardBody>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Phân bổ điểm số</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}`, 'Số lần']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="count" fill="#FFD700" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Detailed History */}
        <Card>
          <CardBody>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Lịch sử làm bài</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lần thứ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày làm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Điểm số
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đúng/Tổng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results?.map((result, index) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{results.length - index}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.created_at).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-primary">{result.score_pct}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.correct_count}/{result.total_questions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={
                          result.score_pct >= 80 ? 'success' : 
                          result.score_pct >= 60 ? 'warning' : 
                          'error'
                        }>
                          {result.score_pct >= 80 ? 'Xuất sắc' : 
                           result.score_pct >= 60 ? 'Khá' : 
                           'Cần cải thiện'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {results?.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Chưa có kết quả
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Bắt đầu làm bài để xem kết quả của bạn
                  </p>
                  <Link href={`/course/${courseId}/unit/${unitId}`}>
                    <Button variant="primary">
                      Bắt đầu làm bài
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center mt-8">
          <Link href={`/course/${courseId}/unit/${unitId}`}>
            <Button variant="primary" size="lg">
              Làm bài lại
            </Button>
          </Link>
          <Link href={`/course/${courseId}`}>
            <Button variant="outline" size="lg">
              Về danh sách Units
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

