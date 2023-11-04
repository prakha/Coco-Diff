import React, { useReducer, useState, useEffect } from "react";
import {
  Box, Button, Flex, FormControl, FormLabel, Input, Image, Spacer, Grid
} from "@chakra-ui/react";
import { useDispatch, useSelector } from 'react-redux';
import { FormReducer } from "../../utils/FormReducer";
import { useHistory } from "react-router-dom";
import { EditIcon, AddIcon, CheckCircleIcon } from '@chakra-ui/icons'
import { useAppContext } from "../../App/Context";
import { UserProfileModal } from './UserProfileModal'
import { UserInterestModal } from './UserInterestModal'
import _ from 'lodash';

export const ProfileComponent = (props) => {
    const {user} = useSelector((state) => ({
        user: state.user.user,
    }))

    // console.log('Profile Component Rendered : ', user)

    const [userProfileModal, changeUserProfileModal] = useState({modal: false});
    const [userInterestModal, changeUserInterestModal] = useState({modal: false});
    
    const {logout} = useAppContext()

    return  user && (
        <div>
            <Button onClick={logout}>LOGOUT</Button>
            <Flex p={10} justifyContent='center' w='100%' style={{paddingBottom:'15px'}}>
                <Box w='80%' p={6} boxShadow='rgba(0, 0, 0, 0.1) 0px 4px 12px' style={{padding: '0px', borderRadius: '7px'}}>
                    <div style={{padding:'10px'}}>
                        <Flex>
                            <Box p="2" >
                                <Image
                                    borderRadius="full"
                                    border = '2px solid gray'
                                    boxSize="170px"
                                    src="https://joeschmoe.io/api/v1/random"
                                    alt="Segun Adebayo"
                                />
                            </Box>
                            {/* <Spacer /> */}
                            <Box p='2' flex="1" >
                                <Flex justifyContent='center' direction='column' align='center' height='100%'>
                                    <div style={{fontSize: '50px'}}><b>{user.name}</b></div>
                                    <div>{user.email}</div>
                                    <div>{user.contact}</div>
                                </Flex>
                            </Box>
                        </Flex>
                    </div>
                </Box>
                {userProfileModal.modal ? 
                    <UserProfileModal userProfileModal={userProfileModal.modal} closeModal={() => changeUserProfileModal({modal: false})}/>
                : null}
                {userInterestModal.modal ? 
                    <UserInterestModal userInterestModal={userInterestModal.modal} closeModal={() => changeUserInterestModal({modal: false})}/>
                : null}
            </Flex>
            <Flex p={10} justifyContent='center' w='100%' style={{paddingBottom:'15px'}}>
                <Box w='80%' p={6} boxShadow='rgba(0, 0, 0, 0.1) 0px 4px 12px' style={{padding: '0px', borderRadius: '7px'}}>
                    <div style={{padding:'10px',display:'flex', justifyContent:'center', alignItems : 'center'}} >
                        <Button leftIcon={<EditIcon />}  onClick={() => changeUserProfileModal({modal: true})} m={5} variant="solid">
                            Edit Profile
                        </Button>
                        {/* <Spacer/> */}
                        <Button leftIcon={<EditIcon />}  onClick={() => changeUserInterestModal({modal: true})} m={5} variant="solid">
                            Add Interest
                        </Button>
                    </div>
                </Box>
            </Flex>
        
            {/* <Flex p={10} justifyContent='center' w='100%' style={{paddingTop: '0px'}}>
                <Box w='80%' boxShadow='rgba(0, 0, 0, 0.1) 0px 4px 12px' style={{padding: '0px', borderRadius: '7px'}}>
                    <div style={{minHeight: '250px', borderRadius: '7px 7px 0px 0px'}}>
                        <Education user={user.staffs}/>
                        <hr/>
                        <Experience user={user.staffs}/>
                    </div>
                </Box>
            </Flex> */}
        </div>
    );
};

