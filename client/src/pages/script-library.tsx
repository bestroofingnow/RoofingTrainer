import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Search, Play, Copy, Volume2 } from "lucide-react";

const mockScripts = [
  {
    id: 1,
    title: "Post-Storm Same-Day Script",
    category: "post_storm",
    content: `Hi, may I speak with __? (pause)
__, I'm <NAME> calling from Best Roofing Now on a quick safety check.
The hail storm that rolled through [CITY] around 2 p.m. dropped stones the size of quarters.
We're offering complimentary, no-contact roof scans with drone photos so you can see exactly what happened up there.
I have two inspection slots open—tomorrow at 6 p.m. or Saturday at 9 a.m. Which is better for you?

Compliance Statement (if asked): We're licensed, insured, and never ask you to sign anything until you've seen clear evidence of damage—promise.`,
    tags: ["urgent", "storm", "compliance"],
    audioUrl: null
  },
  {
    id: 2,
    title: "Annual Roof-Wellness Call (Retail)",
    category: "annual_wellness",
    content: `Your roof just turned 13 this spring—national data shows shingles that age develop sealing fatigue in NC's humidity.
Our 21-point wellness check catches issues before they cost thousands in interior leaks.
Appointment includes free gutter flow test and photo report.

Objection-Bypass: "I'm not seeing leaks." — Absolutely. Most leaks hide 6-12 months before they drip indoors; that's why the check is preventative.`,
    tags: ["preventative", "retail", "wellness"],
    audioUrl: null
  },
  {
    id: 3,
    title: "Insurance-Assistance Call",
    category: "insurance_assistance",
    content: `Many carriers now require photo evidence within 365 days—after that, coverage can lapse.
We document damage in the carrier-approved Xactimate format, so adjusters rarely need second trips.
We can't—and won't—waive deductibles, but 90% of our NC clients pay only that amount for full replacement.`,
    tags: ["insurance", "documentation", "compliance"],
    audioUrl: null
  },
  {
    id: 4,
    title: "Gatekeeper Script (Spouse / Adult Child)",
    category: "gatekeepers",
    content: `I understand Mr. Lee makes the maintenance decisions. Could you help me schedule a brief inspection window so he has accurate photos to review? I'll copy you both on the report.`,
    tags: ["gatekeeper", "family", "decision-maker"],
    audioUrl: null
  },
  {
    id: 5,
    title: "Voicemail Template",
    category: "voicemail",
    content: `Hi __, this is <NAME> with Best Roofing Now.
I'm calling about yesterday's hail on Ridge Rd—roofs there took up to 1¼-inch impact.
I'll email a before-and-after satellite photo so you can decide if a no-cost scan makes sense.
Call or text 704-555-0123. Again, 704-555-0123.
Stay safe!`,
    tags: ["voicemail", "follow-up", "contact"],
    audioUrl: null
  }
];

const objectionResponses = [
  {
    objection: "We already had someone look.",
    response: "Great—what did they find? I often provide a second opinion and catch items missed, especially on ventilation—which insurers require but many roofers skip."
  },
  {
    objection: "I'm not filing a claim; rates will skyrocket.",
    response: "NC carriers can't increase premiums for a single act-of-God claim. Long-term, ignoring hidden damage creates out-of-pocket costs that aren't insurable."
  },
  {
    objection: "No money for a roof.",
    response: "If it's storm-related, your policy—not your wallet—funds the work, minus the deductible. For retail upgrades we partner with Service Finance—$0 down."
  },
  {
    objection: "Send something in writing.",
    response: "Absolutely—expect an email with my license, BBB link, and a one-page inspection overview in the next 5 minutes. May I confirm your address?"
  }
];

export default function ScriptLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data: scripts = mockScripts } = useQuery({
    queryKey: ["/api/scripts", selectedCategory !== "all" ? selectedCategory : undefined],
  });

  const filteredScripts = scripts.filter(script =>
    script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    script.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    script.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = [
    { value: "all", label: "All Scripts" },
    { value: "post_storm", label: "Post-Storm" },
    { value: "annual_wellness", label: "Annual Wellness" },
    { value: "insurance_assistance", label: "Insurance Assistance" },
    { value: "gatekeepers", label: "Gatekeepers" },
    { value: "voicemail", label: "Voicemail" }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Script Library</h1>
              <p className="text-gray-600 mt-2">
                Professional cold calling scripts and objection handling responses
              </p>
            </div>

            <Tabs defaultValue="scripts" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scripts">Call Scripts</TabsTrigger>
                <TabsTrigger value="objections">Objection Handling</TabsTrigger>
              </TabsList>

              <TabsContent value="scripts" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search scripts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="w-full sm:w-48">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Scripts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredScripts.map((script) => (
                    <Card key={script.id} className="h-fit">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{script.title}</CardTitle>
                            <CardDescription className="capitalize">
                              {script.category.replace('_', ' ')}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">
                            {script.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4 text-sm font-mono whitespace-pre-line">
                            {script.content}
                          </div>
                          
                          {script.tags && (
                            <div className="flex flex-wrap gap-2">
                              {script.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center pt-2">
                            <div className="flex space-x-2">
                              {script.audioUrl && (
                                <Button size="sm" variant="outline">
                                  <Volume2 className="h-4 w-4 mr-2" />
                                  Listen
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Play className="h-4 w-4 mr-2" />
                                Practice
                              </Button>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => copyToClipboard(script.content)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredScripts.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <Search className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No scripts found</h3>
                      <p className="text-gray-600">
                        Try adjusting your search terms or category filter.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="objections" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Common Objections & Responses</CardTitle>
                    <CardDescription>
                      Master these proven responses to handle the most common objections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {objectionResponses.map((item, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                          <div className="mb-3">
                            <h4 className="font-semibold text-red-600 mb-2">
                              Objection: "{item.objection}"
                            </h4>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <p className="text-green-800 font-medium">Response:</p>
                              <p className="text-green-700 mt-2">"{item.response}"</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Play className="h-4 w-4 mr-2" />
                                Practice
                              </Button>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => copyToClipboard(item.response)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Response
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Practice Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Objection Handling Practice</CardTitle>
                    <CardDescription>
                      Test your skills with randomized objection scenarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <p className="text-gray-600">
                        Practice responding to random objections to improve your confidence and timing.
                      </p>
                      <Button size="lg" className="training-gradient text-white">
                        <Play className="h-5 w-5 mr-2" />
                        Start Objection Practice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
