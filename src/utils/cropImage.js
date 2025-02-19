export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous")
    image.src = url
  })

export const getCroppedImg = async (avatarURL, pixelCrop) => {
  const image = await createImage(avatarURL)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return ""
  }

  // Set canvas size to match the pixel crop size
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  // As Base64 string
  return canvas.toDataURL("image/jpeg")
}

