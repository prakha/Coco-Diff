import { Box, Text } from '@chakra-ui/react'
// import { ResponsiveLine } from '@nivo/line';
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SectionHeader } from '../../Components/SectionHeader'
import { ROUTES } from '../../Constants/Routes';
import { packageReportAction } from '../../redux/reducers/packages';
import { bilingualText, getAllPackages } from '../../utils/Helper';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Chart from 'chart.js/auto';
import { useQueryParams } from '../../utils/useQueryParams';

export const PackagePerformance = () => {
    const dispatch = useDispatch()
    const params  = useParams()
    let query = useQueryParams();
    let isPerformance = query.get('performance')

    const {packageReport, student} = useSelector(state => ({
        packageReport:state.package.packageReport,
        student:state.user.student
    }))

    useEffect(() => {
        if(params.packageId)
            dispatch(packageReportAction({packageId:params.packageId}))
    }, [params.packageId, dispatch])

    const packages = getAllPackages(student)
    console.log('packages', packages)
    const currentPackage = packages ? _.find(packages,p => p.package?._id === params.packageId) : null
    
    let breadcrumbs = [
        { title: "Home", link: "/" },
        { title: isPerformance ? "Performance Report" : "My Tests", link: isPerformance ? ROUTES.PERFORMANCE_REPORT_PACKAGES : ROUTES.TEST_PACKAGES },
        { title: bilingualText(currentPackage.package.name), link: "#" },
    ];

    
    const reports = useMemo(() => {
        if(packageReport){
            let assignments =  packageReport.assignmentResults?.[0]?.data?.length && _.filter(packageReport.assignmentResults[0].data,d => d.assignment.resultPublished).length ? 
                _.filter(packageReport.assignmentResults[0].data,d => d.assignment.resultPublished).map(ass => 
                    ({
                        name:ass.assignment.title, 
                        createdAt:ass.attempt?.createdAt, 
                        myScore:ass.attempt?.studentResult?.score || 0, 
                        testResult:ass.assignment.result,
                        max:ass.data.maximumMarks || 0,
                        // percentage:(ass.attempt?.studentResult?.score || 0/ass.data.maximumMarks || 0)*100
                    })
                )
                :
                []

            let tests =  packageReport.testResults?.[0]?.data?.length && _.filter(packageReport.testResults[0].data,d => d.test.resultPublished)?.length ? 
                _.filter(packageReport.testResults[0].data,d => d.test.resultPublished).map(test => 
                    ({
                        name:bilingualText(test.test.name), 
                        createdAt:test.attempt?.createdAt, 
                        myScore:test.attempt?.studentResult?.totalScore || 0, 
                        testResult:test.test.testResult,
                        max:test.test.maxMarks || 0,
                        // percentage:(test.attempt?.studentResult?.totalScore || 0/test.test.maxMarks || 0)*100

                    })
                )
                :
                []

            let combinedData =_.concat(tests, assignments)

            // return [
            //     {
            //         id:'Me', 
            //         color:'hsl(84, 70%, 50%)', 
            //         data:combinedData.map(d =>({x:d.name, y:d.studentResult?.score || d.studentResult?.totalScore || 0}))
            //     },
            //     {
            //         id:'Topper', 
            //         color:'hsl(167, 70%, 50%)', 
            //         data:combinedData.map(d =>({x:d.name, y:d.testResult?.highestScore || 0}))
            //     },
            // ]

            // return combinedData.map(d => 
            //     ({
            //         name:d.name, 
            //         me:d.studentResult?.score || d.studentResult?.totalScore || 0, 
            //         topper:d.testResult?.highestScore || 0
            //     })
            // )

            return {
                labels:combinedData.map(d => d.name),
                datasets:[
                    {
                        data:combinedData.map(d => _.round((d.myScore/d.max)*100) || 0),
                        label:'Me',
                        borderColor:'#E74C3C',
                    },
                    {
                        data:combinedData.map(d => d.max && _.round((d.testResult.highestScore/d.max)*100) || 0),
                        label:'Topper',
                        borderColor:'#2ECC71',
                    }
                ]
            }

        }
    }, [packageReport])

    return(
        <Box>
            <SectionHeader title={bilingualText(currentPackage.package.name)} breadcrumbs={breadcrumbs} />
            
            <Box boxShadow="sm" p="6" borderRadius="20px" background="white">
                <Text fontWeight="bold" fontSize='heading'>
                    Performance Report
                </Text>
                <br/><br/>
                <Box>
                    <MyGraph data={reports}/>
                </Box>
                <br/>
            </Box>
        </Box>
    )
}

