import { useGetArticlesQuery } from "../services/articlesApi.ts";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "./getImageUrl.ts";

const Suggestions = ({ theme }: { theme: string }) => {
  const navigate = useNavigate();
  const { data: articles, isLoading } = useGetArticlesQuery({
    theme,
    pgSize: 4,
  });

  // Filter out the current article if needed, or just take the first 3
  const suggested = articles ? articles.slice(0, 3) : [];

  if (isLoading || suggested.length === 0) return null;

  return (
    <section className="bg-[#BD3900] py-20 px-10 -mx-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[#fafafa] text-[10px] font-bold uppercase tracking-[0.4em] mb-12 text-center">
          Next in {theme}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {suggested.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer min-w-0"
              onClick={() => navigate(`/${item.id}`)} // Reverted back to a simple navigate
            >
              <div className="aspect-[4/5] overflow-hidden bg-black/20 mb-6 shrink-0">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </div>
              {/* CRITICAL FIX: Added line-clamp-2 and break-all to strictly contain long strings */}
              <h3 className="text-[#fafafa] text-lg font-serif leading-snug group-hover:underline decoration-1 underline-offset-4 line-clamp-2 break-all">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Suggestions;
