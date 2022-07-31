import { getAllByLabelText } from "@testing-library/react";
import { useState } from "react";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState({});
  const [savedData, setSavedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState("");

  const fetchData = async (e) => {
    if (cityName === "") return alert("please enter name of a city");

    e.preventDefault();
    setLoading(true);
    setWeatherData({});
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.REACT_APP_API_KEY}`
    );
    const data = await res.json();
    setWeatherData(data);
    setCityName("");
    setLoading(false);
  };

  const showSaved = async () => {
    setLoading(true);
    setCityName("");
    try {
      const res = await fetch(
        "https://nodejs-weather-api-test.herokuapp.com/weather"
      );
      const data = await res.json();
      setSavedData(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!weatherData) return;

    setWeatherData({});
    setCityName("");

    const { name, weather, main } = weatherData;
    try {
      setLoading(true);
      const res = await fetch(
        "https://nodejs-weather-api-test.herokuapp.com/weather",
        {
          method: "POST",
          body: JSON.stringify({
            city: name,
            weather,
            main,
          }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      setLoading(false);
      res.ok && alert("saved!");
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="App">
      <form onSubmit={fetchData}>
        <input
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        />
        <button>fetch</button>
      </form>
      <button onClick={handleSave}>save to db</button>
      <button onClick={showSaved}>get all saved</button>
      {loading && <p>loading</p>}
      {savedData &&
        savedData.map((item, index) => (
          <pre>
            <strong>No: {index + 1}</strong> <br />
            city: {item.city} <br />
            weather: {item.weather[0].description}
          </pre>
        ))}
      {weatherData && (
        <pre>search data: {JSON.stringify(weatherData, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;
