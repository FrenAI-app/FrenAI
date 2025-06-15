
// Secure input validation utilities
export const validateInput = {
  // Sanitize text input to prevent XSS - only remove truly dangerous content
  sanitizeText: (input: string): string => {
    if (!input) return '';
    // Only remove the most dangerous patterns, allow normal typing
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  },

  // Validate username with proper constraints
  username: (username: string): { isValid: boolean; error?: string } => {
    const sanitized = username.trim();
    
    if (!sanitized) {
      return { isValid: false, error: 'Username is required' };
    }
    
    if (sanitized.length < 2) {
      return { isValid: false, error: 'Username must be at least 2 characters' };
    }
    
    if (sanitized.length > 30) {
      return { isValid: false, error: 'Username must be less than 30 characters' };
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
      return { isValid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
    }
    
    return { isValid: true };
  },

  // Validate bio content
  bio: (bio: string): { isValid: boolean; error?: string } => {
    const sanitized = bio.trim();
    
    if (sanitized.length > 500) {
      return { isValid: false, error: 'Bio must be less than 500 characters' };
    }
    
    return { isValid: true };
  },

  // Validate wallet address format
  walletAddress: (address: string): { isValid: boolean; error?: string } => {
    const sanitized = address.trim();
    
    if (!sanitized) {
      return { isValid: true }; // Optional field
    }
    
    // Basic Solana address validation (base58, 32-44 characters)
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(sanitized)) {
      return { isValid: false, error: 'Invalid wallet address format' };
    }
    
    return { isValid: true };
  },

  // Validate file uploads
  avatarFile: (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
    }
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 5MB' };
    }
    
    return { isValid: true };
  },

  // Validate avatar prompt for generation
  avatarPrompt: (prompt: string): { isValid: boolean; error?: string } => {
    const sanitized = prompt.trim();
    
    if (!sanitized) {
      return { isValid: false, error: 'Description is required' };
    }
    
    if (sanitized.length < 10) {
      return { isValid: false, error: 'Description must be at least 10 characters' };
    }
    
    if (sanitized.length > 500) {
      return { isValid: false, error: 'Description must be less than 500 characters' };
    }
    
    const wordCount = sanitized.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 3) {
      return { isValid: false, error: 'Description must contain at least 3 words' };
    }
    
    // Check for inappropriate content patterns
    const inappropriatePatterns = [
      /\b(nude|naked|explicit|sexual)\b/gi,
      /\b(violence|violent|kill|murder)\b/gi,
      /\b(hate|racist|discriminat)\b/gi
    ];
    
    for (const pattern of inappropriatePatterns) {
      if (pattern.test(sanitized)) {
        return { isValid: false, error: 'Description contains inappropriate content' };
      }
    }
    
    return { isValid: true };
  }
};
