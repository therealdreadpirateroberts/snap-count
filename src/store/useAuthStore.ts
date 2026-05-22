import { create } from 'zustand';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const AUTH_FILE = (FileSystem as any)['documentDirectory'] + 'mockmaxxing_auth_v2.json';

// Simple Universal Storage Helper
const authStorage = {
  async getItem(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return typeof window !== 'undefined' ? localStorage.getItem('mockmaxxing_auth_v2') : null;
    } else {
      try {
        const info = await FileSystem.getInfoAsync(AUTH_FILE);
        if (info.exists) {
          return await FileSystem.readAsStringAsync(AUTH_FILE);
        }
      } catch (e) {
        console.error('Error reading auth storage:', e);
      }
      return null;
    }
  },
  async setItem(value: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('mockmaxxing_auth_v2', value);
      }
    } else {
      try {
        await FileSystem.writeAsStringAsync(AUTH_FILE, value);
      } catch (e) {
        console.error('Error writing auth storage:', e);
      }
    }
  }
};

// Store Types
export interface UserPreferences {
  scoring: 'Standard' | 'Half-PPR' | 'PPR' | 'Dynasty';
  draftPos: number;
  draftStrategy?: 'Late QB/TE Focus' | 'Hero RB' | 'Zero RB' | 'Balanced' | 'Robust RB' | 'Elite QB/TE Premium';
}

export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  avatarUrl: string;
  provider: 'google' | 'apple' | 'email';
  preferences: UserPreferences;
  phoneNumber?: string;
}

export interface RegisteredUser {
  email: string;
  passwordHash: string; // Plaintext/base64 mock password validation
  name: string;
  firstName: string;
  avatarUrl: string;
  preferences: UserPreferences;
  phoneNumber?: string;
}

