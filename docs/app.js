(function () {
  var index = 0;
  var score = 0;
  var answered = false;

  var el = function (id) { return document.getElementById(id); };

  function show() {
    var s = SCENARIOS[index];
    answered = false;
    el('progress').textContent = 'Scenario ' + (index + 1) + ' of ' + SCENARIOS.length;
    el('title').textContent = s.title;
    el('situation').textContent = s.situation;
    el('feedback').hidden = true;
    el('next').hidden = true;
    var box = el('choices');
    box.innerHTML = '';
    s.choices.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice';
      b.textContent = c.text;
      b.addEventListener('click', function () { choose(i, b); });
      box.appendChild(b);
    });
  }

  function choose(i, button) {
    if (answered) return;
    answered = true;
    var s = SCENARIOS[index];
    var c = s.choices[i];
    if (c.best) score += 1;
    var buttons = el('choices').querySelectorAll('button');
    buttons.forEach(function (b, n) {
      b.disabled = true;
      if (s.choices[n].best) b.classList.add('right');
    });
    if (!c.best) button.classList.add('wrong');
    var fb = el('feedback');
    fb.hidden = false;
    fb.textContent = (c.best ? 'Right. ' : 'Not the best first step. ') + c.why + ' Guide: ' + s.guide;
    var next = el('next');
    next.hidden = false;
    next.textContent = index === SCENARIOS.length - 1 ? 'See result' : 'Next scenario';
    next.focus();
  }

  function finish() {
    el('card').hidden = true;
    el('summary').hidden = false;
    el('score').textContent = 'You chose the best first step in ' + score + ' of ' + SCENARIOS.length + ' scenarios.';
  }

  el('next').addEventListener('click', function () {
    if (index === SCENARIOS.length - 1) finish();
    else { index += 1; show(); }
  });
  el('restart').addEventListener('click', function () {
    index = 0; score = 0;
    el('summary').hidden = true;
    el('card').hidden = false;
    show();
  });

  show();
})();
