import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useTracker } from "../../routes/Courses/useTracker";

let pdfjsLib;

if (typeof window === "undefined") {
} else {
  pdfjsLib = window["pdfjs-dist/build/pdf"];
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    window["pdfjs-dist/build/pdf.worker.min.js"];
}

// export default ({ src }) => {
//   const { pages } = useDocument({
//     url: src,
//   });

//   return (
//     <div className="viewer">
//       {pages.map((canvasURL, idx) => {
//         return <img src={canvasURL} key={idx} />;
//       })}
//     </div>
//   );
// };

export const PdfViewer = ({
  url,
  handle,
  initialPage = 1,
  handlePageChange,
  trackingData,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, changePage] = useState(initialPage);
  const [loading, setLoading] = useState(true);

  const { trackerTrack } = useTracker(trackingData || {});

  // function onDocumentLoadSuccess({ numPages }) {
  //   setNumPages(numPages);
  // }

  useEffect(() => {
    return () => trackerTrack(pageNumber, numPages, false);
  }, [pageNumber]);

  // useEffect(() => {
  //   handlePageChange(pageNumber, numPages)
  // }, [pageNumber])

  function previousPage() {
    changePage((p) => {
      // renderPage(p - 1);
      return p - 1;
    });
  }

  function nextPage() {
    changePage((p) => {
      // renderPage(p + 1);
      return p + 1;
    });
  }

  const pdfDoc = useRef();
  const canvas = useRef();
  const ctx = useRef();
  const pages = useRef([]);

  const renderTask = useCallback((page) => {
    const h = window.innerHeight;

    let viewport = page.getViewport({ scale: 1 });
    const scale = h / viewport.height;
    viewport = page.getViewport({ scale });


    canvas.current.height = viewport.height;
    canvas.current.width = viewport.width;

    var renderContext = {
      canvasContext: ctx.current,
      viewport: viewport,
    };

    var renderTask = page.render(renderContext);

    renderTask.promise.then(function () {
      setLoading(false);
      //pageRendering = false;
      // if (pageNumPending !== null) {
      //   // New page rendering is pending
      //   renderPage(pageNumPending);
      //   pageNumPending = null;
      // }
    });
  }, []);

  const renderPage = useCallback(
    (pn) => {
      if (pages.current[pn]) {
        return renderTask(pages.current[pn]);
      }

      setLoading(true);
      pdfDoc.current &&
        pdfDoc.current.getPage(pn).then((page) => {
          pages.current[pn] = page;
          renderTask(page);
        });
    },
    [renderTask]
  );

  useEffect(() => {
    url &&
      pdfjsLib &&
      pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
        pdfDoc.current = pdfDoc_;
        if (!ctx.current && canvas.current) {
          ctx.current = canvas.current.getContext("2d");
        }
        setNumPages(pdfDoc_.numPages);
        // document.getElementById('page_count').textContent = pdfDoc_.numPages;
        changePage(1);
        canvas.current && renderPage(1);
      });
  }, [url, renderPage]);

  useEffect(() => {    
    if(pageNumber){
      renderPage(pageNumber);

    }
  }, [handle.active, renderPage, pageNumber]);

  return (
    <FullScreen handle={handle}>
      <Box position="relative">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: handle.active ? "100vh" : "90vh",
            overflow: handle.active ? "auto" : "auto",
          }}
        >
          <Box>
            <canvas ref={canvas} id="the-canvas"></canvas>
            <div class="annotationLayer"></div>

          </Box>
          <Flex justifyContent="center" position="absolute" bottom={0}>
            <HStack py={2}>
              <Button
                leftIcon={<ChevronLeftIcon fontSize={16} />}
                size={"xs"}
                colorScheme="teal"
                // disabled={pageNumber <= 1}
                onClick={previousPage}
              >
                Previous
              </Button>
              <Text>
                {pageNumber || (numPages ? 1 : "--")} / {numPages || "--"}
              </Text>

              <Button
                rightIcon={<ChevronRightIcon fontSize={16} />}
                colorScheme="teal"
                size={"xs"}
                // disabled={pageNumber >= numPages}
                onClick={nextPage}
              >
                Next
              </Button>
            </HStack>
          </Flex>
        </div>
        {loading ? (
          <Center top={0} left={0} right={0} bottom={0} position="absolute">
            <Spinner size="xl" />
          </Center>
        ) : null}
      </Box>
    </FullScreen>
  );
};
