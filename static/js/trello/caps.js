var t = TrelloPowerUp.iframe();

window.caps.addEventListener('submit', function (event) {
  event.preventDefault();
  return t
    .set('card', 'shared', 'caps', window.capsInput.value)
    .then(function () {
      t.closePopup();
    });
});

t.render(function () {
  return t
    .get('card', 'shared', 'caps')
    .then(function (estimate) {
      window.capsInput.value = estimate;
    })
    .then(function () {
      t.sizeTo('#caps').done();
    });
});
