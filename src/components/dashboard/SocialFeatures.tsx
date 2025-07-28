
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../contexts/AuthContext';
import { useFinancial } from '../../contexts/FinancialContext';
import { toast } from '../../hooks/use-toast';
import { 
  Users, 
  Share2, 
  Trophy, 
  Target, 
  TrendingUp,
  Medal,
  Star,
  MessageCircle,
  Heart,
  Copy
} from 'lucide-react';

const SocialFeatures = () => {
  const { user } = useAuth();
  const { totalIncome, totalExpenses, balance, goals } = useFinancial();
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Mock data for social features
  const friends = [
    { id: '1', name: 'Sarah Johnson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff', savingsRate: 25 },
    { id: '2', name: 'Mike Chen', avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=6366f1&color=fff', savingsRate: 18 },
    { id: '3', name: 'Emma Davis', avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=f59e0b&color=fff', savingsRate: 32 },
    { id: '4', name: 'Alex Wilson', avatar: 'https://ui-avatars.com/api/?name=Alex+Wilson&background=ef4444&color=fff', savingsRate: 22 },
  ];

  const achievements = [
    {
      id: '1',
      title: 'First Goal Achieved',
      description: 'Completed your first savings goal',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      date: '2024-01-15',
      unlocked: goals.some(g => (g.currentAmount / g.targetAmount) >= 1)
    },
    {
      id: '2',
      title: 'Savings Streak',
      description: 'Saved money for 7 consecutive days',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      date: '2024-01-20',
      unlocked: true
    },
    {
      id: '3',
      title: 'Budget Master',
      description: 'Stayed within budget for a full month',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      date: '2024-02-01',
      unlocked: balance > 0
    },
    {
      id: '4',
      title: 'High Roller',
      description: 'Saved over $1,000 in a single month',
      icon: Medal,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      date: null,
      unlocked: false
    }
  ];

  const challenges = [
    {
      id: '1',
      title: 'No-Spend Weekend',
      description: 'Avoid unnecessary purchases this weekend',
      participants: 24,
      timeLeft: '2 days',
      reward: '$5 bonus'
    },
    {
      id: '2',
      title: 'Meal Prep Challenge',
      description: 'Cook all meals at home for a week',
      participants: 18,
      timeLeft: '5 days',
      reward: '$10 bonus'
    },
    {
      id: '3',
      title: 'Emergency Fund Builder',
      description: 'Save $100 this month',
      participants: 45,
      timeLeft: '15 days',
      reward: '$15 bonus'
    }
  ];

  const userSavingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

  const handleShareAchievement = (achievement: any) => {
    if (navigator.share) {
      navigator.share({
        title: `I just earned "${achievement.title}" on FinanceTracker!`,
        text: achievement.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `I just earned "${achievement.title}" on FinanceTracker! ${achievement.description}`
      );
      toast({
        title: 'Copied to clipboard!',
        description: 'Share your achievement on social media.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Leaderboard */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span>Savings Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Current user */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full text-sm font-bold">
                  You
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name} (You)</p>
                  <p className="text-sm text-gray-600">Savings rate: {userSavingsRate.toFixed(1)}%</p>
                </div>
              </div>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>

            {/* Friends */}
            {friends
              .sort((a, b) => b.savingsRate - a.savingsRate)
              .map((friend, index) => (
                <div key={friend.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-600 text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{friend.name}</p>
                      <p className="text-sm text-gray-600">Savings rate: {friend.savingsRate}%</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Medal className="h-5 w-5 text-purple-600" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    achievement.unlocked
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                  onClick={() => achievement.unlocked && setSelectedAchievement(achievement.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-full ${achievement.bgColor}`}>
                      <Icon className={`h-5 w-5 ${achievement.color}`} />
                    </div>
                    {achievement.unlocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareAchievement(achievement);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {achievement.description}
                  </p>
                  {achievement.date && (
                    <p className="text-xs text-gray-500">
                      Unlocked: {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                  {!achievement.unlocked && (
                    <p className="text-xs text-gray-400">🔒 Locked</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Community Challenges */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Community Challenges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                  <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {challenge.reward}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{challenge.participants} participants</span>
                    <span>⏰ {challenge.timeLeft}</span>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    Join Challenge
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Share Your Progress */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5 text-green-600" />
            <span>Share Your Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="p-6 bg-white rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                My Financial Progress
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Balance</p>
                  <p className="font-bold text-green-600">{formatCurrency(balance)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Savings Rate</p>
                  <p className="font-bold text-blue-600">{userSavingsRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Goals</p>
                  <p className="font-bold text-purple-600">{goals.length}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const shareText = `I've saved ${formatCurrency(balance)} with a ${userSavingsRate.toFixed(1)}% savings rate using FinanceTracker! 💰`;
                  if (navigator.share) {
                    navigator.share({
                      title: 'My Financial Progress',
                      text: shareText,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(shareText);
                    toast({
                      title: 'Copied to clipboard!',
                      description: 'Share your progress on social media.',
                    });
                  }
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Progress
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Heart className="h-4 w-4 mr-2" />
                Share Success
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialFeatures;
