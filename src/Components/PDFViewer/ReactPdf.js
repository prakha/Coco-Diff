import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;


const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};

export const PdfViewer = ({
  url,
  handle,
  initialPage = 1,
  handlePageChange,
  trackingData,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, changePage] = useState(initialPage)




  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }
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
  return (
    <FullScreen handle={handle}>
      <Box position={"relative"} sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: 'center',
        height: handle.active ? "100vh" : "90vh",
        overflow: handle.active ? "auto" : "auto",

      }} >

        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
        >
          {Array.from(new Array(numPages), (el, index) => (

            <Page key={`page_${index}`} pageNumber={index+1} />

          ))}

        </Document>
        {/* <Flex justifyContent="center" position="absolute" bottom={0}>
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
              {currentPage || (numPages ? 1 : "--")} / {numPages || "--"}
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
        </Flex> */}
      </Box>
    </FullScreen>
  );
};
