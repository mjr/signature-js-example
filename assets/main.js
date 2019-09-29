document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector(".signature")
  const saveButton = wrapper.querySelector("[data-action=send]")
  const clearButton = wrapper.querySelector("[data-action=clear]")
  const undoButton = wrapper.querySelector("[data-action=undo]")
  const canvas = wrapper.querySelector("canvas")

  const signaturePad = new SignaturePad(canvas, {
    backgroundColor: "rgb(255, 255, 255)"
  })

  function resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1)

    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    canvas.getContext("2d").scale(ratio, ratio)

    signaturePad.clear()
  }

  window.onresize = resizeCanvas
  resizeCanvas()

  function download(dataURL, filename) {
    if (
      navigator.userAgent.indexOf("Safari") > -1 &&
      navigator.userAgent.indexOf("Chrome") === -1
    ) {
      window.open(dataURL)
    } else {
      const blob = dataURLToBlob(dataURL)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style = "display: none"
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  function dataURLToBlob(dataURL) {
    const parts = dataURL.split(";base64,")
    const contentType = parts[0].split(":")[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length
    const uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }

    return new Blob([uInt8Array], {
      type: contentType
    })
  }

  clearButton.addEventListener("click", function() {
    signaturePad.clear()
  })

  undoButton.addEventListener("click", function() {
    const data = signaturePad.toData()

    if (data) {
      data.pop()

      signaturePad.fromData(data)
    }
  })

  saveButton.addEventListener("click", function() {
    if (signaturePad.isEmpty()) {
      alert("Forneça uma assinatura primeiro.")
    } else {
      const dataURL = signaturePad.toDataURL()
      download(dataURL, "signature.png")
    }
  })

  feather.replace()
})
