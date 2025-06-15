
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useChat } from '../context/ChatContext';
import Message from './Message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Trash2, Anchor, Heart, Users } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useIsMobile } from '@/hooks/use-mobile';
import RoundDuckMascot from './RoundDuckMascot';
import MoodBasedDuck from './MoodBasedDuck';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUser } from '@/context/UserContext';
import EmotionalAwarenessSettings from './EmotionalAwarenessSettings';
import { usePrivyAuth } from '@/context/PrivyContext';
import PersonalitySelector from './PersonalitySelector';
import { saveMemory, getUserAIPreferences, type AIPersonality } from '@/lib/aiMemoryBank';
import UserHeartAvatar from './UserHeartAvatar';

// Memoized helper function
const parseJsonToRecord = (value: any): Record<string, any> => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value;
  }
  return {};
};

const ChatInterface = () => {
  const { 
    messages, 
    loading, 
    sendMessage, 
    clearMessages, 
    personalitySettings, 
    lastDetectedMood,
    updatePersonalitySettings
  } = useChat();
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isMobile = useIsMobile();
  const [showDuckMascot, setShowDuckMascot] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const krakenButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const { profile } = useUser();
  const { authenticated } = usePrivyAuth();
  const [isComposing, setIsComposing] = useState(false);
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState<AIPersonality | null>(null);

  // Memoize expensive calculations
  const containerHeight = useMemo(() => {
    return isMobile ? 'h-[calc(100vh-200px)] min-h-[500px]' : 'h-[70vh] min-h-[500px]';
  }, [isMobile]);

  const isUserAuthenticated = useMemo(() => user || authenticated, [user, authenticated]);

  const getDisplayName = useCallback(() => {
    return profile?.username || 'Fren';
  }, [profile?.username]);

  // Optimized auth state management
  useEffect(() => {
    let mounted = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (mounted) setUser(session?.user || null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setUser(session?.user || null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Debounced send handler
  const handleSend = useCallback(() => {
    if (input.trim() && !loading && !isComposing) {
      sendMessage(input);
      
      // Save important information to memory bank (background task)
      if (user?.id && input.length > 20) {
        setTimeout(() => saveImportantMemories(input), 0);
      }
      
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        if (isMobile) {
          textareaRef.current.blur();
          setTimeout(() => textareaRef.current?.focus(), 100);
        }
      }
    }
  }, [input, loading, isComposing, sendMessage, isMobile, user?.id]);

  // Optimized keyboard handling
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend, isComposing]);

  const handleCompositionStart = useCallback(() => setIsComposing(true), []);
  const handleCompositionEnd = useCallback(() => setIsComposing(false), []);

  // Throttled textarea resize
  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, isMobile ? 80 : 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [isMobile]);

  // Optimized scroll effect
  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: isMobile ? 'auto' : 'smooth',
          block: 'end'
        });
      });
    }
  }, [messages.length, isMobile]);

  // Optimized kraken toggle
  const releaseTheKraken = useCallback(() => {
    setShowDuckMascot(prev => !prev);
    
    const buttonPosition = krakenButtonRef.current?.getBoundingClientRect();
    const event = new CustomEvent('toggleDuckMascot', { 
      detail: { 
        show: !showDuckMascot,
        buttonPosition: buttonPosition 
      } 
    });
    document.dispatchEvent(event);
  }, [showDuckMascot]);

  // Memoized avatar renderers
  const renderDuckAvatar = useCallback((size: 'sm' | 'lg', className: string = '') => (
    <div className={`${className} flex items-center justify-center overflow-hidden`}>
      <img 
        src="/lovable-uploads/ef81092e-a30e-4954-8f1f-75de0119e44a.png"
        alt="Duck Avatar"
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  ), []);

  const renderUserHeartAvatar = useCallback((size: 'sm' | 'lg', className: string = '') => (
    <UserHeartAvatar size={size} className={className} />
  ), []);

  // Load user preferences
  useEffect(() => {
    if (user?.id) {
      getUserAIPreferences(user.id).then(preferences => {
        if (preferences?.active_personality) {
          const personality: AIPersonality = {
            ...preferences.active_personality,
            personality_traits: parseJsonToRecord(preferences.active_personality.personality_traits),
            voice_settings: parseJsonToRecord(preferences.active_personality.voice_settings)
          };
          setCurrentPersonality(personality);
        }
      }).catch(console.error);
    }
  }, [user?.id]);

  const handlePersonalityChange = useCallback((personality: AIPersonality) => {
    setCurrentPersonality(personality);
    updatePersonalitySettings({ aiName: personality.name });
  }, [updatePersonalitySettings]);

  const saveImportantMemories = useCallback(async (message: string) => {
    if (!user?.id) return;

    const personalKeywords = ['my name is', 'i am', 'i like', 'i love', 'i hate', 'i prefer'];
    const goalKeywords = ['i want to', 'my goal', 'i plan to', 'i hope to'];
    const factKeywords = ['i work at', 'i live in', 'my birthday', 'i was born'];

    const lowerMessage = message.toLowerCase();

    try {
      if (personalKeywords.some(keyword => lowerMessage.includes(keyword))) {
        await saveMemory({
          user_id: user.id,
          memory_type: 'personal',
          memory_key: `user_statement_${Date.now()}`,
          memory_value: { statement: message, detected_at: new Date().toISOString() },
          importance_score: 0.8
        });
      } else if (goalKeywords.some(keyword => lowerMessage.includes(keyword))) {
        await saveMemory({
          user_id: user.id,
          memory_type: 'goal',
          memory_key: `user_goal_${Date.now()}`,
          memory_value: { goal: message, detected_at: new Date().toISOString() },
          importance_score: 0.9
        });
      } else if (factKeywords.some(keyword => lowerMessage.includes(keyword))) {
        await saveMemory({
          user_id: user.id,
          memory_type: 'fact',
          memory_key: `user_fact_${Date.now()}`,
          memory_value: { fact: message, detected_at: new Date().toISOString() },
          importance_score: 0.7
        });
      }
    } catch (error) {
      console.error('Error saving memory:', error);
    }
  }, [user?.id]);

  // Memoized empty state
  const EmptyState = useMemo(() => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-fade-in">
      <div className="w-16 h-16 flex items-center justify-center mb-4 animate-bounce-in">
        {renderDuckAvatar('lg')}
      </div>
      <h3 className="text-xl font-medium mb-2 font-quicksand text-purple-800">Welcome to FrenAI!</h3>
      <p className={`${isMobile ? 'text-sm' : ''} text-purple-700`}>
        Send a message to start chatting with {personalitySettings.aiName}.
      </p>
      {isUserAuthenticated ? (
        <p className={`mt-2 ${isMobile ? 'text-xs' : 'text-sm'} text-purple-600`}>
          Fren learns from every conversation and adapts to your unique style. The more you chat, the better our connection becomes!
        </p>
      ) : (
        <div className={`mt-4 ${isMobile ? 'text-xs' : 'text-sm'} space-y-2 max-w-md`}>
          <p className="text-purple-700 font-medium">Sign in to unlock premium features:</p>
          <div className="text-left space-y-1 text-purple-600">
            <p>• AI learns and remembers your preferences</p>
            <p>• Personalized chat experience and moods</p>
            <p>• Access advanced emotional intelligence settings</p>
          </div>
          <p className="text-purple-500 mt-3">
            Currently chatting as guest - conversations won't be saved.
          </p>
        </div>
      )}
    </div>
  ), [renderDuckAvatar, personalitySettings.aiName, isUserAuthenticated, isMobile]);

  return (
    <>
      <div className={`enhanced-glass-card ${isMobile ? 'mx-2 rounded-xl' : 'mx-auto max-w-4xl'} ${containerHeight} flex flex-col border border-white/30 backdrop-blur-lg relative`}>
        {/* Header */}
        <div className={`flex justify-between items-center ${isMobile ? 'p-3' : 'p-4'} border-b border-white/30 bg-white/20 backdrop-blur-sm rounded-t-xl flex-shrink-0`}>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} flex items-center justify-center flex-shrink-0`}>
              {renderDuckAvatar('sm')}
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className={`font-quicksand font-semibold ${isMobile ? 'text-lg' : 'text-xl'} truncate bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent`}>
                {getDisplayName()}
              </h2>
              {currentPersonality && (
                <p className="text-xs text-purple-600 truncate">
                  {currentPersonality.name}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isMobile && (
              <Button
                ref={krakenButtonRef}
                variant="outline"
                size="icon"
                onClick={releaseTheKraken}
                title={showDuckMascot ? "Hide the Kraken" : "Release the Kraken"}
                className={`${isMobile ? 'h-8 w-8' : 'h-9 w-9'} transition-all duration-200 ${showDuckMascot ? 'bg-purple-100/30 border-purple-300/50' : 'hover:bg-amber-100/30'} bg-white/20 border-white/30`}
              >
                <Anchor className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ${showDuckMascot ? 'text-purple-600' : 'text-amber-600'}`} />
              </Button>
            )}
            
            {isUserAuthenticated && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowPersonalitySelector(true)}
                title="Change AI Personality"
                className={`${isMobile ? 'h-8 w-8' : 'h-9 w-9'} transition-all duration-200 hover:bg-blue-100/30 bg-white/20 border-white/30`}
              >
                <Users className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-blue-600`} />
              </Button>
            )}
            
            {isUserAuthenticated && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowProfileDialog(true)}
                title="Emotional Intelligence Settings"
                className={`${isMobile ? 'h-8 w-8' : 'h-9 w-9'} transition-all duration-200 hover:bg-pink-100/30 bg-white/20 border-white/30`}
              >
                <Heart className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-pink-500 animate-pulse`} />
              </Button>
            )}
            
            {isUserAuthenticated && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={clearMessages}
                title="Clear chat history"
                className={`${isMobile ? 'h-8 w-8' : 'h-9 w-9'} transition-all duration-200 hover:bg-amber-100/30 bg-white/20 border-white/30`}
              >
                <Trash2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-amber-600`} />
              </Button>
            )}
          </div>
        </div>
        
        {/* Messages Container */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 bg-white/10 backdrop-blur-sm"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: isMobile ? 'auto' : 'smooth'
          }}
        >
          {messages.length === 0 ? EmptyState : (
            messages.map((message, index) => (
              <div key={message.id} className="animate-message-appear" style={{ animationDelay: `${index * 0.05}s` }}>
                <Message 
                  message={message} 
                  aiName={personalitySettings.aiName}
                  personalityColor="text-purple-600"
                  renderAvatar={message.sender === 'ai' ? 
                    (size) => renderDuckAvatar(size) : 
                    (size) => renderUserHeartAvatar(size)
                  }
                  onAvatarClick={message.sender === 'ai' ? releaseTheKraken : undefined}
                />
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex items-start gap-2 animate-fade-in p-2">
              <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} flex items-center justify-center flex-shrink-0`}>
                {renderDuckAvatar('sm')}
              </div>
              <div className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl p-3 shadow-sm max-w-[85%]">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-purple-600 rounded-full animate-pulse"></div>
                  <div className="h-2 w-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Fren Mascot positioned above input */}
        
        
        {/* Input Container */}
        <div className={`flex items-end gap-2 ${isMobile ? 'p-3' : 'p-4'} bg-white/20 backdrop-blur-sm border-t border-white/30 rounded-b-xl flex-shrink-0`}>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={`Message ${personalitySettings.aiName}...`}
            className={`flex-1 resize-none ${isMobile ? 'min-h-[40px] max-h-[80px] text-base' : 'min-h-[44px] max-h-[120px] text-base'} transition-all duration-200 rounded-xl px-4 py-3 
              bg-white/30 backdrop-blur-sm 
              border border-white/40 
              hover:border-white/50 
              focus:border-white/60 focus:ring-2 focus:ring-purple-500/30 focus:ring-offset-1
              text-purple-800 placeholder:text-purple-600
              shadow-sm hover:shadow-md focus:shadow-md`}
            rows={1}
            disabled={loading}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="sentences"
            spellCheck="true"
          />
          <Button 
            onClick={handleSend} 
            disabled={input.trim() === '' || loading || isComposing}
            className={`rounded-full ${isMobile ? 'h-10 w-10' : 'h-11 w-11'} bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:from-purple-700 active:to-pink-700 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center touch-manipulation shadow-lg border border-white/30`}
            type="button"
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} animate-spin text-white`} />
            ) : (
              <Send className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-white`} />
            )}
          </Button>
        </div>
      </div>
      
      <MoodBasedDuck />
      <RoundDuckMascot />
      
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'sm:max-w-[600px] max-h-[90vh]'} overflow-y-auto`}>
          <EmotionalAwarenessSettings />
        </DialogContent>
      </Dialog>

      <PersonalitySelector 
        open={showPersonalitySelector}
        onOpenChange={setShowPersonalitySelector}
        onPersonalityChange={handlePersonalityChange}
      />
    </>
  );
};

export default ChatInterface;
