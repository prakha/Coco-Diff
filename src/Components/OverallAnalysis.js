import React from "react";
import { Box, Text, Divider, Flex } from "@chakra-ui/react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import _, { size } from "lodash";

const AttemptColors = {
  Correct: "#CFF291",
  Incorrect: "#F67982",
  NotAttempted: "#D0DAE1",
};

const commonProps = {
  padding: 0.5,
  labelTextColor: "inherit:darker(1.4)",
  labelSkipWidth: 16,
  labelSkipHeight: 16,
  legends: [
    {
      dataFrom: "keys",
      anchor: "bottom-right",
      direction: "column",
      justify: false,
      translateX: 120,
      translateY: 0,
      itemWidth: 100,
      itemHeight: 20,
      itemsSpacing: 0,
      itemDirection: "left-to-right",
      itemOpacity: 0.85,
      symbolSize: 20,
      effects: [
        {
          on: "hover",
          style: {
            itemOpacity: 1,
          },
        },
      ],
    },
  ],
  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
};

export const OverallAnalysis = (props) => {
  // console.log({props})
  const isoffline = props.currentAttempt.offline
  return (
    <div>
      {/* <Flex>
                <Box w="80%" pl='3'>
                   <Tag fontWeight='bold' style={{marginTop: '5px'}}>Your Score</Tag>&nbsp;&nbsp;<span style={{fontSize: '24px'}}>{_.round(props.currentAttempt.studentResult.totalScore, 2)}/{props.currentTest.maxMarks}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                   <Tag fontWeight='bold' style={{marginTop: '5px'}}>Accuracy</Tag>&nbsp;&nbsp;<span style={{fontSize: '24px'}}>{_.round((props.currentAttempt.studentResult?.totalStats?.correctNo/props.currentAttempt?.studentResult?.totalStats?.attemptedNo)*100 || 0, 2)}%</span>
                </Box>
            </Flex> */}
      <br />
      <Box>
        <span style={{ fontSize: "16px", paddingLeft: "20px" }}>
          <b>Subject Wise Marks</b>
        </span>
        <SubjectWiseAnalysis {...props} />
        <Divider />
       
        {
          isoffline ? null :
          <>
          <span style={{ fontSize: "16px", paddingLeft: "20px" }}>
          <b>Overall Response Accuracy</b>
        </span>
            <OverallResponseAnalysis {...props} />
            </>
        }
        {props.currentAttempt?.topperAttempt ?
          <Box fontSize='16px' paddingLeft='20px' >
            <Divider />
            <b>Topper Comparison</b>
            <TopperComparison {...props} />
          </Box>
          :
          null
        }
      </Box>
    </div>
  );
};

const TopperComparison = ({ currentAttempt, currentTest }) => {
  let myData = currentAttempt.studentResult?.sectionwiseStats?.length ?
    currentAttempt.studentResult.sectionwiseStats.map(d => ({ x: _.find(currentTest.sections, s => s._id === d.sectionId)?.subjectRefId.name.en, y: d.sectionScore }))
    : []

  let topperData = currentAttempt.topperAttempt?.studentResult?.sectionwiseStats?.length ?
    currentAttempt.topperAttempt.studentResult.sectionwiseStats.map(d => ({ x: _.find(currentTest.sections, s => s._id === d.sectionId)?.subjectRefId.name.en, y: d.sectionScore }))
    : []

  let data = [{ id: 'self', color: "#2ECC71", data: myData }, { id: 'topper', color: "##2ECC71", data: topperData }]
  return (
    <Box height={[400]}>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        colors={['#2ECC71', '#E74C3C']}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Subjects',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Marks',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
      />
    </Box>
  )
}

