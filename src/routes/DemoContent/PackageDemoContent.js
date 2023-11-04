import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { STATUS } from "../../App/Constants";
import { useIsAuthenticated } from "../../App/Context";
import { SectionHeader } from "../../Components/SectionHeader";
import {
  getPackageDemoAction,
  getSinglePackageAction,
} from "../../redux/reducers/packages";
import { bilingualText } from "../../utils/Helper";
import { useQueryParams } from "../../utils/useQueryParams";
import { AudioCard } from "../Contents/AudioFiles";
import { VideoCard } from "../Contents/VideoFiles";
import { EbookModal } from "./EbookModal";
import { PDFModal } from "./PDFModal";
export const PackageDemoContent = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useIsAuthenticated();
  const params = useParams();
  const packageId = params.packageId;
  let query = useQueryParams();
  const slug = query.get("slug");
  const history = useHistory();

  const { currentPackage } = useSelector((state) => ({
    currentPackage: state.package.packageDemoContent?.[0],
  }));

  useEffect(() => {
    dispatch(getPackageDemoAction({ id: packageId }));
  }, [packageId, dispatch]);

  const handleBack = () => {
    history.push("/package?id=" + currentPackage._id);
  };

  const breadcrumbs = [
    { title: "Home", link: "/" },
    {
      title: currentPackage ? bilingualText(currentPackage.name) : null,
      link: "/package?id=" + packageId,
    },
    { title: "Demo", link: "#" },
  ];

  const demoContent = currentPackage?.demoContent;

  const defaultIndex = useMemo(() => {
    if (demoContent) {
      if (demoContent.videos?.length) {
        return 0;
      } else if (demoContent.documents?.length) {
        return 1;
      } else if (demoContent.texts?.length) {
        return 2;
      } else if (demoContent.audios?.length) {
        return 3;
      }
      return 0;
    }
    return -1;
  }, [demoContent]);
  return (
    <Box p={[5, 50]}>
      <SectionHeader title="Demo" breadcrumbs={breadcrumbs} />

      <Box
        mb={4}
        bg="white"
        boxShadow="rgba(149, 157, 165, 0.1) 0px 4px 12px"
        p={10}
      >
        <Button
          variant="link"
          leftIcon={<ArrowBackIcon fontSize={20} />}
          onClick={handleBack}
        >
          {bilingualText(currentPackage?.name)}
        </Button>
        <br />
        <br />
        {demoContent && defaultIndex !== -1 ? (
          <Tabs
            defaultIndex={defaultIndex}
            key={defaultIndex}
            variant="enclosed"
            colorScheme="red"
          >
            <TabList>
              {demoContent.videos?.length ? (
                <Tab _focus={{ boxShadow: "0 0 0 3px #e02a1f75" }}>Video</Tab>
              ) : null}
              {demoContent.documents?.length ? (
                <Tab _focus={{ boxShadow: "0 0 0 3px #e02a1f75" }}>PDF</Tab>
              ) : null}
              {demoContent.texts?.length ? (
                <Tab _focus={{ boxShadow: "0 0 0 3px #e02a1f75" }}>eBook</Tab>
              ) : null}
              {demoContent.audios?.length ? (
                <Tab _focus={{ boxShadow: "0 0 0 3px #e02a1f75" }}>Audio</Tab>
              ) : null}
            </TabList>
            <TabPanels>
              <TabPanel>
                <br />
                <ContentDescription
                  content={demoContent.videos?.length}
                  description={demoContent.description}
                />
                <br />
                {demoContent.videos?.length ? (
                  <Flex flexWrap={"wrap"}>
                    {_.orderBy(demoContent.videos, "oreder", "asc").map(
                      (vid) => (
                        <VideoCard demo key={vid._id} video={vid} />
                      )
                    )}
                  </Flex>
                ) : null}
              </TabPanel>
              <TabPanel>
                <br />
                <ContentDescription
                  content={demoContent.documents?.length}
                  description={demoContent.description}
                />
                <br />
                {demoContent.documents?.length ? (
                  <Flex wrap={"wrap"} alignItems={"stretch"} spacing={10}>
                    {_.orderBy(demoContent.documents, "order", "asc").map(
                      (pdf) => (
                        <PdfCard demo key={pdf._id} doc={pdf} />
                      )
                    )}
                  </Flex>
                ) : null}
              </TabPanel>
              <TabPanel>
                <br />
                <ContentDescription
                  content={demoContent.texts?.length}
                  description={demoContent.description}
                />
                <br />
                {demoContent.texts?.length ? (
                  <Flex flexWrap={"wrap"}>
                    {_.orderBy(demoContent.texts, "order", "asc").map((pdf) => (
                      <EbookCard demo key={pdf._id} doc={pdf} />
                    ))}
                  </Flex>
                ) : null}
              </TabPanel>
              <TabPanel>
                <br />
                <ContentDescription
                  content={demoContent.audios?.length}
                  description={demoContent.description}
                />
                <br />
                {demoContent.audios?.length ? (
                  <Flex flexWrap={"wrap"}>
                    {_.orderBy(demoContent.audios, "order", "asc").map(
                      (aud) => (
                        <Box key={aud._id} pb={8}>
                          <AudioCard demo audio={aud} />
                        </Box>
                      )
                    )}
                  </Flex>
                ) : null}
              </TabPanel>
              <TabPanel>
                <br />
                {/* {demoContent?.videos?.length ?
                                <Flex>
                                    {demoContent.videos.map(vid =>
                                        <VideoCard key={vid._id} video={vid} />
                                    )}
                                </Flex>
                                :
                                null
                            } */}
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          <Text>No demo available...</Text>
        )}
      </Box>
    </Box>
  );
};

