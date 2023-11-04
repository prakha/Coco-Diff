import { ReactNode } from "react";
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  VisuallyHidden,
  chakra,
  useColorModeValue,
  Flex,
  Center,
  Link
} from "@chakra-ui/react";
import { Link as NavLink } from 'react-router-dom'
import { FaTwitter, FaYoutube, FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { useAppContext } from "../App/Context";
import { cocoWebisteUrl } from "../BaseUrl";

const ListHeader = ({ children }) => {
  return (
    <Text color='white' fontWeight='bold' fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      // bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={10}
      h={10}
      cursor={"pointer"}
      as={"a"}
      color="white"
      bg="gray.900"
      p={2}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.6s ease"}
      _hover={{
        bg: "brand.redAccent"//useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export const FooterComponent = ({ global }) => {
  const { navBarLinks } = useAppContext()
  const footer = navBarLinks?.footer;
  const social = navBarLinks?.social;

  const getRelativeUrl = (url) => {
    if (!url) return '';
    let linkUrl = url;
    let source = 'other'
    const curUrl = window && window.location.origin;
    // console.log("[urls]", curUrl, linkUrl, url)
    if (url[0] === '/') {
      linkUrl = cocoWebisteUrl + url;
      source = "home"
    }
    else if (_.startsWith(url, "https://student.competitioncommunity.com/")) {
      linkUrl = url.replace("https://student.competitioncommunity.com/", '/')
      source = "self"
    }

    // console.log("[urls] final", linkUrl)
    return { href: linkUrl, source };
  }

  //global?.social;
  return (
    <Center
      bg='#0b0d17'
      color='gray.400'
    >
      <Box>
        <Box maxW="7xl" py={10}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
            {
              footer?.firstcolumn?.length > 0 &&
              <Stack align={"flex-start"}>
                <ListHeader>{footer.firsttitle}</ListHeader>
                {
                  footer?.firstcolumn.map((item, ind) => {
                    const final = getRelativeUrl(item.href)
                    // console.log("[urls]",{final, label:item.label})
                    if (final.source === "self") {
                      return <NavLink key={ind} to={final.href}><Box>{item.label}</Box></NavLink>
                    }
                    return (
                      <Link key={ind} href={final.href}><Box>{item.label}</Box></Link>
                    )
                  })
                }
              </Stack>
            }
            {
              footer?.secondcolumn?.length > 0 &&
              <Stack align={"flex-start"}>
                <ListHeader>{footer.secondtitle}</ListHeader>
                {
                  footer?.secondcolumn.map((item, ind) => {
                    const final = getRelativeUrl(item.href)
                    if (final.source === "self") {
                      return <NavLink key={ind} to={final.href}><Box>{item.label}</Box></NavLink>
                    }
                    return (
                      <Link key={ind} href={final.href}><Box>{item.label}</Box></Link>
                    )
                  })
                }
              </Stack>
            }

            {
              footer?.thirdcolumn?.length > 0 &&
              <Stack align={"flex-start"}>
                <ListHeader>{footer.thirdtitle}</ListHeader>
                {
                  footer?.thirdcolumn.map((item, ind) => {
                    const final = getRelativeUrl(item.href)
                    if (final.source === "self") {
                      return <NavLink key={ind} to={final.href}><Box>{item.label}</Box></NavLink>
                    }
                    return (
                      <Link key={ind} href={final.href}><Box>{item.label}</Box></Link>
                    )
                  })
                }
              </Stack>
            }
            {footer?.quick_links && (
              <>
                <Stack align={"flex-start"}>
                  <ListHeader>{footer.fourthtitle}</ListHeader>
                  {footer.quick_links.map(
                    (item, ind) => {
                      const final = getRelativeUrl(item.href)
                      if (final.source === "self") {
                        return <NavLink key={ind} to={final.href}><Box>{item.label}</Box></NavLink>
                      }
                      return (
                        <Link key={ind} href={final.href}><Box>{item.label}</Box></Link>
                      )
                    })
                  }  
                  )}
                </Stack>
              </>
            )}
            {/* <AppStoreBadge />
                        <PlayStoreBadge /> */}
          </SimpleGrid>
        </Box>

        <Box maxW='7xl' py={6}>
          <Box
            borderTopWidth={1}
            borderStyle={"solid"}
            borderColor={useColorModeValue("gray.200", "gray.700")}>
            <Flex flexWrap='wrap' color='gray.300'>
              {
                footer?.addresses?.map((a, i) =>
                  <Box key={i} w={{ base: '100%', md: '33%' }} pr={6} py={4}>
                    {a.line1 && <Box>{a.line1}</Box>}
                    {a.line2 && <Box>{a.line2}</Box>}
                    {a.line3 && <Box>{a.line3}</Box>}
                  </Box>
                )
              }
            </Flex>
          </Box>
        </Box>
        <Box maxW='7xl'>
          <Flex
            borderTopWidth={1}
            borderStyle={"solid"}
            flexWrap='wrap'
            borderColor={useColorModeValue("gray.200", "gray.700")}
            as={Stack}
            py={4}
            direction={{ base: "column", md: "row" }}
            spacing={4}
            justify="space-between"
            align="center"
          >
            <Box color='gray.300'>
              <Text m={0}>{footer?.footer_text}</Text>
              <Text m={0}>{footer?.footer_text2}</Text>
            </Box>
            <Stack direction={"row"}>
              {
                social?.facebook &&
                <SocialButton label={"facebook"} href={social.facebook}>
                  <FaFacebook />
                </SocialButton>
              }
              {
                social?.twitter &&
                <SocialButton label={"Twitter"} href={social.twitter}>
                  <FaTwitter />
                </SocialButton>
              }
              {
                social?.youtube &&
                <SocialButton label={"YouTube"} href={social.youtube}>
                  <FaYoutube />
                </SocialButton>
              }
              {
                social?.linkedin &&
                <SocialButton label={"linkedin"} href={social.linkedin}>
                  <FaLinkedin />
                </SocialButton>
              }
              {
                social?.whatsapp &&
                <SocialButton label={"Whatsapp"} href={social.whatsapp}>
                  <FaWhatsapp />
                </SocialButton>
              }
            </Stack>
          </Flex>
        </Box>
      </Box>
    </Center>
  );
};
