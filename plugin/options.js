import {readSettings} from './read_settings.js';

// Saves options to chrome.storage
function save_options() {
  var server_name = document.getElementById('server').value;
  var passcode = document.getElementById('passcode').value;
  chrome.storage.sync.set({
    "server_name": server_name,
    "passcode": passcode
  }, function () {
    // Update status to let user know options were saved.
    var save_status = document.getElementById('save');
    save_status.textContent = 'Options saved.';
    window.close();
  });
}

function restore_options() {
  readSettings().then((items) => {
    document.getElementById('server').value = items.server_name;
    document.getElementById('passcode').value = items.passcode;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
  save_options);