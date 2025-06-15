import React, { useState, useEffect } from 'react';
import { usePrivyAuth } from '@/context/PrivyContext';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarIcon, Gift, Star, Trophy, Award, Flame } from 'lucide-react';
import { format, isSameMonth, isSameDay, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { hasClaimedDailyReward, claimDailyReward, getStreakHistory, getCurrentStreak, DailyRewardData } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import confetti from 'canvas-confetti';

interface StreakMilestone {
  days: number;
  reward: number;
  icon: React.ReactNode;
}

const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, reward: 20, icon: <Star className="h-4 w-4" /> },
  { days: 5, reward: 30, icon: <Star className="h-4 w-4" /> },
  { days: 7, reward: 50, icon: <Trophy className="h-4 w-4" /> },
  { days: 14, reward: 100, icon: <Award className="h-4 w-4" /> },
  { days: 30, reward: 250, icon: <Trophy className="h-5 w-5 text-amber-500" /> },
];

const DailyRewards = () => {
  const { user } = usePrivyAuth(); // Changed from useDynamicContext to usePrivyAuth
  const { profile } = useUser();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [rewardHistory, setRewardHistory] = useState<DailyRewardData[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [triggeredConfetti, setTriggeredConfetti] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());

  // Get next milestone
  const getNextMilestone = () => {
    for (const milestone of STREAK_MILESTONES) {
      if (currentStreak < milestone.days) {
        return milestone;
      }
    }
    return STREAK_MILESTONES[STREAK_MILESTONES.length - 1]; // Return the highest milestone if all are achieved
  };

  // Days until next milestone
  const daysUntilNextMilestone = () => {
    const nextMilestone = getNextMilestone();
    return nextMilestone.days - currentStreak;
  };

  const progressToNextMilestone = () => {
    if (currentStreak === 0) return 0;
    const nextMilestone = getNextMilestone();
    const prevMilestone = STREAK_MILESTONES.findIndex(m => m.days === nextMilestone.days) > 0 
      ? STREAK_MILESTONES[STREAK_MILESTONES.findIndex(m => m.days === nextMilestone.days) - 1].days 
      : 0;
    
    const progress = ((currentStreak - prevMilestone) / (nextMilestone.days - prevMilestone)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  // Trigger confetti animation
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFC107', '#FF9800', '#FFD700']
    });
  };

  // Check if day is in history
  const isDayInHistory = (day: Date) => {
    return rewardHistory.some(record => 
      isSameDay(new Date(record.check_in_date), day)
    );
  };

  // Fetch user reward data
  const fetchRewardData = async () => {
    if (!user?.id) return;
    
    try {
      // Check if already claimed today
      const hasClaimedToday = await hasClaimedDailyReward(user.id);
      setClaimed(hasClaimedToday);
      
      // Get streak history
      const history = await getStreakHistory(user.id);
      setRewardHistory(history);
      
      // Get current streak
      const streak = await getCurrentStreak(user.id);
      setCurrentStreak(streak);
    } catch (error) {
      console.error('Error fetching reward data:', error);
    }
  };

  // Claim daily reward
  const handleClaimReward = async () => {
    if (!user?.id) {
      toast({
        title: "Not logged in",
        description: "Please connect your wallet to claim rewards",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await claimDailyReward(user.id);
      
      if (result.success) {
        setClaimed(true);
        setCurrentStreak(result.streak || 1);
        
        // Add to history
        if (result.streak && result.reward) {
          const newRecord: DailyRewardData = {
            user_id: user.id,
            check_in_date: new Date().toISOString().split('T')[0],
            streak_count: result.streak,
            reward_amount: result.reward,
            collected: true
          };
          
          setRewardHistory([newRecord, ...rewardHistory]);
        }
        
        // Show success message with reward * 10
        const displayReward = (result.reward || 0) * 10;
        toast({
          title: "Reward Claimed!",
          description: `You received ${displayReward} cxFREN tokens. Current streak: ${result.streak} days!`,
        });
        
        // Trigger confetti after a small delay
        setTimeout(() => {
          triggerConfetti();
          setTriggeredConfetti(true);
        }, 300);
      } else if (result.alreadyClaimed) {
        toast({
          title: "Already Claimed",
          description: "You've already claimed your reward for today.",
          variant: "default"
        });
      } else {
        toast({
          title: "Claim Failed",
          description: result.message || "Failed to claim reward. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: "Error",
        description: "Failed to claim daily reward. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Effect for fetching data
  useEffect(() => {
    if (user?.id) {
      fetchRewardData();
    }
  }, [user?.id]);

  // Reset confetti trigger
  useEffect(() => {
    if (triggeredConfetti) {
      const timer = setTimeout(() => {
        setTriggeredConfetti(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [triggeredConfetti]);

  // Get days of the current month for display
  const calendarDays = () => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  // Get motivational message based on streak
  const getMotivationalMessage = () => {
    if (currentStreak === 0) return "Start your streak today!";
    if (currentStreak === 1) return "Great start! Come back tomorrow.";
    if (currentStreak < 5) return "Keep it going! You're building momentum.";
    if (currentStreak < 10) return "Impressive streak! You're really dedicated.";
    if (currentStreak < 20) return "Amazing commitment! You're a daily visitor now.";
    return "Legendary streak! Your dedication is extraordinary!";
  };

  // Custom modifiers for the calendar
  const modifiers = {
    checkedIn: rewardHistory.map(record => new Date(record.check_in_date)),
    today: new Date()
  };

  // Custom styles for different day states
  const modifiersStyles = {
    checkedIn: { backgroundColor: '#FEF3C7', color: '#92400E', fontWeight: 'bold' },
    today: { backgroundColor: '#DBEAFE', color: '#1E40AF', fontWeight: 'bold' }
  };

  // Function to display rewards (multiplied by 10)
  const displayReward = (reward: number) => {
    return reward * 10;
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-2 mb-2">
        <div className="bg-amber-100 p-3 rounded-full">
          <Gift className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold">Daily Rewards</h2>
        <p className="text-muted-foreground max-w-md">
          Check in daily to earn cxFREN tokens and build your streak!
        </p>
      </div>
      
      <Card className="border-amber-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" />
              Current Streak
            </CardTitle>
            <Badge variant="outline" className="font-medium text-amber-700 bg-amber-50">
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            </Badge>
          </div>
          <CardDescription>
            {getMotivationalMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to next milestone</span>
                <span className="font-medium">{daysUntilNextMilestone()} days left</span>
              </div>
              <Progress value={progressToNextMilestone()} className="h-2 bg-amber-100" />
            </div>
            
            <div className="grid grid-cols-5 gap-2 mt-3">
              {STREAK_MILESTONES.map((milestone, i) => (
                <div 
                  key={i} 
                  className={`rounded-md p-2 text-center border ${
                    currentStreak >= milestone.days 
                      ? 'bg-amber-100 border-amber-300' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-center mb-1">
                    {milestone.icon}
                  </div>
                  <div className="text-xs font-medium">{milestone.days}d</div>
                  <div className="text-xs font-medium text-amber-700">{displayReward(milestone.reward)} cxFREN</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleClaimReward} 
            disabled={loading || claimed || !user?.id} 
            className="w-full bg-amber-500 hover:bg-amber-600"
          >
            {loading ? "Processing..." : claimed ? "Claimed Today" : "Claim Daily Reward"}
          </Button>
        </CardFooter>
      </Card>
      
      <Separator />
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Check-in Calendar
          </h3>
          <Badge variant="outline">
            {format(date, 'MMMM yyyy')}
          </Badge>
        </div>
        
        <div className="border rounded-md p-3">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDate(new Date())}
              disabled={isSameMonth(date, new Date())}
            >
              Today
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}
              disabled={date.getMonth() === new Date().getMonth()}
            >
              Next
            </Button>
          </div>
          
          <Calendar
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            month={date}
            onMonthChange={setDate}
            className="pointer-events-auto bg-white rounded-md p-2"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            disabled={(day) => {
              // Can't select future days
              return day > new Date();
            }}
            footer={
              <div className="flex mt-3 justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-100 rounded-full mr-1"></div>
                  <span>Check-in</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-100 rounded-full mr-1"></div>
                  <span>Today</span>
                </div>
              </div>
            }
          />
        </div>
      </div>
      
      <div className="bg-amber-50 rounded-lg p-4 mt-4 text-sm space-y-2">
        <h4 className="font-medium text-amber-800">How it works:</h4>
        <ul className="list-disc pl-5 space-y-1 text-amber-700">
          <li>Check in daily to earn cxFREN tokens</li>
          <li>Build your streak for bonus rewards</li>
          <li>Missing a day resets your streak</li>
          <li>Reach milestones for special rewards</li>
        </ul>
      </div>
    </div>
  );
};

export default DailyRewards;
