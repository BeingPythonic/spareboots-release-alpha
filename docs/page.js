// A convenience gate for invited playtesters. This is a public static site;
// the installer URL and this digest can be read from its source.
const accessCodeDigest = '7e5cac06a569125b647d13a975e42c9396f206a5e3c0792dcbfbd71d90420fee';
const installerUrl = 'https://github.com/BeingPythonic/spareboots-release-alpha/releases/download/installer/TambleSetup.exe';

const form = document.querySelector('.access-form');
const message = document.querySelector('#form-message');
const code = document.querySelector('#access-code');
const submit = form.querySelector('button');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.hidden = true;
  code.removeAttribute('aria-invalid');
  submit.disabled = true;

  try {
    const normalizedCode = code.value.trim().toUpperCase();
    const bytes = new TextEncoder().encode(normalizedCode);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

    if (hex === accessCodeDigest) {
      window.location.assign(installerUrl);
      return;
    }

    message.textContent = "That code didn't work. Check it and try again.";
  } catch {
    message.textContent = 'Could not check the code. Please refresh the page and try again.';
  }

  message.hidden = false;
  code.setAttribute('aria-invalid', 'true');
  code.focus();
  submit.disabled = false;
});
