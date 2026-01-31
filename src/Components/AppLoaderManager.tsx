import {ReactNode, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";
import Loader from "../assets/Loader.tsx";


export const AppLoaderManager = ({children}: { children: ReactNode }) => {
    const [imagesLoaded, setImagesLoaded] = useState(false)

    const isFetching = useSelector((state: RootState) => {
        return Object.values(state.articlesApi.queries).some(
            (query: any) => query?.status === "pending"
        )
    })

    useEffect(() => {
        const images = Array.from(document.images)
        if (images.length === 0) {
            setImagesLoaded(true)
            return;
        }

        let loadedCount = 0
        const handleImageLoad = () => {
            loadedCount++
            if (loadedCount === images.length) {
                setImagesLoaded(true)
            }
        }

        images.forEach(img => {
            if (img.complete) {
                loadedCount++
            } else {
                img.addEventListener("load", handleImageLoad)
                img.addEventListener("error", handleImageLoad)
            }
        })

        if (loadedCount === images.length) {
            setImagesLoaded(true)
        }

        return () => {
            images.forEach((img) => {
                img.removeEventListener("load", handleImageLoad)
                img.removeEventListener("error", handleImageLoad)
            })
        }
    }, [])

    const isAppLoading = isFetching || !imagesLoaded

    return (
        <>
            {isAppLoading && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
                    zIndex: 9999, // Ensure it covers everything
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Loader/>
                </div>
            )}
            {children}
        </>
    )
}