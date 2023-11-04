import React, { useReducer, useState, useEffect } from "react";
import {
  Box, color, HStack,Image, LinkBox, LinkOverlay, Text
} from "@chakra-ui/react";
import { useHistory } from "react-router";

// import { Slide } from 'react-slideshow-image';
// import 'react-slideshow-image/dist/styles.css'
import { GrPrevious, GrNext } from "react-icons/gr";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";


export const MainBanner = ({carousel, height}) => { 

    const navStyle = (dir) => {
        let width = "200px"
        return {
            cursor : "pointer",
            width : width,
            height : height || "500px",
            display : "flex",
            alignItems : "center",
            justifyContent : "center",
            padding : "0.5rem",
            bg : "#FFFFFF00",
            color : "#00000000",
            textAlign : "center",
            fontSize : "80px",
            transition : "all 250ms ease-out",
            marginRight : dir === "prev" ? `-${width}` : "initial",
            marginLeft : dir === "next" ? `-${width}` : "initial",
            transformOrigin : dir === "prev" ? "left" : "right",
            _hover : {
                bg : "#FFFFFF44",
                color : "#00000033"
            }
        }
    }
    const navArrows = {
        prevArrow: (
            <Box {...navStyle("prev")}  >
                <FiChevronLeft />
            </Box>
        ),
        nextArrow: (
            <Box {...navStyle("next")} >
                <FiChevronRight />
            </Box>
        ),
    }

    return (
        <Box p="1.5rem" bg='lightGrayBlue' zIndex="99">
            <Box boxShadow="0px 0px 1rem 5px #C6DCFF" borderRadius="lg" overflow="hidden" >
                {/* <Slide {...navArrows} easing="ease-out" arrows={true} duration={4000} transitionDuration={700} pauseOnHover={false}>
                    {
                        carousel.map((banner, i)=>{
                            return (
                                <Box boxShadow="lg" borderRadius="30px"  key={i} >
                                    <a href={banner.link} rel="noopener noreferrer" target="_blank" width="100vw">
                                        <Image src={banner.imageUrl} width="100%" height={height || "500px"} objectPosition='top' objectFit='cover' fallbackSrc="https://via.placeholder.com/1500x500.png?text=Competition+Comunity"/>
                                    </a>
                                </Box>
                            )
                        })
                    }
                </Slide> */}
            </Box>

        </Box>
    );
};
