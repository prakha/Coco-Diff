import React, { useReducer, useState, useEffect } from "react";
import { Box, Button, Image, Text, Flex, Stack, Divider, Input } from "@chakra-ui/react";

import { useSelector } from "react-redux";
import { SectionHeader } from "../../Components/SectionHeader";
import { DownloadIcon, TimeIcon } from "@chakra-ui/icons";
import { Empty } from "../../Components/Empty";
import { useHistory } from "react-router-dom";
import { map } from "lodash";
import { toReadableDate } from "../../utils/datehelper";
import { ButtonX } from '../../Components/ButtonX'
import { bilingualText } from "../../utils/Helper";

export const Magazines = (props) => {
  const history = useHistory();
  const { packages } = useSelector((s) => ({
    packages: s.user?.student?.packages,
  }));

 const [searchData, changeSearchData] = useState("")
 const [filtermagazinedata, setFilterMagazineData] = useState()

  let magazines = _.filter(
    _.flatMap(packages, (p) =>
      map(p?.package?.magazines, (m) =>
        Object.assign({}, m, {
          package: p.package?.name?.en || p.package?.name.hn,
          assignedOn: p.assignedOn,
        })
      )
    ),
    (mg) => mg.mode === "online" && mg.type === "MAGAZINE"
  );

  useEffect( () => {
    const newFilterData = 
    _.filter(magazines, mag =>
    _.includes
        (
        _.toUpper(bilingualText(mag.name)),
        _.toUpper(searchData)))
        setFilterMagazineData( newFilterData)
    },[ searchData])

  const breadcrumbs = [
    { title: "Home", link: "/" },
    { title: "Magazines", link: "#" },
  ]

  return (
    <Box>
      <SectionHeader
        title="Magazines"
        breadcrumbs={breadcrumbs}
      />
      <Flex mx={6} justifyContent='flex-end' bg='white' p={2}  borderRadius="lg"  boxShadow="sm" >
          <Input
              placeholder="Search"
              style={{ width: "300px", padding:'10px', marginBottom:'10px',marginInline:'10px' }}
              onChange={(e) => changeSearchData(e.target.value)}
          />
      </Flex>
      <Box borderRadius="xl" p="1rem">
        {true ? (
          <div>
            <Flex direction="column">
              {_.map(filtermagazinedata, (mg, index) => {
                return (
                  <Flex
                    key={index}
                    boxShadow="sm"
                    alignItems="center"
                    borderRadius="lg"
                    m={3}
                    background="white"
                  >
                    <Stack direction="row" flex={1}>
                      {mg.media.length && mg.media[0]?.url ? (
                        <Image
                          mt={5}
                          ml={3}
                          borderRadius="lg"
                          height="100px"
                          width="100px"
                          objectFit="cover"
                          src={mg.media[0].url}
                        />
                      ) : null}
                      <Box p="1rem">
                        <div style={{ minHeight: "70px" }}>
                          <h3>
                            <b>{mg?.name?.en}</b>
                          </h3>
                          <Text noOfLines={2} color="gray.500" isTruncated>
                            {mg?.description?.en}
                          </Text>
                          <Divider my={3}/>
                          <Text color="gray.400" fontSize="xs">Package: {mg.package}</Text>
                          <Text color="gray.400" fontSize="xs">Purchased on: {toReadableDate(mg.assignedOn)}</Text>

                        </div>
                      </Box>
                    </Stack>
                    <Box m={3}>
                      {mg.content?.length ? (
                        <ButtonX
                          leftIcon={<DownloadIcon />}
                          onClick={() => window.open(mg.content[0].url)}
                        >
                          Download
                        </ButtonX>
                      ) : (
                        <ButtonX colorScheme="orange" leftIcon={<TimeIcon />}>
                          Coming Soon
                        </ButtonX>
                      )}
                    </Box>
                  </Flex>
                );
              })}
            </Flex>
          </div>
        ) : (
          <Empty
            title="NO MAGAZINES AVAILABLE"
            style={{ background: "white", margin: "0px" }}
          />
        )}
      </Box>
    </Box>
  );
};
