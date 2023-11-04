import { DownloadIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  List,
  ListItem,
  Spacer,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { STATUS } from "../../App/Constants";
import { BaseURL } from "../../BaseUrl";
import { SectionHeader } from "../../Components/SectionHeader";
import { ROUTES } from "../../Constants/Routes";
import { requestUserOrdersAction } from "../../redux/reducers/orders";
import { bilingualText } from "../../utils/Helper";

export const OrderDetails = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const { getOrderStatus, ordersList } = useSelector((state) => ({
    getOrderStatus: state.order.getOrderStatus,
    ordersList: state.order.userOrder,
  }));

  const [currentOrder, setCurrentOrder] = useState();

  useEffect(() => {
    if (ordersList?.length)
      setCurrentOrder(_.find(ordersList, (o) => o._id == params.id));
  }, [ordersList, params]);

  useEffect(() => {
    if (getOrderStatus !== STATUS.SUCCESS) dispatch(requestUserOrdersAction());
  }, [getOrderStatus, dispatch]);

  const handleDownloadInvoice = () => {
    window.open(
      BaseURL + "order/invoice/pdf?orderId=" + currentOrder._id,
      "_blank"
    );
  };

  let breadcrumbs = [
    { title: "Home", link: "/" },
    { title: "My Orders", link: "/dashboard/order" },
    { title: "Order", link: "#" },
  ];

  return (
    <Box>
      <SectionHeader title="My Orders" breadcrumbs={breadcrumbs} />

      <Box background="white" padding="20px">
        {currentOrder ? (
          <Box>
            <Text fontSize="20px" fontWeight="bold">
              Order Details
            </Text>
            <br />
            <Flex flexWrap="wrap" mb={2}>
              <Box>
                Ordered on {moment(currentOrder.updatedAt).format("LL")}
              </Box>
              <Box px={6}>
                <Divider colorScheme="black" orientation="vertical" />
              </Box>
              <HStack>
                <Text>Status</Text>
                <Text
                  fontWeight="bold"
                  color={
                    currentOrder.status == "Processing"
                      ? "#F39C12"
                      : currentOrder.status == "Success"
                      ? "#16A085"
                      : ""
                  }
                >
                  {currentOrder.status}
                </Text>
              </HStack>
              <Box px={6}>
                <Divider colorScheme="black" orientation="vertical" />
              </Box>
              <Box>Order# {currentOrder._id}</Box>
              <Box px={6}>
                <Divider colorScheme="black" orientation="vertical" />
              </Box>
              <Box>
                {currentOrder.status === "Success" ? (
                  <Tooltip label="Download Invoice">
                    <Button
                      onClick={handleDownloadInvoice}
                      colorScheme="blue"
                      leftIcon={<DownloadIcon />}
                      variant="link"
                    >
                      Invoice
                    </Button>
                  </Tooltip>
                ) : null}
              </Box>
            </Flex>
            <Flex
              flexWrap="wrap"
              p={4}
              align="start"
              border="1px solid #D6DBDF"
              justify="space-between"
              borderRadius="4px"
            >
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Shipping Address
                </Text>
                <Text>{currentOrder.addressBilling?.contact}</Text>
                <Text>{currentOrder.addressBilling?.address}</Text>
                <Text>{currentOrder.addressBilling?.landmark}</Text>
                <Text>
                  {currentOrder.addressBilling?.city},{" "}
                  {currentOrder.addressBilling?.state},{" "}
                  {currentOrder.addressBilling?.pincode}
                </Text>
              </Box>
              {/* <Box>
                                <Text fontWeight='bold'>Payment Method</Text>
                            </Box> */}
              <Box>
                {/* <Text fontWeight='bold' mb={2}>Order Summery</Text> */}
                <List>
                  {/* <ListItem>
                                        <HStack justify='space-between'>
                                            <Text paddingRight={20}>Item(s) Subtotal:</Text>
                                            <Text> ₹ 15,499.00</Text>
                                        </HStack> 
                                    </ListItem>
                                    <ListItem>
                                        <HStack justify='space-between'>
                                            <Text>Discount on MRP:</Text>
                                            <Text> ₹ 15,499.00</Text>
                                        </HStack> 
                                    </ListItem>
                                    <ListItem>
                                        <HStack justify='space-between'>
                                            <Text>Promocode savings:</Text>
                                            <Text> ₹ 15,499.00</Text>
                                        </HStack> 
                                    </ListItem>
                                    <ListItem>
                                        <HStack justify='space-between'>
                                            <Text>GST:</Text>
                                            <Text> ₹ 15,499.00</Text>
                                        </HStack> 
                                    </ListItem>
                                    <Divider my={2}/> */}
                  <ListItem pt={[4, 0]}>
                    <HStack fontWeight="bold" justify="space-between">
                      <Text>Total Amount:</Text>
                      <Text> ₹ {_.round(currentOrder.amount, 2)}</Text>
                    </HStack>
                  </ListItem>
                </List>
              </Box>
            </Flex>
            <br />
            {/* <ContentList content={currentOrder.cart?.packages?.length ? currentOrder.cart.packages : []} /> */}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

const ContentList = ({ content }) => {
  const history = useHistory();

  return (
    <Box
      wrap
      p={4}
      align="start"
      border="1px solid #D6DBDF"
      justify="space-between"
      borderRadius="4px"
    >
      <List>
        {content.length
          ? content.map((c) => (
              <ListItem key={c._id} p={2}>
                <Flex spacing={10} flexWrap="wrap" alignItems="center">
                  <Box w={["100%", "60pt"]}>
                    <Image
                      src={c.carousel?.[0]}
                      fallbackSrc="https://via.placeholder.com/200x200.png?text=CO+CO"
                      maxW={["100%", "60pt"]}
                    />
                  </Box>
                  <Box px={[0, 6]} pt={[2, 0]} w={["100%", "auto"]}>
                    <Text
                      onClick={() =>
                        history.push(ROUTES.PACKAGE_DETAILS + "?id=" + c._id)
                      }
                      cursor="pointer"
                      color="#2E86C1"
                    >
                      {bilingualText(c.name)}
                    </Text>
                    <HStack color="#5D6D7E">
                      <Text fontSize="14px">Price:</Text>
                      <Text fontSize="16px" fontWeight="bold">
                        ₹{c.price}
                      </Text>
                    </HStack>
                  </Box>
                </Flex>
                <Divider my={4} />
              </ListItem>
            ))
          : null}
      </List>
    </Box>
  );
};
