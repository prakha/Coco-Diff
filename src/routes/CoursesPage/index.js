import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Empty } from "../../Components/Empty";
import { ItemsSection } from "../../Components/ItemsSection";
import { useQueryParams } from "../../utils/useQueryParams";
import { SectionHeader } from "../../Components/SectionHeader";

export const CoursesPage = () => {
  let query = useQueryParams();
  const courseId = query.get("id");
  const courseName = query.get("name");
  const searchText = query.get("search");
  const searchType = query.get("searchType");

  const { packages } = useSelector((state) => ({
    packages: state.package.packagesList,
  }));

  const filteredPackages = packages.filter((pkg) => {
    let exams = pkg.exams.filter((e) =>{
      return searchText
        ? _.includes(_.toLower(pkg.name.en), _.toLower(searchText))
        :courseName ? e.name.en === courseName
          : e._id === courseId
    }
    );
    
    let type = searchType === 'all' ? true :searchType ?  pkg.type === searchType : true

    return exams.length > 0 && type
  });

  return (
    <Box bg="" p="2rem">
      <SectionHeader
        title={courseName}
        breadcrumbs={[
          { title: "Home", link: "/" },
          { title: courseName || searchText, link: "#" },
        ]}
      />
      {filteredPackages.length ? (
        <Flex style={{ justifyContent: "center" }} w={"full"}>
          <Box flexGrow={1}
            // p="1rem 1rem"
            // marginY="1rem"
            boxShadow="sm"
            bg="white"
            borderRadius="lg"
          >
            <ItemsSection
              items={filteredPackages}
            //   title={courseName || searchText}
              showAll={true}
              showToggle={false}
            />
          </Box>
        </Flex>
      ) : (
        <Empty
          title="Nothing Here"
          subtitle={"No Course for " + (courseName || searchText)}
        />
      )}
    </Box>
  );
};
