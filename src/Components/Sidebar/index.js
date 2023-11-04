import React, { useState } from "react";
import { Box, Divider, HStack } from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router-dom";
import {
  AiFillAppstore,
  AiOutlineHeart,
  AiOutlineLogout,
  AiOutlineMacCommand,
  AiOutlineQuestionCircle,
  AiOutlineSetting,
  AiOutlineShareAlt,
  AiOutlineShoppingCart,
  AiOutlineWallet,
} from "react-icons/ai";
import { ROUTES } from "../../Constants/Routes";
import { RiBookletLine, RiFeedbackLine, RiLiveLine } from "react-icons/ri";
import {
  BsBookmark,
  BsCardChecklist,
  BsChatSquareDots,
  BsGraphUp,
} from "react-icons/bs";
import { BiBookReader, BiShoppingBag } from "react-icons/bi";
import { GiBlackBook } from "react-icons/gi";
import { useAppContext } from "../../App/Context";

const menuOptions = [
  {
    index: 0,
    route: ROUTES.DASHBOARD,
    label: "Dashboard",
    icon: <AiFillAppstore />,
  },
  {
    index: 18,
    route: ROUTES.PERFORMANCE_REPORT_PACKAGES,
    label: "Performance Report",
    icon: <BsGraphUp />,
  },

  {
    index: 1,
    route: ROUTES.COURSES,
    label: "My Course",
    icon: <RiBookletLine />,
  },
  {
    index: 20,
    route: ROUTES.LIVE_CLASSES,
    label: "Live class",
    icon: <RiLiveLine />,
  },
  {
    index: 2,
    route: ROUTES.TEST_PACKAGES,
    label: "My Test",
    icon: <BsCardChecklist />,
  },
  {
    index: 6,
    route: ROUTES.MAGAZINES,
    label: "My Magazine",
    icon: <GiBlackBook />,
  },
  {
    index: 5,
    route: "/dashboard/library/root/audios",
    label: "My Library",
    icon: <BiBookReader />,
  },
  {
    index: 9,
    route: ROUTES.WISHLIST,
    label: "My Wishlist",
    icon: <AiOutlineHeart />,
  },
  {
    index: 10,
    route: "/dashboard/bookmark/root/audios",
    label: "Bookmarks",
    icon: <BsBookmark />,
  },
  // {
  //   index: 11,
  //   route: ROUTES.PERFORMANCE_REPORT,
  //   label: "Performance Report",
  //   icon: <BsGraphUp />,
  // },
  { index: "sep", type: "separator" },
  { index: 7, route: ROUTES.ORDER, label: "My Order", icon: <BiShoppingBag /> },
  { index: "sep2", type: "separator" },
  {
    index: 3,
    route: ROUTES.DISCUSSION_COMMUNITY,
    label: "Discussion Community",
    icon: <BsChatSquareDots />,
  },
  {
    index: 4,
    route: ROUTES.QUESTIONS_COMMUNITY,
    label: "Questions Community",
    icon: <AiOutlineQuestionCircle />,
  },

  {
    index: 14,
    route: ROUTES.FEEDBACK,
    label: "Feedback",
    icon: <RiFeedbackLine />,
  },

  // {
  //   index: 8,
  //   route: ROUTES.CART,
  //   label: "My Cart",
  //   icon: <AiOutlineShoppingCart />,
  // },
  {
    index: 12,
    route: ROUTES.REFERRAL,
    label: "Referral",
    icon: <AiOutlineShareAlt />,
  },
  {
    index: 13,
    route: ROUTES.HELP_AND_SUPPORT,
    label: "Help & Support",
    icon: <AiOutlineMacCommand />,
  },
  {
    index: 15,
    route: ROUTES.WALLET,
    label: "Wallet",
    icon: <AiOutlineWallet />,
  },
  {
    index: 16,
    route: ROUTES.SETTINGS,
    label: "Settings",
    icon: <AiOutlineSetting />,
  },
  {
    index: 17,
    route: ROUTES.LOGOUT,
    logout: true,
    label: "Logout",
    icon: <AiOutlineLogout />,
  },
];

export const Sidebar = () => {
  return (
    <Box
      className="sidebar"
      boxShadow="1px 0px 14px 0px rgba(174, 182, 191, 0.2)"
      height="100%"
      bg="white"
    >
      <SideBarContent />
    </Box>
  );
};

export const SideBarContent = (props) => {
  const currentRoute = useLocation().pathname;

  const index = menuOptions.filter((opt) => {
    return opt.route === currentRoute;
  })[0]?.index;

  const [activeIndex, setActiveIndex] = useState(index || 0);

  const history = useHistory();

  const itemStyle = (index) => {
    if (index === activeIndex) {
      return {
        background: "brand.redAccentLight",
        padding: "0.5rem 1rem",
        transition: "all 0.3s",
        color: "gray.700",
      };
    } else {
      return {
        color: "#3C4043",
        // borderBottom :  "1px solid rgba(0,0,0,0.1)",
        padding: "0.5rem 1rem",
        transition: "all 0.3s",
        _hover: {
          background: "#d2e2fd",
        },
        background: "white",
      };
    }
  };

  const handleItemClick = (item) => {
    history.push(item.route);
    setActiveIndex(item.index);
    if (props.onClose) props.onClose();
    console.log("props.onClose", props.onClose);
  };

  const { logout } = useAppContext();

  return (
    <Box>
      {menuOptions?.map((opt, i) => {
        return !opt.label ? (
          <Box key={i} h={"16px"}></Box>
        ) : (
          <Box key={i} bg="white">
            <Box
              fontSize="16px"
              cursor="pointer"
              onClick={() => {
                if (opt.logout) {
                  return logout();
                }
                handleItemClick(opt);
              }}
              key={opt.index}
              {...itemStyle(opt.index)}
            >
              <HStack spacing={4} p={1}>
                <Box fontSize="lg" color={"brand.redAccent"}>
                  {opt.icon}
                </Box>
                <Box fontSize="sm">{opt.label}</Box>
              </HStack>
            </Box>
            <Box px={4}>
              <Divider />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
