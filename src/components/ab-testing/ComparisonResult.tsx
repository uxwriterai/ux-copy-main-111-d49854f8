import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from 'react-markdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ComparisonResultProps {
  analysis: string;
}

export const ComparisonResult = ({ analysis }: ComparisonResultProps) => {
  // Extract scores using regex
  const getScores = (variation: string) => {
    const scores = {
      clarity: 0,
      engagement: 0,
      relevance: 0,
      readability: 0,
      overall: 0
    };

    const lines = analysis.split('\n');
    let inScoreSection = false;
    let inCurrentVariation = false;

    lines.forEach(line => {
      if (line.includes(`## Variation ${variation}`)) {
        inScoreSection = true;
        inCurrentVariation = true;
      } else if (line.startsWith('## Variation')) {
        inCurrentVariation = false;
      } else if (line.startsWith('# DETAILED')) {
        inScoreSection = false;
      }

      if (inScoreSection && inCurrentVariation) {
        if (line.includes('Clarity:')) scores.clarity = parseInt(line.match(/\d+/)?.[0] || '0');
        if (line.includes('Engagement:')) scores.engagement = parseInt(line.match(/\d+/)?.[0] || '0');
        if (line.includes('Relevance:')) scores.relevance = parseInt(line.match(/\d+/)?.[0] || '0');
        if (line.includes('Readability:')) scores.readability = parseInt(line.match(/\d+/)?.[0] || '0');
        if (line.includes('Overall Score:')) scores.overall = parseInt(line.match(/\d+/)?.[0] || '0');
      }
    });

    return scores;
  };

  const scoresA = getScores('A');
  const scoresB = getScores('B');

  // Extract detailed analysis sections
  const getDetailedAnalysis = () => {
    const sections = {
      strengths: [] as string[],
      weaknesses: [] as string[],
      suggestions: [] as string[]
    };

    const lines = analysis.split('\n');
    let currentSection = '';

    lines.forEach(line => {
      if (line.includes('### Strengths')) {
        currentSection = 'strengths';
      } else if (line.includes('### Weaknesses')) {
        currentSection = 'weaknesses';
      } else if (line.includes('### Suggestions')) {
        currentSection = 'suggestions';
      } else if (line.startsWith('-') && currentSection) {
        sections[currentSection as keyof typeof sections].push(line.replace('-', '').trim());
      }
    });

    return sections;
  };

  const analysis_sections = getDetailedAnalysis();

  return (
    <div className="space-y-8 animate-fadeIn">
      <Card>
        <CardHeader>
          <CardTitle>Scores Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold">Variation A</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Clarity</span>
                    <span>{scoresA.clarity}%</span>
                  </div>
                  <Progress value={scoresA.clarity} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engagement</span>
                    <span>{scoresA.engagement}%</span>
                  </div>
                  <Progress value={scoresA.engagement} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Relevance</span>
                    <span>{scoresA.relevance}%</span>
                  </div>
                  <Progress value={scoresA.relevance} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Readability</span>
                    <span>{scoresA.readability}%</span>
                  </div>
                  <Progress value={scoresA.readability} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Overall Score</span>
                    <span>{scoresA.overall}%</span>
                  </div>
                  <Progress value={scoresA.overall} className="h-3" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Variation B</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Clarity</span>
                    <span>{scoresB.clarity}%</span>
                  </div>
                  <Progress value={scoresB.clarity} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engagement</span>
                    <span>{scoresB.engagement}%</span>
                  </div>
                  <Progress value={scoresB.engagement} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Relevance</span>
                    <span>{scoresB.relevance}%</span>
                  </div>
                  <Progress value={scoresB.relevance} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Readability</span>
                    <span>{scoresB.readability}%</span>
                  </div>
                  <Progress value={scoresB.readability} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Overall Score</span>
                    <span>{scoresB.overall}%</span>
                  </div>
                  <Progress value={scoresB.overall} className="h-3" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Key Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              {analysis_sections.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-muted-foreground">{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              {analysis_sections.weaknesses.map((weakness, index) => (
                <li key={index} className="text-sm text-muted-foreground">{weakness}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Improvement Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Suggestion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysis_sections.suggestions.map((suggestion, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{suggestion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Full Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};