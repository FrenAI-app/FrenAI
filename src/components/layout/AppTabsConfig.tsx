
import { MessageCircle, Book, Image, Coins, Bell, Megaphone } from 'lucide-react';

export interface TabConfig {
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  adminOnly?: boolean;
}

export const getTabsConfig = (isAdmin: boolean): TabConfig[] => {
  const baseTabs: TabConfig[] = [
    {
      value: 'chat',
      icon: MessageCircle,
      label: 'Chat',
      color: 'green'
    },
    {
      value: 'announcements',
      icon: Bell,
      label: 'News',
      color: 'blue'
    },
    {
      value: 'avatar',
      icon: Image,
      label: 'Avatar',
      color: 'green'
    },
    {
      value: 'fren',
      icon: Coins,
      label: 'FREN',
      color: 'amber'
    },
    {
      value: 'docs',
      icon: Book,
      label: 'Docs',
      color: 'green'
    }
  ];

  if (isAdmin) {
    baseTabs.splice(2, 0, {
      value: 'create-announcement',
      icon: Megaphone,
      label: 'Report',
      color: 'purple',
      adminOnly: true
    });
  }

  return baseTabs;
};
