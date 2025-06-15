
import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCircle, Edit, Save, X, User, Mail, Twitter, Github, Linkedin, Link as LinkIcon, Upload } from 'lucide-react';
import AuthButton from './AuthButton';
import PrivyWalletConnect from './PrivyWalletConnect';
import { Separator } from '@/components/ui/separator';
import { usePrivyAuth } from '@/context/PrivyContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from './ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Form schema for profile validation
const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(30, {
    message: "Username cannot be longer than 30 characters.",
  }),
  bio: z.string().max(200, {
    message: "Bio cannot be longer than 200 characters."
  }).optional().or(z.literal('')),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional().or(z.literal('')),
  theme: z.enum(['light', 'dark', 'system'], {
    required_error: "Please select a theme.",
  }).default('system'),
  twitter: z.string().url({message: "Please enter a valid URL"}).optional().or(z.literal('')),
  github: z.string().url({message: "Please enter a valid URL"}).optional().or(z.literal('')),
  linkedin: z.string().url({message: "Please enter a valid URL"}).optional().or(z.literal('')),
  website: z.string().url({message: "Please enter a valid URL"}).optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileDisplay = () => {
  const { profile, loading, updateProfile } = useUser();
  const { user: privyUser, authenticated } = usePrivyAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  // Form setup with react-hook-form and zod validation
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      bio: '',
      email: '',
      theme: 'system',
      twitter: '',
      github: '',
      linkedin: '',
      website: '',
      location: '',
    },
    mode: "onChange",
  });

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || '',
        bio: profile.bio || '',
        email: profile.email || '',
        theme: profile.theme as 'light' | 'dark' | 'system' || 'system',
        twitter: profile.twitter || '',
        github: profile.github || '',
        linkedin: profile.linkedin || '',
        website: profile.website || '',
        location: profile.location || '',
      });
    }
  }, [profile, form]);
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-5 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Determine the username to display
  const displayUsername = () => {
    if (profile && profile.username) {
      return profile.username;
    }
    
    if (privyUser) {
      // Try to get name from Privy
      if (privyUser.email) {
        const email = String(privyUser.email);
        return email.split('@')[0];
      }
      
      // Get Google name if available
      if (privyUser.linkedAccounts) {
        for (const account of privyUser.linkedAccounts) {
          if (account.type === 'google_oauth' && account.detail?.name) {
            return account.detail.name;
          }
        }
      }
      
      return 'Fren';
    }
    
    return 'Guest User';
  };

  const handleSaveProfile = async (data: ProfileFormValues) => {
    try {
      await updateProfile({
        username: data.username,
        bio: data.bio,
        email: data.email,
        theme: data.theme,
        twitter: data.twitter,
        github: data.github,
        linkedin: data.linkedin,
        website: data.website,
        location: data.location,
      });
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      
      // Dispatch a custom event to notify other components about the profile name update
      window.dispatchEvent(new CustomEvent('PROFILE_NAME_UPDATED', { 
        detail: { username: data.username }
      }));
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive"
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !profile?.user_id) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${profile.user_id}/${Date.now()}.${fileExt}`;

    setUploadingAvatar(true);
    
    try {
      // Check if avatars bucket exists and create it if it doesn't
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
        
        if (!avatarBucketExists) {
          // Create the bucket since it doesn't exist
          await supabase.storage.createBucket('avatars', {
            public: true,
            fileSizeLimit: 5242880 // 5MB limit
          });
          console.log("Created avatars bucket");
        }
      } catch (bucketError) {
        console.error("Error checking or creating bucket:", bucketError);
      }
      
      // Upload file
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      console.log("File uploaded successfully, public URL:", publicUrl);
      
      // Update profile with new avatar URL
      await updateProfile({
        avatar_url: publicUrl
      });
      
      setAvatarDialogOpen(false);
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated."
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload your avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingAvatar(false);
    }
  };
  
  if (!authenticated) {
    return (
      <div className="space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Guest User</CardTitle>
            <CardDescription>Please sign in to manage your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-6">
              <UserCircle className="h-16 w-16 text-muted-foreground/30" />
            </div>
            <p className="text-center text-muted-foreground">
              Connect your wallet or sign in to see your profile details
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <AuthButton />
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Define the renderSocialLinks function
  const renderSocialLinks = () => {
    if (!profile) return null;
    
    return (
      <div className="flex gap-3 mt-2">
        {profile.twitter && (
          <a 
            href={profile.twitter} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-400 hover:text-blue-500"
          >
            <Twitter size={16} />
          </a>
        )}
        {profile.github && (
          <a 
            href={profile.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-800 hover:text-gray-600"
          >
            <Github size={16} />
          </a>
        )}
        {profile.linkedin && (
          <a 
            href={profile.linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-700 hover:text-blue-800"
          >
            <Linkedin size={16} />
          </a>
        )}
        {profile.website && (
          <a 
            href={profile.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-green-600 hover:text-green-700"
          >
            <LinkIcon size={16} />
          </a>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{displayUsername()}</CardTitle>
              <CardDescription>Account Details</CardDescription>
            </div>
            {profile && !isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            )}
            {isEditing && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="ml-1">Cancel</span>
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={form.handleSubmit(handleSaveProfile)}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  <Save className="h-4 w-4" />
                  <span className="ml-1">Save</span>
                </Button>
              </div>
            )}
          </div>
          {profile && profile.chain && (
            <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-100 mt-2 self-start">
              {profile.chain}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile details section */}
            <div className="space-y-4 flex-1">
              {isEditing ? (
                <Form {...form}>
                  <form className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="mb-4">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="social">Social Links</TabsTrigger>
                        <TabsTrigger value="preferences">Preferences</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="general" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <User className="h-4 w-4 text-amber-500" />
                                Username
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-amber-500" />
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your email (optional)" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about yourself (max 200 characters)" 
                                  {...field} 
                                  rows={3}
                                />
                              </FormControl>
                              <FormDescription>
                                {field.value?.length || 0}/200 characters
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, Country (optional)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      
                      <TabsContent value="social" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Twitter className="h-4 w-4 text-blue-400" />
                                Twitter
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="https://twitter.com/username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="github"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Github className="h-4 w-4 text-gray-800" />
                                GitHub
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="https://github.com/username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="linkedin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Linkedin className="h-4 w-4 text-blue-700" />
                                LinkedIn
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="https://linkedin.com/in/username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <LinkIcon className="h-4 w-4 text-green-600" />
                                Website
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="https://yourwebsite.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      
                      <TabsContent value="preferences" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="theme"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Theme Preference</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a theme preference" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="light">Light</SelectItem>
                                  <SelectItem value="dark">Dark</SelectItem>
                                  <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Choose how the app should appear to you
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    </Tabs>
                  </form>
                </Form>
              ) : (
                <>
                  {/* Removed wallet information section as requested */}
                  
                  {profile?.email && (
                    <div>
                      <span className="text-sm font-medium flex items-center gap-2 mb-1">
                        <Mail className="h-4 w-4 text-amber-500" />
                        Email
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {profile.email}
                      </span>
                    </div>
                  )}
                  
                  {profile?.location && (
                    <div>
                      <span className="text-sm font-medium mb-1 block">Location</span>
                      <span className="text-sm text-muted-foreground">
                        {profile.location}
                      </span>
                    </div>
                  )}
                  
                  {profile?.bio && (
                    <div>
                      <span className="text-sm font-medium mb-1 block">Bio</span>
                      <p className="text-sm text-muted-foreground">
                        {profile.bio}
                      </p>
                    </div>
                  )}
                  
                  {profile?.created_at && (
                    <div>
                      <span className="text-sm font-medium">Member since</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Manage your account connections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Privy Authentication</h3>
            <PrivyWalletConnect />
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Quick Authentication</h3>
            <AuthButton />
          </div>
        </CardContent>
      </Card>

      {/* Avatar upload dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Profile Picture</DialogTitle>
            <DialogDescription>
              Choose an image to use as your profile picture. Max file size: 5MB.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="bg-amber-100 text-amber-800 text-4xl">
                  {form.getValues().username?.[0]?.toUpperCase() || <User size={32} />}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <label 
                htmlFor="avatar-upload" 
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                {uploadingAvatar ? 'Uploading...' : 'Select Image'}
              </label>
              <Input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarUpload} 
                disabled={uploadingAvatar}
                className="hidden" 
              />
              <span className="text-xs text-muted-foreground mt-2">
                Recommended: Square image, at least 128x128px
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileDisplay;
