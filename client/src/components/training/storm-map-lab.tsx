import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Cloud, Wind, Thermometer, Calendar, Info } from "lucide-react";

interface StormEvent {
  id: string;
  date: string;
  location: string;
  hailSize: string;
  windSpeed: string;
  temperature: string;
  severity: 'severe' | 'moderate' | 'light';
  affected: string;
}

const stormEvents: StormEvent[] = [
  {
    id: "1",
    date: "March 18th, 2024",
    location: "Charlotte Metro",
    hailSize: "1.5 inches",
    windSpeed: "65 mph",
    temperature: "78°F",
    severity: "severe",
    affected: "Downtown Charlotte, Uptown, South End"
  },
  {
    id: "2",
    date: "March 18th, 2024",
    location: "Concord Area",
    hailSize: "1.25 inches",
    windSpeed: "58 mph",
    temperature: "76°F",
    severity: "moderate",
    affected: "Concord Mills, Kannapolis"
  },
  {
    id: "3",
    date: "March 18th, 2024",
    location: "Gastonia Region",
    hailSize: "0.75 inches",
    windSpeed: "45 mph",
    temperature: "75°F",
    severity: "light",
    affected: "Downtown Gastonia, Belmont"
  }
];

const severityConfig = {
  severe: {
    color: "bg-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
    description: "High probability of roof damage"
  },
  moderate: {
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-800",
    description: "Possible damage, inspection recommended"
  },
  light: {
    color: "bg-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-800",
    description: "Minor impact, visual inspection"
  }
};

