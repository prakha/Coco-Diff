import {
    Box,
    HStack,
    List,
    Text,
} from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { PdfCard } from '../Contents/PdfFiles'

  
  export const Documents = ({ course, defaultData }) => { 
    const [documentsList, setDocuments] = useState([]);
  
    useEffect(() => {
      if(course?.documents){
          setDocuments(course.documents)
      }
    }, [course]);
  
    return (
      <Box>
        <HStack mb={3} justify='space-between' p={2} boxShadow='0px 1px 2px #00000040' bg='white'>
            <Text fontSize='lg'>Documents</Text>
        </HStack>
        <List spacing={4} w='100%'>
            {documentsList?.length ?
                documentsList.map((doc) => (
                        <PdfCard demo course={course} doc={doc}/>
                    ))
                : (
                <Text color='gray.400'></Text>
            )}
        </List>
        <br/>
      </Box>
    );
};
  