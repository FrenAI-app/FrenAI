
import { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useUser } from '@/context/UserContext';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useToast } from '@/components/ui/use-toast';
import { Home, Award, Timer, Hand, Info, Lock, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserGameData, createGameRecord, updateGameData, GameTapsData } from '@/lib/supabaseClient';
import { Progress } from "@/components/ui/progress";
import GameAssets from '@/components/game/GameAssets';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedBackground from '@/components/AnimatedBackground';
import TapGame from '@/components/game/TapGame';

const FrenGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameData, setGameData] = useState<GameTapsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tapCount, setTapCount] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isGameAvailable, setIsGameAvailable] = useState(true);
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [leaderboardData, setLeaderboardData] = useState<{username: string, score: number}[]>([]);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  const MAX_DAILY_TAPS = 100;
  const isMobile = useIsMobile();
  
  const { user } = useDynamicContext();
  const { profile } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Assets loaded callback
  const handleAssetsLoaded = useCallback(() => {
    console.log("Game assets loaded successfully");
    setAssetsLoaded(true);
  }, []);

  // Load game data from Supabase
  useEffect(() => {
    const fetchGameData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        let data = await getUserGameData(user.id);
        
        // If no data exists, create a new record
        if (!data) {
          data = await createGameRecord(user.id);
        }
        
        if (data) {
          setGameData(data);
          setTapCount(data.tap_count || 0);
          setScore(data.score || 0);
          setHighScore(data.score || 0);
          
          // Check if daily taps are available
          const today = new Date().toISOString().split('T')[0];
          if (data.last_played !== today) {
            // It's a new day, taps should be reset
            const updatedData = {
              ...data,
              tap_count: 0,
              last_played: today
            };
            
            const result = await updateGameData(updatedData);
            if (result) {
              setGameData(result);
              setTapCount(0);
            }
            setIsGameAvailable(true);
          } else {
            // Check if daily limit is reached
            setIsGameAvailable((data.tap_count || 0) < MAX_DAILY_TAPS);
          }
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
        toast({
          title: "Error",
          description: "Failed to load game data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Mock leaderboard data
    setLeaderboardData([
      { username: "TapMaster", score: 4250 },
      { username: "FastFinger", score: 3800 },
      { username: "ClickChamp", score: 3200 },
      { username: "TapKing", score: 2850 },
      { username: "SpeedTapper", score: 2400 }
    ]);
    
    // Fetch game data
    fetchGameData();
    
    // Check if tutorial has been seen
    const tutorialSeen = localStorage.getItem('tapGameTutorialSeen');
    if (tutorialSeen) {
      setShowTutorial(false);
    }
    
    // Calculate time until next day
    updateTimeUntilReset();
    const interval = setInterval(updateTimeUntilReset, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [user, toast]);

  // Update time until reset
  const updateTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diffMs = tomorrow.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    
    setTimeUntilReset(`${diffHrs}h ${diffMins}m ${diffSecs}s`);
  };

  // Handle score updates from the TapGame component
  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
    
    // Update high score if needed
    if (newScore > highScore) {
      setHighScore(newScore);
    }
    
    // Update tap count
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);
    
    // Check if reached daily limit
    if (newTapCount >= MAX_DAILY_TAPS) {
      setIsGameAvailable(false);
      toast({
        title: "Daily Limit Reached!",
        description: "You've used all your taps for today. Come back tomorrow!",
        className: "glass"
      });
    }
    
    // Update game data in database with throttling
    if (gameData && (newTapCount % (isMobile ? 10 : 5) === 0 || newTapCount >= MAX_DAILY_TAPS)) {
      const updateDatabase = async () => {
        try {
          const updatedData = {
            ...gameData,
            tap_count: newTapCount,
            score: newScore
          };
          
          const result = await updateGameData(updatedData);
          if (result) {
            setGameData(result);
          }
        } catch (error) {
          console.error('Error updating game data:', error);
        }
      };
      
      updateDatabase();
    }
  }, [gameData, tapCount, highScore, toast, isMobile]);

  // Start new game
  const startGame = () => {
    setGameStarted(true);
    
    // Mark tutorial as seen
    if (showTutorial) {
      setShowTutorial(false);
      localStorage.setItem('tapGameTutorialSeen', 'true');
    }
    
    // Display welcome toast
    toast({
      title: "Game Started!",
      description: "Tap as fast as you can to increase your score!",
      className: "bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white"
    });
  };

  // Return to home
  const goHome = () => {
    navigate('/');
  };
  
  // Show tutorial again
  const showTutorialAgain = () => {
    setShowTutorial(true);
  };
  
  // Calculate progress percentage
  const tapProgressPercent = Math.min(100, (tapCount / MAX_DAILY_TAPS) * 100);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 animate-fade-in touch-none select-none">
      <AnimatedBackground />
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goHome}
            className="group glass-button hover:bg-white/20 border-blue-300/50"
          >
            <Home className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:animate-pulse" />
            <span className="text-xs sm:text-sm">Home</span>
          </Button>
        </div>
        
        <h1 className="font-poppins text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-bounce-in">
          Tap Frenzy
        </h1>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center glass p-1 sm:p-2 rounded-lg shadow-md">
            <Hand className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-1" />
            <span className="font-semibold text-blue-700 text-xs sm:text-sm">{isGameAvailable ? MAX_DAILY_TAPS - tapCount : 0}</span>
            <span className="text-[10px] sm:text-xs text-gray-600 ml-1">left</span>
          </div>
          <div className="flex items-center glass p-1 sm:p-2 rounded-lg shadow-md">
            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 mr-1" />
            <span className="font-semibold text-blue-700 text-xs sm:text-sm">{score}</span>
          </div>
        </div>
      </div>

      {!isLoading ? (
        <div className="bg-gradient-to-b from-indigo-50/90 to-purple-50/90 rounded-xl overflow-hidden shadow-lg border border-white/30 backdrop-blur-sm glass-card">
          {gameStarted ? (
            <div className="relative min-h-[75vh]">
              {isGameAvailable ? (
                <>
                  <div className="absolute top-4 left-0 right-0 px-4 z-10">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs sm:text-sm font-medium text-blue-800">Daily Taps</span>
                      <span className="text-xs sm:text-sm font-medium text-blue-800">{tapCount}/{MAX_DAILY_TAPS}</span>
                    </div>
                    <Progress 
                      value={tapProgressPercent} 
                      className="h-2 bg-blue-100" 
                    />
                  </div>
                  
                  <TapGame
                    onScoreUpdate={handleScoreUpdate}
                    isPaused={!assetsLoaded}
                    maxTaps={MAX_DAILY_TAPS}
                    currentTaps={tapCount}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[75vh] p-4 sm:p-6 bg-gradient-to-b from-indigo-50/80 to-blue-50/80">
                  <div className="mb-4 sm:mb-8 text-center">
                    <Lock className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-blue-400 mb-2 sm:mb-4 drop-shadow" />
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 text-blue-800">Daily Limit Reached</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-md">
                      You've used all {MAX_DAILY_TAPS} of your daily taps. Come back tomorrow for more!
                    </p>
                    <div className="flex items-center justify-center bg-blue-100 rounded-lg py-2 px-4 shadow-inner">
                      <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                      <span className="font-mono text-base sm:text-lg text-blue-700">{timeUntilReset}</span>
                    </div>
                  </div>
                  
                  <div className="w-full max-w-md">
                    <div className="bg-white/80 p-4 sm:p-5 rounded-xl shadow-lg border border-blue-100">
                      <div className="flex items-center mb-4">
                        <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 mr-2" />
                        <h3 className="font-semibold text-blue-800">Your Stats Today</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg text-center shadow-inner">
                          <div className="text-xs sm:text-sm text-purple-600">Score</div>
                          <div className="text-xl sm:text-2xl font-bold text-purple-700">{score}</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg text-center shadow-inner">
                          <div className="text-xs sm:text-sm text-blue-600">Taps</div>
                          <div className="text-xl sm:text-2xl font-bold text-blue-700">{tapCount}</div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={goHome} 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      >
                        <Home className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Return Home
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 min-h-[75vh]">
              {showTutorial ? (
                <div className="text-center space-y-4 sm:space-y-6 animate-scale-in max-w-2xl">
                  <div className="text-xl sm:text-2xl mb-2 sm:mb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    How to Play Tap Frenzy
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
                    <div className="glass rounded-lg p-3 sm:p-4 shadow-lg border border-blue-100/50 hover:border-blue-200/50 transition-colors">
                      <h3 className="font-semibold text-base sm:text-lg mb-2 flex items-center text-blue-700">
                        <Hand className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                        Tapping
                      </h3>
                      <ul className="space-y-1 sm:space-y-2 text-sm text-gray-700">
                        <li>• <strong>Tap anywhere</strong> on the screen to score points</li>
                        <li>• You only have <strong>{MAX_DAILY_TAPS} taps per day</strong></li>
                        <li>• Your taps reset at <strong>midnight</strong></li>
                      </ul>
                    </div>
                    
                    <div className="glass rounded-lg p-3 sm:p-4 shadow-lg border border-blue-100/50 hover:border-blue-200/50 transition-colors">
                      <h3 className="font-semibold text-base sm:text-lg mb-2 flex items-center text-amber-700">
                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 mr-2" />
                        Combos
                      </h3>
                      <ul className="space-y-1 sm:space-y-2 text-sm text-gray-700">
                        <li>• Tap <strong>quickly</strong> to build up your combo multiplier</li>
                        <li>• Higher combos = <strong>more points per tap</strong></li>
                        <li>• Combos reset if you <strong>stop tapping</strong></li>
                      </ul>
                    </div>
                    
                    <div className="glass rounded-lg p-3 sm:p-4 shadow-lg border border-blue-100/50 hover:border-blue-200/50 transition-colors">
                      <h3 className="font-semibold text-base sm:text-lg mb-2 flex items-center text-blue-700">
                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                        Scoring
                      </h3>
                      <ul className="space-y-1 sm:space-y-2 text-sm text-gray-700">
                        <li>• Your score is <strong>saved automatically</strong></li>
                        <li>• Try to beat your <strong>previous high score</strong></li>
                        <li>• Compete on the <strong>leaderboard</strong> with others</li>
                      </ul>
                    </div>
                    
                    <div className="glass rounded-lg p-3 sm:p-4 shadow-lg border border-blue-100/50 hover:border-blue-200/50 transition-colors">
                      <h3 className="font-semibold text-base sm:text-lg mb-2 flex items-center text-purple-700">
                        <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-2" />
                        Daily Limit
                      </h3>
                      <ul className="space-y-1 sm:space-y-2 text-sm text-gray-700">
                        <li>• You get <strong>{MAX_DAILY_TAPS} taps every day</strong></li>
                        <li>• Use them <strong>wisely</strong> to maximize your score</li>
                        <li>• Come back <strong>tomorrow</strong> for more taps</li>
                      </ul>
                    </div>
                  </div>
                  <Button 
                    onClick={startGame} 
                    className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg shadow-lg transition-all transform hover:scale-105 border border-blue-300/30"
                  >
                    <Hand className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Start Tapping!
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4 sm:space-y-6 animate-scale-in">
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Tap Frenzy
                  </div>
                  
                  <div className="relative max-w-md mx-auto h-32 sm:h-48 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-xl shadow-inner">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src="/fren-mascot.png" 
                        alt="Tap Mascot" 
                        className="w-24 h-24 sm:w-32 sm:h-32 animate-bounce drop-shadow-lg"
                        onError={(e) => {
                          console.error("Error loading mascot image");
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4 sm:mb-6 text-sm text-gray-700 max-w-md px-4 sm:px-5 py-2 sm:py-3 bg-white/70 rounded-lg shadow-inner">
                    <p className="mb-1 sm:mb-2">• You have {MAX_DAILY_TAPS} taps per day - use them wisely!</p>
                    <p className="mb-1 sm:mb-2">• Tap as fast as you can to build your combo</p>
                    <p>• Come back daily to climb the leaderboard</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-2xl mx-auto">
                    <div>
                      <Button 
                        onClick={startGame} 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full text-base sm:text-lg shadow-lg transition-all transform hover:scale-105"
                      >
                        <Hand className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Start Tapping
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={showTutorialAgain} 
                        className="w-full mt-3 sm:mt-4 border-blue-200 text-blue-700 hover:text-blue-800 shadow-sm"
                      >
                        <Info className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        How to Play
                      </Button>
                    </div>
                    
                    <div className="bg-white/90 rounded-lg shadow-lg p-3 sm:p-4 border border-blue-100">
                      <div className="flex items-center mb-3 sm:mb-4">
                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 mr-2" />
                        <h2 className="text-lg sm:text-xl font-semibold text-blue-700">Leaderboard</h2>
                      </div>
                      
                      <div className="space-y-1 sm:space-y-2">
                        {leaderboardData.map((entry, index) => (
                          <div 
                            key={index}
                            className={`flex justify-between items-center p-1 sm:p-2 rounded ${
                              index === 0 ? 'bg-amber-100' :
                              index === 1 ? 'bg-gray-100' :
                              index === 2 ? 'bg-amber-50' : ''
                            }`}
                          >
                            <div className="flex items-center">
                              <span className={`
                                w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full mr-2 text-xs sm:text-sm
                                ${index === 0 ? 'bg-amber-500 text-white' : 
                                  index === 1 ? 'bg-gray-400 text-white' :
                                  index === 2 ? 'bg-amber-400 text-white' : 'bg-gray-200'
                                }
                              `}>
                                {index + 1}
                              </span>
                              <span className="text-sm">{entry.username}</span>
                            </div>
                            <div className="font-semibold text-sm">{entry.score}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[75vh] glass-card bg-gradient-to-r from-blue-50/90 to-purple-50/90 border border-white/30 rounded-xl">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <style>
        {`
          @keyframes fadeUpAndOut {
            0% { opacity: 1; transform: translate(-50%, -50%); }
            100% { opacity: 0; transform: translate(-50%, -100%); }
          }
          
          @keyframes float-0 {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(20px, -20px, 0) scale(1.05); }
          }
          
          @keyframes float-1 {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(-20px, 20px, 0) scale(1.05); }
          }
          
          @keyframes float-2 {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(15px, 15px, 0) scale(1.05); }
          }
          
          .animate-bounce-gentle {
            animation: bounce-gentle 3s infinite;
          }
          
          @keyframes bounce-gentle {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(0, -10px, 0); }
          }
          
          .animate-pulse-gentle {
            animation: pulse-gentle 2s infinite;
          }
          
          @keyframes pulse-gentle {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
          
          .glass-card {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
          }
          
          .glass {
            background: rgba(255, 255, 255, 0.7);
            box-shadow: 0 4px 10px rgba(31, 38, 135, 0.1);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            border-radius: 0.5rem;
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
          
          /* iOS-specific fixes */
          @supports (-webkit-touch-callout: none) {
            .touch-none {
              touch-action: manipulation;
              -webkit-tap-highlight-color: transparent;
            }
          }
        `}
      </style>
      
      {/* Include the GameAssets component with callback for loading completion */}
      <GameAssets onAssetsLoaded={handleAssetsLoaded} />
    </div>
  );
};

export default FrenGame;
