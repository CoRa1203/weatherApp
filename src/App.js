import "./App.css";
import loop from "./img/loop.svg";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import WeatherAddInfo from "./component/WeatherAddInfo/WeatherAddInfo";

function App() {
  const [city, setCity] =
    useState(""); /*состояние для хранения введенного города*/
  const [cityList, setСityList] = useState(
    []
  ); /*состояние для хранения списка городов*/
  const [weatherData, setWeatherData] =
    useState(null); /*хранятся данные о погоде*/
  const [loading, setLoading] = useState(false); /*состояние загрузки*/
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] =
    useState(false); /*показывает подсказки*/

  const inputRef = useRef(); /*создаем объект*/
  const APIKey = process.env.REACT_APP_API_KEY;

  const search = async (cityName) => {
    /*функция поиска погоды*/
    if (!cityName.trim()) {
      setError("Введите название города");

      return;
    }
    try {
      setLoading(true); /*отображение загрузки*/
      setError(null); /*сброс ошибки*/

      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKey}&lang=ru`
      );

      const { lat, lon } =
        geoResponse
          .data[0]; /*деструктурируем объект. обращаемся к объекту geoResponse при получении данных API и извлекаем lat, lon*/

      const [weatherResponse, UVResponse] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${APIKey}&lang=ru`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}&lang=ru`
        ),
      ]); /*запрос API к данным о погоде*/
      setWeatherData({
        /*сохранение данных о погоде*/ humidity:
          weatherResponse.data.main.humidity,
        windSpeed: weatherResponse.data.wind.speed,
        temperature: Math.floor(weatherResponse.data.main.temp) /*округляем*/,
        location: weatherResponse.data.name,
        UVIndex: UVResponse.data.value,
        weather: weatherResponse.data.weather,
        weatherDescription: weatherResponse.data.weather[0].description,
      });
      console.log(weatherResponse);

      setShowSuggestions(false); /*скрываются подсказки после поиска*/
    } catch (error) {
      setError("Город не найден");
      setWeatherData(null); /*сброс данных о погоде*/
    } finally {
      setLoading(false); /*выключении индикатора загрузки*/
    }
  };

  const fetchCitySuggestions = async (hint) => {
    /*функция для отображения подсказок городов*/
    if (hint.length < 2) {
      /*отправляется запрос при условии, что введено больше 2 символов*/
      setСityList([]); /*очищаем список подсказок*/
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${hint}&limit=5&appid=${APIKey}`
      ); /*запрос API к данным*/
      setСityList(
        /*формируем ответ*/
        response.data.map((city) => ({
          name: city.name,
        }))
      );
      setShowSuggestions(true); /*показываем подсказки*/
    } catch (error) {
      console.error("Ошибка при получении подсказок:", error);
      setСityList([]); /*очищает список при возникновении ошибки*/
    }
  };

  const getWeatherClassName = () => {
    if (!weatherData) return "sunny";
    const weatherClassInfo = weatherData.weather[0].main.toLowerCase();
    if (["clear", "sun"].includes(weatherClassInfo)) return "sunny";
    if (["rain", "drizzle"].includes(weatherClassInfo)) return "rainy";
    if (["cloud", "clouds"].includes(weatherClassInfo)) return "cloudy";
    if (["snow"].includes(weatherClassInfo)) return "snowy";
    if (["thunderstorm"].includes(weatherClassInfo)) return "thunder";
    if (["atmosphere"].includes(weatherClassInfo)) return "foggy";
  };

  const handleInputChange = (e) => {
    /*функция для отображения ввода в input*/
    const value = e.target.value; /*получение текущего текста*/
    setCity(value); /*обновление состояния "city"*/
    fetchCitySuggestions(
      value
    ); /*Вызывает fetchCitySuggestions для поиска подсказок*/
  };

  const handleCitySelect = (selectedCity) => {
    /*функция для добавления нужного города в Input из подсказок*/
    setCity(selectedCity); /*Добавляем город в input*/
    search(selectedCity); /*поиск погоды по выбранному городу*/
    setShowSuggestions(false); /*скрываем подсказки*/
  };

  const handleSearchClick = () => {
    /*запускаем в работу поиск погоды при клике на кнопку поиска*/
    search(city); /*поиск погоды по текущему городу*/
  };

  const handleKeyDown = (e) => {
    /*запускаем в работу поиск погоды при клике на enter*/
    if (e.key === "Enter") {
      search(city); /*поиск при клике на enter*/
    }
  };

  useEffect(() => {
    search("Izhevsk"); /*город по умолчанию*/
  }, []);

  useEffect(() => {
    if (weatherData) {
      console.log("Current weather class:", getWeatherClassName());
      console.log(
        "Applied container classes:",
        document.querySelector(".appContainer").className
      );
    }
  }, [weatherData]);

  return (
    <div className={`App ${getWeatherClassName()}`}>
      <div className={`cloud1 cloud1Gen ${getWeatherClassName()}`} />
      <div className={`cloud2 cloud1Gen ${getWeatherClassName()}`} />
      <div className={`cloud3 cloud1Gen ${getWeatherClassName()}`} />
      <div className={`appContainer ${getWeatherClassName()}`}>
        <div className="searchСity">
          <input
            ref={inputRef}
            type="text"
            placeholder="Поиск города"
            className="search_input"
            value={city}
            onChange={
              handleInputChange
            } /*вызываем функцию handleInputChange при изменении текста*/
            onKeyDown={
              handleKeyDown
            } /*поиск города при нажатии на клавишу enter*/
          />
          <button className="search_btn" onClick={handleSearchClick}>
            <img src={loop} alt="loop" />
          </button>
          {showSuggestions && cityList.length > 0 && (
            <ul className="suggestions_list">
              {cityList.map((cityItem, index) => (
                <li
                  key={index}
                  className="suggestion_item"
                  onClick={() => handleCitySelect(cityItem.name)}
                >
                  {cityItem.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {loading && <div className="loading">Загрузка...</div>}
        {/* отображение индикатора загрузки */}
        {error && <div className="error">{error}</div>}
        {/* отображение ошибки */}
        {weatherData /* отображение данных о погоде */ && (
          <div className={`weatherInfo ${getWeatherClassName()}`}>
            <div className={`weatherInfo_main ${getWeatherClassName()}`}>
              <h1 className="weatherInfo_city">{weatherData.location}</h1>
              <h2 className="weatherInfo_weather">
                {weatherData.temperature}°C
              </h2>
              <p>{weatherData.weatherDescription}</p>
            </div>
            <WeatherAddInfo
              wind={weatherData.windSpeed}
              UV={weatherData.UVIndex}
              humidity={weatherData.humidity}
            />
          </div>
          
        )}
      </div>
    </div>
  );
}

export default App;
