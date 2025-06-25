export function readSettings() {
    return chrome.storage.sync.get({
        "server_name": 'operationlinux.com:8080',
        "passcode": 'none'
      });
}