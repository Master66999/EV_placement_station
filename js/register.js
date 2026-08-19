function playLoaderTransition() {
  const loader = document.getElementById('evision-global-loader');
  const flyingLogo = document.getElementById('flying-evision-logo');
  const orangeLine = document.getElementById('loader-orange-line');
  const targetSlot = document.getElementById('brand-logo-target');

  if (!loader || !flyingLogo || !targetSlot) return;

  setTimeout(() => {
    // 1. Softly fade out orange underline
    if (orangeLine) {
      orangeLine.style.transition = 'opacity 0.25s ease';
      orangeLine.style.opacity = '0';
    }

    // 2. Measure starting and target positions
    const startRect = flyingLogo.getBoundingClientRect();
    const targetRect = targetSlot.getBoundingClientRect();

    // 3. Pin flying logo in fixed space at exact starting location
    flyingLogo.style.position = 'fixed';
    flyingLogo.style.left = startRect.left + 'px';
    flyingLogo.style.top = startRect.top + 'px';
    flyingLogo.style.margin = '0';
    flyingLogo.style.transformOrigin = 'top left';
    flyingLogo.style.zIndex = '1000000';
    flyingLogo.style.transition = 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1), font-size 0.95s cubic-bezier(0.16, 1, 0.3, 1)';

    // Calculate deltas and scaling (from 2.5rem / 40px down to ~14px font-size)
    const scaleFactor = 14 / 40;
    const deltaX = targetRect.left - startRect.left;
    const deltaY = targetRect.top - startRect.top;

    // Force browser layout reflow before triggering transform
    flyingLogo.offsetHeight;

    // 4. Animate to top-left target position
    requestAnimationFrame(() => {
      flyingLogo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleFactor})`;
    });

    // 5. Fade out loader background overlay in sync
    loader.style.transition = 'opacity 0.75s ease 0.15s, visibility 0.75s ease 0.15s';
    loader.style.opacity = '0';

    // 6. Settle permanently into the top navigation bar
    setTimeout(() => {
      loader.classList.add('hidden');
      targetSlot.innerHTML = `<span class="font-glusp text-sm font-extrabold tracking-wider text-white">EVISION</span>`;
      flyingLogo.style.display = 'none';
    }, 980);

  }, 600);
}

// Run transition once DOM is loaded and fonts are ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.fonts) {
    document.fonts.ready.then(() => {
      playLoaderTransition();
    });
  } else {
    playLoaderTransition();
  }
});

function switchAuthTab(tab) {
  const signinView = document.getElementById('view-signin');
  const registerView = document.getElementById('view-register');
  const promptElem = document.getElementById('bottom-switch-prompt');

  if (tab === 'signin') {
    signinView.classList.remove('hidden');
    registerView.classList.add('hidden');
    promptElem.innerHTML = 'New Operator? <button type="button" onclick="switchAuthTab(\'register\')" class="text-brand-container font-semibold hover:text-brand-orangeDark transition-colors ml-1 underline underline-offset-2">Register Station</button>';
  } else {
    signinView.classList.add('hidden');
    registerView.classList.remove('hidden');
    promptElem.innerHTML = 'Already registered? <button type="button" onclick="switchAuthTab(\'signin\')" class="text-brand-container font-semibold hover:text-brand-orangeDark transition-colors ml-1 underline underline-offset-2">Sign in to Operator Portal</button>';
  }
}

// Support URL search parameter (e.g. register.html?mode=register)
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mode') === 'register') {
    switchAuthTab('register');
  }
});

function handleLoginSubmit(e) {
  e.preventDefault();
  const emailElem = document.getElementById('signin-email');
  const passElem = document.getElementById('signin-password');

  const email = emailElem ? emailElem.value.trim() : '';
  const password = passElem ? passElem.value : '';

  if (!email) {
    alert('Please enter your operator email.');
    return;
  }
  if (!password) {
    alert('Please enter your security key / password.');
    return;
  }

  localStorage.setItem('evision_user', JSON.stringify({
    email: email,
    role: 'Station Operator',
    isLoggedIn: true,
    authenticatedAt: new Date().toISOString()
  }));

  // Direct redirect to AI Charging Site Planner Dashboard
  window.location.href = 'site-planner/dashboard.html';
}

function handleRegisterSubmit(e) {
  e.preventDefault();
  const nameElem = document.getElementById('reg-name');
  const emailElem = document.getElementById('reg-email');
  const passElem = document.getElementById('reg-password');
  const confirmPassElem = document.getElementById('reg-confirm-password');

  const name = nameElem ? nameElem.value.trim() : '';
  const email = emailElem ? emailElem.value.trim() : '';
  const password = passElem ? passElem.value : '';
  const confirmPassword = confirmPassElem ? confirmPassElem.value : '';

  if (!name || !email) {
    alert('Please fill in your name and email.');
    return;
  }

  if (!password || !confirmPassword) {
    alert('Please enter and confirm your password.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match. Please re-enter your password.');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters long.');
    return;
  }

  localStorage.setItem('evision_user', JSON.stringify({
    name: name,
    email: email,
    role: 'Station Operator',
    isLoggedIn: true,
    registeredAt: new Date().toISOString()
  }));

  // Direct redirect to AI Charging Site Planner Dashboard
  window.location.href = 'site-planner/dashboard.html';
}