export const SubjectWiseAnalysis = ({ currentTest, currentAttempt }) => {
  const formTotalChartData = (currentTest, currentAttempt) => {
    let data = _.map(currentAttempt.studentResult.sectionwiseStats, (s) => {
      let currentSection = _.find(
        currentTest.sections,
        (sec) => sec._id === s.sectionId
      );
      console.log({ currentSection, s })
      return {
        name: currentSection?.subjectRefId?.name?.en,
        Marks: s.sectionScore,
        Total: currentSection?.maxMarks - s.sectionScore,
        MaxMarks: currentSection?.maxMarks,
      };
    });
    return data;
  };


  let data = formTotalChartData(currentTest, currentAttempt);
  console.log({ data })

  return (
    <Box h={`${75 * size(data)}px`} paddingX={[0, 0, 5, 20]}>
      <ResponsiveBar
        {...commonProps}
        margin={{ top: 20, right: 100, bottom: 70, left: 100 }}
        keys={["Marks", "Total"]}
        indexBy="name"
        data={data}
        label={(d) => {
          if (d.id === "Total") {
            return null;
          }
          return d.value;
        }}
        tooltip={(d) => {
          const val = d.id === "Total" ? d.data.MaxMarks : d.value;
          return (
            <Flex fontSize="xs">
              <Box h={4} w={4} bg={d.color}></Box>
              <Text ml={4}>
                {d.indexValue} - {d.id} : {val}
              </Text>
            </Flex>
          );
        }}
        layout="horizontal"
        colors={["#A9CBE4", "#D0DAE1"]}
        valueScale={{ type: "linear" }}
        axisLeft={{
          tickSize: 10,
          tickPadding: 5,
          tickRotation: -35,
          format: (d) => (size(d) > 20 ? d.substring(0, 19) + ".." : d),
        }}
        axisBottom={{
          tickSize: 10,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Marks",
          legendPosition: "middle",
          legendOffset: 50,
        }}
      />
    </Box>
  );
};

export const OverallResponseAnalysis = ({
  currentTest,
  currentAttempt,
  section,
}) => {
  const formSectionChartData = (currentTest, currentAttempt, section) => {
    let stats = _.find(
      currentAttempt.studentResult.sectionwiseStats,
      (s) => s.sectionId == section._id
    );

    let data = [
      { name: "Correct Question", Correct: stats.correctNo },
      { name: "Incorrect Question", Incorrect: stats.incorrectNo },
      {
        name: "NotAttempted Question",
        NotAttempted:
          section.questions.length - stats.correctNo - stats.incorrectNo,
      },
    ];

    return data;
  };

  const formTotalChartData = (currentTest, currentAttempt) => {
    //let stats = currentAttempt.studentResult.totalStats
    let data = _.map(currentAttempt.studentResult.sectionwiseStats, (s) => {
      let currentSection = _.find(
        currentTest.sections,
        (sec) => sec._id === s.sectionId
      );
      return {
        name: currentSection?.subjectRefId?.name?.en,
        Correct: s.correctNo,
        Incorrect: s.incorrectNo,
        NotAttempted:
          currentSection.questions.length - s.correctNo - s.incorrectNo,
      };
    });

    return data;
  };

  let data = section
    ? formSectionChartData(currentTest, currentAttempt, section)
    : formTotalChartData(currentTest, currentAttempt);
  return (
    <Box px={[0, 0, 5, 20]} style={{ height: "500px" }}>
      <ResponsiveBar
        {...commonProps}
        keys={["Correct", "Incorrect", "NotAttempted"]}
        indexBy="name"
        data={data}
        colors={({ id }) => AttemptColors[id]}
        valueScale={{ type: "linear" }}
        margin={{ top: 60, right: 140, bottom: 120, left: 100 }}
        padding={0.65}
        axisBottom={{
          tickSize: 10,
          tickPadding: 5,
          tickRotation: -25,
          format: (d) => (size(d) > 20 ? d.substring(0, 19) + ".." : d),
        }}
        axisLeft={{
          tickSize: 10,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Questions",
          legendPosition: "middle",
          legendOffset: -40,
        }}
      />
    </Box>
  );
};
