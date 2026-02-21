import {useEffect, useState} from "react";
import {ArticleType} from "../types/ArticleType.ts";
import {useIntersectionObserver} from "../hooks/useIntersectionObserver.ts";
import {Link, useNavigate} from "react-router-dom";
import {useGetArticlesQuery} from "../services/articlesApi.ts";
import {getImageUrl} from "./getImageUrl.ts";

const MediaGallery = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [articles, setArticles] = useState<ArticleType[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const {targetRef, isIntersecting} = useIntersectionObserver();

    const [click, setClick] = useState<boolean>(false);
    const navigate = useNavigate();

    const {data, isFetching} = useGetArticlesQuery({pgNumber: pageNumber, pgSize: 10});

    useEffect(() => {
        if (!data) return;
        if (data.length === 0) {
            setHasMore(false);
        } else {
            setArticles(prev => {
                const validArticles = data.filter(item => item.image && item.image.trim().length > 0);
                const newUnique = validArticles.filter(n => !prev.some(p => p.id === n.id));
                return [...prev, ...newUnique];
            });
        }
    }, [data]);

    useEffect(() => {
        if (isIntersecting && hasMore && !isFetching) {
            setPageNumber(prev => prev + 1);
        }
    }, [isIntersecting, hasMore, isFetching]);

    const handleBackClick = () => {
        setClick(true);
    };

    useEffect(() => {
        if (click) {
            navigate("/");
        }
    }, [click, navigate]);

    return (
        <div style={{padding: '20px', backgroundColor: '#1a1a1a', minHeight: '100vh'}}>
            <div
                style={{
                    fontSize: '32px',
                    color: '#fff',
                    marginBottom: '30px',
                    cursor: 'pointer'
                }}
                onClick={handleBackClick}
            >
                {"⇚ Назад"}
            </div>

            <h1 style={{color: '#fff', fontSize: '28px', marginBottom: '20px'}}>
                Media Archive
            </h1>

            {/* SIMPLIFIED GRID - NO FANCY CSS */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                {articles.map((article) => {
                    if (!article.image) return null;

                    const imageUrl = getImageUrl(article.image);

                    return (
                        <Link
                            key={article.id}
                            to={`/${article.id}`}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                backgroundColor: '#333',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <img
                                src={imageUrl}
                                alt={article.title}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                                onLoad={(e) => {
                                    console.log(`✅ Loaded: ${article.title}`, e.currentTarget.naturalWidth, 'x', e.currentTarget.naturalHeight);
                                }}
                                onError={(e) => {
                                    console.error(`❌ Failed: ${article.title}`, e.currentTarget.src);
                                    e.currentTarget.style.backgroundColor = '#ff0000';
                                }}
                            />
                            <div style={{
                                padding: '12px',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                backgroundColor: 'rgba(0,0,0,0.7)'
                            }}>
                                {article.title}
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div ref={targetRef} style={{
                height: '80px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {isFetching && (
                    <div style={{
                        width: '32px',
                        height: '32px',
                        border: '3px solid #fff',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}/>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default MediaGallery;