const ContentDescription = ({ description, content }) => {
  const { currentPackage } = useSelector((state) => ({
    currentPackage: state.package.packageDemoContent?.[0],
  }));

  return (
    <Box px={5}>
      <Text fontSize={18}>
        {currentPackage ? bilingualText(currentPackage.name) : null}
      </Text>
      {content ? (
        <Box
          fontSize={16}
          pb={3}
          color="gray.500"
          fontFamily="Lato"
          as="pre"
          sx={{
            "white-space": "-moz-pre-wrap",
            "white-space": "-o-pre-wrap",
            "word-wrap": "break-word",
            "white-space": "pre-wrap",
          }}
        >
          {description}
        </Box>
      ) : (
        <Box py={3}>
          <Text>Content will be available soon...</Text>
        </Box>
      )}
    </Box>
  );
};

const PdfCard = ({ doc }) => {
  const [showModal, openShowModal] = useState();

  const handleOpen = () => {
    openShowModal((d) => !d);
  };

  return (
    <>
      <Box
        width={200}
        p={"10px 10px 10px 0"}
        cursor="pointer"
        onClick={handleOpen}
      >
        <VStack>
          <Image
            src={doc.thumbnail || "/images/coco-book-cover-2.jpg"}
            objectFit="cover"
            width={100}
            height={150}
          />
          <Tooltip label={doc.name}>
            <Text textAlign={"center"} fontSize={13}>
              {doc.name.length > 60
                ? `${doc.name.substring(0, 60)}...`
                : doc.name}
            </Text>
          </Tooltip>
        </VStack>
      </Box>
      {showModal ? (
        <PDFModal visible={showModal} closeModal={handleOpen} document={doc} />
      ) : null}
    </>
  );
};

const EbookCard = ({ doc }) => {
  const [showModal, openShowModal] = useState();

  const handleOpen = () => {
    openShowModal((d) => !d);
  };

  return (
    <>
      <Box
        width={200}
        p={"10px 10px 10px 0"}
        cursor="pointer"
        onClick={handleOpen}
      >
        <VStack>
          <Image
            src={doc.thumbnail || "/images/coco-book-cover-2.jpg"}
            objectFit="cover"
            width={100}
            height={150}
          />
          <Text textAlign={"center"} fontSize={13}>
            {doc.name}
          </Text>
        </VStack>
      </Box>
      {showModal ? (
        <EbookModal
          visible={showModal}
          closeModal={handleOpen}
          document={doc}
        />
      ) : null}
    </>
  );
};
