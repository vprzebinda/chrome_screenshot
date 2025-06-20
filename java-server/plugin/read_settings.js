export function readSettings() {
    return chrome.storage.sync.get({
        "server_name": '192.168.1.105:8080',
        "passcode": 'none'
      });
}