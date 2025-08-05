import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Phone, TrendingUp, Users, Video, BookOpen } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-primary text-white px-3 py-1 rounded font-bold text-lg">
                BRN
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">Best Roofing Now</h1>
              </div>
            </div>
            <Button onClick={() => window.location.href = "/api/login"}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Cold Calling for
            <span className="training-gradient bg-clip-text text-transparent"> Roofing Success</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive 5-day training program with interactive modules, real-world simulations, 
            and performance tracking to transform your cold calling skills.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-3"
            onClick={() => window.location.href = "/api/login"}
          >
            Start Training Program
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Complete Training Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Video className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Interactive Video Training</CardTitle>
                <CardDescription>
                  CEO welcome message, expert instruction, and micro-lessons with real-world examples
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Call Simulation & Practice</CardTitle>
                <CardDescription>
                  Record practice calls, get scored feedback, and master the 6R framework
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Comprehensive Script Library</CardTitle>
                <CardDescription>
                  Post-storm scripts, objection handling, and compliance-focused templates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Track KPIs, quiz scores, and progress with detailed performance metrics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Gamified Learning</CardTitle>
                <CardDescription>
                  Leaderboards, achievements, and competitive elements to drive engagement
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Certification Program</CardTitle>
                <CardDescription>
                  80% written exam, 70% live-call scoring for official certification
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Training Curriculum */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            5-Day Training Curriculum
          </h2>
          <div className="space-y-6">
            {[
              {
                day: 1,
                title: "Welcome & Roofing Basics",
                description: "CEO welcome, company mission, roofing fundamentals, virtual attic walkthrough",
                modules: ["Mission & Values", "Roofing Basics Lightning Round", "Virtual Attic Tour"]
              },
              {
                day: 2,
                title: "Insurance & Regulations",
                description: "Insurance 101, NC claim regulations, storm damage identification",
                modules: ["Insurance Fundamentals", "Storm Map Lab", "Damage Vocabulary"]
              },
              {
                day: 3,
                title: "Scripts & Psychology",
                description: "Cold calling psychology, script development, compliance training",
                modules: ["TCPA & DNC Compliance", "Call Psychology", "Script Hack-a-thon"]
              },
              {
                day: 4,
                title: "Objection Handling",
                description: "Objection handling techniques, CRM training, live call analysis",
                modules: ["Objection Dojo", "CRM Mastery", "Live Call Review"]
              },
              {
                day: 5,
                title: "Ethics & Certification",
                description: "Ethics training, KPI understanding, final certification exam",
                modules: ["Ethics & Fraud Prevention", "KPI Math", "Certification Exam"]
              }
            ].map((day) => (
              <Card key={day.day} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Day {day.day}: {day.title}</CardTitle>
                      <CardDescription className="text-lg">{day.description}</CardDescription>
                    </div>
                    <div className="text-3xl font-bold text-primary/20">
                      {day.day}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {day.modules.map((module, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 training-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Cold Calling Skills?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of successful appointment setters who have completed our certification program.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-3"
            onClick={() => window.location.href = "/api/login"}
          >
            Start Your Training Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary text-white px-3 py-1 rounded font-bold text-lg mr-4">
              BRN
            </div>
            <span className="text-lg font-semibold">Best Roofing Now Training</span>
          </div>
          <p className="text-gray-400">
            Professional cold calling training for the roofing industry
          </p>
        </div>
      </footer>
    </div>
  );
}
