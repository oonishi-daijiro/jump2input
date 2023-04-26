function jump2input() {

  const enableTypeList = ["text", "search", "tel", "url", "email", "password"]
  const inputs = Array.from(document.getElementsByTagName('input'))
  const inputText = inputs.filter(e => enableTypeList.includes(e.type))
  console.log(inputs)
  if (inputText.length >= 1) {
    if (count === inputText.length) {
      inputText[count - 1].blur()
      count = 0
      return
    } else {
      inputText[count].focus()
    }


    inputText[count].setSelectionRange(inputText[count].value.length, inputText[count].value.length)
    const offsetTop = inputText[count].offsetTop

    if (!isInViewY(inputText[count])) { // if the input is not in the screen
      window.scrollTo({
        left: 0,
        top: offsetTop
      })
    }
    count += 1
  }

}

function isInViewY(dom) {
  const offsetFromViewY = dom.getBoundingClientRect().top
  const screenHeight = screen.height
  return 0 < offsetFromViewY && offsetFromViewY < screenHeight
  // ↑ 0 < offsetFromViewY < screenHeight
}

jump2input()
