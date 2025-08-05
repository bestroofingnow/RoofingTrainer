import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { TrendingUp, TrendingDown, Phone, Users, Target, Award, Calendar } from "lucide-react";

interface KpiData {
  date: string;
  dailyDials: number;
  contactRate: number;
  inspectionsSet: number;
  inspectionToDealRate: number;
}

interface KpiDashboardProps {
  data: KpiData[];
  timeRange: string;
}

export default function KpiDashboard({ data, timeRange }: KpiDashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState("dailyDials");

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Target className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Performance Data</h3>
          <p className="text-gray-600">Start making calls to see your KPI metrics here.</p>
        </CardContent>
      </Card>
    );
  }

  const latest = data[0];
  const previous = data[1];

  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return { trend: "neutral", change: 0 };
    const change = ((current - previous) / previous) * 100;
    return {
      trend: change > 0 ? "up" : change < 0 ? "down" : "neutral",
      change: Math.abs(change)
    };
  };

  const metrics = [
    {
      key: "dailyDials",
      title: "Daily Dials",
      value: latest.dailyDials,
      target: 120,
      icon: Phone,
      format: (val: number) => val.toString(),
      color: "blue"
    },
    {
      key: "contactRate",
      title: "Contact Rate",
      value: latest.contactRate,
      target: 18,
      icon: Users,
      format: (val: number) => `${val.toFixed(1)}%`,
      color: "green"
    },
    {
      key: "inspectionsSet",
      title: "Inspections Set",
      value: latest.inspectionsSet,
      target: 6,
      icon: Target,
      format: (val: number) => val.toString(),
      color: "purple"
    },
    {
      key: "inspectionToDealRate",
      title: "Inspection-to-Deal",
      value: latest.inspectionToDealRate,
      target: 35,
      icon: Award,
      format: (val: number) => `${val.toFixed(1)}%`,
      color: "orange"
    }
  ];

  const getStatusColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return "green";
    if (percentage >= 80) return "yellow";
    return "red";
  };

  const getStatusBadge = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return { variant: "default" as const, text: "On Target" };
    if (percentage >= 80) return { variant: "secondary" as const, text: "Close" };
    return { variant: "destructive" as const, text: "Below Target" };
  };

  // Generate chart data points for the selected metric
  const chartData = data.slice(0, 7).reverse(); // Last 7 data points
  const selectedMetricData = metrics.find(m => m.key === selectedMetric);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const trend = calculateTrend(metric.value, previous?.[metric.key as keyof KpiData] || 0);
          const status = getStatusBadge(metric.value, metric.target);
          
          return (
            <Card key={metric.key} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <metric.icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">{metric.title}</span>
                  </div>
                  <Badge {...status}>{status.text}</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.format(metric.value)}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Target: {metric.format(metric.target)}
                    </span>
                    
                    {trend.change > 0 && (
                      <div className={`flex items-center space-x-1 ${
                        trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trend.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{trend.change.toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all ${
                        getStatusColor(metric.value, metric.target) === 'green' ? 'bg-green-500' :
                        getStatusColor(metric.value, metric.target) === 'yellow' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min((metric.value / metric.target) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Trends</CardTitle>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric.key} value={metric.key}>
                    {metric.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {selectedMetricData && (
            <div className="space-y-4">
              {/* Simple bar chart representation */}
              <div className="flex items-end justify-between h-40 bg-gray-50 rounded-lg p-4">
                {chartData.map((point, index) => {
                  const value = point[selectedMetric as keyof KpiData] as number;
                  const maxValue = Math.max(...chartData.map(p => p[selectedMetric as keyof KpiData] as number));
                  const height = (value / maxValue) * 120; // Max height of 120px
                  
                  return (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div 
                        className="bg-primary rounded-t w-8 transition-all hover:bg-primary/80"
                        style={{ height: `${Math.max(height, 4)}px` }}
                      />
                      <div className="text-xs text-gray-500 text-center">
                        {new Date(point.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-xs font-medium">
                        {selectedMetricData.format(value)}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Chart legend and info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span className="text-gray-600">{selectedMetricData.title}</span>
                  </div>
                  <div className="text-gray-500">
                    Target: {selectedMetricData.format(selectedMetricData.target)}
                  </div>
                </div>
                <div className="text-gray-500">
                  Last {Math.min(chartData.length, 7)} days
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Dials</span>
                <span className="font-semibold">
                  {data.slice(0, 7).reduce((sum, d) => sum + d.dailyDials, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Contact Rate</span>
                <span className="font-semibold">
                  {(data.slice(0, 7).reduce((sum, d) => sum + d.contactRate, 0) / Math.min(data.length, 7)).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Inspections</span>
                <span className="font-semibold">
                  {data.slice(0, 7).reduce((sum, d) => sum + d.inspectionsSet, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Conversion</span>
                <span className="font-semibold">
                  {(data.slice(0, 7).reduce((sum, d) => sum + d.inspectionToDealRate, 0) / Math.min(data.length, 7)).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-800">Green Zone</span>
                </div>
                <div className="text-sm text-green-700">
                  ≥120 dials, ≥18% contact, ≥6 inspections, ≥35% conversion
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-yellow-800">Yellow Zone</span>
                </div>
                <div className="text-sm text-yellow-700">
                  80-119 dials, 12-17% contact, 3-5 inspections, 25-34% conversion
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-red-800">Red Zone</span>
                </div>
                <div className="text-sm text-red-700">
                  &lt;80 dials, &lt;12% contact, &lt;3 inspections, &lt;25% conversion
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
