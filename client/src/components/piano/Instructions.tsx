import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Instructions() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">How to Play</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-sm space-y-2">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Tap or click on any colored square to play a piano note</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Each square plays a different note from the piano scale</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Adjust the grid size to access more notes</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Enable auto-play for a surprise melody</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
