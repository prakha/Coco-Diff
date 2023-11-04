import React, {
  useReducer,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { STATUS } from "../../App/Constants";
import {
  Box,
  Image,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Spacer,
  Text,
  InputGroup,
  Input,
  InputRightAddon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  IconButton,
  useColorMode,
  useDisclosure,
  Badge,
  useToast,
  HStack,
  Select,
  useMediaQuery,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
  InputLeftElement,
  Center,
  Stack,
  Popover,
  PopoverTrigger,
  Link,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  useColorModeValue,
} from "@chakra-ui/react";
import { AiOutlineSolution } from "react-icons/ai";
import { useAppContext, useIsAuthenticated } from "../../App/Context";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  ChevronDownIcon,
  Search2Icon,
  PhoneIcon,
  HamburgerIcon,
  SearchIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { ImPriceTags } from "react-icons/im";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useWindowSize } from "../../utils/useWindowSize";
import { LoginRoute } from "../../routes/Login";
import $ from "jquery";
import CartContext from "../../Cart/useCart";
import {
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineBell,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { CUSTOM_ROUTES, ROUTES } from "../../Constants/Routes";
import { BasicDetailsComponent } from "../../routes/BasicDetailsComponent";
import { Dropdown, ProfileDropdown } from "../ProfileDropdown";
import { useLoginModal } from "../../App/useLoginModal";
import { CONTACT_IT_HELP, CONTACT_OTHER } from "../../Constants/Config";
import { BiMenu } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import { SideBarContent } from "../Sidebar";
import { isSSR } from "../../utils/ssrHelper";
import { mobileView, webView } from "../../utils/Helper";
import { cocoWebisteUrl, strApiBaseUrl } from "../../BaseUrl";

export const CommonHeader = ({ pageContext, config }) => {
  const [navItems, setNavItems] = useState([]);
  const context = React.useContext(CartContext);
  const isAuthenticated = useIsAuthenticated();
  const [width, height] = useWindowSize();
  const { logout, navBarLinks } = useAppContext();
  const history = useHistory();
  const { isOpen, onClose } = useDisclosure();

  const { user } = useSelector((s) => ({
    user: s.user,
  }));

  const courses = config?.courseCategories;
  const tests = config?.testSeries;

  const {
    modalType,
    setModalType,
    closeLoginModal,
    openLoginModal,
    toggleLoginModal,
  } = useLoginModal();
  // const [modalType , setModalType] = useState(SIGNIN_MODAL_TYPE.SIGNIN)

  const _couponLogin = useCallback(() => {
    setModalType(SIGNIN_MODAL_TYPE.COUPON_LOGIN);
    openLoginModal();
  }, [openLoginModal, setModalType]);

  const _signInOut = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setModalType(SIGNIN_MODAL_TYPE.SIGNIN);
      toggleLoginModal();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (modalType !== SIGNIN_MODAL_TYPE.COUPON_LOGIN) {
        closeLoginModal();
      }
      // if(user.status === STATUS.SUCCESS){
      //     // setCurrentUser(user.user)
      // }
    }
  }, [modalType, isAuthenticated, closeLoginModal]);

  const getRelativeUrl = (url) => {
    if (!url) return "";
    let linkUrl = url;
    const curUrl = window && window.location.origin;
    if (url[0] === "/") linkUrl = cocoWebisteUrl + url;
    else if (_.startsWith(url, curUrl)) linkUrl = url.replace(curUrl, "/");
    return linkUrl;
  };

  useEffect(() => {
    if (!navBarLinks) return;
    const data = navBarLinks;
    // res.data.attributes;
    const exams = data?.exams && Array.isArray(data.exams) && data.exams;
    const tests =
      data?.testseries && Array.isArray(data?.testseries) && data?.testseries;
    const nav = [
      {
        label: "Exams",
        children: [],
        order: 2,
      },
      {
        label: "Test Series",
        children: [],
        order: 3,
      },
      {
        label: "Free Study",
        order: 4,
        href: getRelativeUrl("/free-study"),
      },
      {
        label: "More",
        children: data?.menu_extras?.map((item, index) => ({
          label: item.title,
          order: index,
          href: getRelativeUrl(item.valuehref),
        })),
      },
    ];

    if (exams?.length) {
      exams.map((c) => {
        nav[0].children.push({
          label: c.name?.en,
          _id: c._id,
          href: c.exams ? null : cocoWebisteUrl + "/exams/" + c._id,
          children: c.exams?.map((e) => {
            return {
              label: e.name?.en,
              _id: e._id,
              href: cocoWebisteUrl + "/exams/" + e._id,
            };
          }),
        });
      });
    }

    // if (exams?.length) {
    //   exams.map((e) => {
    //     nav[0].children.push({
    //       label: e.name?.en,
    //       description: null,
    //       _id: e._id,
    //       href: cocoWebisteUrl+"/exams/" + e._id,
    //     });
    //   });
    // }

    if (tests?.length) {
      tests.map((e) => {
        nav[1].children.push({
          label: e.name?.en,
          description: null,
          _id: e._id,
          href: cocoWebisteUrl + "/tests/" + e._id,
        });
      });
    }
    setNavItems(nav);
  }, [navBarLinks]);
  const contact = useMemo(() => {
    return navBarLinks.contact;
  }, [navBarLinks.contact]);
  const status = useSelector((s) => s.user.status);
  return (
    <Box>
      <Box {...mobileView}>
        <Box bg="white">
          <Box maxW="80em">
            <HStack justifyContent="space-between">
              <Box flexGrow="1">
                <HStack py={3} pl={8}>
                  <Link href={cocoWebisteUrl}>
                    <Image
                      w="100px"
                      src={"/logo_red.png"}
                      alt="COCO"
                      cursor="pointer"
                    />
                  </Link>
                </HStack>
              </Box>
              <HStack justifyContent="flex-end" mx={2}>
                {isAuthenticated ? (
                  <HStack>
                    <Box>
                      <Box
                        pos="relative"
                        cursor="pointer"
                        onClick={() => history.push("/notifications")}
                      >
                        <Box color="brand.redAccent">
                          <AiOutlineBell fontSize="20px" />
                        </Box>
                      </Box>
                    </Box>

                    <Box color="brand.redAccent">
                      <IconButton
                        onClick={_signInOut}
                        variant="ghost"
                        fontSize="20px"
                        icon={<AiOutlineLogout />}
                      />
                    </Box>
                  </HStack>
                ) : (
                  <Box color="brand.redAccent">
                    <IconButton
                      fontSize="20px"
                      onClick={_signInOut}
                      variant="ghost"
                      icon={<AiOutlineLogin />}
                    />
                  </Box>
                )}
              </HStack>
              <Box ml={2} mr={4}>
                <MobileDrawer courses={courses} tests={tests} />
              </Box>
            </HStack>
          </Box>
          {/* <SearchBarHeader contact={contact} width="100%" /> */}
        </Box>
      </Box>
      <Box {...webView} color="white">
        <Center>
          <Box maxW="6xl" w="100%" py={2}>
            <Box
              pos="relative"
              backgroundColor="white"
              backgroundRepeat="no-repeat"
              h={"3.51vw"}
            >
              <HStack alignItems="center" justifyContent="space-between" wrap>
                <HStack
                  flexGrow="1"
                  w={"25%"}
                  style={{ verticalAlign: "middle" }}
                  align="center"
                  py={2}
                  spacing={4}
                >
                  <Link href={cocoWebisteUrl}>
                    <Image
                      w="6.80vw"
                      src={"/logo_red.png"}
                      alt="COCO"
                      cursor="pointer"
                      onClick={() => history.push("/")}
                    />
                  </Link>
                  <Box w="100%" pos="relative">
                    <DesktopNav data={navItems} />
                  </Box>
                </HStack>
                <HStack w="fit" align="center">
                  <HStack wrap="wrap" spacing={6}>
                    {contact &&
                      contact.map(
                        (c) =>
                          c.active && (
                            <Flex
                              key={c.text}
                              align="center"
                              display={{ base: "none", md: "inline-flex" }}
                            >
                              <Image
                                src="/contact.png"
                                w="20px"
                                alt="contact"
                              />
                              <Text
                                ml={1}
                                fontSize="sm"
                                color="brand.redAccent"
                                fontWeight={"500"}
                                mr={2}
                              >
                                {c.text}
                              </Text>
                            </Flex>
                          )
                      )}
                    {user.user ? (
                      <Box
                        display="inline-block"
                        paddingY="5px"
                        borderRadius={5}
                        color="brand.redAccent"
                        border="1px solid"
                        borderColor="brand.redAccent"
                      >
                        <ProfileDropdown />
                      </Box>
                    ) : (
                      <Button
                        fontSize={"sm"}
                        // borderRightRadius={user ? 0 : null}
                        fontWeight={600}
                        color={"white"}
                        colorScheme="redAccent"
                        bg={"brand.redAccent"}
                        size="sm"
                        // href={LMS_URL}
                        // target="_blank"
                        onClick={_signInOut}
                        isLoading={status === STATUS.FETCHING}
                        // rel="noreferrer"
                        p={5}
                        _hover={{
                          bg: "redAccent.900",
                        }}
                      >
                        Sign In / Sign Up
                      </Button>
                    )}
                  </HStack>
                </HStack>
              </HStack>
            </Box>
          </Box>
        </Center>
        <Center py={2} bg="brand.redAccentLight">
          <Flex
            maxW="6xl"
            justify={"space-between"}
            alignItems="center"
            p="2px"
            w="100%"
          >
            {width < 900 ? (
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={
                    <HamburgerIcon
                      style={{
                        display: "inline-block",
                        fontSize: "1.75vw",
                        padding: "5px",
                      }}
                    />
                  }
                  size="xs"
                />
                <MenuList
                  style={{
                    backgroundColor: "#2c7de9",
                    border: "0px",
                    padding: "10px",
                  }}
                >
                  <MenuComponent
                    isAuthenticated={isAuthenticated}
                    hamburger={true}
                  />
                </MenuList>
              </Menu>
            ) : null}
            {width > 900 ? (
              <Box>
                <MenuComponent
                  isAuthenticated={isAuthenticated}
                  hamburger={false}
                  signInOut={_signInOut}
                />
              </Box>
            ) : null}
            {isAuthenticated && (
              <Button
                ml={8}
                size="sm"
                onClick={() => history.push("/doubts")}
                bg="brand.redAccent"
                _hover={{ bg: "brand.redAccent" }}
              >
                <AiOutlineSolution color="white" />
                <Text ml={1} style={{ color: "white" }} fontSize="sm">
                  Connect to Teacher
                </Text>
              </Button>
            )}
            <Center flexGrow={1} mx={3}>
              {/* <SearchBarHeader /> */}
            </Center>
            <Box display="flex" alignItems="center">
              <HStack
                style={{
                  color: "white",
                  fontSize: "",
                  borderRight: "1px solid #D6DBDF",
                  padding: "0px 10px",
                  cursor: "pointer",
                }}
                onClick={_couponLogin}
              >
                <Box color="brand.redAccent">
                  <ImPriceTags fontSize="1.05vw" />
                </Box>
                <Text color="brand.redAccent" fontSize="sm">
                  Coupon Login
                </Text>
              </HStack>
              {isAuthenticated ? (
                <HStack ml={2} spacing={3}>
                  <Box>
                    <Box
                      pos="relative"
                      // onClick={() => history.push("/dashboard/wishlist")}
                      cursor="pointer"
                    >
                      <Box color="brand.redAccent">
                        <AiOutlineHeart fontSize="1.52vw" />
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <Box
                      pos="relative"
                      onClick={() => history.push("/notifications")}
                      cursor="pointer"
                    >
                      <Box color="brand.redAccent">
                        <AiOutlineBell fontSize="1.52vw" />
                      </Box>
                    </Box>
                  </Box>
                </HStack>
              ) : (
                <span
                  style={{
                    display: "inline-block",
                    color: "#717678",
                    fontSize: "",
                    padding: "",
                    cursor: "pointer",
                  }}
                  onClick={_signInOut}
                >
                  <Button
                    variant="ghost"
                    color="brand.redAccent"
                    fontWeight="normal"
                    leftIcon={
                      <IoPersonCircleOutline style={{ fontSize: "22px" }} />
                    }
                    _focus={{ boxShadow: "none" }}
                    fontSize="sm"
                  >
                    {isAuthenticated ? "Sign Out" : "Sign In"}
                  </Button>
                </span>
              )}
            </Box>
          </Flex>
        </Center>
        <SignInFlow />
        <CompleteProfilePopUp />
        {isOpen ? (
          <Dropdown isOpen={isOpen} user={user} close={onClose} />
        ) : null}
      </Box>
    </Box>
  );
};

