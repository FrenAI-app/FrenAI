
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Badge } from '@/components/ui/badge';

interface AnnouncementBadgeProps {
  children: React.ReactNode;
}

const AnnouncementBadge = ({ children }: AnnouncementBadgeProps) => {
  const [hasNew, setHasNew] = useState(false);
  const [lastViewed, setLastViewed] = useState<string | null>(null);

  useEffect(() => {
    // Get last viewed timestamp from localStorage
    const lastViewedTimestamp = localStorage.getItem('announcements_last_viewed');
    setLastViewed(lastViewedTimestamp);
    
    checkForNewAnnouncements(lastViewedTimestamp);
  }, []);

  const checkForNewAnnouncements = async (lastViewedTimestamp: string | null) => {
    try {
      let query = supabase
        .from('announcements')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);

      if (lastViewedTimestamp) {
        query = query.gt('created_at', lastViewedTimestamp);
      }

      const { data, error } = await query;

      if (error) throw error;

      setHasNew((data && data.length > 0) || !lastViewedTimestamp);
    } catch (error) {
      console.error('Error checking for new announcements:', error);
    }
  };

  // Mark announcements as viewed when tab is accessed
  const markAsViewed = () => {
    const now = new Date().toISOString();
    localStorage.setItem('announcements_last_viewed', now);
    setHasNew(false);
  };

  // Listen for tab changes to mark as viewed
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      if (event.detail === 'announcements') {
        markAsViewed();
      }
    };

    window.addEventListener('announcementTabViewed', handleTabChange as EventListener);
    
    return () => {
      window.removeEventListener('announcementTabViewed', handleTabChange as EventListener);
    };
  }, []);

  return (
    <div className="relative">
      {children}
      {hasNew && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-2 w-2 p-0 rounded-full bg-red-500 border-white border-2"
        >
          <span className="sr-only">New announcements</span>
        </Badge>
      )}
    </div>
  );
};

export default AnnouncementBadge;
