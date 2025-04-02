
import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Twitter, Share2 } from 'lucide-react';
import { useOrder } from '@/contexts/OrderContext';
import { translations } from '@/utils/translations';

interface SocialMediaFeed {
  id: string;
  content: string;
  date: string;
  platform: 'facebook' | 'instagram' | 'twitter';
  imageUrl?: string;
}

export const SocialMediaIntegration: React.FC = () => {
  const { language } = useOrder();
  const [feeds, setFeeds] = useState<SocialMediaFeed[]>([]);
  const [visibleFeeds, setVisibleFeeds] = useState<SocialMediaFeed[]>([]);
  const [activeFeed, setActiveFeed] = useState<'all' | 'facebook' | 'instagram' | 'twitter'>('all');
  
  // This would normally fetch from actual APIs, but for demo we'll use mock data
  useEffect(() => {
    const mockFeeds: SocialMediaFeed[] = [
      {
        id: '1',
        content: 'Try our new seasonal menu items! #DamoneRestaurant',
        date: '2 hours ago',
        platform: 'twitter',
        imageUrl: '/images/download (5).jpeg'
      },
      {
        id: '2',
        content: 'Weekend special: 15% off on all desserts! Tag a friend you'd bring along.',
        date: '5 hours ago',
        platform: 'facebook',
        imageUrl: '/images/download (13).jpeg'
      },
      {
        id: '3',
        content: 'Chef's special of the day: Grilled salmon with lemon butter sauce',
        date: '1 day ago',
        platform: 'instagram',
        imageUrl: '/images/download (4).jpeg'
      },
      {
        id: '4',
        content: 'Join us for happy hour, everyday 4-6PM!',
        date: '2 days ago',
        platform: 'twitter'
      },
      {
        id: '5',
        content: 'Behind the scenes: Our pastry chef preparing the famous chocolate cake',
        date: '3 days ago',
        platform: 'instagram',
        imageUrl: '/images/download (15).jpeg'
      }
    ];
    
    setFeeds(mockFeeds);
    
    // In a real implementation, you would set up API calls to fetch actual social media feeds
    // Example: const fetchSocialFeeds = async () => { ... }
  }, []);
  
  // Filter and limit visible feeds based on selection and time
  useEffect(() => {
    // Filter based on selected platform
    const filteredFeeds = activeFeed === 'all' 
      ? feeds 
      : feeds.filter(feed => feed.platform === activeFeed);
    
    // Only show 3 most recent feeds
    const limitedFeeds = filteredFeeds.slice(0, 3);
    
    setVisibleFeeds(limitedFeeds);
    
    // Auto-hide feeds after 2 minutes (120000ms)
    const currentTime = Date.now();
    const twoMinutesLater = currentTime + 120000;
    
    const timeout = setTimeout(() => {
      // In a real app, this would filter out old feeds
      // For demo, we'll just rotate the feeds
      setFeeds(prevFeeds => {
        const rotated = [...prevFeeds];
        const first = rotated.shift();
        if (first) rotated.push(first);
        return rotated;
      });
    }, 120000);
    
    return () => clearTimeout(timeout);
  }, [feeds, activeFeed]);
  
  // Share current page to social media
  const shareToSocial = (platform: 'facebook' | 'twitter') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out Damone Restaurant!');
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };
  
  return (
    <div className="social-media-integration mt-10">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
        {translations[language].socialMediaUpdates}
      </h2>
      
      <div className="flex justify-center space-x-4 mb-4">
        <button 
          onClick={() => setActiveFeed('all')} 
          className={`px-4 py-2 rounded-full ${activeFeed === 'all' ? 'bg-[#684b2c] text-white' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}`}
        >
          All
        </button>
        <button 
          onClick={() => setActiveFeed('facebook')} 
          className={`px-4 py-2 rounded-full flex items-center ${activeFeed === 'facebook' ? 'bg-[#684b2c] text-white' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}`}
        >
          <Facebook size={16} className="mr-1" /> Facebook
        </button>
        <button 
          onClick={() => setActiveFeed('instagram')} 
          className={`px-4 py-2 rounded-full flex items-center ${activeFeed === 'instagram' ? 'bg-[#684b2c] text-white' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}`}
        >
          <Instagram size={16} className="mr-1" /> Instagram
        </button>
        <button 
          onClick={() => setActiveFeed('twitter')} 
          className={`px-4 py-2 rounded-full flex items-center ${activeFeed === 'twitter' ? 'bg-[#684b2c] text-white' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}`}
        >
          <Twitter size={16} className="mr-1" /> Twitter
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleFeeds.length > 0 ? (
          visibleFeeds.map(feed => (
            <div key={feed.id} className="bg-white dark:bg-[#3a3a3a] p-4 rounded-md shadow-md">
              <div className="flex items-center mb-2">
                {feed.platform === 'facebook' && <Facebook className="text-blue-600 mr-2" size={20} />}
                {feed.platform === 'instagram' && <Instagram className="text-pink-600 mr-2" size={20} />}
                {feed.platform === 'twitter' && <Twitter className="text-blue-400 mr-2" size={20} />}
                <span className="text-sm text-gray-500 dark:text-gray-400">{feed.date}</span>
              </div>
              {feed.imageUrl && (
                <div className="mb-3 h-40 overflow-hidden rounded">
                  <img src={feed.imageUrl} alt="Social media post" className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-black dark:text-white">{feed.content}</p>
              <div className="mt-3 flex justify-end">
                <button 
                  onClick={() => shareToSocial(feed.platform === 'instagram' ? 'facebook' : feed.platform)}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-[#684b2c] dark:hover:text-[#a77e58]"
                >
                  <Share2 size={16} className="mr-1" /> Share
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-3 text-center">No social media updates available</p>
        )}
      </div>
      
      <div className="mt-6 flex justify-center space-x-4">
        <a 
          href="https://facebook.com/damonerestaurant" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Facebook className="mr-1" size={24} />
          Follow on Facebook
        </a>
        <a 
          href="https://instagram.com/damonerestaurant" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center text-pink-600 hover:text-pink-800 transition-colors"
        >
          <Instagram className="mr-1" size={24} />
          Follow on Instagram
        </a>
        <a 
          href="https://twitter.com/damonerestaurant" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center text-blue-400 hover:text-blue-600 transition-colors"
        >
          <Twitter className="mr-1" size={24} />
          Follow on Twitter
        </a>
      </div>
    </div>
  );
};
