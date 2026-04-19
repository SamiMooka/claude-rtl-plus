let rtlEnabled = true;

function hasPersianText(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function applyRTLToProseMirror() {
  if (!rtlEnabled) return;
  
  const proseMirror = document.querySelector('.ProseMirror[role="textbox"]');
  if (proseMirror) {
    const text = proseMirror.textContent.trim();
    if (text.length === 0) {
      proseMirror.removeAttribute('dir');
    } else if (hasPersianText(text)) {
      proseMirror.setAttribute('dir', 'rtl');
    } else {
      proseMirror.setAttribute('dir', 'ltr');
    }
  }
}

function applyRTL() {
  if (!rtlEnabled) return;
 
  applyRTLToProseMirror();
 
  document.querySelectorAll('.standard-markdown').forEach(el => {
    if (hasPersianText(el.textContent)) {
      el.setAttribute('dir', 'rtl');
    }
  });
 
  document.querySelectorAll('div[data-testid="user-message"]').forEach(el => {
    if (hasPersianText(el.textContent)) {
      el.setAttribute('dir', 'rtl');
    }
  });
 
  document.querySelectorAll('code, pre').forEach(el => {
    if (hasPersianText(el.textContent)) {
      el.setAttribute('dir', 'rtl');
    }
  });
 
  document.querySelectorAll('[id="markdown-artifact"]').forEach(el => {
    if (hasPersianText(el.textContent)) {
      el.setAttribute('dir', 'rtl');
    }
  });
 
  document.querySelectorAll('.font-claude-response').forEach(el => {
    if (hasPersianText(el.textContent)) {
      el.setAttribute('dir', 'rtl');
    }
  });
 
  document.querySelectorAll('.relative.group').forEach(el => {
    if (hasPersianText(el.textContent)) {
      el.setAttribute('dir', 'rtl');
    }
  });
 
  document.querySelectorAll('.whitespace-normal.break-words').forEach(el => {
    if (hasPersianText(el.textContent)) {
      el.setAttribute('dir', 'rtl');
    }
  });
}

function removeRTL() {
  const proseMirror = document.querySelector('.ProseMirror[role="textbox"]');
  if (proseMirror) {
    proseMirror.removeAttribute('dir');
  }
 
  document.querySelectorAll('.standard-markdown').forEach(el => {
    el.removeAttribute('dir');
  });
 
  document.querySelectorAll('div[data-testid="user-message"]').forEach(el => {
    el.removeAttribute('dir');
    el.style.textAlign = '';
  });
 
  document.querySelectorAll('code, pre').forEach(el => {
    el.removeAttribute('dir');
  });
 
  document.querySelectorAll('[id="markdown-artifact"]').forEach(el => {
    el.removeAttribute('dir');
  });
 
  document.querySelectorAll('.font-claude-response').forEach(el => {
    el.removeAttribute('dir');
  });
 
  document.querySelectorAll('.relative.group').forEach(el => {
    el.removeAttribute('dir');
  });
 
  document.querySelectorAll('.whitespace-normal.break-words').forEach(el => {
    el.removeAttribute('dir');
  });
}

browser.storage.local.get('rtlEnabled', function(data) {
  rtlEnabled = data.rtlEnabled !== false;
  if (rtlEnabled) applyRTL();
});

browser.runtime.onMessage.addListener(function(request) {
  if (request.action === 'toggleRTL') {
    rtlEnabled = request.enabled;
    if (rtlEnabled) {
      applyRTL();
    } else {
      removeRTL();
    }
  }
});

const observer = new MutationObserver(applyRTL);
observer.observe(document.body, { childList: true, subtree: true });

const bodyObserver = new MutationObserver(() => {
  const proseMirror = document.querySelector('.ProseMirror[role="textbox"]');
  if (proseMirror && !proseMirror.dataset.rtlObserverAttached) {
    proseMirror.dataset.rtlObserverAttached = 'true';
    const proseMirrorObserver = new MutationObserver(applyRTLToProseMirror);
    proseMirrorObserver.observe(proseMirror, { 
      characterData: true, 
      childList: true, 
      subtree: true 
    });
    
    proseMirror.addEventListener('input', applyRTLToProseMirror);
    proseMirror.addEventListener('keyup', applyRTLToProseMirror);
  }
});
bodyObserver.observe(document.body, { childList: true, subtree: true });

applyRTL();