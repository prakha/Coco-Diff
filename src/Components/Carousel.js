import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Text, HStack,
  Box,
  Flex,
  useColorModeValue,
  Image,
  AspectRatio,
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export const Carousel = ({ carousel, height }) => {
  const slides = useMemo(() => {
    return carousel || [];
  }, [carousel]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const history = useHistory()

  const slidesCount = slides?.length;

  const prevSlide = useCallback(() => {
    setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
  }, [slidesCount]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
  }, [slidesCount]);

  const carouselStyle = {
    transition: "all .5s",
    ml: `-${currentSlide * 100}%`,
  };

  const SLIDES_INTERVAL_TIME = 5000;
  const ANIMATION_DIRECTION = "right";

  useEffect(() => {
    const automatedSlide = setInterval(() => {
      ANIMATION_DIRECTION.toLowerCase() === "left" ? prevSlide() : nextSlide();
    }, SLIDES_INTERVAL_TIME);
    return () => clearInterval(automatedSlide);
  }, [nextSlide, prevSlide]);

  return (
    <AspectRatio ratio={4} w="full" pos='relative'>
      <Flex style={{alignItems:'stretch'}}>
        <Flex background='linear-gradient(rgba(33, 47, 60,.2), rgba(33, 47, 60,.2)), url("/images/Black_Color.jpg")' 
          pos='absolute' top={0} bottom={0} left={0} zIndex={2} 
          _hover={{background:'linear-gradient(rgba(33, 47, 60,.4), rgba(33, 47, 60,.4)), url("/images/Black_Color.jpg")'}} 
          transition='all .4s' cursor='pointer' align='center' onClick={prevSlide}
        >
          <AiOutlineLeft color='white' fontSize={25} />
        </Flex>
        <Flex
          bg={useColorModeValue("gray.200", "gray.600")}
        >
          {slides.filter((d) => d.active).length ? (
            <Flex w="full" overflow="hidden">
                <Flex pos="relative" w="full" {...carouselStyle}>
                  {slides
                    .filter((d) => d.active)
                    .map((slide, sid) => {
                      return (
                      <Box
                        key={`slide-${sid}`}
                        flex="none"
                        boxSize="full"
                        shadow="md"
                        as={Link}
                        href={slide.link}
                        onClick={() => {
                          if(slide.link){
                            window.open(slide.link)
                          }
                        }}
                        //  to={{pathname: slide.link, target:"_blank"}}
                      >
                        <Text
                          color="white"
                          fontSize="xs"
                          p="8px 12px"
                          pos="absolute"
                          top="0"
                          whiteSpace="nowrap"
                        >
                          {sid + 1} / {slidesCount}
                        </Text>
                        <Image
                          src={slide.imageUrl}
                          boxSize="full"
                          backgroundSize="initial"
                        />
                        
                      </Box>
                    )
                    })}
                </Flex>
            </Flex>
          ) : null}
        </Flex>
        <Flex background='linear-gradient(rgba(33, 47, 60,.1), rgba(33, 47, 60,.1)), url("/images/Black_Color.jpg")' 
          pos='absolute' top={0} bottom={0} right={0} zIndex={2} 
          _hover={{background:'linear-gradient(rgba(33, 47, 60,.4), rgba(33, 47, 60,.4)), url("/images/Black_Color.jpg")'}} 
          transition='all .4s' cursor='pointer' align='center' onClick={nextSlide}
        >
          <AiOutlineRight fontSize={25} color='white' />
        </Flex>
      </Flex>
    </AspectRatio>
  );
};
