export function readSettings() {
    return chrome.storage.sync.get({
        "server_name": 'screenshot.operationlinux.org',
        "passcode": 'none'
      });
}