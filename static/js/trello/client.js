const BLACK_ICON =
  'https://iframe.integrations.angorasix.com/static/images/a6-250-black.png';
const WHITE_ICON =
  'https://iframe.integrations.angorasix.com/static/images/a6-250-white.png';

TrelloPowerUp.initialize({
  'card-buttons': function (t, options) {
    return [
      {
        icon: BLACK_ICON,
        text: 'Caps',
        callback: function (t) {
          return t.popup({
            title: 'Caps',
            url: '/static/pages/trello/caps.html',
          });
        },
      },
    ];
  },
  'card-badges': function (t, options) {
    return t.get('card', 'shared', 'capsParams').then(function (capsParams) {
      const capsValue = capsParams.caps;
      return [
        {
          icon: capsValue ? BLACK_ICON : WHITE_ICON,
          text: capsParams.caps || 'No Caps',
          color: capsValue ? null : 'red',
        },
      ];
    });
  },
});
