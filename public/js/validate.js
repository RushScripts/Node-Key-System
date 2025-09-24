async function validateKey(key) {
  if (!key) return { ok: false, message: 'No key provided' };
  const res = await fetch(`/api/validate?key=${encodeURIComponent(key)}`);
  return res.json();
}

(function () {
  const params = new URLSearchParams(window.location.search);
  const k = params.get('KEY');
  if (k) {
    validateKey(k).then(result => {
      const div = document.createElement('pre');
      div.textContent = JSON.stringify(result, null, 2);
      document.body.appendChild(div);
    });
  }
})();
