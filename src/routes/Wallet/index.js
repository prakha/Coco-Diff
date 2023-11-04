import React, { useReducer, useState, useEffect } from "react";
import {
  Box,
  Button,
  HStack,
  Spacer,
  VStack,
  Image,
  Text,
  InputGroup,
  InputLeftAddon,
  Input,
  Tag,
  TagLeftIcon,
  TagLabel,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { SectionHeader } from "../../Components/SectionHeader";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import cocoCreditImg from "./coco_credit.png";
import instantCheckoutImg from "./instant_checkout.png";
import consolidatedMoneyImg from "./cons_money.png";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  requestUserWalletOrders,
  requestUserWalletAction,
  updateUserWalletAction,
} from "../../redux/reducers/wallet";
import { STATUS } from "../../App/Constants";
import { useHistory } from "react-router";
import { ROUTES } from "../../Constants/Routes";
import { Route, Switch } from "react-router-dom";
import { useQueryParams } from "../../utils/useQueryParams";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { LoadingRef } from "../../App/AppProvider";
import { apis } from "../../services/api/apis";
import { usePaymentVerify } from "../Cart/usePaymentVerify";
import moment from "moment";

export const Wallet = () => {
  const dispatch = useDispatch();

  let query = useQueryParams();

  const th = query.get("transectionHistory");

  useEffect(() => {
    dispatch(requestUserWalletAction());
  }, [dispatch]);
  const [walletData, setWalletData] = useState(null);

  const { wallet } = useSelector((state) => ({
    wallet: state.wallet,
  }));

  useEffect(() => {
    if (wallet.getWalletStatus === STATUS.SUCCESS) {
      setWalletData(wallet.wallet);
    }
  }, [wallet]);

  return th ? (
    <Box>
      <TransactionHistory walletData={walletData} />
    </Box>
  ) : (
    <Box>
      <WalletSection walletData={walletData} />
    </Box>
  );
};