const DesktopNav = ({ data }) => {
  const linkColor = useColorModeValue("gray.900", "gray.200");
  const linkHoverColor = useColorModeValue("redAccent.500", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={2}>
      {data.map((navItem) => {
        const isChild = navItem.children && navItem.children.length;
        // console.log({navItem})
        return (
          <Box key={navItem.label}>
            {!isChild ? (
              <Box
                cursor="pointer"
                p={2}
                fontSize={"sm"}
                fontWeight={"700"}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {/* <Link
                to={navItem.href}
                passHref={true}
                href={navItem.href ?? "#"}
              > */}
                <Link href={navItem.href} focusable={true} passHref={true}>
                  <Box>
                    {navItem.label} {isChild ? <ChevronDownIcon /> : null}
                  </Box>
                </Link>
                {/* </Link> */}
              </Box>
            ) : (
              <Popover trigger={"hover"} placement={"bottom-start"}>
                <PopoverTrigger>
                  <Box
                    cursor="pointer"
                    p={2}
                    fontSize={"sm"}
                    fontWeight={"700"}
                    color={linkColor}
                    _hover={{
                      textDecoration: "none",
                      color: linkHoverColor,
                    }}
                  >
                    {/* <Link
                    to={navItem.href}
                    passHref={true}
                    href={navItem.href ?? "#"}
                  > */}
                    <Box>
                      {navItem.label} {isChild ? <ChevronDownIcon /> : null}
                    </Box>
                    {/* </Link> */}
                  </Box>
                </PopoverTrigger>

                {isChild ? (
                  <PopoverContent
                    border={0}
                    boxShadow={"xl"}
                    bg={popoverContentBgColor}
                    maxW="250px"
                  >
                    <PopoverArrow size="lg" bg="gray.700" />
                    <PopoverBody
                      p={0}
                      maxH="60vh"
                      borderTop="2px solid"
                      borderColor="gray.700"
                      overflow="hidden"
                      overflowY="auto"
                      borderRadius={5}
                    >
                      <Stack spacing={0}>
                        {navItem.children?.map((child) => (
                          <DesktopSubNav key={child.label} {...child} />
                        ))}
                      </Stack>
                    </PopoverBody>
                  </PopoverContent>
                ) : null}
              </Popover>
            )}
          </Box>
        );
      })}
    </Stack>
  );
};

