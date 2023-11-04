import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  HStack,
  Progress,
  Tab,
  Table,
  Tag,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Tooltip,
  Alert,
  AlertIcon,
  Flex,
  Image,
  IconButton,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "../../Components/SectionHeader";
import { GoEye } from "react-icons/go";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ErrorChecker } from "../../Components/ErrorChecker";
import { STATUS } from "../../App/Constants";
import _, { find } from "lodash";
import { ROUTES } from "../../Constants/Routes";
import { map } from "lodash";
import { size } from "lodash";
import { bilingualText, getAllPackages, getTrialPackages, mobileView, webView } from "../../utils/Helper";
import { BsGraphUp } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import moment from "moment";

export const TestPackages = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [filterpackagedata , setFilterPackageData] =useState()
  const [searchData, changeSearchData] = useState("");

  const {
    user,
    studentAttemptsStatus,
    getPkgContentsStatus,
    attempts,
    student,
    tests,
    assignments,
    assignmentAttemptsData,
    config
  } = useSelector((state) => ({
    user: state.user.user,
    studentAttemptsStatus: state.package.studentAttemptsStatus,
    getPkgContentsStatus: state.package.getPkgContentsStatus,
    attempts: state.package.attemptsData,
    student: state.user.student,
    tests: state.package.packageContents?.tests,
    assignments: state.package.packageContents?.assignments,
    config: state.package.config,
    // assignmentAttemptsData: state.package?.assignmentAttemptsData || [],
  }));

  const attemptsData = useMemo(() => {
    const packages = getAllPackages(student)
    let attemptsd = packages
      ? _.filter(
          packages,
          (p) =>
            size(p?.package?.tests || []) || size(p?.package?.assignments || [])
        )
      : [];

    return map(attemptsd, (a) => {
      let ptests = a?.package?.tests;
      let passignments = a?.package?.assignments;

      ptests = map(ptests, (te) => {
        let ntest = find(tests, (t) => t._id === te.test);

        return Object.assign({}, te, {
          test: ntest,
        });
      });

      passignments = map(passignments, (te) => {
        let nass = find(assignments, (a) => a._id === te.assignmentId);
        return Object.assign({}, te, {
          assignmentId: nass,
        });
      });

      if (a?.package?.tests || a?.package?.assignments) {
        return Object.assign({}, a, {
          package: Object.assign({}, a.package, {
            tests: ptests,
            assignments: passignments,
          }),
        });
      }
      return a;
    });
  }, [assignments, student, tests]);

  const showTests = (pkg) => {
    history.push("/dashboard/test-packages/" + pkg._id);
  };

  let breadcrumbs = [
    { title: "Home", link: "/" },
    { title: "My Tests", link: ROUTES.TEST_PACKAGES },
  ];


  const handleOpenPerformance = (pkg) => {
    history.push('/dashboard/package-performance-report/'+pkg.package._id)
  }

  useEffect( () => {
    const newFilterData = 
    _.orderBy(attemptsData, 'assignedOn', 'desc')
    .filter(f =>
    _.includes
        (
          _.toUpper(bilingualText(f.package?.name)),
          _.toUpper(searchData)))
        setFilterPackageData( newFilterData)
  },[ searchData])
  
  return (
    <Box>
      <SectionHeader title="My Tests" breadcrumbs={breadcrumbs} />

      <Box {...mobileView}>
        <Alert alignItems="start">
          <AlertIcon />
          Please download COCO mobile app to view tests in mobile.
        </Alert>

        <Flex
          p={5}
          bg="gray.50"
          mt={10}
          as="a"
          href="https://bit.ly/3rlc2YQ"
          target={"_blank"}
          border="0.5px solid #dadada"
          borderRadius={"md"}
          alignItems="center"
        >
          <Image
            style={{ height: "40px", width: "40px" }}
            src={require("../../Images/play.png")}
          />
          <Text ml={3}>Click here to download android app</Text>
        </Flex>
      </Box>

      {config.testOffers?.length && _.filter(config.testOffers,t => t.html).length ? 
        <Box background={'white'} p={6} borderTopRadius="20px">
          <div dangerouslySetInnerHTML={{__html:_.find(config.testOffers,t => t.html).html}}/>
        </Box>
        :
        null
      }

      <ErrorChecker status={getPkgContentsStatus}>
        <Box
          {...webView}
          boxShadow="sm"
          p="6"
          borderBottomRadius="20px"
          background="white"
        >
          <div>
            <Flex justifyContent={'flex-end'}>
              <Input
                placeholder="Search"
                style={{ width: "300px", padding:'10px', marginBottom:'10px' }}
                onChange={(e) => changeSearchData(e.target.value)}
              />
            </Flex>
            <Table>
              <Thead>
                <Tr>
                  <Th>Sr. No.</Th>
                  <Th>Package Name</Th>
                  <Th>Details</Th>
                  <Th>Total</Th>
                  {/*<Th>Assignments</Th>*/}
                  {/*<Th>Attempt/Total</Th>*/}
                  <Th>Progress</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filterpackagedata?.length
                  ? 
                    _.map(filterpackagedata, (ad, i) => {
                      const validityExpired = ad.validity?.date ? moment(ad.validity.date).isBefore(moment()) : false
                      const pkg = ad.package;
                      let totalTest = pkg?.tests?.length;
                      let totalAssignment = pkg?.assignments?.length;

                      let attemptedTest = _.filter(
                        pkg.tests,
                        (t) => t?.test?.userAttempts.length
                      ).length;

                      const attemptedAssignment = _.filter(
                        pkg?.assignments,
                        (a) => _.size(a?.assignmentId?.submissions)
                      ).length;

                      // console.log(attemptedTest + attemptedAssignment);
                      //const sizeTests = size(item?.package?.tests);
                      //const sizeAssignments = size(item?.package?.assignments);
                      //const sizeAttemptedAssignments = size(attemptedAssignments);

                      //const sizeAttemptedTests = size(attempted);

                      //  attemptedAssignment =  assignmentAttemptsData?.submissions?.length || 0;

                      let value = _.round(
                        ((attemptedTest + attemptedAssignment) /
                          (totalTest + totalAssignment)) *
                          100,
                        2
                      );

                      value =
                        String(value) === "NaN" || String(value) === "Infinity"
                          ? 0
                          : value;
                      return (
                        <Tr key={i}>
                          <Td>
                            <Box
                              padding="10px"
                              textAlign="center"
                              borderRadius="3px"
                              width="50px"
                              background="#F0F3F4"
                            >
                              {++i}.
                            </Box>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {pkg.name.en}
                              {pkg.name.hn && pkg.name.en ? "/" : null}
                              {pkg.name.hn}
                            </Text>
                            {/* <span style={{fontSize:'14px', color:'#85929E'}}>Civil Service Exam</span> */}
                          </Td>
                          <Td>
                            {totalTest && totalTest != 0 ? (
                              <Tag
                                onClick={() => showTests(pkg)}
                                style={{ cursor: "pointer", margin: "2px" }}
                              >
                                Tests
                              </Tag>
                            ) : null}
                            {totalAssignment && totalAssignment != 0 ? (
                              <Tag
                                onClick={() => showTests(pkg)}
                                style={{ cursor: "pointer", margin: "2px" }}
                              >
                                Assignments
                              </Tag>
                            ) : null}
                          </Td>
                          <Td>
                            <Tag style={{ margin: "2px" }}>
                              {attemptedTest +
                                attemptedAssignment +
                                "/" +
                                _.sum([totalTest, totalAssignment])}
                            </Tag>
                          </Td>
                          {/*<Td>{totalAssignment || "0"}</Td>*/}
                          {/*<Td>{totalTest ? `${_.filter(pkg.tests,t => !(t.maxAttempts && t.maxAttempts == t.userAttempts?.length)).length}/${pkg.tests.length}` : 0}</Td>*/}
                          <Td>
                            <Progress
                              size="sm"
                              colorScheme={
                                value <= 30
                                  ? "red"
                                  : value < 60 && value > 30
                                  ? "yellow"
                                  : "green"
                              }
                              value={value}
                              style={{ borderRadius: "30px", width: "200px" }}
                            />
                            <HStack justifyContent="space-between">
                              <Text fontSize="sm">{value + "%"}</Text>
                              <Text fontSize="sm">
                                {testPackageStatus(value)}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            {validityExpired ?
                              <Text color={'#E74C3C'} fontSize='sm'>
                                Looks like your previous due is pending. Please pay your due and continue learning.
                              </Text>
                              :
                              <HStack>
                                <Tooltip placement="top" label="View Tests">
                                  <IconButton color={'brand.redAccent'} variant='outline' size="sm"
                                    icon={<GoEye />} onClick={() => showTests(pkg)}
                                  />
                                </Tooltip>
                                <Tooltip placement="top" label="Performance">
                                  <IconButton color={'red.500'} variant='outline' size="sm" icon={<BsGraphUp/>}
                                    onClick={() => handleOpenPerformance(ad)}
                                  />
                                </Tooltip>
                              </HStack>
                            }
                          </Td>
                        </Tr>
                      );
                    })
                  : null}
              </Tbody>
            </Table>
          </div>
        </Box>
      </ErrorChecker>
    </Box>
  );
};

export const testPackageStatus = (progress) => {
  return progress === 100 ? "Complete" : progress === 0 ? "Start" : "Progress";
};
