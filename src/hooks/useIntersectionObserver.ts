import {useEffect, useRef, useState} from "react";

export const useIntersectionObserver = () => {
    const targetRef = useRef(null)
    const [isIntersecting, setIntersecting] = useState<boolean>(false)
    useEffect(() => {
        const element = targetRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIntersecting(entry.isIntersecting);
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [])
    return {targetRef, isIntersecting}
}