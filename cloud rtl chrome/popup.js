document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('rtlToggle');
  
  chrome.storage.local.get('rtlEnabled', function(data) {
    toggle.checked = data.rtlEnabled !== false;
  });
  
  toggle.addEventListener('change', function() {
    chrome.storage.local.set({ rtlEnabled: toggle.checked });
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleRTL', enabled: toggle.checked });
    });
  });
});