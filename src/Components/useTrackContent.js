import { useCallback, useEffect } from "react"
import { useSelector } from "react-redux"

export const useTrackContent = () => {
    const trackings = useSelector(state => state.tracking.trackings)

    const startTracking = useCallback((courseId, contentType, contentId) => {
        const videoTrackings = trackings?.[courseId]?.[contentType]
        const thisTracking = videoTrackings?.[contentId];
        let finalLog = thisTracking
        let current = finalLog?.properties?.current || 0;
        let total = finalLog?.properties?.size || 0
        let progress = parseInt(current / total * 100) || 0

        return { current, total, progress}
    }, [trackings]);

    return {startTracking}
}