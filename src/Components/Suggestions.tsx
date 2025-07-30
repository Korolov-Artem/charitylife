import {useGetArticlesQuery} from "../services/articlesApi.ts";
import SuggestedArticle from "./SuggestedArticle.tsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


const Suggestions = (props: { theme: string }) => {

    const [clickData, setClickData] = useState(false);
    const [id, setId] = useState("");
    const navigate = useNavigate();

    const handleClick = (id: string) => {
        setClickData(true);
        setId(id)
    }

    useEffect(() => {
        if (clickData) {
            navigate(`/${id}`);
        }
    }, [clickData, setClickData, id, setId]);

    const {data: articles, isLoading, isError} = useGetArticlesQuery({theme: props.theme, pgSize: 3});

    if (isLoading) {
        return <p>Loading...</p>
    }
    if (isError) {
        return <p>An unknown error occurred</p>
    }


    return (
        <div className="bg-[#BD3900] w-[100vw] mt-[10vh] -mb-[41vh]">
            <div className="text-[#faeeee] text-3xl pt-[2vh]">
                Можливо, вам також сподобається
            </div>
            <div className=" flex justify-between items-end">
                <div onClick={() => handleClick(articles[0].id)}>
                    <SuggestedArticle
                        title={articles[0].title}
                        image={articles[0].image}
                    />
                </div>
                <div onClick={() => handleClick(articles[1].id)}>
                    <SuggestedArticle
                        title={articles[1].title}
                        image={articles[1].image}
                    />
                </div>
                <div onClick={() => handleClick(articles[2].id)}>
                    <SuggestedArticle
                        title={articles[2].title}
                        image={articles[2].image}
                    />
                </div>
            </div>
        </div>
    )
}

export default Suggestions;