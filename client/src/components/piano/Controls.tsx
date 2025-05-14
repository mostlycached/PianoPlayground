import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";

interface ControlsProps {
  columns: number;
  rows: number;
  autoplay: boolean;
  onColumnsChange: (columns: number) => void;
  onAutoplayChange: (enabled: boolean) => void;
}

export default function Controls({
  columns,
  rows,
  autoplay,
  onColumnsChange,
  onAutoplayChange,
}: ControlsProps) {
  const increaseColumns = () => {
    onColumnsChange(Math.min(columns + 1, 5));
  };

  const decreaseColumns = () => {
    onColumnsChange(Math.max(columns - 1, 2));
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div>
            <Label htmlFor="gridSize" className="block text-sm font-medium mb-1">
              Grid Size
            </Label>
            <div className="flex items-center">
              <Button
                variant="default"
                className="rounded-l-md rounded-r-none bg-primary hover:bg-primary-dark"
                onClick={decreaseColumns}
                aria-label="Decrease grid columns"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span
                id="gridSizeDisplay"
                className="bg-white border-t border-b border-input px-4 py-2 min-w-[60px] text-center"
              >
                {columns}x{rows}
              </span>
              <Button
                variant="default"
                className="rounded-r-md rounded-l-none bg-primary hover:bg-primary-dark"
                onClick={increaseColumns}
                aria-label="Increase grid columns"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enableAutoplay"
              checked={autoplay}
              onCheckedChange={onAutoplayChange}
              aria-label="Enable auto-play mode"
            />
            <Label htmlFor="enableAutoplay" className="text-sm font-medium">
              Enable Auto-play Mode
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
