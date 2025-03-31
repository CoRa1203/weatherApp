import './WeatherAddInfoCard.css';

function WeatherAddInfoCard({icon, description, cardInfo, unit}){
    return(
        <div className="weatherInfo_addInfo-card">
        <img src={icon} alt={description} />
        <p className="weatherInfo_addInfo-text">{cardInfo} {unit}</p>
      </div>
    )
}

export default WeatherAddInfoCard;