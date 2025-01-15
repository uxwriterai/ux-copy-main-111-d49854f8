import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ComparisonResultProps {
  analysis: string;
}

export const ComparisonResult = ({ analysis }: ComparisonResultProps) => {
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

  const getDetailedAnalysis = () => {
    const sections = {
      winner: '',
      strengths: [] as string[],
      weaknesses: [] as string[],
      suggestions: [] as string[],
      clarity: '',
      tone: '',
      engagement: '',
      cta: ''
    };

    const lines = analysis.split('\n');
    let currentSection = '';
    let collectingList = false;

    lines.forEach(line => {
      if (line.includes('# WINNER DECLARATION')) {
        currentSection = 'winner';
        collectingList = false;
      } else if (line.includes('### Strengths')) {
        currentSection = 'strengths';
        collectingList = true;
      } else if (line.includes('### Weaknesses')) {
        currentSection = 'weaknesses';
        collectingList = true;
      } else if (line.includes('# OPTIMIZATION RECOMMENDATIONS')) {
        currentSection = 'suggestions';
        collectingList = true;
      } else if (line.includes('## Clarity Analysis')) {
        currentSection = 'clarity';
        collectingList = false;
      } else if (line.includes('## Tone Analysis')) {
        currentSection = 'tone';
        collectingList = false;
      } else if (line.includes('## Engagement Analysis')) {
        currentSection = 'engagement';
        collectingList = false;
      } else if (line.includes('## CTA Analysis')) {
        currentSection = 'cta';
        collectingList = false;
      } else if (line.trim() && !line.startsWith('#')) {
        if (collectingList && line.trim().startsWith('-')) {
          const content = line.replace('-', '').trim();
          if (currentSection === 'strengths') {
            sections.strengths.push(content);
          } else if (currentSection === 'weaknesses') {
            sections.weaknesses.push(content);
          } else if (currentSection === 'suggestions') {
            sections.suggestions.push(content);
          }
        } else if (!collectingList) {
          if (currentSection === 'winner') {
            sections.winner = line.trim();
          } else if (currentSection === 'clarity') {
            sections.clarity = line.trim();
          } else if (currentSection === 'tone') {
            sections.tone = line.trim();
          } else if (currentSection === 'engagement') {
            sections.engagement = line.trim();
          } else if (currentSection === 'cta') {
            sections.cta = line.trim();
          }
        }
      }
    });

    return sections;
  };

  const scoresA = getScores('A');
  const scoresB = getScores('B');
  const analysis_sections = getDetailedAnalysis();

  return (
    <div className="space-y-8 animate-fadeIn">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Winner Analysis
            <Badge variant="secondary" className="text-sm">
              {analysis_sections.winner.includes('A') ? 'Variation A' : 'Variation B'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{analysis_sections.winner}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Variation A</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variation B</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Key Strengths
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                Positives
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis_sections.strengths.length > 0 ? (
              <ul className="list-disc pl-4 space-y-2">
                {analysis_sections.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{strength}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No strengths identified.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Areas for Improvement
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                To Improve
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis_sections.weaknesses.length > 0 ? (
              <ul className="list-disc pl-4 space-y-2">
                {analysis_sections.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{weakness}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No areas for improvement identified.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {analysis_sections.clarity && (
              <div>
                <h4 className="font-semibold mb-2">Clarity & Message</h4>
                <p className="text-sm text-muted-foreground">{analysis_sections.clarity}</p>
              </div>
            )}
            {analysis_sections.tone && (
              <div>
                <h4 className="font-semibold mb-2">Tone & Voice</h4>
                <p className="text-sm text-muted-foreground">{analysis_sections.tone}</p>
              </div>
            )}
            {analysis_sections.engagement && (
              <div>
                <h4 className="font-semibold mb-2">User Engagement</h4>
                <p className="text-sm text-muted-foreground">{analysis_sections.engagement}</p>
              </div>
            )}
            {analysis_sections.cta && (
              <div>
                <h4 className="font-semibold mb-2">Call-to-Action Impact</h4>
                <p className="text-sm text-muted-foreground">{analysis_sections.cta}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Improvement Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {analysis_sections.suggestions.length > 0 ? (
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
          ) : (
            <p className="text-sm text-muted-foreground">No improvement suggestions available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};