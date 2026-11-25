// Detroit Old Time Jam: loads events and tunes from the JSON files.
// If your JSON files have different names, change these two lines.
const EVENTS_FILE = "events.json";
const SONGS_FILE = "songs.json";

// Order the key groups appear in on the page
const KEY_ORDER = ["G", "D", "A", "C"];

function makeEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

async function loadJSON(path) {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) throw new Error("Could not load " + path);
  return response.json();
}

function renderEvents(events) {
  const list = document.getElementById("events-list");
  if (!list) return;
  list.innerHTML = "";

  events.forEach(function (item) {
    const li = document.createElement("li");

    // An entry with only a note (no name) shows as a plain line of text
    if (item.note && !item.name) {
      li.className = "events-note";
      li.textContent = item.note;
      list.appendChild(li);
      return;
    }

    li.className = "event-card";
    li.appendChild(makeEl("div", "event-name", item.name || ""));

    const when = makeEl("div", "event-when");
    if (item.date) when.appendChild(makeEl("strong", "", item.date));
    if (item.date && item.time) when.appendChild(document.createTextNode(", "));
    if (item.time) when.appendChild(document.createTextNode(item.time));
    if (item.date || item.time) li.appendChild(when);

    if (item.note) li.appendChild(makeEl("p", "event-note", item.note));

    list.appendChild(li);
  });

  if (events.length === 0) {
    list.appendChild(makeEl("li", "events-note", "No jams scheduled right now. Check back soon."));
  }
}

function renderSongs(songs) {
  const container = document.getElementById("songs-list");
  if (!container) return;
  container.innerHTML = "";

  // Group tunes by key
  const groups = {};
  songs.forEach(function (song) {
    const key = (song.key || "").trim() || "Other";
    if (!groups[key]) groups[key] = [];
    groups[key].push(song);
  });

  const keys = Object.keys(groups).sort(function (a, b) {
    const ia = KEY_ORDER.indexOf(a);
    const ib = KEY_ORDER.indexOf(b);
    if (a === "Other") return 1;
    if (b === "Other") return -1;
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  });

  keys.forEach(function (key) {
    const group = makeEl("div", "key-group");
    group.appendChild(makeEl("h3", "", key === "Other" ? "Other Tunes" : "Key of " + key));

    const ul = makeEl("ul", "tune-list");
    groups[key]
      .slice()
      .sort(function (a, b) { return a.title.localeCompare(b.title); })
      .forEach(function (song) {
        const li = document.createElement("li");
        if (song.link) {
          const a = makeEl("a", "", song.title);
          a.href = song.link;
          a.target = "_blank";
          a.rel = "noopener";
          li.appendChild(a);
        } else {
          li.textContent = song.title;
        }
        ul.appendChild(li);
      });

    group.appendChild(ul);
    container.appendChild(group);
  });
}

loadJSON(EVENTS_FILE)
  .then(renderEvents)
  .catch(function () {
    const list = document.getElementById("events-list");
    if (list) list.innerHTML = '<li class="events-note">Jam dates could not be loaded. Please check back soon.</li>';
  });

loadJSON(SONGS_FILE)
  .then(renderSongs)
  .catch(function () {
    const container = document.getElementById("songs-list");
    if (container) container.innerHTML = '<p class="muted">The tune list could not be loaded.</p>';
  });
