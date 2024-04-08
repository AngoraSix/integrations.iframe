TrelloPowerUp.initialize({
  'card-buttons': function (t, options) {
    return [
      {
        icon: 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421',
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