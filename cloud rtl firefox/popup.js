document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('rtlToggle');
  
  browser.storage.local.get('rtlEnabled', function(data) {
    toggle.checked = data.rtlEnabled !== false;
  });
  
  toggle.addEventListener('change', function() {
    browser.storage.local.set({ rtlEnabled: toggle.checked });
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      browser.tabs.sendMessage(tabs[0].id, { action: 'toggleRTL', enabled: toggle.checked });
    });
  });
});