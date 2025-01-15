import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ComparisonResultProps {
  analysis: string;
}

export const ComparisonResult = ({ analysis }: ComparisonResultProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap">{analysis}</div>
        </div>
      </CardContent>
    </Card>
  );
};