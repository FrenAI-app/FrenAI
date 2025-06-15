
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, MessageSquare, Heart, Target, Book } from 'lucide-react';
import { getMemories, getConversationAnalytics, type AIMemory, type ConversationAnalytics } from '@/lib/aiMemoryBank';
import { useUser } from '@/context/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';

const AILearningDashboard: React.FC = () => {
  const [memories, setMemories] = useState<AIMemory[]>([]);
  const [analytics, setAnalytics] = useState<ConversationAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useUser();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (profile?.user_id) {
      loadDashboardData();
    }
  }, [profile?.user_id]);

  const loadDashboardData = async () => {
    if (!profile?.user_id) return;
    
    setLoading(true);
    try {
      const [memoriesData, analyticsData] = await Promise.all([
        getMemories(profile.user_id),
        getConversationAnalytics(profile.user_id, 30)
      ]);
      
      setMemories(memoriesData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMemoryTypeIcon = (type: string) => {
    switch (type) {
      case 'personal': return '👤';
      case 'preference': return '⚙️';
      case 'fact': return '📋';
      case 'relationship': return '💝';
      case 'goal': return '🎯';
      case 'interest': return '🌟';
      default: return '💭';
    }
  };

  const getMemoryTypeColor = (type: string) => {
    switch (type) {
      case 'personal': return 'bg-blue-100 text-blue-800';
      case 'preference': return 'bg-green-100 text-green-800';
      case 'fact': return 'bg-purple-100 text-purple-800';
      case 'relationship': return 'bg-pink-100 text-pink-800';
      case 'goal': return 'bg-orange-100 text-orange-800';
      case 'interest': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalMessages = analytics.reduce((sum, day) => sum + day.total_messages, 0);
  const totalAIMessages = analytics.reduce((sum, day) => sum + day.ai_messages, 0);
  const averageSessionDuration = analytics.length > 0 
    ? analytics.reduce((sum, day) => sum + (day.session_duration_minutes || 0), 0) / analytics.length 
    : 0;

  const memoriesByType = memories.reduce((acc, memory) => {
    acc[memory.memory_type] = (acc[memory.memory_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const overallMoodDistribution = analytics.reduce((acc, day) => {
    Object.entries(day.mood_distribution || {}).forEach(([mood, count]) => {
      acc[mood] = (acc[mood] || 0) + (count as number);
    });
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isMobile ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center gap-2 mb-6">
        <Brain className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} text-purple-600`} />
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
          AI Learning Dashboard
        </h2>
      </div>

      {/* Overview Stats */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-4 gap-6'}`}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Memories</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memories.length}</div>
            <p className="text-xs text-muted-foreground">
              Things I remember about you
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Messages exchanged (30 days)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageSessionDuration)}m</div>
            <p className="text-xs text-muted-foreground">
              Average chat duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.min(100, memories.length * 2)}%</div>
            <p className="text-xs text-muted-foreground">
              How well I know you
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Memory Bank */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Memory Bank
          </CardTitle>
          <CardDescription>
            What I've learned about you and remember from our conversations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
            {Object.entries(memoriesByType).map(([type, count]) => (
              <div 
                key={type} 
                className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getMemoryTypeIcon(type)}</span>
                  <div>
                    <p className="font-medium capitalize">{type}</p>
                    <p className="text-xs text-gray-500">{count} memories</p>
                  </div>
                </div>
                <Badge className={getMemoryTypeColor(type)}>
                  {count}
                </Badge>
              </div>
            ))}
          </div>

          {memories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No memories yet</p>
              <p className="text-sm">
                Start chatting with me to help me learn about you!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Mood Patterns
          </CardTitle>
          <CardDescription>
            Your emotional patterns over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(overallMoodDistribution).map(([mood, count]) => {
              const total = Object.values(overallMoodDistribution).reduce((sum, c) => sum + c, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={mood} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="capitalize font-medium">{mood}</span>
                    <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>

          {Object.keys(overallMoodDistribution).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No mood data yet</p>
              <p className="text-sm">
                Chat with me more to see your mood patterns!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AILearningDashboard;
