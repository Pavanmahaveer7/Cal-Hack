import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles, Mic, TrendingUp, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Mission = () => {
  const values = [
    {
      icon: Heart,
      title: "Accessibility First",
      description: "We believe education should be available to everyone, regardless of ability.",
      details: [
        "WCAG 2.1 AAA compliance ensures the highest accessibility standards",
        "Every feature designed with screen readers and voice navigation in mind",
        "Continuous testing with blind and visually impaired users",
        "Committed to removing barriers in educational technology",
      ],
    },
    {
      icon: Sparkles,
      title: "AI Innovation",
      description: "Leveraging cutting-edge AI to transform any content into accessible learning materials.",
      details: [
        "Advanced natural language processing for content analysis",
        "Intelligent flashcard generation from complex documents",
        "Adaptive learning algorithms that personalize the experience",
        "Continuous improvement through machine learning",
      ],
    },
    {
      icon: Mic,
      title: "Voice Empowerment",
      description: "Making learning natural and hands-free through advanced voice technology.",
      details: [
        "State-of-the-art speech recognition for seamless interaction",
        "Natural-sounding text-to-speech across all content",
        "Voice commands for intuitive navigation",
        "Scheduled phone calls for convenient learning access",
      ],
    },
    {
      icon: TrendingUp,
      title: "Student Success",
      description: "Measuring our success by the achievements of the students we serve.",
      details: [
        "Comprehensive progress tracking and analytics",
        "Adaptive testing to challenge and support learners",
        "Real-time feedback for continuous improvement",
        "Celebrating every milestone and achievement",
      ],
    },
    {
      icon: RefreshCw,
      title: "Continuous Improvement",
      description: "Always listening, learning, and adapting to serve our community better.",
      details: [
        "Regular user feedback sessions with students and educators",
        "Rapid iteration based on real-world usage",
        "Transparent development roadmap",
        "Community-driven feature prioritization",
      ],
    },
  ];

  const stats = [
    { value: "10,000+", label: "Flashcards Generated" },
    { value: "500+", label: "Students Empowered" },
    { value: "25,000+", label: "Learning Sessions" },
    { value: "15%", label: "Avg Test Score Improvement" },
  ];

  return (
    <div className="min-h-screen py-12">
      <main id="main-content" className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <Badge variant="secondary" className="mb-4">
            <Heart className="mr-2 h-4 w-4" />
            Our Mission
          </Badge>
          <h1 className="mb-6 text-5xl font-bold text-foreground md:text-6xl animate-fade-in-up">
            Empowering Through <span className="text-primary">Accessible</span> Education
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            We're on a mission to make education accessible to everyone through AI-driven, 
            voice-enabled technology. Every student deserves the opportunity to learn, grow, 
            and succeed—regardless of their abilities.
          </p>
        </section>

        {/* Origin Story */}
        <section className="mb-20">
          <Card className="overflow-hidden border-primary/20">
            <CardContent className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5">
              <h2 className="mb-6 text-3xl font-bold text-foreground text-center">How It All Began</h2>
              <div className="space-y-4 text-lg text-foreground/80 leading-relaxed">
                <p>
                  The journey of Braillience started with a discovery. <strong className="text-foreground">Arnav</strong>, 
                  while researching accessibility in education, came across a groundbreaking ACM paper 
                  that explored the challenges faced by Braille language learners in the digital age.
                </p>
                <p>
                  The paper revealed a stark reality: while technology had revolutionized education for 
                  most students, those who relied on Braille were being left behind. Traditional learning 
                  materials weren't easily convertible, and existing solutions were often expensive, 
                  cumbersome, or simply inaccessible.
                </p>
                <p>
                  Inspired by this research, Arnav brought an idea to the team: what if we could use 
                  artificial intelligence to bridge this gap? What if we could create a platform that 
                  automatically transforms any educational content into an accessible, voice-guided 
                  learning experience?
                </p>
                <p>
                  The team—<strong className="text-foreground">Bilal, Pavan, Arnav, and Ragav</strong>—immediately 
                  saw the potential. Together, we began building Braillience: a platform that combines 
                  AI-powered content generation, voice technology, and accessible design to empower 
                  blind students with the same educational opportunities as their sighted peers.
                </p>
                <p className="text-primary font-semibold">
                  From an academic paper to a working platform, Braillience represents our commitment 
                  to turning research into real-world impact.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Impact Stats */}
        <section className="mb-20" aria-labelledby="impact-heading">
          <h2 id="impact-heading" className="sr-only">Our Impact</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardContent className="p-6">
                  <div className="mb-2 text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-20" aria-labelledby="values-heading">
          <div className="mb-12 text-center">
            <h2 id="values-heading" className="mb-4 text-4xl font-bold text-foreground">
              Our Core Values
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              These principles guide everything we do at Braillience
            </p>
          </div>

          <div className="space-y-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="overflow-hidden hover-lift">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:w-48">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                          <Icon className="h-10 w-10 text-primary" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="flex-1 p-6 md:p-8">
                        <h3 className="mb-2 text-2xl font-semibold text-foreground">{value.title}</h3>
                        <p className="mb-4 text-lg text-muted-foreground">{value.description}</p>
                        <ul className="space-y-2">
                          {value.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                              <span className="text-foreground/80">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Vision Statement */}
        <section className="rounded-2xl bg-gradient-to-r from-primary to-accent p-12 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Our Vision for the Future</h2>
          <p className="mx-auto max-w-3xl text-lg text-white/90">
            We envision a world where every educational resource is automatically accessible, 
            where AI serves as a bridge rather than a barrier, and where blind and visually 
            impaired students have the same opportunities to excel as their peers. 
            Through Braillience, we're taking the first steps toward that future.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Mission;
