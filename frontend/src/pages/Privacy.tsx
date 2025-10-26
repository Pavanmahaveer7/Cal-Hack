import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, UserCheck, Bell, Trash2 } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      icon: Shield,
      title: "Information We Collect",
      content: [
        "Personal information you provide (name, email, phone number)",
        "Educational content you upload for flashcard generation",
        "Learning progress and test results",
        "Voice interaction data for improving speech recognition",
        "Device and usage information for service optimization"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To provide and improve our AI-powered flashcard generation service",
        "To deliver voice-guided learning sessions and scheduled phone calls",
        "To track learning progress and generate analytics",
        "To communicate with you about your account and services",
        "To ensure platform security and prevent fraud"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "All data is encrypted in transit and at rest",
        "We use industry-standard security measures to protect your information",
        "Regular security audits and vulnerability assessments",
        "Access to personal data is restricted to authorized personnel only",
        "We never sell your personal information to third parties"
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access your personal data at any time",
        "Request correction of inaccurate information",
        "Delete your account and associated data",
        "Opt-out of non-essential communications",
        "Export your learning data in a portable format"
      ]
    },
    {
      icon: Bell,
      title: "Third-Party Services",
      content: [
        "AI processing: OpenAI GPT for flashcard generation",
        "Voice services: Web Speech API and similar technologies",
        "Phone calls: Twilio or similar telephony services",
        "Analytics: Usage analytics to improve our service",
        "All third parties are GDPR and accessibility compliant"
      ]
    },
    {
      icon: Trash2,
      title: "Data Retention",
      content: [
        "Active account data is retained while your account is active",
        "Learning history kept for progress tracking purposes",
        "You can request data deletion at any time",
        "Deleted data is permanently removed within 30 days",
        "Some data may be retained for legal compliance purposes"
      ]
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <main id="main-content" className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold text-foreground md:text-6xl animate-fade-in-up">
            Privacy Policy
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Your privacy is paramount. We're committed to protecting your personal information 
            and being transparent about how we use it.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Last Updated: January 2025
          </p>
        </section>

        {/* Introduction */}
        <section className="mb-12">
          <Card>
            <CardContent className="p-8">
              <p className="text-lg text-foreground/80 leading-relaxed">
                At <strong className="text-foreground">Braillience</strong>, we understand that accessibility 
                and privacy go hand in hand. This Privacy Policy explains how we collect, use, protect, and 
                share your information when you use our AI-powered accessible learning platform. We are 
                committed to WCAG 2.1 AAA standards and comply with GDPR, CCPA, and other privacy regulations.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Privacy Sections */}
        <section className="mb-12 space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h2 className="mb-4 text-2xl font-bold text-foreground">{section.title}</h2>
                      <ul className="space-y-2">
                        {section.content.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground/80">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Accessibility Notice */}
        <section className="mb-12">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Accessibility & Privacy
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed mb-4">
                We recognize that blind and visually impaired users have specific privacy needs. 
                All privacy controls are fully accessible via screen readers and keyboard navigation. 
                You can manage your privacy settings independently without assistance.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Voice recordings used for learning sessions are processed securely and can be 
                deleted at your request. We use voice data solely to improve speech recognition 
                accuracy and never for marketing purposes.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Children's Privacy */}
        <section className="mb-12">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Children's Privacy
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Braillience is designed for college students (18+). We do not knowingly collect 
                information from children under 18. If we discover that we have collected data 
                from someone under 18, we will delete it immediately. Parents or guardians who 
                believe we may have information from a child should contact us.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* International Users */}
        <section className="mb-12">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                International Data Transfers
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                If you access Braillience from outside the United States, your information may be 
                transferred to, stored, and processed in the U.S. We ensure appropriate safeguards 
                are in place to protect your data in accordance with this Privacy Policy and 
                applicable laws.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Changes to Policy */}
        <section className="mb-12">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Changes to This Policy
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of 
                significant changes via email and by updating the "Last Updated" date. Continued 
                use of Braillience after changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Contact Section */}
        <section className="rounded-2xl bg-gradient-to-r from-primary to-accent p-12 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Questions About Privacy?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            If you have any questions, concerns, or requests regarding this Privacy Policy or 
            your personal data, please contact us.
          </p>
          <div className="space-y-4">
            <p className="text-lg">
              <strong>Email:</strong>{" "}
              <a href="mailto:braillienceai@gmail.com" className="underline hover:text-white/80">
                braillienceai@gmail.com
              </a>
            </p>
            <p className="text-sm text-white/70">
              We will respond to all privacy inquiries within 30 days
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Privacy;