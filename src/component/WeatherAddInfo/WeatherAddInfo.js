import "./WeatherAddInfo.css";
import windIcon from "../../img/windIcon.svg";
import sunIcon from "../../img/sunIcon.svg";
import dropIcon from "../../img/dropIcon.svg";
import WeatherAddInfoCard from "../WeatherAddInfoCard/WeatherAddInfoCard";

function WeatherAddInfo({ wind, UV, humidity }) {
  return (
    <div className="weatherInfo_addInfo">
      <WeatherAddInfoCard
      icon={windIcon} 
      description='windSpeed'
      cardInfo={wind} 
      unit='м/с'
      />
       <WeatherAddInfoCard
      icon={sunIcon} 
      description='uvIndication'
      cardInfo={UV} 
      unit='UV'
      />
       <WeatherAddInfoCard
      icon={dropIcon} 
      description='humidityIndication'
      cardInfo={humidity} 
      unit='%'
      />
    </div>
  );
}

export default WeatherAddInfo;
