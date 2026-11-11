(() => {
  'use strict';

  // Everything is saved in this browser only (localStorage). No network calls anywhere in this file.
  const KEY = 'little-tasks-v1';

  const MASCOTS = {
    sprout: {
      emoji: '🌱', name: 'Sprout',
      empty: ['Plant a task and watch me grow!'],
      start: ['A little water (and a task) goes a long way.', 'Let’s grow today, one leaf at a time.'],
      some: ['{left} to go. I can feel myself growing!', 'Nice! {left} left.'],
      done: ['All done! I’m a whole tree now 🌳', 'Fully bloomed. Proud of you!'],
      tap: ['*wiggles leaves*', 'Photosynthesising…', 'Hi!']
    },
    iris: {
      emoji: '🪻', name: 'Iris',
      empty: ['An empty garden… add something to grow?'],
      start: ['Good day to blossom. What’s first?', 'Petals ready. Let’s begin.'],
      some: ['{left} more and I’ll be in full bloom.', 'Blooming nicely: {left} left.'],
      done: ['Full bloom! 🌸 You did everything.', 'The whole garden is happy today.'],
      tap: ['*smells lovely*', 'Hehe, that tickles!', 'Don’t pick me!']
    },
    momo: {
      emoji: '🐱', name: 'Momo',
      empty: ['No tasks? Perfect. Nap time.', 'I approve of this empty list. Zzz.'],
      start: ['I’ll supervise. From this sunny spot.', 'Do your tasks. I will knock things off the table.'],
      some: ['{left} left. I believe in you (from the sofa).', 'Good human. {left} more, then treats?'],
      done: ['All done?! You may now pet me.', 'Purrfect day. 😸'],
      tap: ['Mrrp?', '*knocks your phone over*', 'Feed me.', '*slow blink*']
    },
    potato: {
      emoji: '🥔', name: 'Sir Potato',
      empty: ['I am but a humble potato. Give me purpose.'],
      start: ['Today we rise. Like a well-baked potato.', 'Even potatoes have goals.'],
      some: ['{left} to go. Stay crispy.', 'Mash those tasks! {left} left.'],
      done: ['Legendary. You are a golden french fry. 🍟', 'All done. I shall now return to the soil.'],
      tap: ['I am potato.', 'Please don’t fry me.', '*starchy noises*']
    },
    penguin: {
      emoji: '🐧', name: 'Pip',
      empty: ['Brrr, it’s empty here. Add something?'],
      start: ['Waddle waddle, let’s get going!', 'One waddle at a time.'],
      some: ['Sliding through! {left} left.', '{left} more fish… I mean tasks.'],
      done: ['Everything done! *happy belly slide* 🛷', 'Coolest human ever. Literally.'],
      tap: ['Noot noot!', '*flaps tiny wings*', 'Fish?']
    },
    sloth: {
      emoji: '🦥', name: 'Slo',
      empty: ['Nothing… to… do… perfect…'],
      start: ['We’ll… get there… eventually…', 'Slow is still moving.'],
      some: ['{left}… left… you’re… speedy…', 'Wow… so fast… {left} more…'],
      done: ['You… did… it… all… 🎉', 'Time… for… a… long… nap…'],
      tap: ['…hi…', '…zzz…', '…what…']
    },
    ghost: {
      emoji: '👻', name: 'Boo',
      empty: ['Spooky… there are no tasks here.'],
      start: ['Boo! Did I scare you into being productive?', 'Let’s haunt this to-do list.'],
      some: ['{left} left. I’ll haunt them for you.', 'Ooooh, {left} more…'],
      done: ['All done. I’m so proud I could… vanish.', 'Boo-tiful work! 👻'],
      tap: ['BOO!', '*floats away*', '*rattles chains politely*']
    },
    // These mascots change how they look depending on how your day is going.
    cloud: {
      emoji: '🌧️', name: 'Drizzle',
      face: (mood) => ({ empty: '☁️', start: '🌧️', some: '⛅', done: '☀️' })[mood],
      empty: ['Just a quiet grey cloud. Add a task?'],
      start: ['Grumble. It’s raining. Do a task and maybe I’ll cheer up.', 'Drip. Drip. Hmph.'],
      some: ['The sun is peeking out… {left} more.', 'Less rain, more sun! {left} left.'],
      done: ['Fine. FINE. It’s sunny. I’m happy. ☀️', 'Not a cloud in the sky. Well done.'],
      tap: ['*grumbly thunder*', 'Don’t poke the cloud.', '*sprinkles you*']
    },
    moon: {
      emoji: '🌙', name: 'Luna',
      face: (mood) => ({ empty: '🌙', start: '🌚', some: '🌛', done: '🌝' })[mood],
      empty: ['Zzz… nothing to do… back to sleep…'],
      start: ['*yawn* Is it morning already? Fine, let’s start.', 'Still sleepy… one task will wake me up.'],
      some: ['Getting brighter! {left} to go.', 'Half awake and proud of you. {left} left.'],
      done: ['Fully awake and glowing! 🌕', 'Full moon energy. You did it all!'],
      tap: ['*yawns*', 'Five more minutes…', '*glows softly*']
    },
    dragon: {
      emoji: '🥚', name: 'Ember',
      // Grows up as your best streak gets longer
      face: (mood, ctx) => ctx.best >= 7 ? '🐉' : ctx.best >= 3 ? '🐲' : ctx.best >= 1 ? '🦎' : '🥚',
      empty: ['*the egg wobbles* Feed me tasks so I can grow!'],
      start: ['Streaks make me grow. Let’s keep the fire going!', 'Rawr (tiny version). Let’s go!'],
      some: ['{left} more and I get stronger!', 'I can feel my wings growing. {left} left.'],
      done: ['ROAR! 🔥 All done. Keep the streak and I’ll keep growing.', 'Mighty work. Even dragons are impressed.'],
      tap: ['*tiny puff of smoke*', 'Rawr!', '*breathes a warm, friendly flame*']
    },
    frog: {
      emoji: '🐸', name: 'Gulp',
      empty: ['My plate is empty. Feed me tasks!', 'Ribbit. Hungry.'],
      start: ['Tick a task and I’ll eat it. Nom.', 'So many tasty tasks…'],
      some: ['*crunch* Delicious. {left} left on the menu.', 'Mmm, more please! {left} to go.'],
      done: ['*BURP* I ate every task. Thank you. 🪰', 'So full. Best day ever.'],
      tap: ['Ribbit.', '*catches a fly*', '*blinks slowly*']
    },
    plant: {
      emoji: '🪴', name: 'Fern',
      // Wilts if you missed daily tasks yesterday, perks up when you finish today
      face: (mood, ctx) => mood === 'done' ? '🪴' : ctx.wilted ? '🥀' : mood === 'empty' ? '🌿' : '🪴',
      empty: ['A little pot, waiting for something to do.'],
      start: ['Daily tasks are my water. Don’t forget me!', 'Leaves out, ready to grow.'],
      some: ['Ahh, that’s refreshing. {left} more sips.', 'Growing strong! {left} left.'],
      done: ['Watered and happy! 🌿', 'Look at my leaves shine. Thank you!'],
      wilt: ['I’m a bit droopy… we missed some yesterday. Water me?', '*droops* Finish today’s tasks and I’ll perk up.'],
      tap: ['*rustles*', 'More sunlight, please.', '*leans toward you*']
    }
  };

  // ---------- Dates ----------
  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const daysBetween = (a, b) => {
    const [ay, am, ad] = a.split('-').map(Number);
    const [by, bm, bd] = b.split('-').map(Number);
    return Math.round((new Date(by, bm - 1, bd) - new Date(ay, am - 1, ad)) / 86400000);
  };

  // ---------- State ----------
  const fresh = () => ({ v: 1, lastDate: dayKey(), mascot: 'sprout', tasks: [] });

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && Array.isArray(s.tasks)) return { ...fresh(), ...s };
    } catch (e) { /* fall through */ }
    return fresh();
  }

  let state = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { toast('Couldn’t save. Your phone storage might be full.'); }
  }

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // ---------- Midnight reset ----------
  function rollover() {
    const today = dayKey();
    if (state.lastDate === today) return false;
    const gap = Math.max(1, daysBetween(state.lastDate, today));

    // Used by Fern the plant: droopy if any daily task was missed.
    const dailies = state.tasks.filter((t) => t.type === 'daily' && !t.keep);
    state.wilted = dailies.length > 0 && (gap > 1 || dailies.some((t) => !t.done));

    state.tasks = state.tasks.filter((t) => {
      if (t.type === 'once') return !t.done; // ticked to-dos get cleared away
      if (t.keep) {                          // "keep tonight": skip this one reset
        t.keep = false;
        return true;
      }
      if (t.done && gap === 1) t.streak = (t.streak || 0) + 1;
      else t.streak = 0;
      t.done = false;
      return true;
    });

    state.lastDate = today;
    save();
    return true;
  }

  // ---------- Rendering ----------
  const $ = (id) => document.getElementById(id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  let lastMood = '';
  let lastLine = '';

  function renderTask(t) {
    const li = document.createElement('li');
    li.className = 'task' + (t.done ? ' done' : '') + (t.keep ? ' kept' : '');

    const check = document.createElement('button');
    check.className = 'check';
    check.type = 'button';
    check.textContent = t.done ? '✓' : '';
    check.setAttribute('aria-label', (t.done ? 'Untick ' : 'Tick ') + t.text);
    check.addEventListener('click', () => toggle(t.id));

    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = t.text;

    li.append(check, text);

    if (t.type === 'daily') {
      const streak = (t.streak || 0) + (t.done ? 1 : 0);
      if (streak > 0) {
        const s = document.createElement('span');
        s.className = 'streak';
        s.textContent = `🔥${streak}`;
        s.title = `${streak} day streak`;
        li.append(s);
      }
      const keep = document.createElement('button');
      keep.className = 'icon-btn keep';
      keep.type = 'button';
      keep.textContent = '🔒';
      keep.setAttribute('aria-pressed', String(!!t.keep));
      keep.setAttribute('aria-label', t.keep ? 'Will not reset tonight. Tap to undo' : 'Don’t reset this tonight');
      keep.title = keep.getAttribute('aria-label');
      keep.addEventListener('click', () => toggleKeep(t.id));
      li.append(keep);
    }

    const del = document.createElement('button');
    del.className = 'icon-btn';
    del.type = 'button';
    del.textContent = '✕';
    del.setAttribute('aria-label', 'Delete ' + t.text);
    del.addEventListener('click', () => remove(t.id));
    li.append(del);

    return li;
  }

  function render() {
    const daily = state.tasks.filter((t) => t.type === 'daily');
    const once = state.tasks.filter((t) => t.type === 'once');
    // Unfinished first, keeping the order they were added in.
    const order = (a, b) => Number(a.done) - Number(b.done);

    $('dailyList').replaceChildren(...[...daily].sort(order).map(renderTask));
    $('onceList').replaceChildren(...[...once].sort(order).map(renderTask));
    $('dailyEmpty').hidden = daily.length > 0;
    $('onceEmpty').hidden = once.length > 0;

    $('today').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
    renderMascot();
    renderPicker();
  }

  function renderMascot(forceNew) {
    const m = MASCOTS[state.mascot] || MASCOTS.sprout;
    const total = state.tasks.length;
    const done = state.tasks.filter((t) => t.done).length;
    const left = total - done;
    const mood = total === 0 ? 'empty' : done === 0 ? 'start' : left === 0 ? 'done' : 'some';

    const best = Math.max(0, ...state.tasks.filter((t) => t.type === 'daily').map((t) => (t.streak || 0) + (t.done ? 1 : 0)));
    const wilted = !!state.wilted && mood !== 'done';
    $('mascot').textContent = (m.face && m.face(mood, { best, wilted })) || m.emoji;
    $('mascotName').textContent = m.name;
    const lineKey = mood + (wilted ? '-wilt' : '');
    if (forceNew || lineKey !== lastMood || !lastLine) {
      lastLine = pick(wilted && m.wilt && mood !== 'empty' ? m.wilt : m[mood]);
      if (mood === 'done' && lastMood && lastMood !== 'done') bounce();
    }
    lastMood = lineKey;
    $('mascotLine').textContent = lastLine.replace('{left}', left);
    $('barFill').style.width = total ? `${(done / total) * 100}%` : '0';
  }

  function renderPicker() {
    const box = $('mascotPicker');
    if (box.childElementCount) {
      box.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === state.mascot)));
      return;
    }
    for (const [id, m] of Object.entries(MASCOTS)) {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.id = id;
      b.setAttribute('aria-pressed', String(id === state.mascot));
      const e = document.createElement('span'); e.className = 'emo'; e.textContent = m.emoji;
      const n = document.createElement('span'); n.className = 'nm'; n.textContent = m.name;
      b.append(e, n);
      b.addEventListener('click', () => { state.mascot = id; save(); lastLine = ''; render(); bounce(); });
      box.append(b);
    }
  }

  function bounce() {
    const el = $('mascot');
    el.classList.remove('bounce');
    void el.offsetWidth;
    el.classList.add('bounce');
  }

  function updateCountdown() {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const mins = Math.max(0, Math.ceil((midnight - now) / 60000));
    const h = Math.floor(mins / 60), m = mins % 60;
    $('countdown').textContent = `Daily tasks reset in ${h ? h + 'h ' : ''}${m}m`;
  }

  // ---------- Actions ----------
  let undoFn = null;
  let toastTimer = null;

  function toast(msg, undo) {
    undoFn = undo || null;
    $('toastText').textContent = msg;
    $('toastUndo').hidden = !undo;
    $('toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $('toast').hidden = true; undoFn = null; }, 5000);
  }

  function find(id) { return state.tasks.find((t) => t.id === id); }

  function toggle(id) {
    const t = find(id); if (!t) return;
    t.done = !t.done;
    save(); render();
  }

  function toggleKeep(id) {
    const t = find(id); if (!t) return;
    t.keep = !t.keep;
    save(); render();
    if (t.keep) toast(`“${t.text}” won’t reset tonight.`);
  }

  function remove(id) {
    const i = state.tasks.findIndex((t) => t.id === id); if (i < 0) return;
    const [t] = state.tasks.splice(i, 1);
    save(); render();
    toast(`Deleted “${t.text}”`, () => { state.tasks.splice(i, 0, t); save(); render(); });
  }

  $('addForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('taskInput');
    const text = input.value.trim();
    if (!text) return;
    const type = document.querySelector('input[name="kind"]:checked').value;
    state.tasks.push({ id: uid(), text, type, done: false, keep: false, streak: 0 });
    input.value = '';
    save(); render();
    input.focus();
  });

  $('mascot').addEventListener('click', () => {
    const m = MASCOTS[state.mascot] || MASCOTS.sprout;
    bounce();
    $('mascotLine').textContent = pick(m.tap);
    setTimeout(() => renderMascot(true), 2200);
  });

  $('toastUndo').addEventListener('click', () => {
    if (undoFn) undoFn();
    undoFn = null;
    $('toast').hidden = true;
  });

  // Backup: makes a file on your phone. Nothing is uploaded anywhere.
  $('exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `little-tasks-backup-${dayKey()}.json`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  $('importInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data || !Array.isArray(data.tasks)) throw new Error('bad');
      const tasks = data.tasks
        .filter((t) => t && typeof t.text === 'string' && (t.type === 'daily' || t.type === 'once'))
        .map((t) => ({
          id: typeof t.id === 'string' ? t.id : uid(),
          text: t.text.slice(0, 200), type: t.type,
          done: !!t.done, keep: !!t.keep, streak: Number.isFinite(t.streak) ? t.streak : 0
        }));
      if (!confirm(`Replace your current tasks with ${tasks.length} tasks from this backup?`)) return;
      state = {
        ...fresh(),
        mascot: MASCOTS[data.mascot] ? data.mascot : state.mascot,
        lastDate: /^\d{4}-\d{2}-\d{2}$/.test(data.lastDate) ? data.lastDate : dayKey(),
        tasks
      };
      rollover(); save(); lastLine = ''; render();
      toast('Backup restored ✓');
    } catch (err) {
      toast('That file isn’t a Little Tasks backup.');
    }
  });

  $('wipeBtn').addEventListener('click', () => {
    if (!confirm('Delete ALL tasks? This can’t be undone (unless you have a backup).')) return;
    state = { ...fresh(), mascot: state.mascot };
    save(); lastLine = ''; render();
  });

  // ---------- Start ----------
  function tick() {
    if (rollover()) { lastLine = ''; render(); }
    updateCountdown();
  }

  rollover();
  render();
  updateCountdown();
  setInterval(tick, 20000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });

  // Offline support: lets the app open with no internet.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
