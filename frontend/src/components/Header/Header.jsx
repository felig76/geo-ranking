import '../styles/Header.css'
function Header() {
  return (
    <header id="gameHeader">
      <h2 id="title">Geo Ranking</h2>
      <div id="configButtons">
        <div className="headeConfigButton" id="languageSelect">
          <button>🇪🇸</button>
        </div>
        <button className="headeConfigButton" id="colorSchemeSelect">🌙</button>
      </div>
    </header>
  );
}

export default Header