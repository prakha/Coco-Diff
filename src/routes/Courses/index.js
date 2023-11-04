import { Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Route, Switch } from 'react-router'
import { SectionHeader } from '../../Components/SectionHeader'
import { ROUTES } from '../../Constants/Routes'
import { CourseContent } from './CourseContent'
import { CourseList } from './CourseList'

export const Courses = () => {
    return(
        <Box>
            <Switch>
                <Route exact path={ROUTES.COURSE_CONTENT} component={CourseContent} />
                <Route exact path={ROUTES.COURSE} component={CourseList} />
            </Switch>
        </Box>
    )
}