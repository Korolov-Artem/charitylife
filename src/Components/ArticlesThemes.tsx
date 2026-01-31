import {MouseEvent, useState} from "react";
import {useGetArticlesByThemeQuery} from "../services/articlesApi.ts";
import ArticlesByTheme from "./ArticlesByTheme.tsx";

const ArticlesThemes = () => {
    const [currentId, setCurrentId] = useState("design");
    const [page, setPage] = useState(1);

    const {
        data,
        isLoading,
        error,
        isFetching
    } = useGetArticlesByThemeQuery({theme: currentId, page: page})

    const articles = data?.articles || [];
    const hasMore = data?.hasMore || false;

    const handleClick = (e: MouseEvent<HTMLDivElement>, themeId: string) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentId(themeId);
        setPage(1)
    }

    const handlePrev = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    const handleNext = () => {
        if (hasMore) {
            setPage(page + 1)
        }
    }

    const getClasses = (themeId: string) => {
        if (currentId === themeId) {
            return "bg-[#BD3900] h-[10vh] w-[10wh] pl-[2vw] pr-[2vw] transition-all duration-200 content-center";
        }
        return "content-center h-[10vh] w-[10wh] pl-[2vw] pr-[2vw] cursor-pointer hover:text-red-700 hover:transition-colors hover:duration-200"
    }

    return (
        <div className="flex flex-col border-b-[1vh] ml-[-40vw]">
            <div
                className="flex mt-[30vh] text-4xl ml-[45vw] tracking-[0.2rem]underline-offset-8">
                <div
                    className={`${getClasses("design")} ml-[2vw]`}
                    onClick={(e) => handleClick(e, "design")}
                >
                    Дизайн
                </div>
                <div
                    className={`${getClasses("health")}`}
                    onClick={(e) => handleClick(e, "health")}
                >
                    Здоровʼя
                </div>
                <div
                    className={`${getClasses("travel")}`}
                    onClick={(e) => handleClick(e, "travel")}
                >
                    Подорожі
                </div>
                <div
                    className={`${getClasses("relationships")}`}
                    onClick={(e) => handleClick(e, "relationships")}
                >
                    Відносини
                </div>
                <div
                    className={`${getClasses("food")}`}
                    onClick={(e) => handleClick(e, "food")}
                >
                    Їжа
                </div>
            </div>
            <div className="flex justify-between mt-[24vh] ml-[22vw]">
                {articles && articles.length > 0 ? <ArticlesByTheme articles={articles}/>
                    : <div className="text-5xl ml-[30vw] mb-[15vh]">Покищо, тут порожньо...</div>}
                {isLoading ? "Loading..." : null}
                {error ? `An error occurred while retrieving articles: ${error}` : null}
            </div>

            {articles && articles.length > 0 ?
                <div
                    className="flex ml-[50vw] mt-[-2vh] text-6xl items-center gap-[5vw]">
                    <button onClick={handlePrev} disabled={page === 1 || isFetching}
                            className={`!bg-transparent ${page === 1 ? "text-[#ECEBDF] !hover:cursor-default" : "hover:cursor-pointer hover:text-red-700"} transition-all duration-300 ease-in-out`}
                            style={{
                                outline: 'none',
                                border: 'none',
                                boxShadow: 'none',
                                background: 'transparent',
                                WebkitTapHighlightColor: 'transparent'
                            }}
                    >
                        {`<`}
                    </button>
                    <button onClick={handleNext} disabled={!hasMore || isFetching}
                            className={`!bg-transparent ${!hasMore ? "text-[#ECEBDF] !hover:cursor-default" : "hover:cursor-pointer hover:text-red-700"} transition-all duration-300  ease-in-out`}
                            style={{
                                outline: 'none',
                                border: 'none',
                                boxShadow: 'none',
                                background: 'transparent',
                                WebkitTapHighlightColor: 'transparent'
                            }}
                    >
                        {`>`}
                    </button>
                </div> : null
            }
        </div>
    )
}

export default ArticlesThemes;