import {ReactNode, useEffect, useState} from "react";
import Loader from "../assets/Loader.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";


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

    if (isAppLoading) return <Loader/>

    return <>{children}</>
}