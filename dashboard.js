/* Verdigris Systems Laboratory dashboard — vanilla, static-site compatible. */
(function () {
  var GROUP_ORDER = [
    { id: 'character-systems', title: 'Character Systems', blurb: 'Load a scenario, tune values, and compare HUD, tree, and itemization readouts.' },
    { id: 'world-terrain', title: 'World & Terrain', blurb: 'Author zones and autotiles, then inspect the continent-scale presentation.' },
    { id: 'systems-integration', title: 'Systems Integration', blurb: 'Inspect spellcraft constraints and replay versioned fixtures against retained modules.' },
    { id: 'chronicles', title: 'Chronicles', blurb: 'House, scion, and relic language for permadeath meta-progression.' }
  ];

  var TARGET_LABELS = {
    'hud-resources': 'HUD resources',
    'passive-tree': 'Passive tree',
    'itemization': 'Itemization',
    'spellcraft': 'Spellcraft',
    'zone-generation': 'Zone generation',
    'terrain-autotile': 'Terrain autotile',
    'world-presentation': 'World presentation',
    'chronicle-meta': 'Chronicle meta',
    'systems-integration': 'Systems integration',
    none: 'None'
  };

  function docsUrl(mod) {
    return 'https://github.com/alexkorol/WIZARD/blob/gh-pages/' + mod.readme;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function card(mod) {
    var target = (mod.verdigrisTargets || []).map(function (id) {
      return TARGET_LABELS[id] || id;
    }).join(', ');
    var preview = mod.preview
      ? '<img class="card-preview" src="' + escapeHtml(mod.preview) + '" alt="" width="640" height="360" loading="lazy">'
      : '';
    return (
      '<article class="card reveal" data-module="' + escapeHtml(mod.id) + '">' +
        preview +
        '<div class="card-body">' +
          '<div class="card-kicker">' +
            '<span class="badge">' + escapeHtml(mod.category) + '</span>' +
            (String(mod.status).toLowerCase() === String(mod.category).toLowerCase()
              ? ''
              : '<span class="badge badge-status">' + escapeHtml(mod.status) + '</span>') +
          '</div>' +
          '<h3>' + escapeHtml(mod.title) + '</h3>' +
          '<p class="purpose">' + escapeHtml(mod.description) + '</p>' +
          '<p class="target"><span>Verdigris target</span> ' + escapeHtml(target) + '</p>' +
          '<div class="cta-row">' +
            '<a class="btn btn-primary" href="' + escapeHtml(mod.launch) + '">Launch</a>' +
            '<a class="btn btn-ghost" href="' + escapeHtml(docsUrl(mod)) + '">Documentation</a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function render() {
    var registry = window.WIZARD_REGISTRY;
    var host = document.getElementById('module-groups');
    var count = document.getElementById('module-count');
    if (!registry || !host) return;
    var dashboard = registry.dashboard || [];
    if (count) count.textContent = String(dashboard.length);
    host.innerHTML = GROUP_ORDER.map(function (group) {
      var mods = dashboard.filter(function (mod) { return mod.group === group.id; });
      if (!mods.length) return '';
      return (
        '<section class="collection" id="' + group.id + '" aria-labelledby="' + group.id + '-label">' +
          '<h2 class="section-label" id="' + group.id + '-label">' + escapeHtml(group.title) + '</h2>' +
          '<p class="group-blurb">' + escapeHtml(group.blurb) + '</p>' +
          '<div class="grid">' + mods.map(card).join('') + '</div>' +
        '</section>'
      );
    }).join('');
  }

  function reveal() {
    document.documentElement.classList.add('js');
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = document.querySelectorAll('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  render();
  reveal();
})();
