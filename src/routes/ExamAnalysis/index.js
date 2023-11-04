import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { SectionHeader } from '../../Components/SectionHeader';
import { URIS } from '../../services/api';
import { apis } from '../../services/api/apis';
import { useApiRequest } from '../../services/api/useApiRequest';
import { bilingualText } from '../../utils/Helper';
import { useQueryParams } from '../../utils/useQueryParams';
import { MainAnalysisComponent } from '../TestAnalysis';
import { ExamAnalysisContext } from './Context'


export const ExamAnalysisScreen = props => {
    const query = useQueryParams();
    const testId = query.get("testId");
    const testAttemptId = query.get("testAttemptId");
    const platform = query.get("platform") || "web";
    const [language, changeLanguage] = useState("en");

    const [testData, setTestData] = useState();
    const [testAttempt, setTestAttempt] = useState();
    const [attemptLoading, setAttemptLoading] = useState(false);

    const requestAttempt = useCallback(
        async (tdata) => {
            setAttemptLoading(true);
            const res = await apis.getTestAttemptApi({ id: testAttemptId });
            setAttemptLoading(false);
            if (res.ok) {
                // const atdata = getExamAttemptData(tdata, res.data);
                setTestAttempt(res.data);
            } else {
            }
        },
        [testAttemptId]
    );

    const onCompleted = useCallback(
        (data) => {
            console.log({data})
            setTestData(data);
            //call the attempt response
            requestAttempt(data);
        },
        [requestAttempt]
    );

    const onError = useCallback((response) => { }, []);

    const { request, loading } = useApiRequest(URIS.GET_SINGLE_TEST_DATA, {
        onCompleted,
        onError,
    });

    useEffect(() => {
        request({ method: "GET", params: { testId } });
    }, [testId, request]);


  const closeWindow = () => {
    // localStorage.setItem("testId", testId);
    // localStorage.setItem("attemptId", attemptData._id);
    window.close();
  };

    return (
        <ExamAnalysisContext.Provider>
            <Box p={10} bg="gray.50">
                <Flex justifyContent="space-between" mb={10}>
                <Heading color="red.500"  fontSize="4xl">Test Analysis</Heading>
                <Box>
                    <Button onClick={closeWindow} colorScheme="red">
                        Close window
                    </Button>
                </Box>
                </Flex>
            {testAttempt? 
                    testData?.testOption?.showAnalysis ? 
                        <Box>   
                            <SectionHeader title={bilingualText(testData.name)}/> 
                            <Box mt={2}>
                                <MainAnalysisComponent currentTest={testData} currentAttempt={testAttempt}/>
                            </Box>
                        </Box>
                    : testData?.resultPublished ?
                        <Box>    
                            <Text fontWeight='bold' fontSize='xl'>{bilingualText(testData.name)}</Text>
                            <br/>
                            <Box mt={2}>
                                <MainAnalysisComponent currentTest={testData} currentAttempt={testAttempt}/>
                            </Box>
                        </Box>
                        :
                        <Text>The analysis will be available after the result is published.</Text>
                :
                    <Text>Something went wrong</Text>
                }

            </Box>
        </ExamAnalysisContext.Provider>

    )
}