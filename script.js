document.addEventListener("DOMContentLoaded", () => {
  fetch('events.json')
    .then(res => res.json())
    .then(events => {
      const eventsList = document.getElementById('events-list');
      eventsList.innerHTML = events.map(e => `<li>🎶 ${e.date} – ${e.time} - ${e.name}</li>`).join('');
    });

  fetch('songs.json')
    .then(res => res.json())
    .then(songs => {
      const songsList = document.getElementById('songs-list');
      songsList.innerHTML = songs.map(s =>
        `<li>“${s.title}” – Key: ${s.key} – <a href="${s.link}" target="_blank">Listen</a></li>`
      ).join('');
    });
});
