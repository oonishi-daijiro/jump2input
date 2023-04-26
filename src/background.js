// chrome.commands.onCommand.addListener((command) => {
//   console.log("shortcut")
//   chrome.tabs.query({
//     active: true,
//     lastFocusedWindow: true
//   }).then(tab => {
//     console.log(tab)
//     chrome.scripting.executeScript({
//       target: {
//         tabId: tab[0].id,
//         allFrames: true
//       },
//       files: ['./injections/jump2input.js']
//     })
//   })

// })

chrome.commands.onCommand.addListener(async command => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  })
  console.log(tab)
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
      allFrames: true
    },
    files: ['./injection/jump2input.js']
  })
})