const MyGraph = ({ data }) => {

    useEffect(() => {
        let myChart
        if(data){
            myChart = new Chart(document.getElementById("line-chart"), {
                type: 'line',
                responsive:true,
                data,
                options: {
                    responsive: true,
                    interaction: {
                      mode: 'index',
                      intersect: false,
                    },
                    stacked: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'My performance compared to topper'
                      }
                    },
                    scales: {
                        x: {
                          display: true,
                          title: {
                            display: true,
                            text: 'Test / Assignment'
                          }
                        },
                        y: {
                          display: true,
                          title: {
                            display: true,
                            text: 'Percentage'
                          }
                        }
                    }
                }
            })
        }

        return () => myChart?.destroy()
    }, [data])

    return(
        <Box display={'block'} minHeight={300} pos='relative'>
            <canvas id="line-chart"></canvas>
            <br/><br/>
        </Box>
        // <ResponsiveContainer width="100%" height="100%">
        //     <LineChart data={data}>
        //         <CartesianGrid strokeDasharray="3 3" />
        //         <XAxis dataKey="name" angle={30} interval={0} fontSize={12} />
        //         <YAxis />
        //         <Tooltip />
        //         <Legend />
        //         <Line dataKey="me" stroke="#E74C3C" strokeWidth={2} />
        //         <Line dataKey="topper" stroke="#2ECC71" strokeWidth={2} />
        //     </LineChart>
        // </ResponsiveContainer>
    // <ResponsiveLine
    //     data={data}
    //     margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    //     xScale={{ type: 'point' }}
    //     yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
    //     yFormat=" >-.2f"
    //     axisTop={null}
    //     axisRight={null}
    //     colors={['#2ECC71', '#E74C3C']}
    //     axisBottom={{
    //         orient: 'bottom',
    //         tickSize: 5,
    //         tickPadding: 5,
    //         tickRotation: 0,
    //         legend: 'Tests / Assignments',
    //         legendOffset: 36,
    //         legendPosition: 'middle'
    //     }}
    //     axisLeft={{
    //         orient: 'left',
    //         tickSize: 5,
    //         tickPadding: 5,
    //         tickRotation: 0,
    //         legend: 'Marks',
    //         legendOffset: -40,
    //         legendPosition: 'middle'
    //     }}
    //     pointSize={10}
    //     pointColor={{ theme: 'background' }}
    //     pointBorderWidth={2}
    //     pointBorderColor={{ from: 'serieColor' }}
    //     pointLabelYOffset={-12}
    //     useMesh={true}
    //     legends={[
    //         {
    //             anchor: 'bottom-right',
    //             direction: 'column',
    //             justify: false,
    //             translateX: 100,
    //             translateY: 0,
    //             itemsSpacing: 0,
    //             itemDirection: 'left-to-right',
    //             itemWidth: 80,
    //             itemHeight: 20,
    //             itemOpacity: 0.75,
    //             symbolSize: 12,
    //             symbolShape: 'circle',
    //             symbolBorderColor: 'rgba(0, 0, 0, .5)',
    //             effects: [
    //                 {
    //                     on: 'hover',
    //                     style: {
    //                         itemBackground: 'rgba(0, 0, 0, .03)',
    //                         itemOpacity: 1
    //                     }
    //                 }
    //             ]
    //         }
    //     ]}
    // />
)}