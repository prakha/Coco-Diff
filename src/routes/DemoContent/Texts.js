import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Box, HStack, List, ListItem, Text, VStack } from "@chakra-ui/layout";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { useIsAuthenticated } from "../../App/Context";
import { useLoginModal } from "../../App/useLoginModal";
import { CONTENT_TYPE } from "../../Constants";
import { typeset } from "../../utils/Helper";
import { useTracker } from "../Courses/useTracker";

export const Texts = ({ course }) => {
  return (
    <Box>
      <HStack
        mb={4}
        justify="space-between"
        p={2}
        boxShadow="0px 1px 2px #00000040"
        bg="white"
      >
        <Text fontSize="lg">Books</Text>
      </HStack>
      <SingleSubject course={course} />
      <br />
    </Box>
  );
};

const SingleSubject = ({ course }) => {
  const [selectedContent, setContent] = useState();
  const [hoverCont, setHoverCont] = useState();

  // useEffect(() => {
  //     if(selectedContent)
  //         window.renderMathInElement(document.getElementById("math-tex", {
  //             delimiters: [
  //                 { left: "$", right: "$", display: true }
  //             ]
  //         }))
  // }, [selectedContent])

  useEffect(() => {
    // renderFun();
    if (selectedContent) {
      typeset(() =>
        document.getElementById("math-tex", {
          delimiters: [{ left: "$", right: "$", display: true }],
        })
      );
    }
  }, [selectedContent]);

  const selectContent = (cont) => {
    setContent(cont);
  };

  const hoverContent = (ch) => {
    setHoverCont(ch._id);
  };

  const hoverContentOff = () => {
    setHoverCont(null);
  };

  const { toggleLoginModal } = useLoginModal();
  const isAuthenticated = useIsAuthenticated();

  const openText = () => {
    if (!isAuthenticated) toggleLoginModal();
  };

  return (
    <Box>
      <Accordion
        border="1px solid #D6DBDF"
        onClick={openText}
        allowMultiple
        w="100%"
      >
        {course?.texts?.length ? (
          course.texts.map((text) => (
            <AccordionItem isDisabled={!isAuthenticated}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {text.name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel w="100%" pb={4} border="1px solid #D6DBDF">
                <TextCard demo content={text} />
              </AccordionPanel>
            </AccordionItem>
          ))
        ) : (
          <Text py={2}></Text>
        )}
      </Accordion>
    </Box>
  );
};

export const TextCard = ({ content, subject }) => {
  const params = useParams();
  const [moveFileModal, toggleMoveFileModal] = useState();

  const { trackerTrack } = useTracker({
    contentType: CONTENT_TYPE.TEXT,
    courseId: params.courseId,
    dataId: content._id,
    contentId: subject,
    latency: 1,
  });

  useEffect(() => {
    trackerTrack(1, 1);
  }, []);

  return (
    <>
      <HStack justifyContent="space-between" align="">
        <HStack>
          <Text fontSize="20px" fontWeight="bold">
            {content.name}
          </Text>
        </HStack>
      </HStack>
      <br />
      <Box px={6} py={2} bg="rgba(239, 243, 246, 0.66)">
        <div
          id="math-tex"
          dangerouslySetInnerHTML={{ __html: content.data.value }}
        />
      </Box>
    </>
  );
};
