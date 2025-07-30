const SuggestedArticle = ({title, image}: { title: string, image: string }) => {
    return (
        <div
            className="hover:cursor-pointer ml-[2vw] mr-[2vw] mt-[5vh] mb-[2vh] flex items-center justify-center text-[#faeeee]  shadow-lg rounded-lg hover:shadow-none !cursor:pointer transition-all duration-300">
            <img src={image}
                 className="w-[15vw] h-[40vh] object-cover ml-[2vw] rounded-lg mb-[2vw] pt-[4vh]"/>
            <h2 className="text-xl ml-[1vw] w-[5vw] text-left mr-[3vw] font-[Cormorant_Garamond]">
                {title}</h2>
        </div>
    )
}

export default SuggestedArticle