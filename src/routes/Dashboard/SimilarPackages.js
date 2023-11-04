import { Box, HStack, Text, IconButton } from "@chakra-ui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
// import { Card } from '../../Components/ItemCard'

export const RelativePackages = ({ packages }) => {
  return null;
  // const [currentPackages, changePackages] = useState([])
  // let pkgData = [...packages, ...packages, ...packages, ...packages]
  // const [loadingMore, changeLoading] = useState(false)
  // const [currentIndex, changeIndex] = useState(0)
  // const [allPackages, changeAllPackages] = useState(packages)
  // useEffect(() => {
  //     let data = _.chunk(allPackages, 3)[currentIndex]
  //     changePackages(data)
  // }, [allPackages, currentIndex])
  // useEffect(() => {
  //     changeLoading(true)
  //     setTimeout(() => changeLoading(false), 500)
  // }, [currentIndex])
  // const handleForward = () => {
  //     changeIndex(currentIndex+1)
  // }
  // const handleBackward = () => {
  //     changeIndex(currentIndex-1)
  // }
  // return( packages.length ?
  //     <Box borderRadius='15px' p={3} background='white' boxShadow='0px 3px 6px #0000000A'>
  //         <HStack justifyContent='space-between'>
  //             <Text fontSize={18}>Recommended Packages</Text>
  //         </HStack>
  //         <br/>
  //         <HStack spacing={0} align='stretch' justifyContent={'space-between'}>
  //             <HStack spacing={0} align='center'>
  //                 <IconButton isLoading={loadingMore} boxShadow='md' variant='outline' size='sm' onClick={handleBackward} icon={<AiOutlineLeft fontSize={18} />}
  //                     visibility={packages.length > 3 && currentIndex !== 0 ? 'block' : 'hidden'}
  //                 />
  //             </HStack>
  //             <HStack flexGrow={1} align='stretch'>
  //                 {currentPackages.map(pkg =>
  //                     <Card key={pkg._id} hideActions item={pkg} width={["90vw", "50%","50%","30%"]}/>
  //                 )}
  //             </HStack>
  //             <HStack align='center'>
  //                 <IconButton isLoading={loadingMore} boxShadow='md' variant='outline' size='sm' onClick={handleForward} icon={<AiOutlineRight fontSize={18} />}
  //                     visibility={packages.length > 3 && currentIndex + 1 !== _.chunk(allPackages, 3).length ? 'block' : 'hidden'}
  //                 />
  //             </HStack>
  //         </HStack>
  //     </Box>
  //     :
  //     null
  // )
};
