import { Box, VStack, Text } from '@chakra-ui/react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from "@chakra-ui/react"
import _ from 'lodash';
import React, { useEffect } from 'react'
import { useHistory, useLocation, useParams } from 'react-router'
import {Link} from "react-router-dom";

export const SectionHeader = ({title, breadcrumbs, style}) => {
    const location = useLocation()

    // const breadcrubmData = (typeof window !== 'undefined') ? JSON.parse(localStorage.getItem('breadcrumb')) : []
    // const routeName = (typeof window !== 'undefined') ? localStorage.getItem('routeName') : ''
    // useEffect(() => {
    //     console.log('first')
    //     localStorage.setItem("breadcrumb", JSON.stringify(breadcrumbs) )
    
    //     return () => localStorage.removeItem("breadcrumb")
    // }, [])

    // let trimUrl = url => {
    //     console.log('url', url)
    //     return url.slice(0, url.lastIndexOf('/'))
    // }

    // useEffect(() => {
    //     let pathname = trimUrl(location.pathname)
    //     if(breadcrumbs && pathname && breadcrubmData){
    //         console.log('Second')
    //         console.log('data', breadcrubmData, pathname)
    //         let objIndex = _.findIndex(breadcrubmData,d => trimUrl(d.link) == pathname)
    //         if(objIndex != -1){
    //             localStorage.setItem("breadcrumb", JSON.stringify(_.slice(breadcrubmData, 0, objIndex+1))) 
    //         }else if(objIndex+1 == breadcrubmData.length){
    //             null
    //         }else{
    //             routeName ? localStorage.setItem("breadcrumb", JSON.stringify(_.concat(breadcrubmData, {title:routeName, link:location.pathname}))) : null
    //         }

    //         localStorage.removeItem("routeName")
    //     }
    // }, [location.pathname, breadcrumbs])

    const history = useHistory();
    return(
        <Box marginBottom="2rem">
                {title ? <Text fontSize='heading' style={{ fontWeight:'bold', marginBottom:'5px'}}>{title}</Text> : null}
                {
                    breadcrumbs ?
                        <Breadcrumb fontSize="sm" color='rgba(0,0,0,0.5)'>
                            {breadcrumbs.map((b,i)=>{
                                let link = () => b.link ? b.link == 'goBack' ? history.goBack() : history.push(b.link) : ''
                                // console.log("SectionHeader breadcrumbs: ", b)
                                return <BreadcrumbItem key={i} >
                                        <BreadcrumbLink onClick={()=> link()} >{b.title}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                {/* return <BreadcrumbItem key={i} ><BreadcrumbLink as={Link} to={b.link || '#'} >{b.title}</BreadcrumbLink></BreadcrumbItem> */}
                            })}    
                        </Breadcrumb> : 
                        null
                }            
        </Box>
    )
}
