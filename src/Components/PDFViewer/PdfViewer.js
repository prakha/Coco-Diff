import React, { useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { Box } from '@chakra-ui/react'
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { useTracker } from '../../routes/Courses/useTracker';



export const PdfViewer = ({
    url,
    handle,
    initialPage = 0,
    handlePageChange,
    trackingData,
    height = '90vh'
}) => {
    const [numPages, setNumPages] = useState(null);
    const [currentPage, changePage] = useState(initialPage)

    const { trackerTrack } = useTracker(trackingData || {});

    const _load = (a) => {
        console.log({ numPages: a.doc._pdfInfo.numPages })
        setNumPages(a.doc._pdfInfo.numPages)
    }

    const _changePage = (a) => {
        console.log({ "pagechange": a })
        changePage(a.currentPage)
    }

    const toolbarPluginInstance = toolbarPlugin({});

    const { Toolbar } = toolbarPluginInstance;


    useEffect(() => {
        return () => trackerTrack(currentPage, numPages, false);
    }, [currentPage, numPages, trackerTrack]);


    return (
        <FullScreen handle={handle}>
            <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js">
                <Box h={height}  >
                    <div
                        style={{
                            alignItems: 'center',
                            backgroundColor: '#eeeeee',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                            padding: '4px',
                            display: 'flex'
                        }}
                    >
                        <Toolbar>
                            {(props) => {
                                const {
                                    CurrentPageInput,
                                    Download,
                                    EnterFullScreen,
                                    GoToNextPage,
                                    GoToPreviousPage,
                                    NumberOfPages,
                                    Print,
                                    ShowSearchPopover,
                                    Zoom,
                                    ZoomIn,
                                    ZoomOut,
                                } = props;
                                return (
                                    <>

                                        <div style={{ padding: '0px 2px' }}>
                                            <ZoomOut />
                                        </div>
                                        <div style={{ padding: '0px 2px' }}>
                                            <Zoom />
                                        </div>
                                        <div style={{ padding: '0px 2px' }}>
                                            <ZoomIn />
                                        </div>
                                        <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                                            <GoToPreviousPage />
                                        </div>
                                        <div style={{ padding: '0px 2px', width: '4rem' }}>
                                            <CurrentPageInput />
                                        </div>
                                        <div style={{ padding: '0px 2px' }}>
                                            / <NumberOfPages />
                                        </div>
                                        <div style={{ padding: '0px 2px' }}>
                                            <GoToNextPage />
                                        </div>
                                        {/* <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                                            <EnterFullScreen />
                                        </div> */}

                                    </>
                                );
                            }}
                        </Toolbar>
                    </div>
                    <div
                        style={{
                            height: "90vh",
                            overflow: 'hidden',
                        }}
                    >
                        <Viewer plugins={[toolbarPluginInstance]} initialPage={initialPage} fileUrl={url} onPageChange={_changePage} onDocumentLoad={_load} />
                    </div>

                </Box>
            </Worker>
        </FullScreen>
    )

}  