const WalletSection = ({ walletData }) => {
  const history = useHistory();

  const [amount, setAmount] = useState(null);
  const priceOptions = [
    { price: 750.0 },
    { price: 1000.0 },
    { price: 1500.0 },
    { price: 2000.0 },
  ];

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const toast = useToast();
  const dispatch = useDispatch();

  const { _checkout } = usePaymentVerify({
    mode: "wallet",
    onSuccess: (data) => {
      toast({
        status: "success",
        title: "Payment done",
        position: "top",
        description: "Amount has been added to your wallet",
      });
      dispatch(updateUserWalletAction(data.wallet));
    },
  });

  const handleWalletAddMoney = async () => {
    // console.log("handleWalletAddMoney Called : ", amount)
    _checkout({
      payableAmount: parseFloat(amount),
      type: "credit",
    });
  };

  return (
    <Box>
      <HStack alignItems="flex-start">
        <SectionHeader
          title="My Wallet"
          breadcrumbs={[
            { title: "Home", link: "/" },
            { title: "My Wallet", link: "#" },
          ]}
        />
        <Spacer />
        <Button
          width="200px"
          colorScheme="green"
          variant="outline"
          leftIcon={<FaRegMoneyBillAlt />}
          onClick={() =>
            history.push(ROUTES.WALLET + "?transectionHistory=true")
          }
        >
          Transaction History
        </Button>
      </HStack>
      <Box
        marginY="1rem"
        p="2rem"
        backgroundColor="#EFF3F6A8"
        boxShadow="lg"
        borderRadius="xl"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box width="70%">
          <VStack>
            <Box
              width="100%"
              backgroundColor="white"
              borderRadius="lg"
              boxShadow="lg"
              p="2rem"
            >
              <VStack width="100%">
                <Box display="flex" alignItems="center" p="10px">
                  <Image height="40px" src={cocoCreditImg} />
                  <Box
                    height="40px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    paddingTop="10px"
                  >
                    <Text fontSize="xs" lineHeight="13px" fontWeight="light">
                      COCO
                    </Text>
                    <Text
                      fontSize="md"
                      letterSpacing="1px"
                      lineHeight="13px"
                      fontWeight="bold"
                    >
                      CREDIT
                    </Text>
                  </Box>
                </Box>
                <HStack textAlign="center" width="80%" marginTop="2rem">
                  <Box width="50%" height="200px">
                    <VStack>
                      <Image height="40px" src={instantCheckoutImg} />
                      <Text fontWeight="bold" fontSize="large">
                        INSTANT CHECKOUT
                      </Text>
                      <Text fontSize="small" color="text.100">
                        One-click, easy and fast checkout
                      </Text>
                    </VStack>
                  </Box>
                  <Box width="50%" height="200px">
                    <VStack>
                      <Image height="40px" src={consolidatedMoneyImg} />
                      <Text fontWeight="bold" fontSize="large">
                        CONSOLIDATED MONEY
                      </Text>
                      <Text fontSize="small" color="text.100">
                        Gift cards, refunds and cashbacks in one place
                      </Text>
                    </VStack>
                  </Box>
                </HStack>
              </VStack>
            </Box>
            <Box
              width="100%"
              backgroundColor="white"
              borderRadius="lg"
              boxShadow="lg"
            >
              <VStack p="2rem">
                <Text fontWeight="bold" fontSize="lg">
                  TOP-UP YOUR COCO CREDIT NOW!
                </Text>
                <Text fontWeight="bolder" fontSize="22px" color="#239F60">
                  {walletData?.balance.toString()
                    ? "₹" + walletData.balance.toString()
                    : "-"}
                </Text>
                <Text fontWeight="light" fontSize="small" color="text.300">
                  Top-up Your Coco Credit
                </Text>
                <Box>
                  <HStack>
                    {priceOptions.map((p) => (
                      <Button
                        onClick={() => setAmount(p.price.toString())}
                        variant="ghost"
                        boxShadow="lg"
                      >
                        ₹ {p.price.toString()}
                      </Button>
                    ))}
                  </HStack>
                  <InputGroup marginTop="1rem">
                    <InputLeftAddon children="₹" />
                    <Input
                      onChange={handleAmountChange}
                      value={amount}
                      type="number"
                      placeholder="Enter an amount (eg: 1000)"
                    />
                  </InputGroup>
                </Box>
              </VStack>
              <Button
                disabled={!parseFloat(amount)}
                width="100%"
                colorScheme="green"
                leftIcon={<AiOutlinePlus />}
                onClick={handleWalletAddMoney}
              >
                Add Money
              </Button>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

const TransactionHistory = () => {
  const orders = useSelector((s) => s.wallet.orders);
  const status = useSelector((s) => s.user.orderStatus);

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestUserWalletOrders());
  }, [dispatch]);

  return (
    <Box>
      <HStack alignItems="flex-start">
        <SectionHeader
          title="Transaction History"
          breadcrumbs={[
            { title: "Home", link: "/" },
            { title: "My Wallet", link: ROUTES.WALLET },
            { title: "Transaction History", link: "#" },
          ]}
        />
        <Spacer />
        <Button
          width="200px"
          colorScheme="white"
          variant="outline"
          leftIcon={<FaRegMoneyBillAlt />}
          onClick={() => history.push(ROUTES.WALLET)}
        >
          Back To Wallet
        </Button>
      </HStack>
      <Flex w="100%" flexDirection="column" alignItems="center">
        {orders ? (
          orders.map((t) => {
            return (
              <Flex
                width="80%"
                mt={2}
                boxShadow="xs"
                p="1rem"
                borderRadius="md"
              >
                <HStack flex={1} spacing={20}>
                  <Text
                    width="25%"
                    fontSize="large"
                    fontWeight={t.status == "Success"? "bold" : "300"}
                    textDecoration={t.status !== "Success"? "line-through": "none"}
                    style={{
                      color:
                        "gray.400"
                    }}
                  >
                    ₹{t.processedAmount}
                  </Text>
                  <Text
                    width="25%"
                    fontSize="large"
                    fontWeight="bold"
                    sx={{ color: t.status === "Success" ? "green.600" : "red.600" }}
                  >
                    {t.status}
                  </Text>
                  {/* To DO : Date from the API */}
                  <Text color="gray.700" fontSize="sm">
                    {moment(t.createdAt).format("DD MMM, YYYY hh:mm a")}
                  </Text>
                </HStack>
                <Tag
                  ml={10}
                  size="sm"
                  variant="subtle"
                  colorScheme={
                    t.type === "credit"
                      ? "green"
                      : t.type === "debit"
                      ? "red"
                      : "blue"
                  }
                >
                  <TagLeftIcon
                    boxSize="12px"
                    as={
                      t.type === "credit"
                        ? AddIcon
                        : t.type === "debit"
                        ? MinusIcon
                        : ""
                    }
                  />
                  <TagLabel>{t.type.toUpperCase()} </TagLabel>
                </Tag>
              </Flex>
            );
          })
        ) : status === STATUS.FETCHING ? (
          <Text>Loading...</Text>
        ) : (
          <Text>No Data</Text>
        )}
      </Flex>
    </Box>
  );
};
