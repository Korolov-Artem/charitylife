import "./Article.css";

const Article = () => {
  return (
    <div className="flex flex-col border-b-2 border-black max-w-sm mt-8 ml-4 items-start overflow-hidden text-ellipsis break-words text-left font-serif text-lg">
      <div className="hover:text-red-700 hover:transition-colors hover:duration-200 hover:cursor-pointer">
        <p className="m-4 p-1 leading-tight">
          Перший параграф-другий лорем іпсуму чи ще чогось, що знахожиться у
          статті. Це тута, щоб привернути потенційного читача
        </p>
      </div>
    </div>
  );
};

export default Article;
