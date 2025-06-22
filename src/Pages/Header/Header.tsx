import "./Header.css";

const Header = () => {
  return (
    <div className="Header">
      <div className="Header__Text">
        <div className="Header__Text_Publications">
          <h2 className="text-3xl mt-4 font-light">Публікації</h2>
        </div>
        <div className="Header__Text_Title">
          <h2 className="text-3xl mt-4 font-light">CharityLife</h2>
        </div>
        <div className="Header__Text_Menu">
          <h2 className="text-3xl mt-4 font-light">Меню</h2>
        </div>
      </div>
    </div>
  );
};

export default Header;