// const Experience = (props) => {
//     const dispatch = useDispatch();
//     const [experienceModal, changeExperienceModal] = useState({modal: false, data: ""});
//   return(
//     <div>
//         <Flex>
//             <Box p={4} style={{padding: '20px'}} >
//                 <div style={{fontSize: '20px'}}>Experience</div>
//             </Box>
//             <Spacer />
//             <Box p={4} style={{padding: '20px'}}>
//                 <AddIcon
//                     onClick={() => changeExperienceModal({modal: true, data: ''})}
//                     style={{ fontSize: "20px", cursor: "pointer" }}
//                 />
//             </Box>
//         </Flex>
//         <div>
//             {_.map(props.user.member?.experiences ? props.user.member.experiences : [], (s,i) => {
//                 return(
//                     <Flex key={i}>
//                         <Box p={4} style={{paddingLeft: '30px', paddingTop: '0px'}}>
//                             <div style={{ fontSize: "18px", margin: 0, padding: 0 }}>
//                                 <b>{s.company}</b>
//                             </div>
//                             <div style={{ fontSize: "16px" }}>
//                                 {s.title}
//                             </div>
//                             <div style={{ fontSize: "16px" }}>
//                                 {s.employmentType}
//                             </div>
//                             <div style={{ fontSize: "16px" }}>
//                                 {s.location}
//                             </div>
//                             <div style={{ fontSize: "16px" }}>
//                                 {s.current ? (s.startDate +' - Currently Working') : (s.startDate+' - '+s.endDate)}
//                             </div>
//                         </Box>
//                         <Spacer />
//                         <Box p={4} style={{padding: '20px', paddingTop: '0px'}}>
//                             <EditIcon
//                                 onClick={() => changeExperienceModal({modal: true, data: s})}
//                                 fontSize='heading'
//                                 cursor="pointer"
//                             />
//                         </Box>
//                     </Flex>
//                 )}
//             )}
//         </div>
//         {experienceModal.modal ? 
//             <UserExperienceModal preSelected={experienceModal.data} experienceModal={experienceModal.modal} closeModal={() => changeExperienceModal({modal: false, data: ''})}/>
//         : null}
//     </div>
//   )
// }
{/* 
const Education = (props) => {
    const dispatch = useDispatch();
    const [educationModal, changeEducationModal] = useState({modal: false, data: ""});
  return(
    <div>
        <Flex>
            <Box p={4} style={{padding: '20px'}} >
                <div style={{fontSize: '20px'}}>Education</div>
            </Box>
            <Spacer />
            <Box p={4} style={{padding: '20px'}}>
                <AddIcon
                    onClick={() => changeEducationModal({modal: true, data: ''})}
                    style={{ fontSize: "20px", cursor: "pointer" }}
                />
            </Box>
        </Flex>
        <div>
            {_.map(props.user.member?.educations ? props.user.member.educations : [], (s,i) => {
                return(
                    <Flex key={i}>
                        <Box p={4} style={{paddingLeft: '30px', paddingTop: '0px'}}>
                            <div style={{ fontSize: "18px", margin: 0, padding: 0 }}>
                                <b>{s.school}</b>
                            </div>
                            <div style={{ fontSize: "16px" }}>
                                {s.degree}
                            </div>
                            <div style={{ fontSize: "16px" }}>
                                {s.studyField}
                            </div>
                            <div style={{ fontSize: "16px" }}>
                                {s.startYear +' - '+ s.endYear}
                            </div>
                        </Box>
                        <Spacer />
                        <Box p={4} style={{padding: '20px', paddingTop: '0px'}}>
                            <EditIcon
                                onClick={() => changeEducationModal({modal: true, data: s})}
                                fontSize='heading'
                                cursor="pointer"
                            />
                        </Box>
                    </Flex>
                )}
            )}
        </div>
        {educationModal.modal ? 
            <UserEducationModal preSelected={educationModal.data} educationModal={educationModal.modal} closeModal={() => changeEducationModal({modal: false, data: ''})}/>
        : null}
    </div>
  )
} */}
