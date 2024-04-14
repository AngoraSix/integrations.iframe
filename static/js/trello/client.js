TrelloPowerUp.initialize({
  'card-buttons': function (t, options) {
    return [
      {
        icon: 'https://iframe.integrations.angorasix.com/static/images/a6-250-black.png',
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
});
