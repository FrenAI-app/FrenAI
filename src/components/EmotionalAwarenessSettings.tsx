
import React from 'react';
import { Heart, Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EmotionalAwarenessSettings = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          <span>Emotional Intelligence</span>
        </CardTitle>
        <CardDescription>
          Your AI buddy is equipped with advanced emotional awareness to provide more empathetic responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-md border border-pink-200 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-pink-100 p-2 rounded-full">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h4 className="font-medium text-pink-800 mb-2">Always Emotionally Aware</h4>
              <p className="text-sm text-pink-700 mb-3">
                Your AI friend automatically understands your emotional state and responds with empathy and care. 
                This feature is always active to ensure the best possible conversation experience.
              </p>
              <div className="flex items-center gap-2 text-sm text-pink-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-md border border-green-200 flex items-start gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <Brain className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-green-800 mb-1">How it works</h4>
            <p className="text-sm text-green-700">
              Every message you send is analyzed by an advanced sentiment analysis model that helps 
              your AI friend understand your emotional state and respond more empathetically. This creates 
              a more natural and supportive conversation experience.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalAwarenessSettings;
