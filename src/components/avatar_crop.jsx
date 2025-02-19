"use client"

import { useState, useCallback } from "react"
import PropTypes from "prop-types"
import Cropper from "react-easy-crop"
import { getCroppedImg } from "../utils/cropImage"

const Button = ({ children, onClick, variant = "primary" }) => (
  <button
    className={`px-4 py-2 rounded ${variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
    onClick={onClick}
  >
    {children}
  </button>
)

const Slider = ({ value, onChange, min, max, step }) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value}
    onChange={(e) => onChange(Number.parseFloat(e.target.value))}
    className="w-full"
  />
)

const Dialog = ({ open, onClose, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        {children}
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  )
}

const AvatarCropTool = ({ onSave, initialAvatarUrl, isEditing }) => {
  const [avatarURL, setAvatarURL] = useState(initialAvatarUrl)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isOpen, setIsOpen] = useState(false)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setAvatarURL(reader.result)
        setIsOpen(true)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleSave = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(avatarURL, croppedAreaPixels)
      setAvatarURL(croppedImage)
      setIsOpen(false)
      if (onSave) {
        onSave(croppedImage)
      }
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, avatarURL, onSave])

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className="relative w-[142px] h-[142px] rounded-full overflow-hidden cursor-pointer"
        onClick={() => isEditing && document.getElementById("avatarInput").click()}
      >
        {avatarURL ? (
          <img src={avatarURL || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle r="71" cx="71" cy="71" fill="#D9D9D9" />
          </svg>
        )}
        {isEditing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-sm">Change Avatar</span>
          </div>
        )}
      </div>
      {isEditing && (
        <input id="avatarInput" className="hidden" type="file" accept="image/*" onChange={handleFileChange} />
      )}

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Crop Your New Profile Picture</h2>
        <div className="mt-4">
          <div className="relative w-full h-64">
            {avatarURL && (
              <Cropper
                image={avatarURL}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            )}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Zoom</label>
            <Slider value={zoom} onChange={setZoom} min={1} max={3} step={0.1} />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button onClick={() => setIsOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

AvatarCropTool.propTypes = {
  onSave: PropTypes.func.isRequired,
  initialAvatarUrl: PropTypes.string,
  isEditing: PropTypes.bool.isRequired,
}

export default AvatarCropTool

