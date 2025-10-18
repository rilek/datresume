console.log('Content script loaded')

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message)
  
  if (message.type === 'GET_PAGE_INFO') {
    const pageInfo = {
      title: document.title,
      url: window.location.href,
      content: document.body.innerText.slice(0, 1000) // First 1000 characters
    }
    sendResponse(pageInfo)
  }
})

// You can add more content script functionality here
// For example, detecting resume-related content on pages