interface AuthState {
  user: User | null;
  registeredUsers: { [email: string]: RegisteredUser };
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  initAuth: () => Promise<void>;
  loginWithProvider: (provider: 'google' | 'apple', preferences?: UserPreferences, customName?: string) => Promise<void>;
  registerWithEmail: (email: string, passwordHash: string, name: string, firstName: string, preferences: UserPreferences, phoneNumber?: string) => Promise<boolean>;
  loginWithEmail: (email: string, passwordHash: string) => Promise<boolean>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  updateProfile: (name: string, email: string, phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
  resetPasswordWithPhone: (email: string, phoneNumber: string, newPasswordHash: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

// Generate a premium username
const generateFantasyName = (email: string): string => {
  const prefix = email.split('@')[0].substring(0, 12).replace(/[^a-zA-Z0-9]/g, '_');
  const suffixes = ['_Coach', '_Drafter', '_Wizard', '_Maxxer', '_Guru', '_Dynasty'];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `@${prefix}${randomSuffix}`;
};

// Extract a capitalized first name from any user display name
export const extractFirstName = (fullName: string): string => {
  if (!fullName) return 'COACH';
  // Clean up common social name prefixes like @google_coach or @Apple_Legend
  let clean = fullName.replace(/^@/, '');
  // Split by spaces, underscores or hyphens
  let parts = clean.split(/[\s_-]+/);
  // Get the first part
  let first = parts[0] || 'COACH';
  // If it's email or social prefix like "google", "apple", capitalize nicely
  if (first.toLowerCase() === 'google') return 'Google';
  if (first.toLowerCase() === 'apple') return 'Apple';
  if (first.toLowerCase() === 'email') return 'Email';
  return first.charAt(0).toUpperCase() + first.slice(1);
};

// Select a premium avatar based on indexing
const PREMIUM_AVATARS = [
  '🏈', '🏆', '🧢', '📋', '🤖', '🥇', '👑', '🧙‍♂️'
];
export const getRandomPremiumAvatar = () => {
  return PREMIUM_AVATARS[Math.floor(Math.random() * PREMIUM_AVATARS.length)];
};

export const useAuthStore = create<AuthState>((set, get) => {
  // Save helper to persist state changes
  const saveState = async (user: User | null, registeredUsers: { [email: string]: RegisteredUser }) => {
    try {
      const stateToSave = JSON.stringify({ user, registeredUsers });
      await authStorage.setItem(stateToSave);
    } catch (e) {
      console.error('Failed to save auth state:', e);
    }
  };

  return {
    user: null,
    registeredUsers: {},
    isLoading: true,
    isInitialized: false,

    initAuth: async () => {
      set({ isLoading: true });
      
      const defaultUser: User = {
        id: 'email_brad_default',
        email: 'lou.bradstafford@gmail.com',
        name: '@Brad',
        firstName: 'Brad',
        avatarUrl: '👑',
        provider: 'apple', // CEO is logged in via Apple by default
        preferences: {
          scoring: 'Half-PPR',
          draftPos: 1,
          draftStrategy: 'Hero RB'
        },
        phoneNumber: '502-216-6336'
      };

      const seedBots: { [email: string]: RegisteredUser } = {
        'andy@mockmax.com': { email: 'andy@mockmax.com', passwordHash: 'andy_pass', name: '@Andy_Coach', firstName: 'Andy', avatarUrl: '🧢', preferences: { scoring: 'Half-PPR', draftPos: 2, draftStrategy: 'Balanced' } },
        'mike@mockmax.com': { email: 'mike@mockmax.com', passwordHash: 'mike_pass', name: '@Mike_Guru', firstName: 'Mike', avatarUrl: '🏈', preferences: { scoring: 'Half-PPR', draftPos: 3, draftStrategy: 'Hero RB' } },
        'jason@mockmax.com': { email: 'jason@mockmax.com', passwordHash: 'jason_pass', name: '@Jason_Wizard', firstName: 'Jason', avatarUrl: '📋', preferences: { scoring: 'Half-PPR', draftPos: 4, draftStrategy: 'Late QB/TE Focus' } },
        'sarah@mockmax.com': { email: 'sarah@mockmax.com', passwordHash: 'sarah_pass', name: '@Sarah_Maxxer', firstName: 'Sarah', avatarUrl: '👑', preferences: { scoring: 'Half-PPR', draftPos: 5, draftStrategy: 'Hero RB' } },
        'david@mockmax.com': { email: 'david@mockmax.com', passwordHash: 'david_pass', name: '@David_Drafter', firstName: 'David', avatarUrl: '🤖', preferences: { scoring: 'Half-PPR', draftPos: 6, draftStrategy: 'Hero RB' } },
        'jessica@mockmax.com': { email: 'jessica@mockmax.com', passwordHash: 'jessica_pass', name: '@Jessica_Dynasty', firstName: 'Jessica', avatarUrl: '🏆', preferences: { scoring: 'Half-PPR', draftPos: 7, draftStrategy: 'Balanced' } },
        'michael@mockmax.com': { email: 'michael@mockmax.com', passwordHash: 'michael_pass', name: '@Michael_Pro', firstName: 'Michael', avatarUrl: '🥇', preferences: { scoring: 'Half-PPR', draftPos: 8, draftStrategy: 'Balanced' } },
        'emily@mockmax.com': { email: 'emily@mockmax.com', passwordHash: 'emily_pass', name: '@Emily_Legend', firstName: 'Emily', avatarUrl: '🧢', preferences: { scoring: 'Half-PPR', draftPos: 9, draftStrategy: 'Balanced' } },
        'james@mockmax.com': { email: 'james@mockmax.com', passwordHash: 'james_pass', name: '@James_Champ', firstName: 'James', avatarUrl: '🧙‍♂️', preferences: { scoring: 'Half-PPR', draftPos: 10, draftStrategy: 'Balanced' } },
        'ashley@mockmax.com': { email: 'ashley@mockmax.com', passwordHash: 'ashley_pass', name: '@Ashley_Elite', firstName: 'Ashley', avatarUrl: '👑', preferences: { scoring: 'Half-PPR', draftPos: 11, draftStrategy: 'Robust RB' } },
        'robert@mockmax.com': { email: 'robert@mockmax.com', passwordHash: 'robert_pass', name: '@Robert_Stats', firstName: 'Robert', avatarUrl: '🏈', preferences: { scoring: 'Half-PPR', draftPos: 12, draftStrategy: 'Balanced' } },
        'sophia@mockmax.com': { email: 'sophia@mockmax.com', passwordHash: 'sophia_pass', name: '@Sophia_ZeroRB', firstName: 'Sophia', avatarUrl: '👑', preferences: { scoring: 'Half-PPR', draftPos: 8, draftStrategy: 'Zero RB' } },
        'william@mockmax.com': { email: 'william@mockmax.com', passwordHash: 'william_pass', name: '@William_Premium', firstName: 'William', avatarUrl: '🤖', preferences: { scoring: 'Half-PPR', draftPos: 5, draftStrategy: 'Elite QB/TE Premium' } }
      };

      try {
        const storedStr = await authStorage.getItem();
        let restoredUser = defaultUser;
        let restoredRegistered: { [email: string]: RegisteredUser } = {
          'lou.bradstafford@gmail.com': {
            email: 'lou.bradstafford@gmail.com',
            passwordHash: 'brad_pass',
            name: '@Brad',
            firstName: 'Brad',
            avatarUrl: '👑',
            preferences: { scoring: 'Half-PPR', draftPos: 1, draftStrategy: 'Hero RB' },
            phoneNumber: '502-216-6336'
          },
          'brad.apple@mockmax.com': {
            email: 'lou.bradstafford@gmail.com',
            passwordHash: 'social_bypass_apple',
            name: '@Brad',
            firstName: 'Brad',
            avatarUrl: '👑',
            preferences: { scoring: 'Half-PPR', draftPos: 1, draftStrategy: 'Hero RB' },
            phoneNumber: '502-216-6336'
          },
          'brad.google@mockmax.com': {
            email: 'lou.bradstafford@gmail.com',
            passwordHash: 'social_bypass_google',
            name: '@Brad',
            firstName: 'Brad',
            avatarUrl: '👑',
            preferences: { scoring: 'Half-PPR', draftPos: 1, draftStrategy: 'Hero RB' },
            phoneNumber: '502-216-6336'
          },
          ...seedBots
        };

        if (storedStr) {
          const parsed = JSON.parse(storedStr);
          if (parsed.user) {
            restoredUser = parsed.user;
            // Robust active session migration for the CEO
            if (
              restoredUser.email === 'brad@mockmax.com' ||
              restoredUser.name === '@Brad_Drafter' ||
              restoredUser.email === 'appledynasty105.apple@mockmax.com' ||
              restoredUser.name === '@apple_dynasty105' ||
              restoredUser.name === '@appe_dynasty105'
            ) {
              restoredUser = {
                ...restoredUser,
                email: 'lou.bradstafford@gmail.com',
                name: '@Brad',
                firstName: 'Brad',
                phoneNumber: '502-216-6336',
                provider: 'apple'
              };
            }
          }
          if (parsed.registeredUsers) {
            restoredRegistered = {
              ...restoredRegistered,
              ...parsed.registeredUsers
            };
          }
        }
        
        // Ensure all registered users have proper firstNames
        if (restoredUser && !restoredUser.firstName) {
          restoredUser.firstName = extractFirstName(restoredUser.name || restoredUser.email || 'COACH');
        }
        
        Object.keys(restoredRegistered).forEach(email => {
          if (!restoredRegistered[email].firstName) {
            restoredRegistered[email].firstName = extractFirstName(restoredRegistered[email].name || email);
          }
        });

        set({
          user: restoredUser,
          registeredUsers: restoredRegistered,
          isInitialized: true,
          isLoading: false
        });

        // Save state immediately
        await saveState(restoredUser, restoredRegistered);
        return;
      } catch (e) {
        console.error('Failed to restore auth session:', e);
      }
      set({ isInitialized: true, isLoading: false });
    },

    loginWithProvider: async (provider: 'google' | 'apple', preferences?: UserPreferences, customName?: string) => {
      const { registeredUsers } = get();
      const defaultPrefs: UserPreferences = preferences || {
        scoring: 'Half-PPR',
        draftPos: Math.floor(Math.random() * 12) + 1,
        draftStrategy: 'Late QB/TE Focus'
      };
      
      // Standardize the Coach Name
      const name = customName ? customName.trim() : (provider === 'google' ? 'Google Drafter' : 'Apple Legend');
      const firstName = extractFirstName(name);
      
      // Generate a unique, deterministic mock email address from the Coach Name to prevent duplicates
      const cleanedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `${cleanedName}.${provider}@mockmax.com`;
      const avatarUrl = provider === 'google' ? '🤖' : '👑';

      // Check if this user is already registered in our device store database
      const existingRegisteredUser = registeredUsers[email];
      
      let finalPrefs = defaultPrefs;
      let finalAvatar = avatarUrl;
      let finalName = name;
      let finalFirstName = firstName;

      if (existingRegisteredUser) {
        // Best Practice: If they already exist, load their existing profile and preferences!
        console.log(`🤖 [Auth Store] Existing ${provider} user found. Signing in to:`, email);
        finalPrefs = existingRegisteredUser.preferences;
        finalAvatar = existingRegisteredUser.avatarUrl;
        finalName = existingRegisteredUser.name;
        finalFirstName = existingRegisteredUser.firstName || extractFirstName(finalName);
      } else {
        // If they are a new user, register them in registeredUsers to persist them
        console.log(`🤖 [Auth Store] Registering new ${provider} user:`, email);
        const newRegistered: RegisteredUser = {
          email,
          passwordHash: `social_bypass_${provider}`, // Bypass for social sign-ins
          name: finalName,
          firstName: finalFirstName,
          avatarUrl: finalAvatar,
          preferences: finalPrefs
        };
        
        // Update the registered list
        set({
          registeredUsers: {
            ...registeredUsers,
            [email]: newRegistered
          }
        });
      }

      const newUser: User = {
        id: `${provider}_${cleanedName}_${Date.now()}`,
        email: existingRegisteredUser ? existingRegisteredUser.email : email,
        name: finalName,
        firstName: finalFirstName,
        avatarUrl: finalAvatar,
        provider,
        preferences: finalPrefs,
        phoneNumber: existingRegisteredUser ? existingRegisteredUser.phoneNumber : undefined
      };

      set({ user: newUser });
      await saveState(newUser, get().registeredUsers);
    },

    registerWithEmail: async (email: string, passwordHash: string, name: string, firstName: string, preferences: UserPreferences, phoneNumber?: string) => {
      const { registeredUsers } = get();
      const normalizedEmail = email.trim().toLowerCase();

      if (registeredUsers[normalizedEmail]) {
        return false; // Email already exists
      }

      const avatarUrl = getRandomPremiumAvatar();

      const finalName = name.trim() || `@${firstName}_${Math.floor(100 + Math.random() * 900)}`;

      const newRegisteredUser: RegisteredUser = {
        email: normalizedEmail,
        passwordHash,
        name: finalName,
        firstName: firstName || extractFirstName(finalName),
        avatarUrl,
        preferences,
        phoneNumber: phoneNumber?.trim()
      };

      const newUsersList = {
        ...registeredUsers,
        [normalizedEmail]: newRegisteredUser
      };

      const newUser: User = {
        id: `email_${Date.now()}`,
        email: normalizedEmail,
        name: newRegisteredUser.name,
        firstName: newRegisteredUser.firstName,
        avatarUrl: newRegisteredUser.avatarUrl,
        provider: 'email',
        preferences,
        phoneNumber: phoneNumber?.trim()
      };

      set({
        registeredUsers: newUsersList,
        user: newUser
      });

      await saveState(newUser, newUsersList);
      return true;
    },

    loginWithEmail: async (email: string, passwordHash: string) => {
      const { registeredUsers } = get();
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = registeredUsers[normalizedEmail];

      if (!existingUser || existingUser.passwordHash !== passwordHash) {
        return false; // Invalid email or password
      }

      const newUser: User = {
        id: `email_${Date.now()}`,
        email: normalizedEmail,
        name: existingUser.name,
        firstName: existingUser.firstName || extractFirstName(existingUser.name || 'COACH'),
        avatarUrl: existingUser.avatarUrl,
        provider: 'email',
        preferences: existingUser.preferences,
        phoneNumber: existingUser.phoneNumber
      };

      set({ user: newUser });
      await saveState(newUser, registeredUsers);
      return true;
    },

    updatePreferences: async (prefs: Partial<UserPreferences>) => {
      const { user, registeredUsers } = get();
      if (!user) return;

      const updatedUser: User = {
        ...user,
        preferences: {
          ...user.preferences,
          ...prefs
        }
      };

      // Also update in registered list if they are an email user
      let updatedRegistered = { ...registeredUsers };
      if (user.provider === 'email' && registeredUsers[user.email]) {
        updatedRegistered[user.email] = {
          ...registeredUsers[user.email],
          preferences: updatedUser.preferences
        };
      }

      set({ user: updatedUser, registeredUsers: updatedRegistered });
      await saveState(updatedUser, updatedRegistered);
    },

    updateAvatar: async (avatarUrl: string) => {
      const { user, registeredUsers } = get();
      if (!user) return;

      const updatedUser: User = {
        ...user,
        avatarUrl
      };

      let updatedRegistered = { ...registeredUsers };
      if (user.provider === 'email' && registeredUsers[user.email]) {
        updatedRegistered[user.email] = {
          ...registeredUsers[user.email],
          avatarUrl
        };
      }

      set({ user: updatedUser, registeredUsers: updatedRegistered });
      await saveState(updatedUser, updatedRegistered);
    },

    updateProfile: async (name: string, email: string, phoneNumber: string) => {
      const { user, registeredUsers } = get();
      if (!user) return { success: false, error: 'No active session' };

      const trimmedName = name.trim();
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPhone = phoneNumber.trim();

      const finalName = trimmedName.startsWith('@') ? trimmedName : `@${trimmedName}`;

      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }

      if (trimmedEmail !== user.email && registeredUsers[trimmedEmail]) {
        return { success: false, error: 'This email address is already in use.' };
      }

      const updatedUser: User = {
        ...user,
        name: finalName,
        email: trimmedEmail,
        firstName: extractFirstName(finalName),
        phoneNumber: trimmedPhone
      };

      let updatedRegistered = { ...registeredUsers };
      if (user.provider === 'email') {
        const existingRecord = registeredUsers[user.email];
        if (existingRecord) {
          if (trimmedEmail !== user.email) {
            delete updatedRegistered[user.email];
          }
          updatedRegistered[trimmedEmail] = {
            ...existingRecord,
            email: trimmedEmail,
            name: finalName,
            firstName: updatedUser.firstName,
            phoneNumber: trimmedPhone
          };
        }
      }

      set({ user: updatedUser, registeredUsers: updatedRegistered });
      await saveState(updatedUser, updatedRegistered);
      return { success: true };
    },

    resetPasswordWithPhone: async (email: string, phoneNumber: string, newPasswordHash: string) => {
      const { registeredUsers } = get();
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPhone = phoneNumber.trim();

      const existingRecord = registeredUsers[normalizedEmail];
      if (!existingRecord) {
        return { success: false, error: 'Invalid email address. Coach record not found.' };
      }

      const recordPhone = existingRecord.phoneNumber || '';
      const cleanPhone = (p: string) => p.replace(/\D/g, '');
      if (!recordPhone || cleanPhone(recordPhone) !== cleanPhone(normalizedPhone)) {
        return { success: false, error: 'Verification failed. Phone number does not match our records.' };
      }

      const updatedRecord: RegisteredUser = {
        ...existingRecord,
        passwordHash: newPasswordHash
      };

      const updatedRegistered = {
        ...registeredUsers,
        [normalizedEmail]: updatedRecord
      };

      const newUser: User = {
        id: `email_${Date.now()}`,
        email: normalizedEmail,
        name: existingRecord.name,
        firstName: existingRecord.firstName || extractFirstName(existingRecord.name || 'COACH'),
        avatarUrl: existingRecord.avatarUrl,
        provider: 'email',
        preferences: existingRecord.preferences,
        phoneNumber: existingRecord.phoneNumber
      };

      set({ user: newUser, registeredUsers: updatedRegistered });
      await saveState(newUser, updatedRegistered);
      return { success: true };
    },

    logout: async () => {
      const { registeredUsers } = get();
      set({ user: null });
      await saveState(null, registeredUsers);
    }
  };
});
