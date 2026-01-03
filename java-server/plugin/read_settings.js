export function readSettings() {
    return chrome.storage.sync.get({
        "server_name": 'operationlinux.org:8080',
        "passcode": 'none'
      });
}