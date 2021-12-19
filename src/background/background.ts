// TODO: background script

import fetch from 'node-fetch'

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  try {
    if (changeInfo.status == 'complete' && tab.active) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: dejatedepollas,
      })
    }
  } catch (err) {}
})

function dejatedepollas() {
  chrome.runtime.sendMessage(
    { url: document.location.href },
    function (response) {
      if (response) {
        document.open()
        document.write(response)
        document.close()
      }
    }
  )
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  checkPage(sender.tab.url, sendResponse)
  return true
})

export async function checkPage(url: String, sendResponse): Promise<any> {
  const response = await fetch(`http://127.0.0.1:3000/api/v1/websites`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer gAEqdLtKuZEK5WB8L2DLWbX4',
    },
  })
  const data = await response.json()

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let body = ''

    data.find((o) => {
      if (o.url === url) {
        body = o.body
        return true // stop searching
      }
    })
    sendResponse(body)
  })
}
