async function ensureDeviceCookie() {
  const name = 'node_key_system_device';
  function readCookie(n){
    const v = document.cookie.split('; ').find(c=>c.startsWith(n+'='));
    return v ? decodeURIComponent(v.split('=')[1]) : null;
  }
  let id = readCookie(name);
  if (id) return id;

  const uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c/4).toString(16)
  );
  document.cookie = `${name}=${uuid}; path=/; max-age=157680000; samesite=lax`;
  return uuid;
}

async function getKeyForDevice() {
  await ensureDeviceCookie();
  const res = await fetch('/api/get-key', { credentials: 'same-origin' });
  return res.json();
}

async function generateKey() {
  await ensureDeviceCookie();
  const res = await fetch('/api/get-key', { credentials: 'same-origin' });
  return res.json();
}
