import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { postData } from '../utils/api';
import { toast } from 'react-toastify';

const initialInput = {
  sleepHours: 7.5,
  sleepQuality: "Good",
  screenTime: 5,
  physicalActivity: 30,
  socialInteraction: 3,
  workProductivity: 7,
  weather: "Sunny",
  dietQuality: "Good",
};

const sleepQualityOptions = ["Poor", "Fair", "Good", "Excellent"];
const weatherOptions = ["Cloudy", "Rainy", "Sunny"];
const dietQualityOptions = ["Average", "Good", "Poor"];

const Tracker = () => {
  const [input, setInput] = useState(initialInput);
  const [result, setResult] = useState(null);
  const [aiMarkdown, setAiMarkdown] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    const payload = {
      sleep_hours: input.sleepHours,
      sleep_quality: input.sleepQuality,
      screen_time: input.screenTime,
      physical_activity: input.physicalActivity,
      social_interaction: input.socialInteraction,
      work_productivity: input.workProductivity,
      weather: input.weather,
      diet_quality: input.dietQuality
    };
    try {
      const data = await postData("/tracker/predict", payload);
      if (data.detail) {
        toast.info(data.detail);
        return;
      }
      setResult({
        moodScore: data.mood_score,
        stressLevel: data.stress_level,
      });
      setAiMarkdown(data.ai_recommendation || "");
    } catch (err) {
      toast.error("Failed to predict mental health status.");
      setResult(null);
      setAiMarkdown("");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 mt-10">
      <h2 className="text-2xl md:text-3xl font-bold text-purple-700 mb-6 text-center">
        🧠 Mental Health Tracker
      </h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="sleepHours" className="font-semibold">
            Sleep Hours
          </label>
          <input
            type="number"
            name="sleepHours"
            id="sleepHours"
            step={"0.1"}
            min={"3"}
            max={"12"}
            value={input.sleepHours}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded border"
          />
        </div>
        <div>
          <label htmlFor="sleepQuality" className="font-semibold">
            Sleep Quality
          </label>
          <select
            name="sleepQuality"
            id="sleepQuality"
            value={input.sleepQuality}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded border"
          >
            {sleepQualityOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="screenTime" className="font-semibold">
            Screen Time (hours)
          </label>
          <input
            type="number"
            name="screenTime"
            id="screenTime"
            step={"0.1"}
            min={"1"}
            max={"12"}
            value={input.screenTime}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded border"
          />
        </div>
        <div>
          <label htmlFor="physicalActivity" className="font-semibold">
            Physical Activity (minutes)
          </label>
          <input
            type="number"
            name="physicalActivity"
            id="physicalActivity"
            min={"0"}
            max={"120"}
            value={input.physicalActivity}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded border"
          />
        </div>
        <div>
          <label htmlFor="socialInteraction" className="font-semibold">
            Social Interaction (hours)
          </label>
          <input
            type="number"
            name="socialInteraction"
            id="socialInteraction"
            step={"0.1"}
            min={"0"}
            max={"10"}
            value={input.socialInteraction}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded border"
          />
        </div>
        <div>
          <label htmlFor="workProductivity" className="font-semibold">
            Work Productivity Score
          </label>
          <input
            type="number"
            name="workProductivity"
            id="workProductivity"
            min={"1"}
            max={"10"}
            value={input.workProductivity}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded border"
          />
        </div>
        <div>
          <label htmlFor="weather" className="font-semibold">
            Weather
          </label>
          <select
            name="weather"
            id="weather"
            value={input.weather}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded border"
          >
            {weatherOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dietQuality" className="font-semibold">
            Diet Quality
          </label>
          <select
            name="dietQuality"
            id="dietQuality"
            value={input.dietQuality}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded border"
          >
            {dietQualityOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </form>
      <button
        onClick={handlePredict}
        disabled={loading}
        className="mt-8 w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Predicting..." : "🔮 Predict Mental Health Status"}
      </button>
      {result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-xl p-6 text-center shadow">
                <h3 className="text-xl font-semibold mb-2">😊 Mood Score</h3>
                <div className="text-4xl font-bold">{result.moodScore}/10</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-xl p-6 text-center shadow">
                <h3 className="text-xl font-semibold mb-2">😰 Stress Level</h3>
                <div className="text-4xl font-bold">{result.stressLevel}/10</div>
            </div>
        </div>
      )}
      {aiMarkdown && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6 shadow">
            <ReactMarkdown>{aiMarkdown}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Tracker;