export default function StormMapLab() {
  const [selectedStorm, setSelectedStorm] = useState<StormEvent | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const handleMarkerClick = (stormId: string) => {
    const storm = stormEvents.find(s => s.id === stormId);
    setSelectedStorm(storm || null);
    setActiveMarker(stormId);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Storm Map Lab - HailTrace Demo</CardTitle>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Cloud className="h-3 w-3" />
            <span>Interactive</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="map">Storm Map</TabsTrigger>
            <TabsTrigger value="data">Weather Data</TabsTrigger>
            <TabsTrigger value="analysis">Damage Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            {/* Map Container */}
            <div className="relative bg-blue-50 rounded-lg p-6 h-80 overflow-hidden">
              {/* Background map illustration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg">
                {/* Simulated North Carolina outline */}
                <div className="absolute inset-4 border-2 border-gray-300 rounded-lg opacity-30"></div>
                
                {/* City labels */}
                <div className="absolute top-8 left-12 text-xs font-medium text-gray-600">Asheville</div>
                <div className="absolute top-12 right-16 text-xs font-medium text-gray-600">Raleigh</div>
                <div className="absolute bottom-16 left-20 text-xs font-medium text-gray-600">Charlotte</div>
                <div className="absolute bottom-20 right-12 text-xs font-medium text-gray-600">Wilmington</div>
              </div>

              {/* Storm markers */}
              {stormEvents.map((storm, index) => {
                const positions = [
                  { top: '45%', left: '25%' }, // Charlotte
                  { top: '40%', left: '35%' }, // Concord
                  { top: '50%', left: '15%' }  // Gastonia
                ];
                
                const position = positions[index];
                const config = severityConfig[storm.severity];
                
                return (
                  <div
                    key={storm.id}
                    className={`absolute w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 ${
                      activeMarker === storm.id ? 'scale-125 ring-2 ring-white' : ''
                    } ${config.color} ${
                      storm.severity === 'severe' ? 'animate-pulse' : ''
                    }`}
                    style={position}
                    onClick={() => handleMarkerClick(storm.id)}
                  />
                );
              })}
              
              {/* Storm info overlay */}
              {selectedStorm && (
                <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedStorm.date}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span>{selectedStorm.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Cloud className="h-3 w-3" />
                      <span>Hail: {selectedStorm.hailSize}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wind className="h-3 w-3" />
                      <span>Wind: {selectedStorm.windSpeed}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-3 w-3" />
                      <span>Temp: {selectedStorm.temperature}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(severityConfig).map(([severity, config]) => (
                <div key={severity} className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}>
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 ${config.color} rounded-full mr-2`}></div>
                    <span className={`font-medium ${config.textColor} capitalize`}>
                      {severity} {severity === 'severe' ? '(1.5"+)' : severity === 'moderate' ? '(1"-1.5")' : '(0.5"-1")'}
                    </span>
                  </div>
                  <p className={`text-sm ${config.textColor}`}>{config.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stormEvents.map((storm) => {
                const config = severityConfig[storm.severity];
                return (
                  <Card key={storm.id} className={`${config.borderColor} border-2`}>
                    <CardHeader className={config.bgColor}>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{storm.location}</CardTitle>
                        <Badge variant="outline" className={config.textColor}>
                          {storm.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center space-x-2 text-gray-600 mb-2">
                            <Calendar className="h-4 w-4" />
                            <span>Date & Time</span>
                          </div>
                          <p className="font-medium">{storm.date}</p>
                          <p className="text-gray-500">2:15 PM - 3:45 PM</p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 text-gray-600 mb-2">
                            <Cloud className="h-4 w-4" />
                            <span>Hail Size</span>
                          </div>
                          <p className="font-medium">{storm.hailSize}</p>
                          <p className="text-gray-500">Maximum recorded</p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 text-gray-600 mb-2">
                            <Wind className="h-4 w-4" />
                            <span>Wind Speed</span>
                          </div>
                          <p className="font-medium">{storm.windSpeed}</p>
                          <p className="text-gray-500">Peak gust</p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 text-gray-600 mb-2">
                            <Thermometer className="h-4 w-4" />
                            <span>Temperature</span>
                          </div>
                          <p className="font-medium">{storm.temperature}</p>
                          <p className="text-gray-500">At storm time</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium text-gray-900 mb-2">Affected Areas</h4>
                        <p className="text-sm text-gray-600">{storm.affected}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Damage Assessment Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Hail Size Impact</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                        <span className="font-medium text-red-800">1.5"+ (Golf Ball)</span>
                        <span className="text-sm text-red-600">Severe damage likely</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <span className="font-medium text-orange-800">1"-1.5" (Quarter)</span>
                        <span className="text-sm text-orange-600">Moderate damage possible</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <span className="font-medium text-yellow-800">0.5"-1" (Pea/Dime)</span>
                        <span className="text-sm text-yellow-600">Light damage possible</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Wind Speed Effects</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 border rounded-lg">
                        <div className="font-medium text-gray-900">60+ mph</div>
                        <div className="text-sm text-gray-600">Shingle lifting, debris impact</div>
                      </div>
                      <div className="p-3 bg-gray-50 border rounded-lg">
                        <div className="font-medium text-gray-900">45-60 mph</div>
                        <div className="text-sm text-gray-600">Edge damage, loose shingles</div>
                      </div>
                      <div className="p-3 bg-gray-50 border rounded-lg">
                        <div className="font-medium text-gray-900">30-45 mph</div>
                        <div className="text-sm text-gray-600">Minor impact, inspection needed</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Professional Assessment Required</h4>
                      <p className="text-sm text-blue-800">
                        While this map provides valuable data for initial assessment, always conduct 
                        a thorough in-person inspection to accurately determine roof damage. Use this 
                        information to prioritize your inspection schedule and set proper expectations 
                        with homeowners.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Call Script Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                  <p className="text-gray-700 leading-relaxed">
                    "Mrs. Douglas, I'm calling about the March 18th hail storm that hit your neighborhood. 
                    According to our weather tracking, your area in Charlotte received <strong>1.5-inch hail stones</strong> with 
                    <strong>65 mph winds</strong> around 2:30 PM. Many homes built before 2010 like yours experienced 
                    granule loss and potential structural damage. We've already helped 27 families on 
                    Amber Court with their insurance claims..."
                  </p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline">
                    Copy Script
                  </Button>
                  <Button size="sm" variant="outline">
                    Practice with Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
