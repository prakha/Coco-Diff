import React, {  } from 'react'
import { Route, Switch } from "react-router-dom";
import { ROUTES } from '../../Constants/Routes'
import { SectionHeader } from '../../Components/SectionHeader'
import {DiscussionCommunityMain} from './DiscussionCommunityMain'
import {SingleForumComponent} from './SingleForumComponent'

export const DiscussionCommunity = (props) => {
    return (
    	<>
         	<Switch>
				<Route exact path={ROUTES.DISCUSSION_COMMUNITY} component={DiscussionCommunityMain}/>
            	<Route exact path={ROUTES.SINGLE_COMMUNITY_FORUM} component={SingleForumComponent}/>	
        	</Switch>
        </>
    );
};


