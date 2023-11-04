import React, {  } from 'react'
import { Route, Switch } from "react-router-dom";
import { ROUTES } from '../../Constants/Routes'
import StudentDoubtsHome from './StudentDoubtsHome'

export default function Doubts(props){
    return (
				<Route exact path={ROUTES.DOUBTS} component={StudentDoubtsHome}/>
    );
};


