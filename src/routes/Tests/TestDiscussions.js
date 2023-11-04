import { Box, Heading } from "@chakra-ui/react";
import { find } from "lodash";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { SectionHeader } from "../../Components/SectionHeader";
import { ROUTES } from "../../Constants/Routes";
import { DiscussionComments } from "../DiscussionCommunity/DiscussionComments";

export const TestDiscussionScreen = (props) => {
  const params = useParams();
  // console.log({params})
  const student = useSelector((s) => s.user.student);
  let pkg = student
    ? find(student.packages, (p) => p.package?._id === params.packageId)
    : null;
  console.log({ pkg });
  let breadcrumbs = [
    { title: "Home", link: "/" },
    { title: "My Tests", link: ROUTES.TEST_PACKAGES },
    {
      title: pkg?.package?.name?.en || "Package Tests",
      link: ROUTES.TEST_PACKAGES + "/" + params.packageId,
    },
    { title: "Discussion" },
  ];
  const [sortType, setSortType] = useState();

  console.log('props', props)
  return (
    <Box p={3}>
      <SectionHeader title="Test Discussions" breadcrumbs={breadcrumbs} />
      <DiscussionComments
        itemModel={_.capitalize(params.type)}
        sortType={sortType}
        showAttachment={true}
        inputStyle="flushed"
        itemId={params.testId}
        includeDoubt={1}
      />
    </Box>
  );
};
