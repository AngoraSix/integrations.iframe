'use client';

import { Typography, Box } from '@mui/material';
import { useEffect } from 'react';

const TrelloPage = () => {
  useEffect(() => {
    // Ensure TrelloPowerUp is loaded
    if (typeof window !== 'undefined' && window.TrelloPowerUp) {
      const BLACK_ICON =
        'https://iframe.integrations.angorasix.com/static/images/a6-250-black.png';
      const WHITE_ICON =
        'https://iframe.integrations.angorasix.com/static/images/a6-250-white.png';

      window.TrelloPowerUp.initialize({
        'card-buttons': function (t, options) {
          return [
            {
              icon: BLACK_ICON,
              text: 'AngoraSix',
              callback: function (t) {
                return t.popup({
                  title: 'AngoraSix',
                  url: '/en/trello/caps', // use i18n here
                });
              },
            },
          ];
        },
        'card-badges': function (t, options) {
          return t.get('card', 'shared', 'capsParams').then(function (capsParams) {
            const capsValue = capsParams?.caps;
            return [
              {
                icon: capsValue ? BLACK_ICON : WHITE_ICON,
                text: capsValue || 'No Caps',
                color: capsValue ? null : 'red',
              },
            ];
          });
        },
        'card-detail-badges': function (t, options) {
          return t.get('card', 'shared', 'capsParams').then(function (capsParams) {
            const capsValue = capsParams?.caps;
            return [
              {
                title: 'Caps',
                icon: capsValue ? BLACK_ICON : WHITE_ICON,
                text: capsValue || 'No Caps!',
                color: capsValue ? null : 'red',
              },
            ];
          });
        },
      });
    }
  }, []);

  return (
    <Box>
      <Typography>Trello Power-Up</Typography>
      <Typography>This is the main Power-Up entry point.</Typography>
    </Box>
  );
};

export default TrelloPage;