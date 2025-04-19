import type React from "react"
import { useState } from "react"
import  Button  from "../components/common/Button"
import { ClockIcon, Coins } from "lucide-react"

const steps = ["Preferences", "Budget & Time", "Your Schedule"]

const preferencesList = [
  { label: "Historical Landmarks", icon: "📍" },
  { label: "Museums & Galleries", icon: "🏛️" },
  { label: "Nature & Parks", icon: "🌳" },
  { label: "Local Cuisine", icon: "🍽️" },
  { label: "Cafes & Bars", icon: "☕" },
  { label: "Shopping", icon: "🛍️" },
]

const ToursPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([])
  const [budget, setBudget] = useState(100)
  const [startTime, setStartTime] = useState(540); 
  const [endTime, setEndTime] = useState(600);     
  

  const togglePref = (pref: string) => {
    setSelectedPrefs((prev) => (prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]))
  }

  const nextStep = () => {
    if (activeStep === 0 && selectedPrefs.length === 0) return
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
  }

  const duration = ((endTime - startTime) / 60).toFixed(1)

  return (
    <div className="pt-20 px-4 pb-16 bg-background min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Plan Your Perfect Tour</h1>
        <p className="text-gray-600">
          Our AI will create a personalized itinerary based on your preferences and budget.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex bg-gray-100 rounded overflow-hidden">
          {steps.map((step, index) => (
            <button
              key={step}
              onClick={() => setActiveStep(index)}
              className={`flex-1 py-2 text-center text-sm font-medium transition ${
                index === activeStep ? "bg-white shadow font-semibold" : ""
              }`}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        {/* Step 1: Preferences */}
        {activeStep === 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4">What are you interested in?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {preferencesList.map((pref) => (
                <button
                  key={pref.label}
                  onClick={() => togglePref(pref.label)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded border transition text-sm text-center ${
                    selectedPrefs.includes(pref.label) ? "bg-blue-100 border-blue-500" : "border-gray-300"
                  }`}
                >
                  <span className="text-xl">{pref.icon}</span>
                  {pref.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">Select at least one preference to continue</p>
            <div className="mt-6 flex justify-end">
              <Button disabled={selectedPrefs.length === 0} onClick={nextStep}>
                Next Step →
              </Button>
            </div>
          </>
        )}

        {/* Step 2: Budget & Time */}
        {activeStep === 1 && (
          <>
            {/* Budget Section */}
            <div className="mb-10">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Daily Budget (€)</h2>
                <span className="bg-gray-200 px-3 py-1 rounded font-semibold flex items-center gap-1">
                  <Coins size={16} /> {budget}€
                </span>
              </div>
              <div className="mt-2">
                <input
                  type="range"
                  min={10}
                  max={300}
                  step={10}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>€10</span>
                  <span>€300+</span>
                </div>
              </div>
            </div>

            {/* Time Range Section */}
            <div className="mb-10">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Tour Duration (hours)</h2>
                <span className="bg-gray-200 px-3 py-1 rounded font-semibold flex items-center gap-1">
                  <ClockIcon size={16} /> {duration} hours
                </span>
              </div>
              <div className="relative mt-2">
                <div className="h-2 bg-gray-100 border border-gray-400 rounded-full relative">
                  <div
                    className="h-full bg-blue-500 rounded-full absolute"
                    style={{
                      left: `${((startTime - 540) / (1260 - 540)) * 100}%`,
                      width: `${((endTime - startTime) / (1260 - 540)) * 100}%`,
                    }}
                  ></div>
                </div>
                <input
                  type="range"
                  min={540}
                  max={1260}
                  step={15}
                  value={startTime}
                  onChange={(e) => setStartTime(Math.min(Number(e.target.value), endTime - 15))}
                  className="w-full appearance-none absolute top-0 bottom-0 my-auto z-10 h-2 bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-400"
                />
                <input
                  type="range"
                  min={540}
                  max={1260}
                  step={15}
                  value={endTime}
                  onChange={(e) => setEndTime(Math.max(Number(e.target.value), startTime + 15))}
                  className="w-full appearance-none absolute top-0 bottom-0 my-auto z-10 h-2 bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-400"
                />
              </div>
              <div className="mt-1 flex justify-between text-sm text-gray-500">
                <span>09:00</span>
                <span>21:00</span>
              </div>
              <div className="mt-2 flex justify-center text-sm text-gray-500">
                {formatTime(startTime)} - {formatTime(endTime)}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                ← Back
              </Button>
              <Button onClick={nextStep}>
                ✨ Generate Tour
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Schedule */}
        {activeStep === 2 && (
          <>
            <div className="text-center py-12 text-gray-500">Your Schedule step coming soon...</div>
            <div className="mt-6 flex justify-start">
              <Button variant="outline" onClick={prevStep}>
                ← Back
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ToursPage
