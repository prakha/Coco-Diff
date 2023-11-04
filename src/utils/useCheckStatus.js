import { useRef, useEffect } from "react"
import { STATUS } from "../App/Constants"

export const useCheckStatus =  ({ status, onSuccess, onError }) => {
  const checkRef = useRef()
  useEffect(() => {
    if (status === STATUS.SUCCESS) {
      if (checkRef.current) {
        onSuccess && onSuccess()
        checkRef.current = false
      }
    } else if (status === STATUS.FAILED) {
      if (checkRef.current) {
        onError && onError()
        checkRef.current = false
      }
    } else if (status === STATUS.FETCHING) {
      checkRef.current = true
    }
  }, [onError, onSuccess, status])
  return status
}