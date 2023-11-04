import { Accordion, AccordionItem, AccordionPanel, AccordionButton } from '@chakra-ui/accordion'
import { ButtonGroup, IconButton, Button } from '@chakra-ui/button'
import { VStack, HStack, Box, Text, Flex, Spacer, Stack } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Route, Switch } from "react-router-dom";
import { ROUTES } from '../../Constants/Routes'
import { STATUS } from '../../App/Constants'
import { SectionHeader } from '../../Components/SectionHeader'
import {QuestionCommunityMain} from './QuestionCommunityMain'
import {SingleQuestionComponent} from './SingleQuestionComponent'

export const QuestionsCommunity = (props) => {
    return (
    	<>
    		{/* <SectionHeader title="Question Community"/> */}
         	<Switch>
            	<Route exact path={ROUTES.QUESTIONS_COMMUNITY} component={QuestionCommunityMain}/>
            	<Route exact path={ROUTES.SINGLE_QUESTION_COMMUNITY} component={SingleQuestionComponent}/>	
        	</Switch>
        </>
    );
};


