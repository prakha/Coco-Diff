import { useState, useEffect } from 'react';
import getDocumentPages from './Pdfjs';

export default ({
  url
}) => {
  const [pages, setPages] = useState([]);
  useEffect(() => {
    const getPages = async () => {
      const canvases = await getDocumentPages({
        url
      });

      setPages(canvases);
    }
    getPages();
  }, [url])
  return {
    pages
  }
}