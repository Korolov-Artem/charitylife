import testImg from "../assets/image.png";

const NewArticle = () => {
  return (
    <div className="border-b-10 border-s-black">
      <h1 className="-ml-130 mt-10 font-normal tracking-[1rem]">
        Найновіша Стаття
      </h1>
      <div>
        <img
          src={testImg}
          className="flex max-h-250 min-h-150 max-w-110 min-w-110 object-cover ml-8 mt-10 hover:cursor-pointer"
        />
      </div>
      <div>
        <h2 className="-mt-200 ml-130 max-w-130 text-left text-4xl font-light text-[#BD3900] leading-relaxed cursor-pointer hover:text-black hover:transition-colors hover:duration-200 hover:cursor-pointer">
          Дуже лаконічний, супер короткий, та все ж доволі інформативний зміст /
          основна ідея і т.д.
        </h2>
      </div>
      <div>
        <p className="max-w-100 text-left font-[Cormorant_Garamond] ml-130 mt-20 text-[1.3rem] leading-relaxed cursor-pointer hover:text-red-700 hover:transition-colors hover:duration-200 hover:cursor-pointer">
          Перший параграф-другий лорем іпсуму чи ще чогось, що знахожиться у
          статті. Це тута, щоб привернути потенційного читача або додати ще
          трошечки інформації тим, хто вже хоче прочитати. І ще разок те саме:
          перший параграф-другий лорем іпсуму чи ще чогось, що знахожиться у
          статті. Це тута, щоб привернути потенційного читача або додати ще
          трошечки інформації тим, хто вже хоче прочитати
        </p>
      </div>
      <div>
        <p className="flex text-[1rem] font-bold  pt-6 ml-130">
          Генадій Корольов
        </p>
      </div>
      <div>
        <p className="flex -mt-5 font-bold ml-260 text-[#BD3900] text-[1rem]">
          26 Березня, 2025
        </p>
      </div>
    </div>
  );
};

export default NewArticle;
