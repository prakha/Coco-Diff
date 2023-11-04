import React, { useEffect, useState } from 'react'
import { Box, HStack, Progress, Stack, Text, Spacer, Center, Divider, GridItem, Grid, Button, Flex, Tag} from '@chakra-ui/react'
import { ResponsiveBar } from '@nivo/bar';
import {secondsToMinuteSeconds} from '../utils/Helper'
const AttemptColors = {
    'Time Spent On Correct Questions': '#9CCC65',
    'Time Spent On Incorrect Questions': '#EF5350',
    'Time Spent On NotAttempted Questions': '#90A4AE'
}

const commonProps = {
  margin: { top: 60, right: 100, bottom: 100, left: 100 },
  padding: 0.5,
  labelTextColor: 'inherit:darker(1.4)',
  labelSkipWidth: 16,
  labelSkipHeight: 16,
  legends: [
    {
        dataFrom: 'keys',
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 50,
        translateY: 0,
        itemWidth: 100,
        itemHeight: 20,
        itemsSpacing: 0,
        itemDirection: 'left-to-right',
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
            {
                on: 'hover',
                style: {
                    itemOpacity: 1
                }
            }
        ]
    }
  ],
  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
};

export const TimeWiseAnalysis = (props) => {
    return(
        <div>           
            <br/>
            <Box>
                <span style={{fontSize: '20px', paddingLeft: '20px'}}><b>Time Usage Analysis(Positively Used And Wasted Time)</b></span>
                <TimeUsageAnalysis {...props}/>
                <Divider/>
                <span style={{fontSize: '20px', paddingLeft: '20px'}}><b>Time Spent Across Subject (mins)</b></span>
                <TimeSpentSubjectWise {...props}/>
            </Box>
        </div>
    )
}

export const TimeSpentSubjectWise = ({currentTest, currentAttempt}) => {
    const formTotalChartData = (currentTest, currentAttempt) => {
        let data = _.map(currentTest.sections, s => {
            let timeSpent = _.sumBy(_.filter(currentAttempt.finalResponse, sec => sec.sectionId == s._id), 'totalTimeSpent')
            return (
                {
                    name: s?.subjectRefId?.name?.en+s._id,
                    'Time Spent': _.round(secondsToMinuteSeconds(timeSpent), 1)
                })
            }
        )
        return data
    }

    let data = formTotalChartData(currentTest, currentAttempt)

    return(
        <div style={{height: '450px'}}>
            <ResponsiveBar {...commonProps} keys={['Time Spent']} indexBy='name' data={data} colors={() => '#addd8e'}
                valueScale={{ type: 'linear' }}
                axisLeft={{
                    tickSize: 10,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Questions',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
            />
        </div>
    )
}

export const TimeUsageAnalysis = ({currentTest, currentAttempt, section}) => {
    const formSectionChartData = (currentTest, currentAttempt, section) => {
        let stats = _.filter(currentAttempt.finalResponse, s => s.sectionId == section._id)
        let correctTime = _.round(secondsToMinuteSeconds(_.sumBy(_.filter(stats, s => s?.remarks === 'correct'), 'totalTimeSpent')), 1)
        let incorrectTime = _.round(secondsToMinuteSeconds(_.sumBy(_.filter(stats, s => s?.remarks === 'incorrect'), 'totalTimeSpent')), 1) 
        let notAttemptedTime = _.round(secondsToMinuteSeconds(_.sumBy(_.filter(stats, s => s?.remarks === 'not-marked'), 'totalTimeSpent')), 1) 
        let data = [
            {name: "Correct", 'Time Spent On Correct Questions': correctTime},
            {name: "Incorrect", 'Time Spent On Incorrect Questions': incorrectTime},
            {name: "NotAttempted", 'Time Spent On NotAttempted Questions': notAttemptedTime}
        ]

        return data
    }

    const formTotalChartData = (currentTest, currentAttempt) => {
        let data = _.map(currentTest.sections, s => {
        	let stats = _.filter(currentAttempt.finalResponse, sec => sec.sectionId == s._id)
        	let correctTime = _.round(secondsToMinuteSeconds(_.sumBy(_.filter(stats, sec => sec?.remarks === 'correct'), 'totalTimeSpent')), 1)
        	let incorrectTime = _.round(secondsToMinuteSeconds(_.sumBy(_.filter(stats, sec => sec?.remarks === 'incorrect'), 'totalTimeSpent')), 1) 
        	let notAttemptedTime = _.round(secondsToMinuteSeconds(_.sumBy(_.filter(stats, sec => sec?.remarks != 'correct' && sec?.remarks != 'incorrect'), 'totalTimeSpent')), 1)  
            return (
                {
                    name: s?.subjectRefId?.name?.en+s._id,
                    'Time Spent On Correct Questions': correctTime,
                    'Time Spent On Incorrect Questions': incorrectTime,
                    'Time Spent On NotAttempted Questions': notAttemptedTime
                })
            }
        )

        return data
    }

    let data = section ? formSectionChartData(currentTest, currentAttempt, section) : formTotalChartData(currentTest, currentAttempt)
    return(
        <div style={{height: '450px'}}>
            <ResponsiveBar {...commonProps} keys={['Time Spent On Correct Questions', 'Time Spent On Incorrect Questions', 'Time Spent On NotAttempted Questions']} indexBy='name' data={data} colors={({ id }) => AttemptColors[id]}
                valueScale={{ type: 'linear' }}
                axisLeft={{
                    tickSize: 10,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Questions',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-left',
                        direction: 'column',
                        justify: false,
                        itemsSpacing: 0,
                        itemWidth: 82,
                        itemHeight: 14,
                        translateY: 80,
                        translateX: -20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 15,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    ) 
}

