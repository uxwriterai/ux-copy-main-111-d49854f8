import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyVariant } from "@/components/microcopy/CopyVariant";

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
          <CardContent className="space-y-4">
            {section.content.map((content, contentIndex) => (
              <CopyVariant 
                key={contentIndex} 
                text={content.replace(/[*#`]/g, '').trim()} 
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};