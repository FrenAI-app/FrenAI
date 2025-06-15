
import React, { useState, useEffect } from 'react';
import { usePrivyAuth } from '@/context/PrivyContext';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const PostAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, authenticated, login, ready } = usePrivyAuth();
  const navigate = useNavigate();

  // Debug logging
  console.log('PostAnnouncement Debug:', {
    authenticated,
    ready,
    userEmail: user?.email,
    userId: user?.id,
    isAdmin: authenticated && user?.email === 'hellofrens@frenai.app'
  });

  const isAdmin = authenticated && user?.email === 'hellofrens@frenai.app';

  useEffect(() => {
    // Wait for Privy to be ready before checking authentication
    if (!ready) return;

    if (!authenticated) {
      console.log('User not authenticated, showing sign in prompt');
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page.",
        variant: "destructive"
      });
      return;
    }

    if (authenticated && !isAdmin) {
      console.log('User authenticated but not admin:', user?.email);
      toast({
        title: "Access Denied",
        description: "Only the admin can post announcements.",
        variant: "destructive"
      });
      navigate('/announcements');
    }
  }, [authenticated, isAdmin, navigate, ready, user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Attempting to submit announcement:', { title: title.trim(), message: message.trim() });
    
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and message fields.",
        variant: "destructive"
      });
      return;
    }

    if (!isAdmin) {
      console.log('Submit blocked - user is not admin:', user?.email);
      toast({
        title: "Access Denied",
        description: "Only the admin can post announcements.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Inserting announcement to Supabase...');
      const { data, error } = await supabase
        .from('announcements')
        .insert([
          {
            title: title.trim(),
            message: message.trim(),
            admin_id: user?.id || '',
            admin_email: user?.email || ''
          }
        ])
        .select();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Announcement posted successfully');
      toast({
        title: "Success",
        description: "Announcement posted successfully!",
      });

      // Reset form and navigate back
      setTitle('');
      setMessage('');
      navigate('/announcements');
    } catch (error) {
      console.error('Error posting announcement:', error);
      toast({
        title: "Error",
        description: `Failed to post announcement: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while Privy initializes
  if (!ready) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card className="bg-white shadow-md rounded-lg">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Loading...</h3>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card className="bg-white shadow-md rounded-lg">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication Required</h3>
            <p className="text-gray-600 mb-6">Please sign in with the admin account to post announcements.</p>
            <Button onClick={() => login()} className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card className="bg-white shadow-md rounded-lg">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Access Denied</h3>
            <p className="text-gray-600 mb-2">Only the admin (hellofrens@frenai.app) can post announcements.</p>
            <p className="text-gray-500 mb-6 text-sm">Current user: {user?.email || 'Unknown'}</p>
            <Button onClick={() => navigate('/announcements')} variant="outline">
              View Announcements
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/announcements')}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Announcements
        </Button>
      </div>

      <Card className="bg-white shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Post New Announcement</CardTitle>
          <CardDescription>
            Share important updates with the FrenAI community
          </CardDescription>
          <div className="text-sm text-green-600">
            Signed in as: {user?.email}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title *
              </Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message *
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your announcement message..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/announcements')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting || !title.trim() || !message.trim()}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post Announcement
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostAnnouncement;
