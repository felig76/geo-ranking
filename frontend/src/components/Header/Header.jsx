import './Header.css'

function Header() {
  return (
    <header id="gamePageHeader">
      <h2 id="title">GeoRanking 🌎</h2>
      <div id="configButtons">
        <div className="headerConfigButton" id="languageSelect">
          <button title="Cambiar idioma"></button>
        </div>
        <div className="headerConfigButton" id="colorSchemeSelect">
          <button title="Cambiar tema"></button>
        </div>
      </div>
    </header>
  );
}

export default Header;
