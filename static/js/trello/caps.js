var t = TrelloPowerUp.iframe();

const CREDIT_RATIO = 2;
const AVG_COMPLEXITY = 3;

const MODIFIERS_MAP = {
  'software': 1.5,
  'web-design': 1.5,
};

const _calcCaps = (ef, com, modif) => {
  return (ef / CREDIT_RATIO) * (com / AVG_COMPLEXITY) * MODIFIERS_MAP[modif];
};

const effortInput = document.querySelector('#effortInput');
const complexityInput = document.querySelector('#complexityInput');
const industryInput = document.querySelector('#industryInput');
const capsOutput = document.querySelector('#capsOutput');

effortInput.addEventListener('change', function (event) {
  capsOutput.value = _calcCaps(
    effortInput.value || 0,
    complexityInput.value || 0,
    industryInput.value || 0
  );
});
complexityInput.addEventListener('change', function (event) {
  capsOutput.value = _calcCaps(
    effortInput.value || 0,
    complexityInput.value || 0,
    industryInput.value || 0
  );
});
industryInput.addEventListener('change', function (event) {
  capsOutput.value = _calcCaps(
    effortInput.value || 0,
    complexityInput.value || 0,
    industryInput.value || 0
  );
});

window.caps.addEventListener('submit', function (event) {
  event.preventDefault();
  return t
    .set('card', 'shared', 'capsParams', {
      effort: effortInput.value,
      complexity: complexityInput.value,
      industry: industryInput.value,
      caps: capsOutput.value,
    })
    .then(function () {
      t.closePopup();
    });
});

t.render(function () {
  return t
    .get('card', 'shared', 'capsParams')
    .then(function (capsParams) {
      effortInput.value = capsParams?.effort;
      complexityInput.value = capsParams?.complexity;
      industryInput.value = capsParams?.industry;
      capsOutput.value = capsParams?.caps;
    })
    .then(function () {
      t.sizeTo('#caps').done();
    });
});
