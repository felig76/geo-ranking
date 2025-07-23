import './TopList.css';
function TopList({ correctAnswers, revealedCountries, revealedLost, unit }) {
  return (
    <div id='topList'>
      {correctAnswers.map((item, index) => (
        <div
          key={index}
          className={`list-item ${revealedCountries.includes(index) ? "revealed" : ""} ${revealedLost.includes(index) ? "revealedLost" : ""} ${!revealedCountries.includes(index) && !revealedLost.includes(index) ? "hidden" : ""}`}
        >
          <p className='list-top-index'>Top {index + 1}</p>
          <p className='list-item-text'>
            {revealedCountries.includes(index) || revealedLost.includes(index) ? (
              ` ${item.country}: ${item.value.toLocaleString()} ${unit}`
            ) : (
              ""
            )}
          </p>
          
        </div>
      ))}
    </div>
  );
}

export default TopList