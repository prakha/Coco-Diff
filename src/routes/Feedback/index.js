
import React, { useReducer, useState, useEffect } from "react";
import { Box, Button, HStack, IconButton, Image, Spacer, Text, Textarea, useToast } from "@chakra-ui/react";
import { SectionHeader } from "../../Components/SectionHeader";
import feedbackImg from './feedback.png'
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { createUserFeedbackAction } from "../../redux/reducers/feedback";
import { STATUS } from "../../App/Constants";
import { ButtonX } from "../../Components/ButtonX";
export const Feedback = (props) => { 

    const dispatch = useDispatch();
    const toast = useToast();
    const { feedback } = useSelector((s) => ({
        feedback: s.feedback
      }));

    const [starRating, setStartRating] = useState(-1)
    let [message, setMessage] = React.useState("")

    const handleStarRatingChange = (rating) => {
        setStartRating(rating)
    }

    let handleMessageChange = (e) => {
      setMessage(e.target.value)
    }

    const postFeedback = (e) => {
        e.preventDefault()
        // console.log("Posting Feedback")
        dispatch(createUserFeedbackAction({
            rating : starRating + 1,
            message : message
        }))
    }


    // console.log("Feedback State : ", feedback)

    useEffect(()=>{
        if(feedback.getFeedbackStatus === STATUS.SUCCESS){
            // console.log("Successfully Submitted")
            setMessage('')
            toast({
                title: "Feedback Submitted.",
                description: "Thank you for your Feedback.",
                status: "success",
                duration: 3000,
                // isClosable: true,
              })
        }else if(feedback.getFeedbackStatus === STATUS.FAILED){
            toast({
                title: "Somthing Went Wrong",
                description: "Couldn't Process your request at the moment.",
                status: "error",
                duration: 3000,
                // isClosable: true,
              })
        }
    }, [feedback, toast])
    return (
        <Box>
            <SectionHeader title="Feedback" breadcrumbs={[{title : "Home", link: "/"}, {title : "Feedback", link: "#"}]} />
            <Box boxShadow='md' borderRadius="xl" bg="white" p="1.5rem">
                <Box display="flex" >
                        <Box width="50%" display="flex" flexDirection="column">
                            <form onSubmit={postFeedback} width="50%">
                                <Box marginBottom="1rem">
                                    <Text fontSize="large" fontWeight="bold" marginBottom="10px">How satisfied are you with our online courses/test?</Text>
                                    <StarsRatingInput updateRating={handleStarRatingChange} rate={starRating} />
                                </Box>
                                <Box>
                                    <Text fontSize="sm" color="text.300" marginBottom="30px">Do you have a suggestion or found bug? Let us know in the field below</Text>
                                    <Textarea
                                        value={message}
                                        onChange={handleMessageChange}
                                        placeholder="Write your message here"
                                        fontSize="sm"
                                        size="lg"
                                        height={'200px'}
                                    />
                                </Box>
                                <Box display="flex" justifyContent="center" mt="2">
                                    <ButtonX type="submit" size="sm" width="150px" borderRadius="5px" 
                                        isLoading={feedback.getFeedbackStatus === STATUS.FETCHING}
                                    >Next</ButtonX>
                                </Box>
                            </form>
                        </Box>


                    <Box width="50%" display="flex" justifyContent="center" alignItems="center" >
                        <Box>
                            <Image width="300px" src={feedbackImg} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};


const StarsRatingInput = ({updateRating, rate}) => {
    const [hoverRate, setHoverRate] = useState(rate);
    const updateHoverRate = (rating) => {
        setHoverRate(rating);
    }

    const StyleProps = {
        color:"#FECD52",
        fontSize:"25px",
        cursor:"pointer",
        minWidth:"unset",
        variant:"ghost",
        _hover:{
            color : '#FECD52',
        } 
    }
    return(
        <Box>
            {/* {rate} */}
            <HStack>
                {
                    [...Array(5).keys()].map((v)=>{
                        return(
                            // color={hoverRate > v - 1 ? "#FECD52" : "#000000"}
                            <Box 
                                {...StyleProps}
                                key={v} 
                                onClick={()=>updateRating(v)} 
                                onMouseEnter={()=>updateHoverRate(v)} 
                                onMouseLeave={()=>updateHoverRate(rate)}
                            >
                                {hoverRate > v - 1 ? <AiFillStar /> :<AiOutlineStar />}
                            </Box>
                            
                        )
                    })
                }
                <Spacer/>
                {/* Reaction Meter Uncomment to see */}
                {/* <Text>{['Worse', 'Bad', 'Ok', 'Good', 'Best'][rate]} {['😠', '😐', '🙂', '😀', '😘'][rate]}</Text> */}
            </HStack>
        </Box>
    )
}