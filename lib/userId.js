// Gestion du userId côté client (cookie simple)
export function getUserId() {
  let userId = getCookie("userId");
  if (!userId) {
    userId = Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setCookie("userId", userId, 365);
  }
  return userId;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Lax' + (process.env.NODE_ENV === 'production' ? '; Secure' : '');
}
