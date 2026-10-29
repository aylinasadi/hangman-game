import { useEffect, useRef } from "react";

export default function usePageFocus(title) {
    const ref = useRef(null);
    useEffect(() => {
        document.title = title;
        ref.current?.focus();
    }, [title]);
    return ref;
}