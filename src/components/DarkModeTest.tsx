import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useTheme } from './contexts/ThemeContext';

const DarkModeTest: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">Dark Mode Test</h1>
          <p className="text-muted-foreground">Current theme: {theme}</p>
          <Button onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>

        {/* Test Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-card-foreground">Test Card Title</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-card-foreground">
              This card should have proper background and text colors in both light and dark modes.
            </p>
            
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default">Primary Badge</Badge>
              <Badge variant="secondary">Secondary Badge</Badge>
              <Badge variant="outline">Outline Badge</Badge>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-muted-foreground">
                This is muted content that should be clearly readable in both themes.
              </p>
            </div>

            <div className="bg-accent p-4 rounded-lg">
              <p className="text-accent-foreground">
                This is accent content with proper contrast.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette Display */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background border border-border p-3 rounded-lg">
                <p className="text-foreground font-medium">Background</p>
                <p className="text-muted-foreground text-sm">Primary surface</p>
              </div>
              
              <div className="bg-card border border-border p-3 rounded-lg">
                <p className="text-card-foreground font-medium">Card</p>
                <p className="text-muted-foreground text-sm">Elevated surface</p>
              </div>
              
              <div className="bg-muted border border-border p-3 rounded-lg">
                <p className="text-muted-foreground font-medium">Muted</p>
                <p className="text-muted-foreground text-sm">Subtle background</p>
              </div>
              
              <div className="bg-accent border border-border p-3 rounded-lg">
                <p className="text-accent-foreground font-medium">Accent</p>
                <p className="text-muted-foreground text-sm">Accent background</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>HTML class:</strong> {document.documentElement.className}</p>
              <p><strong>Body class:</strong> {document.body.className}</p>
              <p><strong>Theme state:</strong> {theme}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DarkModeTest;