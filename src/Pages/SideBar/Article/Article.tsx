import {ArticleType} from "../../../types/ArticleType.ts";

type ArticleProps = {
    data: ArticleType,
    count: number
}

const Article: React.FC<ArticleProps> = ({data, count}) => {
    return (
        <div
            className={`flex flex-col ${count < 4 ? "border-b-2 border-black" : " "} min-h-[20vh] max-h-[20vh] max-w-sm mt-8 ml-4 items-start overflow-hidden text-ellipsis break-words text-left font-serif text-lg`}>
            <div className="hover:text-red-700 hover:transition-colors hover:duration-200 hover:cursor-pointer">
                <p className="m-4 p-1 leading-tight">
                    {data.synopsis}
                </p>
            </div>
        </div>
    );
};

export default Article;
