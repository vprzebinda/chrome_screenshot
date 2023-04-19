export function readSettings() {
    return chrome.storage.sync.get({
        "server_name": 'hill.przebinda.com',
        "passcode": 'default'
      });
}