const DesktopSubNav = ({
  label,
  href,
  subLabel,
  children,
  isnested = false,
}) => {
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const isChild = children && children.length;

  return (
    <Box
      role={"group"}
      sx={
        isnested
          ? {
              ".gp:hover .lnk": {
                color: "redAccent.400",
              },
            }
          : null
      }
      display={"block"}
      borderBottom="1px solid"
      borderColor="gray.200"
      bg="white"
      _hover={{ bg: useColorModeValue("redAccent.50", "gray.900") }}
    >
      {href ? (
        <Link href={href} focusable={true} passHref={true}>
          <Stack
            p={4}
            className="gp"
            direction={"row"}
            align={"center"}
            focusable={true}
          >
            <Box>
              <Text
                fontSize={"sm"}
                transition={"all .3s ease"}
                className="lnk"
                _groupHover={isnested ? {} : { color: "redAccent.400" }}
                fontWeight={"bold"}
                color="gray.700"
              >
                {label}
              </Text>
              <Text fontSize={"sm"}>{subLabel}</Text>
            </Box>
          </Stack>
        </Link>
      ) : (
        <Popover trigger={"hover"} placement={"right-start"}>
          <PopoverTrigger>
            <Stack
              p={4}
              w="100%"
              color="gray.800"
              direction={"row"}
              align={"center"}
              focusable={true}
            >
              <Box flex={1}>
                <Text
                  fontSize={"sm"}
                  transition={"all .3s ease"}
                  _groupHover={{ color: "redAccent.400" }}
                  fontWeight={"bold"}
                >
                  {label}
                </Text>
                <Text fontSize={"sm"}>{subLabel}</Text>
              </Box>
              <ChevronRightIcon
                className="ico"
                ml={-3}
                mt={1}
                fontSize="lg"
                // opacity="0"
                transition="all 0.3s"
              />
            </Stack>
          </PopoverTrigger>
          {isChild ? (
            <PopoverContent
              border={0}
              marginLeft={-5}
              boxShadow={"xl"}
              bg={popoverContentBgColor}
              maxW="250px"
            >
              <PopoverArrow size="lg" bg="gray.700" />
              <PopoverBody
                p={0}
                maxH="60vh"
                borderTop="1px solid"
                borderColor="gray.700"
                borderRadius={10}
                overflow="hidden"
                overflowY="auto"
              >
                <Stack spacing={0}>
                  {children?.map((child) => (
                    <DesktopSubNav
                      isnested={true}
                      key={child.label}
                      {...child}
                    />
                  ))}
                </Stack>
              </PopoverBody>
            </PopoverContent>
          ) : null}
        </Popover>
      )}
    </Box>
  );
};

