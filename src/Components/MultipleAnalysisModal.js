import React from "react";
import { useHistory, useParams } from "react-router-dom";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tag,
  ModalOverlay,
  Divider,
  HStack,
} from "@chakra-ui/react";
import { map } from "lodash";

export const MultipleAnalysisModal = ({
  visible,
  closeModal,
  testData,
  attempts,
}) => {
  const params = useParams()
  const history = useHistory();
  const openAnalysis = (attemptId) => {
    closeModal();
    history.push("/dashboard/exam/analysis/" + params.packageId + '/' + testData._id + "/" + attemptId);
  };

  return (
    <Modal isOpen={visible} size="4xl" onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Test Attempt Analysis</ModalHeader>
        <Divider />
        <ModalBody>
          <HStack spacing={4} style={{ marginTop: "10px" }}>
            {map(attempts, (s, i) => (
              <Tag
                size="md"
                key={i}
                variant="solid"
                colorScheme="teal"
                onClick={() => openAnalysis(s._id)}
                style={{ cursor: "pointer" }}
              >
                Test Attempt {s.attemptNo}
              </Tag>
            ))}
          </HStack>
          <br />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
