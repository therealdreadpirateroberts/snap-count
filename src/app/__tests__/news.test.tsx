import React from 'react';
import { render } from '@testing-library/react-native';
import NewsScreen from '../news';
import { usePlayerStore } from '@/store/usePlayerStore';

describe('NewsScreen Smoke Test', () => {
  beforeEach(() => {
    // Populate some mock news in usePlayerStore to verify rendering
    usePlayerStore.setState({
      news: [
        {
          id: 'news_1',
          headline: 'Davante Adams traded to Jets',
          summary: 'The Raiders have finalized a blockbuster trade sending Adams to the Jets.',
          take: 'This reunites Adams with Aaron Rodgers. Huge PPR boost!',
          timestamp: Date.now(),
          timeAgo: '1h ago',
          tag: 'TRADE',
          tagColor: '#3B82F6',
          playersAffected: [
            { name: 'Davante Adams', position: 'WR', trend: 'up' as const }
          ]
        }
      ]
    });
  });

  it('renders successfully without throwing exceptions', () => {
    const { toJSON } = render(<NewsScreen />);
    expect(toJSON()).not.toBeNull();
  });
});