function MobileDrawer({ courses, tests }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showCourses, setShowCourses] = useState(false);
  const [showTestSeries, setShowTestSeries] = useState(false);
  const history = useHistory();
  //console.log(tests);
  function handleCourses() {
    if (showCourses) setShowCourses(false);
    else setShowCourses(true);
  }
  function handleTestSeries() {
    if (showTestSeries) setShowTestSeries(false);
    else setShowTestSeries(true);
  }
  const isAuthenticated = useIsAuthenticated();
  const btnRef = React.useRef();

  const { logout } = useAppContext();
  const { setModalType, toggleLoginModal } = useLoginModal();

  const _signInOut = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setModalType(SIGNIN_MODAL_TYPE.SIGNIN);
      toggleLoginModal();
    }
    onClose();
  };

  return (
    <>
      <IconButton
        colorScheme="url(/images/Header_1920.jpg)"
        icon={<HamburgerIcon color="brand.redAccent" />}
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontWeight="bold" color="gray.800" bgColor="gray.50">
            Competition Community
          </DrawerHeader>
          <Divider />
          {!isAuthenticated ? (
            <DrawerBody>
              {isAuthenticated ? (
                <Box
                  onClick={() => {
                    history.push("/dashboard/courses");
                  }}
                  py={2}
                >
                  Dashboard
                </Box>
              ) : null}
              <HStack py={2} onClick={handleCourses}>
                <b>Courses </b> <Spacer /> <ChevronDownIcon fontSize="20px" />
              </HStack>
              <Flex direction="column">
                {showCourses
                  ? courses.map((course, index) => {
                      return (
                        <Text
                          onClick={() => {
                            history.push(
                              ROUTES.PACKAGES +
                                "?id=" +
                                course._id +
                                "&name=" +
                                course.name.en
                            );
                            onClose();
                          }}
                          fontSize="14px"
                          pt={2}
                          key={index}
                        >
                          {course.name.en}
                        </Text>
                      );
                    })
                  : null}
              </Flex>
              <HStack py={2} onClick={handleTestSeries}>
                {" "}
                <b>Test Series</b> <Spacer />{" "}
                <ChevronDownIcon fontSize="20px" />
              </HStack>
              <Flex direction="column">
                {showTestSeries
                  ? tests.map((test, index) => {
                      return (
                        <Text
                          onClick={() => {
                            history.push(
                              ROUTES.PACKAGES +
                                "?id=" +
                                test._id +
                                "&name=" +
                                test.name.en
                            );
                            onClose();
                          }}
                          fontSize="14px"
                          pt={2}
                          key={index}
                        >
                          {test.name.en}
                        </Text>
                      );
                    })
                  : null}
              </Flex>
              <Box
                py={2}
                onClick={() => {
                  history.push(ROUTES.CURRENT_AFFAIRS);
                  onClose();
                }}
              >
                <b>Current Affairs</b>
              </Box>
              <Box
                py={2}
                onClick={() => {
                  history.push(ROUTES.BOOKS);
                  onClose();
                }}
              >
                <b>Book Store</b>
              </Box>
              <Box py={2} onClick={_signInOut}>
                {isAuthenticated ? "Sign Out" : "Sign In"}
              </Box>

              {
                //<Box py={2}><b>Help &amp; Support</b></Box>
              }
            </DrawerBody>
          ) : (
            <DrawerBody>
              {isAuthenticated && (
                <Button
                  size="sm"
                  onClick={() => history.push("/doubts")}
                  bg="brand.redAccent"
                  mb={2}
                >
                  <AiOutlineSolution color="white" />
                  <Text ml={1} style={{ color: "white" }} fontSize="sm">
                    Connect to Teacher
                  </Text>
                </Button>
              )}
              <SideBarContent onClose={onClose} />
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

const MenuComponent = ({ isAuthenticated, signInOut, hamburger }) => {
  const history = useHistory();
  const toast = useToast();
  //console.log("hamburger",hamburger)
  //hamburger = true
  const handleSignIn = () => {
    toast({
      title: "Sign In to Continue.",
      position: "top",
      variant: "subtle",
      status: "info",
      duration: 2500,
      isClosable: true,
    });

    signInOut();
  };

  const location = useLocation();
  const [openMenu, changeOpenMenu] = useState();
  const _openMenu = () => {
    //console.log("In OpenMenu")
    changeOpenMenu(!openMenu);
    if (openMenu) $("#sidebar").animate({ width: 0 });
    else $("#sidebar").animate({ left: "250px", width: "20%" });
  };

  // useEffect(() => {
  //   // changeOpenMenu(false);
  //   $("#sidebar").animate({width: 0 });
  // }, []);

  return (
    <HStack spacing={7}>
      {isAuthenticated ? (
        <Menu>
          <MenuButton
            className="menuButton"
            fontSize="xs"
            // onClick={openMenu}
            onClick={_openMenu}
          >
            <Box color="gray.600">
              <BiMenu fontSize="2.2vw" />
            </Box>
          </MenuButton>
        </Menu>
      ) : null}
      {/* <Menu>
        <MenuButton
          fontSize="xs"
          style={{ color: "#717678" }}
          _hover={menuButtonHoverStyle}
          onClick={() => history.push("/")}
        >
          HOME
        </MenuButton>
      </Menu> */}
      {hamburger ? (
        <hr style={{ paddingTop: "5px", paddingBottom: "3px" }} />
      ) : null}
      {/* <Menu>
                <MenuButton fontSize="xs" style={{paddingRight: '20px', color: 'white'}} _hover={menuButtonHoverStyle}>DOWNLOAD</MenuButton>
            </Menu> */}
      {hamburger ? (
        <hr style={{ paddingTop: "5px", paddingBottom: "3px" }} />
      ) : null}
      {hamburger ? (
        <hr style={{ paddingTop: "5px", paddingBottom: "3px" }} />
      ) : null}
    </HStack>
  );
};

const menuButtonHoverStyle = {
  color: "white",
};

export const SIGNIN_MODAL_TYPE = {
  SIGNIN: "signin",
  COUPON_LOGIN: "coupon",
};

const SignInFlow = () => {
  const { modalType, isLoginModalOpen, toggleLoginModal } = useLoginModal();

  return (
    <Modal size="xl" isOpen={isLoginModalOpen} onClose={toggleLoginModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {modalType === SIGNIN_MODAL_TYPE.COUPON_LOGIN
            ? "Coupon Login"
            : "Sign In"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <LoginRoute />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const CompleteProfilePopUp = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isConfirmed, setIsConfirmed] = useState(null);

  const { user } = useSelector((s) => ({
    user: s.user.user,
  }));

  useEffect(() => {
    if (user && !user.confirmed) {
      setIsConfirmed(false);
      onOpen();
    } else {
      setIsConfirmed(true);
      onClose();
    }
  }, [onClose, onOpen, user]);

  const toast = useToast();

  const handleModalClose = () => {
    if (isConfirmed) {
      onClose();
    } else {
      toast.closeAll();
      toast({
        title: "Please Complete your Profile first.",
        position: "top",
        variant: "subtle",
        status: "warning",
        duration: 2500,
        isClosable: false,
      });
    }
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Complete Your Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <BasicDetailsComponent />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// const SearchBarHeader = ({ width, contact = [] }) => {
//   const history = useHistory();
//   const [searchData, changeSearchData] = useState("");
//   const [searchType, changeSearchType] = useState("all");

//   const search = (e) => {
//     e.preventDefault();
//     history.push(
//       ROUTES.PACKAGES + `?search=${searchData}&searchType=${searchType}`
//     );
//   };

//   // const [isSmallDevice] = useMediaQuery("(max-width: 48em)");

//   // if (isSmallDevice) {
//   //   return (
//   //     <Box key="small" p={2} bg="gray.50" width={width} display={"inline"}>
//   //       <form onSubmit={search} width={width}>
//   //         <Box>
//   //           <InputGroup>
//   //             <InputLeftElement
//   //               pointerEvents="none"
//   //               children={<SearchIcon color="gray.300" />}
//   //             />
//   //             <Input
//   //               background="white"
//   //               color="black"
//   //               borderRadius="full"
//   //               placeholder="What do you want to learn"
//   //               onChange={(e) => changeSearchData(e.target.value)}
//   //               // borderRightRadius={2}
//   //             />
//   //           </InputGroup>
//   //         </Box>
//   //       </form>
//   //     </Box>
//   //   );
//   // }
//   return (
//     <Box
//       w={width}
//       p={[3, 3, 3, 0]}
//       flexGrow={{ lg: "0.5" }}
//       bg={["gray.50", "gray.50", "transparent"]}
//     >
//       <form onSubmit={search}>
//         {/* <InputLeftAddon style={{paddingRight: '0px'}}>
//                     <Menu style={{backgroundColor: 'lightGrayBlue', color: "text.100", border: '0px'}}>
//                         <MenuButton style={{color: "text.100"}}>Exam &nbsp;&nbsp;<ChevronDownIcon/>&nbsp;&nbsp;</MenuButton>
//                         <Portal>
//                             <MenuList>
//                             <MenuItem>Exam</MenuItem>
//                             </MenuList>
//                         </Portal>
//                     </Menu>
//                 </InputLeftAddon> */}
//         <InputGroup>
//           <InputLeftElement
//             {...mobileView}
//             pointerEvents="none"
//             my={2}
//             children={<SearchIcon color="gray.300" />}
//           />
//           <Select
//             {...webView}
//             size="sm"
//             defaultValue={"exam"}
//             color="black"
//             w="30%"
//             _focus={{
//               border: null,
//             }}
//             border={null}
//             borderRightRadius={0}
//             borderLeftRadius={3}
//             background="white"
//             onChange={(e) => changeSearchType(e.target.value)}
//           >
//             <option value="all" style={{ padding: 4 }}>
//               All
//             </option>
//             <option value="COURSE" style={{ padding: 4 }}>
//               Courses
//             </option>
//             <option value="TEST" style={{ padding: 4 }}>
//               Tests
//             </option>
//             <option value="BOOK" style={{ padding: 4 }}>
//               Books
//             </option>
//             <option value="MAGAZINE" style={{ padding: 4 }}>
//               Magazines
//             </option>

//             {/* <option value='package'>Package</option> */}
//           </Select>

//           <Input
//             size={["lg", "lg", "lg", "sm"]}
//             background="white"
//             color="black"
//             pl={["2.5rem", "2.5rem", "1rem"]}
//             py={[2, 2, 2, 0]}
//             borderRadius={["full", "full", "full", 0]}
//             placeholder="What do you want to learn"
//             variant={["outline", "outine", "filled"]}
//             onChange={(e) => changeSearchData(e.target.value)}
//             // borderRightRadius={2}
//           />
//           <IconButton
//             size="sm"
//             width="10%"
//             {...webView}
//             type="submit"
//             // disabled={!searchData}
//             icon={<Search2Icon />}
//             // borderRadius={0}
//             background="brand.redAccent"
//             borderRightRadius={3}
//             borderLeftRadius={0}
//             color="white"
//           />
//         </InputGroup>
//       </form>
//       <Box {...mobileView} p={3} mt={2} textAlign="center">
//         <HStack fontSize="xs">
//           <PhoneIcon color="#13F0FA" />
//           {contact?.map((c) => {
//             return (
//               c?.active && (
//                 <Text key={c} color="gray.500">
//                   {c.text}
//                 </Text>
//               )
//             );
//           })}
//           {/* <Text color="gray.500">IT Help : {CONTACT_IT_HELP}</Text>{" "}
//           <Text color="gray.500">Other : {CONTACT_OTHER}</Text>{" "} */}
//         </HStack>
//       </Box>
//     </Box>
//   );
// };
