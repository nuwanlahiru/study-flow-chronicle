import { useState, useEffect } from "react";
import { UserStats } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const useStreak = (userId: string | undefined) => {
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserStats() {
      if (!userId) {
        setStreak(0);
        setLongestStreak(0);
        setLastActiveDate(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch user stats
        const { data: userStatsData, error: userStatsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (userStatsError && userStatsError.code !== 'PGRST116') {
          // PGRST116 means not found, which is expected if this is the user's first time
          console.error("Error fetching user stats:", userStatsError);
          toast.error("Failed to load user stats");
          setLoading(false);
          return;
        } 

        if (userStatsData) {
          // Cast the data to our UserStats type
          const userStats = userStatsData as unknown as UserStats;
          setStreak(userStats.current_streak);
          setLongestStreak(userStats.longest_streak);
          setLastActiveDate(userStats.last_active_date);
        }

        // Check if user logged in today and update streak if needed
        const today = new Date().toISOString().split('T')[0];
        
        if (!lastActiveDate || lastActiveDate !== today) {
          // User logged in on a new day
          await updateUserStreak(userId, today, streak, longestStreak);

          // Update local streak values after updating in DB
          const { data: updatedStatsData } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', userId)
            .single();
            
          if (updatedStatsData) {
            const updatedStats = updatedStatsData as unknown as UserStats;
            setStreak(updatedStats.current_streak);
            setLongestStreak(updatedStats.longest_streak);
            setLastActiveDate(updatedStats.last_active_date);
          }
        }
      } catch (error) {
        console.error("Error loading user stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUserStats();
  }, [userId]);

  // Helper function to update user streak in the database
  const updateUserStreak = async (userId: string, today: string, currentStreak: number, currentLongestStreak: number) => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // Use explicit casting for TypeScript
      const { data: userStatsData, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      let newStreak = 1; // Default to 1 for new day login
      let newLongestStreak = currentLongestStreak;
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error checking user stats:", error);
        return;
      }
      
      if (!userStatsData) {
        // Create new record for first-time user
        await supabase.from('user_stats').insert({
          user_id: userId,
          current_streak: newStreak,
          longest_streak: newStreak,
          last_active_date: today
        });
        return;
      }
      
      // User has stats already
      const userStats = userStatsData as unknown as UserStats;
      const lastActiveDateFromDB = userStats.last_active_date;
      
      if (lastActiveDateFromDB === yesterdayStr) {
        // User was active yesterday, increment streak
        newStreak = userStats.current_streak + 1;
      } else if (lastActiveDateFromDB === today) {
        // Already logged in today, keep current streak
        newStreak = userStats.current_streak;
      } else {
        // Streak broken, start new streak at 1
        newStreak = 1;
      }
      
      // Update longest streak if needed
      newLongestStreak = Math.max(newStreak, userStats.longest_streak);
      
      await supabase.from('user_stats').update({
        current_streak: newStreak,
        longest_streak: newLongestStreak,
        last_active_date: today
      }).eq('user_id', userId);
      
    } catch (error) {
      console.error("Error updating user streak:", error);
    }
  };

  return {
    streak,
    longestStreak,
    loading
  };
};
