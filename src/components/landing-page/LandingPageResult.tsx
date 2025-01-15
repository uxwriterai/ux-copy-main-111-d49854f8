import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LandingPageSection {
  title: string;
  content: string[];
}

interface LandingPageResultProps {
  sections: LandingPageSection[];
  onRestart: () => void;
}

export const LandingPageResult = ({ sections, onRestart }: LandingPageResultProps) => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container max-w-6xl py-8">
        <div className="text-left mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Landing Page Copy</h1>
          <p className="text-lg text-muted-foreground">
            Your generated landing page sections
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {sections.length} sections generated
          </p>
        </div>

        <div className="space-y-8 animate-fadeIn">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onRestart}>
              Start Over
            </Button>
          </div>

          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {section.content.map((content, contentIndex) => (
                  <p key={contentIndex} className="mb-4">
                    {content.replace(/[*#`]/g, '').trim()}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};