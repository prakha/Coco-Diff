import React, { useState, useEffect, useCallback, useMemo } from "react";
import { STATUS } from "../../App/Constants";
import {
  Wrap,
  WrapItem,
  useToast,
  Box,
  HStack,
  Button,
  VStack,
  Text,
  InputGroup,
  Input,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Flex,
  Stack,
  Image,
  Heading,
  Select,
  FormControl,
  FormLabel,
  Divider,
  Tooltip,
  Spacer,
  IconButton,
  Switch as ChakraSwitch,
  InputLeftAddon,
  Checkbox,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import {
  resetPromoCode,
  updateCartData,
  verifyPromoAciton,
} from "../../redux/reducers/cart";
import { useDispatch, useSelector } from "react-redux";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { useAppContext, useIsAuthenticated } from "../../App/Context";
import { ROUTES } from "../../Constants/Routes";
import { CommonHeader } from "../../Components/CommonHeader";
import { apis } from "../../services/api/apis";
import { LoadingRef } from "../../App/AppProvider";
import { useCart } from "../../Cart/useCart";
import { setStudentData } from "../../redux/reducers/user";
import { BsFillTagFill } from "react-icons/bs";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { SectionHeader } from "../../Components/SectionHeader";
import {
  AiFillHeart,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlinePlus,
  AiOutlineSelect,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { addToWishlistAction } from "../../redux/reducers/wishlist";
import { Empty } from "../../Components/Empty";
import {
  requestUserAddressAction,
  updateUserAddressAction,
} from "../../redux/reducers/address";
import { BiLocationPlus } from "react-icons/bi";
import _, { find, forEach, map, size } from "lodash";
import { useCheckStatus } from "../../utils/useCheckStatus";
import { SuccessOrder } from "./SuccessPage";
import { usePaymentVerify } from "./usePaymentVerify";
import { requestUserWalletAction } from "../../redux/reducers/wallet";
import { bilingualText, getPackagePrice } from "../../utils/Helper";
import { useQueryParams } from "../../utils/useQueryParams";
import e from "express";
import { useLoginModal } from "../../App/useLoginModal";
import { ButtonX } from "../../Components/ButtonX";
import { getSinglePackageAction } from "../../redux/reducers/packages";
import moment from "moment";

export const Cart = (props) => {
  const isAuthenticated = useIsAuthenticated();
  let { path, url } = useRouteMatch();

  return (
    <Box backgroundColor="#f7f8fb">
      {!isAuthenticated ? (
        <Alert status="warning">
          <AlertIcon />
          You are not Logged In, Please login now to Complete your Purchase
        </Alert>
      ) : null}
      {path === ROUTES.PUBLIC_CART ? <CommonHeader pageContext="cart" /> : null}
      <Switch>
        <Route exact path={path}>
          <Box p={path === ROUTES.PUBLIC_CART ? 1 : 0}>
            <CartComponent />
          </Box>
        </Route>
        <Route exact path={ROUTES.CHECKOUT}>
          <CheckoutComponent />
        </Route>
        <Route exact path={ROUTES.SUCCESS_CART}>
          <SuccessOrder />
        </Route>
      </Switch>
    </Box>
  );
};

const CheckoutComponent = () => {
  const dispatch = useDispatch();
  const location = useLocation()
  const urlSearchParams = new URLSearchParams(location.search);
  const {packageId, subscriptionId, renew, centerId} = Object.fromEntries(urlSearchParams.entries());

  console.log('renew', centerId)
  const { userData, currentPackage } = useSelector((s) => ({
    userData: s?.user?.user,
    currentPackage:s.package.currentPackage?.[0]
  }));

  const {
    cart,
    cartAnalysis: { total, isOffline },
  } = useCart();

  const [userBillingAddress, setUserBillingAddress] = useState(null);
  const [userShippingAddress, setUserShippingAddress] = useState(null);

  useEffect(() => {
    if (userData) {
      dispatch(requestUserAddressAction({ userId: userData._id }));
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if(packageId){
      dispatch(getSinglePackageAction({ id:packageId }));
    }
  }, [packageId, dispatch])
  
  const subscription = useMemo(() => {
    if(currentPackage && currentPackage.subscriptions?.length){
      return _.find(currentPackage.subscriptions,sub => sub._id === subscriptionId  )
    }
  }, [currentPackage, subscriptionId])

  const handleUpdateUserAddresses = useCallback((address, addressType) => {
    if (addressType === "billing") {
      setUserBillingAddress(address);
    } else if (addressType === "shipping") {
      setUserShippingAddress(address);
    }
  }, []);

  return !cart && !subscriptionId ? (
    <Redirect to={ROUTES.PUBLIC_CART} />
  ) : (
    <Box m={[3, 5, 6]}>
      <SectionHeader
        title="Checkout"
        breadcrumbs={[
          { title: "Home", link: "/" },
          { title: "Cart", link: ROUTES.PUBLIC_CART },
          { title: "Checkout", link: "#" },
        ]}
      />

      <Flex
        alignItems="flex-start"
        justifyContent="center"
        flexWrap="wrap"
        spacing="2rem"
      >
        <Box
          boxShadow="md"
          borderRadius="xl"
          bg="white"
          p={"1.5rem"}
          mb={4}
          width={["100%", "68%", "68%"]}
        >
          {subscription ?
            subscription.mode === 'offline' ?
              <>
                <Text my={2}>Please provide Address</Text>
                <AddressComponent
                  addressType="shipping"
                  userData={userData}
                  selectedAddress={userShippingAddress}
                  updateUserAddresses={handleUpdateUserAddresses}
                />
              </>
              :
              null
            :isOffline ? (
              <>
                <Text my={2}>Please provide Address</Text>
                <AddressComponent
                  addressType="shipping"
                  userData={userData}
                  selectedAddress={userShippingAddress}
                  updateUserAddresses={handleUpdateUserAddresses}
                />
              </>
            ) : null
          }

          <br />

          <AddressComponent
            addressType="billing"
            userData={userData}
            selectedAddress={userBillingAddress}
            updateUserAddresses={handleUpdateUserAddresses}
          />
        </Box>

        <Box
          boxShadow="md"
          borderRadius="xl"
          bg="white"
          p="1.5rem"
          width={["100%", "100%", "100%", "50%"]}
        >
          {subscription ? 
            <FinalSubscriptionCheckout
              renew={renew === 'true'}
              currentPackage={currentPackage}
              centerId={centerId}
              subscription={subscription}
              userAddresses={{ userBillingAddress, userShippingAddress }}
            />
            :
            <FinalCheckout
              userAddresses={{ userBillingAddress, userShippingAddress }}
            />
          }
        </Box>
      </Flex>
    </Box>
  );
};

const AddressComponent = ({
  addressType,
  userData,
  selectedAddress,
  updateUserAddresses,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [addressMode, setAddressMode] = useState("DISPLAY");

  const userAddressData = useSelector((s) => s?.address?.userAddress);

  // const [selectedAddress, setSelectedAddress] = useState(
  //   userAddressData ? userAddressData[0] : null
  // );
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const { addressStatus } = useSelector((s) => ({
    addressStatus: s?.address,
  }));

  useEffect(() => {
    if (userAddressData?.length && !selectedAddress) {
      updateUserAddresses(userAddressData[0], addressType);
    }
  }, [userAddressData, selectedAddress, updateUserAddresses, addressType]);

  useCheckStatus({
    status: addressStatus.addressUpdateStatus,
    onSuccess: () => {
      toast.closeAll();
      toast({
        title: "New Address Added",
        status: "success",
        duration: 3000,
      });
      setAddressMode("DISPLAY");
      setIsAddingAddress(false);
    },
    onError: () => {
      toast.closeAll();
      toast({
        title: "Something Went Wrong",
        description: "Couldn't Add New Address, Please Try Again",
        status: "error",
        duration: 3000,
      });
      setIsAddingAddress(false);
    },
  });

  useEffect(() => {
    if (addressStatus.addressUpdateStatus === STATUS.FETCHING) {
      setIsAddingAddress(true);
    }
  }, [addressStatus]);

  const user = useSelector((s) => s.user.user);

  const handleAddressUpdateSubmit = (e, formData) => {
    e.nativeEvent.preventDefault();
    formData["userId"] = user._id;
    dispatch(updateUserAddressAction(formData));
  };

  const handleSelectedAddressChange = (e) => {
    updateUserAddresses(
      userAddressData.filter((address) => {
        return e.target.value === address._id;
      })[0],
      addressType
    );
  };

  return (
    <Box>
      <Flex flexWrap="wrap" width="100%">
        <Text as={"h1"} mb={3} fontSize="2xl" fontWeight="600">
          {addressType.toUpperCase()} ADDRESS
        </Text>
        <Spacer />
        <Button
          isLoading={isAddingAddress}
          loadingText={"Adding Address"}
          width="200px"
          leftIcon={
            addressMode === "UPDATE" ? (
              <AiOutlineEye fontSize="large" />
            ) : (
              <AiOutlinePlus fontSize="large" />
            )
          }
          justifyContent="space-between"
          onClick={() =>
            addressMode === "UPDATE"
              ? setAddressMode("DISPLAY")
              : setAddressMode("UPDATE")
          }
          variant="outline"
          colorScheme="green"
        >
          {addressMode === "UPDATE" ? "View All Address" : "Add New Address"}
        </Button>
      </Flex>
      <br />

      {addressMode === "UPDATE" ? (
        <AddNewAddressForm
          submitForm={handleAddressUpdateSubmit}
          userData={userData}
        />
      ) : (
        <Box>
          {userAddressData?.length ? (
            <Box>
              <InputGroup>
                <InputLeftAddon
                  children="Select Address"
                  pointerEvents="none"
                />
                <Select
                  onChange={handleSelectedAddressChange}
                  defaultValue={selectedAddress?._id}
                >
                  {userAddressData.map((address, i) => {
                    return (
                      <option value={address._id}>
                        {address?.name || address?.address}
                      </option>
                    );
                  })}
                </Select>
              </InputGroup>

              {selectedAddress ? (
                <Box mt="2rem">
                  {/* Start */}
                  <Flex
                    flexWrap="wrap"
                    spacing={4}
                    backgroundColor="white"
                    boxShadow="xs"
                    borderRadius="15px"
                    p="5"
                  >
                    <AddressItem
                      name="Address"
                      value={selectedAddress?.address}
                    />
                    <AddressItem
                      name="Landmark"
                      value={selectedAddress?.landmark}
                    />
                    <AddressItem
                      name="Pincode"
                      value={selectedAddress?.pincode}
                    />
                    {/* <Divider/> */}
                    <AddressItem name="City" value={selectedAddress?.city} />
                    <AddressItem name="State" value={selectedAddress?.state} />
                    {/* <AddressItem
                        name="District"
                        value={selectedAddress?.district}
                      /> */}
                  </Flex>
                  {/* End */}
                </Box>
              ) : (
                <Box>
                  <Empty
                    title="No Address Selected"
                    subtitle="Select One of the Address from Above to Continue"
                    Icon={<AiOutlineSelect />}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Box>
              <Empty
                title="No Address Found"
                subtitle="You have not added any Address yet, Add one to continue"
                Icon={<BiLocationPlus />}
                cta={{
                  text: "Add Address",
                  action: () => setAddressMode("UPDATE"),
                }}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

const AddNewAddressForm = ({ submitForm, userData }) => {
  const [addressName, setAddressName] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [pincode, setPincode] = useState(null);
  const [landmark, setLandmark] = useState(null);
  const [contact, setContact] = useState(userData?.contact);
  const [isPermanent, setIsPermanent] = useState(false);
  const [stateCityData, setStateCityData] = useState(null);
  const [cityData, setCityData] = useState(null);

  const fetchStateCityData = async () => {
    const response = await apis.fetchStateCityDataApi();
    const { ok, data, status } = response;
    if (ok && data) {
      setStateCityData(data);
    } else {
      console.log("API Call Failed : ", data);
    }
  };

  useEffect(() => {
    fetchStateCityData();
  }, []);

  useEffect(() => {
    if (userData) {
      setContact(userData.contact);
    }
  }, [userData]);

  const handleStateValueChange = (e) => {
    let cities = stateCityData.find((s) => s.name === e.target.value).cities;
    document.getElementById("citySelector").selectedIndex = 0;
    setState(e.target.value);
    setCityData(cities);
  };

  return (
    <Box>
      <form
        onSubmit={(e) =>
          submitForm(e, {
            name: addressName,
            address,
            city,
            state,
            pincode,
            landmark,
            contact,
            type: isPermanent ? "permanent" : "temp",
          })
        }
      >
        <VStack
          alignItems="stretch"
          spacing={4}
          backgroundColor="rgba(0,0,0,0.03)"
          borderRadius="15px"
          p={8}
        >
          <HStack width="100%">
            <FormControl variant="filled" p={2} id="addressName" isRequired>
              <FormLabel>Address Name</FormLabel>
              <Input
                onChange={(e) => setAddressName(e.target.value)}
                placeholder="Address Name Eg. Home, Work, etc."
                bg="white"
              />
            </FormControl>
          </HStack>
          <Flex flexWrap="wrap" width="100%">
            <FormControl
              variant="filled"
              w={["100%", "50%", "33%"]}
              p={2}
              id="address"
              isRequired
            >
              <FormLabel>Address</FormLabel>
              <Input
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                bg="white"
              />
            </FormControl>
            <FormControl
              variant="filled"
              w={["100%", "50%", "33%"]}
              p={2}
              id="landmark"
              isRequired
            >
              <FormLabel>Landmark</FormLabel>
              <Input
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Landmark"
                bg="white"
              />
            </FormControl>
            <FormControl
              variant="filled"
              w={["100%", "50%", "33%"]}
              p={2}
              id="pincode"
              isRequired
            >
              <FormLabel>Pincode</FormLabel>
              <Input
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
                bg="white"
              />
            </FormControl>
          </Flex>

          <Divider />

          {stateCityData ? (
            <Flex flexWrap="wrap" width="100%">
              <FormControl
                variant="filled"
                w={["100%", "50%", "50%"]}
                p={2}
                id="state"
                isRequired
              >
                <FormLabel>State</FormLabel>
                <Select
                  onChange={handleStateValueChange}
                  defaultValue={null}
                  placeholder="Select Your State"
                  bg="white"
                >
                  {stateCityData.map((state, i) => (
                    <option value={state.name}>{state.name}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                variant="filled"
                w={["100%", "50%", "50%"]}
                p={2}
                id="city"
                isRequired
              >
                <FormLabel>City</FormLabel>
                <Select
                  disabled={!state}
                  defaultValue={null}
                  id="citySelector"
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Select Your City"
                  bg="white"
                >
                  {cityData?.map((city, i) => (
                    <option value={city.name}>{city.name}</option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
          ) : null}
          <Flex p={2} flexWrap="wrap" justifyContent="space-between">
            <HStack alignItems="center">
              <FormLabel htmlFor="addressPermanent">
                Is this Permanent Address?
              </FormLabel>
              <ChakraSwitch
                onChange={(e) => setIsPermanent(e.target.checked)}
                id="addressPermanent"
              />
            </HStack>

            <Button type="submit" variant="outline" colorScheme="blue">
              Submit
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
};

const AddressItem = ({ name, value }) => {
  return (
    <Box p={3} width={["100%", "50%", "33%"]}>
      <Box
        p={3}
        bg="lightGrayBlue"
        borderRadius="sm"
        boxShadow="sm"
        borderLeft="4px solid #C6DCFF"
      >
        <Text fontSize="sm" fontWeight="bold">
          {name}:
        </Text>
        <Text color="rgba(0,0,0,0.7)">{value}</Text>
      </Box>
    </Box>
  );
};

export const CartComponent = () => {
  const isAuthenticated = useIsAuthenticated();
  const { removePackageFromCart, addPackageToCart, packagesData } = useCart();
  const dispatch = useDispatch();
  const history = useHistory();
  const toast = useToast();
  const [wishlistPackageID, setWishlistPackageID] = useState(null);
  const query = useQueryParams();
  const purchasePkg = query.get("addtocart");
  const { openLoginModal } = useLoginModal();

  useEffect(() => {
    if (purchasePkg) {
      if (isAuthenticated) {
        addPackageToCart(purchasePkg);
      } else {
        openLoginModal();
      }
    }
  }, [purchasePkg, openLoginModal, addPackageToCart, isAuthenticated]);

  const handleRemove = (id) => {
    removePackageFromCart(id);
    toast({
      title: "Item Removed.",
      // description: "We've created your account for you.",
      status: "success",
      duration: 3000,
      // isClosable: true,
    });
  };

  const { wishlist } = useSelector((s) => ({
    wishlist: s.wishlist,
  }));

  const handleMoveToWishlist = (id) => {
    setWishlistPackageID(id);
    dispatch(addToWishlistAction({ packageId: id }));
  };

  useCheckStatus({
    status: wishlist.addWishlistStatus,
    onSuccess: () => {
      removePackageFromCart(wishlistPackageID);
      toast({
        title: "Item Moved to Wishlist.",
        status: "success",
        duration: 3000,
      });
    },
  });

  return (
    <Box p={[3, 5, 6]}>
      <SectionHeader
        title="MY CART"
        breadcrumbs={[
          { title: "Home", link: "/" },
          { title: "My Cart", link: "#" },
        ]}
      />
      {packagesData.length ? (
        <Flex flexWrap="wrap" alignItems="flex-start">
          <Box width={["100%", "100%", "100%", "70%"]} mb={4} pr="1rem">
            {/* <ItemsTable items={packagesData} remove={handleRemove} /> */}
            <ItemsList
              items={packagesData}
              remove={handleRemove}
              moveToWishlist={handleMoveToWishlist}
            />
          </Box>
          <Box width={["100%", "100%", "100%", "30%"]}>
            <CheckoutSection
              items={packagesData}
              isAuthenticated={isAuthenticated}
            />
          </Box>
        </Flex>
      ) : (
        <Box width="100%">
          <Empty
            title="Your Cart is Empty"
            subtitle="Before Proceed to Checkout you must add some items to your Shopping Cart."
            Icon={<AiOutlineShoppingCart />}
            cta={{ text: "Go To Home", action: () => history.push("/") }}
          />
        </Box>
      )}
    </Box>
  );
};

const CheckoutSection = ({ items, isAuthenticated }) => {
  const dispatch = useDispatch();

  const { verifyPromoStatus, promoCodeData } = useSelector((state) => ({
    verifyPromoStatus: state.cart.verifyPromoStatus,
    promoCodeData: state.cart.promoCodeData,
  }));

  const {
    cartAnalysis: {
      total,
      afterDiscount,
      initialDiscount,
      promoDiscount,
      isOffline,
      wallet,
      gst,
      topay,
      saved,
    },
  } = useCart();

  const [promoCode, changePromo] = useState("");

  const history = useHistory();

  const _checkout = () => {
    history.push(ROUTES.CHECKOUT);
  };

  const _changePromo = (e) => {
    changePromo(e.target.value);
  };

  const applyPromo = (e) => {
    e.preventDefault();
    dispatch(verifyPromoAciton({ code: promoCode }));
  };

  const removePromocode = () => {
    dispatch(resetPromoCode());
    changePromo("");
  };

  return (
    <Box>
      <VStack spacing="10px" alignItems="left">
        <VStack
          spacing="1rem"
          boxShadow="md"
          borderRadius="xl"
          bg="white"
          p="1.5rem"
        >
          <Box>
            <Text fontSize="large" fontWeight="bold">
              Discount
            </Text>
            {/* <Text fontSize="small" color="text.100">
              If you have any discount voucher/coupons, apply here. If you don’t
              have any, click here to get one.
            </Text> */}
          </Box>
          <form onSubmit={applyPromo} style={{ width: "100%" }}>
            <InputGroup>
              {/* <InputLeftElement pointerEvents="none" children={<RiCoupon2Line />} /> */}
              <Input
                type="text"
                borderRadius="5px 0 0 5px"
                color="#3C4043B3"
                bg="lightGrayBlue"
                value={promoCode}
                required
                name="promo"
                onChange={_changePromo}
                placeholder="Enter Coupon Code"
              />
              <Button
                borderRadius="0 5px 5px 0"
                type="submit"
                colorScheme="green"
                fontSize="small"
                fontWeight="normal"
              >
                Apply
              </Button>
            </InputGroup>
          </form>
        </VStack>
        <Box marginBottom="5px">
          {verifyPromoStatus == STATUS.SUCCESS ? (
            promoCodeData ? (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom="5px"
                bg="#EDF4E5"
                color="green.500"
                border="1px solid green"
                p="5px"
              >
                <Box>
                  Promo Code applied: <b>{promoCodeData.code}</b>
                </Box>
                <Tooltip label="Remove" placement="top">
                  <DeleteIcon
                    color="red.500"
                    cursor="pointer"
                    onClick={removePromocode}
                    fontSize="16px"
                  />
                </Tooltip>
              </Box>
            ) : (
              <Text color="red.500" fontWeight="bold" alignItems="left">
                Promocode not valid
              </Text>
            )
          ) : null}
        </Box>

        <Box
          spacing="1rem"
          boxShadow="md"
          borderRadius="xl"
          overflow="hidden"
          p="0"
        >
          <Box
            color="brand.redAccent"
            bg="brand.redAccentLight"
            fontWeight='bold'
            height="50px"
            display="flex"
            alignItems="center"
          >
            <Text fontSize="large" marginLeft="20px">
              Cart Summary
            </Text>
          </Box>
          {/* Price Details */}
          <Box p="1rem" backgroundColor="white">
            <Text fontWeight="bold" fontSize="sm" mb="1.5rem">
              PRICE DETAILS ({items.length} item{items.length > 1 ? "s" : ""})
            </Text>
            <VStack spacing="1rem" alignItems="flex-start">
              <Box display="flex" width="100%" justifyContent="space-between">
                <Text>Total MRP</Text>
                <Text>₹{total}</Text>
              </Box>
              <Box display="flex" width="100%" justifyContent="space-between">
                <Text>Discount on MRP</Text>
                <Text color="green.500">- ₹{initialDiscount}</Text>
              </Box>
              <Box display="flex" width="100%" justifyContent="space-between">
                <Text>Promocode savings </Text>
                <Text color="green.500">₹ {promoDiscount}</Text>
              </Box>
              <Box display="flex" width="100%" justifyContent="space-between">
                <Text>GST </Text>
                <Text>+ ₹{gst}</Text>
              </Box>
              <Divider marginTop="10px" />
              <Box display="flex" width="100%" justifyContent="space-between">
                <Text fontWeight="bold">Total Amount</Text>
                <Text fontWeight="bold">₹{topay}</Text>
              </Box>
            </VStack>
            {/* Place Order Button */}
            <ButtonX
              w="100%"
              mt="3rem"
              borderRadius="5px"
              onClick={_checkout}
              disabled={!isAuthenticated}
            >
              {" "}
              Place Order{" "}
            </ButtonX>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export const FinalSubscriptionCheckout = ({ userAddresses, subscription, currentPackage, renew, centerId }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { promoCodeData } = useSelector((state) => ({
    promoCodeData: state.cart.promoCodeData,
  }));

  const {
    cartAnalysis: { wallet },
  } = useCart();

  const { getPackageContent } = useAppContext();
  const {finalSubscriptionPrice} = useCart()

  const {topay} = useMemo(() => {
    if(currentPackage && subscription){
        return finalSubscriptionPrice(currentPackage, subscription)
    } return {}
}, [currentPackage, finalSubscriptionPrice, subscription])

  const history = useHistory();

  const terms = useMemo(() => {
    if(currentPackage){
      const obj = {terms:currentPackage.terms, name:bilingualText(currentPackage.name), centers:currentPackage.centers}
      return [obj]
    } return []
  }, [currentPackage])

  const { _checkout } = usePaymentVerify({
    onSuccess: (data, orderId, resp) => {
      toast({
        status: "success",
        title: "Payment done",
        description: "Cart packages have been added to your account",
      });

      if (data?.student) {
        data?.student && dispatch(setStudentData(data));
        getPackageContent(data?.student);
      }
      const finalData = !orderId
        ? {
            amount: data.amount,
            status: data.status,
            orderId: data._id,
            packages: map(data.cart?.packages, (p) => {
              return {
                _id: p._id,
                name: p.name?.en,
              };
            }),
          }
        : {
            amount: data.amount,
            status: data.status,
            rOrderId: resp.razorpay_order_id,
            rPaymentId: resp.razorpay_payment_id,
            orderId: orderId,
            packages: map(data.cart?.packages, (p) => {
              return {
                _id: p._id,
                name: p.name?.en,
              };
            }),
          };
      history.push(
        `${ROUTES.SUCCESS_CART}?rpdata=${JSON.stringify(finalData)}`
      );
    },
  });

  const _completeUserAddress = () => {
    toast.closeAll();
    toast({
      status: "error",
      title: "Add a Billing Address",
      description: "Please add a Billing Address to Continue this Purchase",
      duration: 5000,
    });
  };

  const isAuthenticated = useIsAuthenticated();
  const [useWallet, setUseWallet] = useState(false);

  const _thisCheckout = (lang, mode, center) => {
    const data = {
      amount: topay,
      promoCode: promoCodeData?.code,
      lang,
      mode,
      center,
      // New Params
      deliverable: mode === 'offline' ? true : false,
      type: useWallet ? "Wallet" : "Online",
      addressBilling: userAddresses?.userBillingAddress,
      addressShipping: userAddresses?.userShippingAddress,
      uncarted:true,
      packages:[currentPackage._id],
      subscription:{
        renew,
        _id:subscription._id
      }
    }
    // console.log('data', data)
    _checkout(data);
  };

  const handlePaymentProcess = () => {
    if (!userAddresses) {
      _completeUserAddress();
    } else {
      if (terms && terms?.length) {
        setTermsVisible(true);
      } else {
        _thisCheckout();
      }
    }
  };

  const [visible, setTermsVisible] = useState();
  const closeModal = () => {
    setTermsVisible(false);
  };

  const _onAgree = (lang, mode, center) => {
    setTermsVisible(false);
    _thisCheckout(lang, mode, center);
  };

  return (
    <Box>
      <Text as={"h1"} fontSize="2xl" fontWeight="600" mb={4}>
        {" "}
        Checkout{" "}
      </Text>
      <Box display="flex" flexDirection="column">
        <Box>
          <HStack>
            <Text color="text.300" fontWeight="600">
              Total Amount :
            </Text>
            <Spacer />
            <Text fontSize="heading" fontWeight="bolder" fontFamily="monospace">
              {" "}
              {`₹${topay}`}
            </Text>
          </HStack>
        </Box>
        <Box pt={3} width="100%">
          {subscription.mode === 'offline' && !userAddresses?.userShippingAddress ? (
            <Text fontSize="xs" my={2} color="red.500">
              Shipping address is mandatory for offline orders
            </Text>
          ) : null}

          {wallet ? (
            <Box>
              <WalletDetails
                topay={topay}
                useWallet={useWallet}
                setUseWallet={setUseWallet}
              />
            </Box>
          ) : (
            <Box
              p={3}
              m={2}
              fontSize="xs"
              color="gray.500"
              borderRadius={"md"}
              boxShadow="sm"
            >
              Wallet is not enabled in one of your cart items
            </Box>
          )}

          {/* <Text color="red.500" m={3} my={10}>
            शुल्क भुगतान करते समय कृपया HDFC, SBI के Net Banking एवं PAYTM
            Wallet का प्रयोग ना करें। यह सुविधा 4 नवंबर से उपलब्ध होगी। अन्य सभी
            भुगतान माध्यमों से भुगतान की सुविधा उपलब्ध है।
          </Text> */}
          <Button
            size="lg"
            width="100%"
            mt={2}
            disabled={
              !isAuthenticated ||
              (subscription.mode === 'offline' && !userAddresses?.userShippingAddress)
            }
            colorScheme="green"
            onClick={handlePaymentProcess}
          >
            Proceed to pay {useWallet ? "using Wallet " : "online"}
          </Button>
        </Box>
      </Box>
      <TermsConditions
        centerId={centerId}
        subscription={subscription}
        terms={terms}
        visible={visible}
        closeModal={closeModal}
        onAgree={_onAgree}
      />
    </Box>
  );
};

export const FinalCheckout = ({ userAddresses }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { promoCodeData } = useSelector((state) => ({
    promoCodeData: state.cart.promoCodeData,
  }));

  const {
    cartAnalysis: { topay, terms, wallet, isOffline },
  } = useCart();

  const { getPackageContent } = useAppContext();

  const history = useHistory();

  useEffect(() => {})

  const { _checkout } = usePaymentVerify({
    onSuccess: (data, orderId, resp) => {
      toast({
        status: "success",
        title: "Payment done",
        description: "Cart packages have been added to your account",
      });
      dispatch(updateCartData(data));

      if (data?.student) {
        data?.student && dispatch(setStudentData(data));
        getPackageContent(data?.student);
      }
      const finalData = !orderId
        ? {
            amount: data.amount,
            status: data.status,
            orderId: data._id,
            packages: map(data.cart?.packages, (p) => {
              return {
                _id: p._id,
                name: p.name?.en,
              };
            }),
          }
        : {
            amount: data.amount,
            status: data.status,
            rOrderId: resp.razorpay_order_id,
            rPaymentId: resp.razorpay_payment_id,
            orderId: orderId,
            packages: map(data.cart?.packages, (p) => {
              return {
                _id: p._id,
                name: p.name?.en,
              };
            }),
          };
      history.push(
        `${ROUTES.SUCCESS_CART}?rpdata=${JSON.stringify(finalData)}`
      );
    },
  });

  const _completeUserAddress = () => {
    toast.closeAll();
    toast({
      status: "error",
      title: "Add a Billing Address",
      description: "Please add a Billing Address to Continue this Purchase",
      duration: 5000,
    });
  };

  const isAuthenticated = useIsAuthenticated();
  const [useWallet, setUseWallet] = useState(false);

  const _thisCheckout = (lang, mode, center) => {
    _checkout({
      amount: topay,
      promoCode: promoCodeData?.code,
      lang,
      mode,
      center,
      // New Params
      deliverable: isOffline ? true : false,
      type: useWallet ? "Wallet" : "Online",
      addressBilling: userAddresses?.userBillingAddress,
      addressShipping: userAddresses?.userShippingAddress,
    });
  };

  const handlePaymentProcess = () => {
    if (!userAddresses) {
      _completeUserAddress();
    } else {
      if (terms && terms.length) {
        setTermsVisible(true);
      } else {
        _thisCheckout();
      }
    }
  };

  const [visible, setTermsVisible] = useState();
  const closeModal = () => {
    setTermsVisible(false);
  };

  const _onAgree = (lang, mode, center) => {
    setTermsVisible(false);
    _thisCheckout(lang, mode, center);
  };

  return (
    <Box>
      <Text as={"h1"} fontSize="2xl" fontWeight="600" mb={4}>
        {" "}
        Checkout{" "}
      </Text>
      <Box display="flex" flexDirection="column">
        <Box>
          <HStack>
            <Text color="text.300" fontWeight="600">
              Total Amount :
            </Text>
            <Spacer />
            <Text fontSize="heading" fontWeight="bolder" fontFamily="monospace">
              {" "}
              {`₹${topay}`}
            </Text>
          </HStack>
        </Box>
        <Box pt={3} width="100%">
          {isOffline && !userAddresses?.userShippingAddress ? (
            <Text fontSize="xs" my={2} color="red.500">
              Shipping address is mandatory for offline orders
            </Text>
          ) : null}

          {wallet ? (
            <Box>
              <WalletDetails
                topay={topay}
                useWallet={useWallet}
                setUseWallet={setUseWallet}
              />
            </Box>
          ) : (
            <Box
              p={3}
              m={2}
              fontSize="xs"
              color="gray.500"
              borderRadius={"md"}
              boxShadow="sm"
            >
              Wallet is not enabled in one of your cart items
            </Box>
          )}

          {/* <Text color="red.500" m={3} my={10}>
            शुल्क भुगतान करते समय कृपया HDFC, SBI के Net Banking एवं PAYTM
            Wallet का प्रयोग ना करें। यह सुविधा 4 नवंबर से उपलब्ध होगी। अन्य सभी
            भुगतान माध्यमों से भुगतान की सुविधा उपलब्ध है।
          </Text> */}
          <Button
            size="lg"
            width="100%"
            mt={2}
            disabled={
              !isAuthenticated ||
              (isOffline && !userAddresses?.userShippingAddress)
            }
            colorScheme="green"
            onClick={handlePaymentProcess}
          >
            Proceed to pay {useWallet ? "using Wallet " : "online"}
          </Button>
        </Box>
      </Box>
      <TermsConditions
        terms={terms}
        visible={visible}
        closeModal={closeModal}
        onAgree={_onAgree}
      />
    </Box>
  );
};

const TermsConditions = ({ visible, closeModal, terms, onAgree, subscription, centerId }) => {
  const [value, setValue] = useState();
  const [mode, setMode] = useState("online");
  const [centerObj, setCenterObj] = useState();
  const [center, setCenter] = useState();

  useEffect(() => {
    if(subscription){
      const lang = subscription.lang === 'english' ? 'en' : 'hn'
      const {mode} = subscription
      const {centers} = terms?.[0]
      setValue(lang)
      setMode(mode)
      setCenter(centers)
      setCenterObj(find(centers,c => c._id === centerId))
    }
  }, [subscription, terms, centerId])
  const _onAgree = () => {
    onAgree(value, mode, mode === "offline" ? centerObj : undefined);
    setChecked(false);
  };

  const [checked, setChecked] = useState(false);
  
  console.log('terms', terms)
  return (
    <Modal isOpen={visible} size="4xl" onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Terms and conditions</ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody px={10}>
          <Box px={10} mb={30}>
            {map(terms, (t) => {
              const _setCenter = (c) => {
                setCenter(c);
                setCenterObj(find(t.centers, co => co.name === c));
              };
              return (
                <Box p={3}>
                  <Text fontSize="lg" color="green.400">
                    {t?.pkgName}
                  </Text>
                  <Divider my={2} />
                    <Heading size="sm">Fee is not refundable once the package is purchased.</Heading>
                  <Divider my={2} />
                  <Flex>
                    {t.terms?.en ? (
                      <Box
                        as={"pre"}
                        fontSize="sm"
                        flex={1}
                        p={3}
                        sx={{
                          "white-space": "-moz-pre-wrap",
                          "white-space": "-o-pre-wrap",
                          "word-wrap": "break-word",
                          "white-space": "pre-wrap",
                        }}
                        color="gray.700"
                        dangerouslySetInnerHTML={{
                          __html: t.terms?.en,
                        }}
                      ></Box>
                    ) : null}
                    {t.terms?.hn ? (
                      <Box
                        as="pre"
                        fontSize="xs"
                        flex={1}
                        p={3}
                        sx={{
                          "white-space": "-moz-pre-wrap",
                          "white-space": "-o-pre-wrap",
                          "word-wrap": "break-word",
                          "white-space": "pre-wrap",
                        }}
                        color="gray.700"
                        dangerouslySetInnerHTML={{
                          __html: t.terms?.hn,
                        }}
                      ></Box>
                    ) : null}
                  </Flex>
                  {t.centers && t.centers.length ? (
                    <Box my={10}>
                      <Text color="orange.400">Please Select Mode</Text>
                      <RadioGroup onChange={setMode} value={mode}>
                        <Stack direction="row">
                          <Radio disabled={subscription} value="offline">Offline</Radio>
                          <Radio disabled={subscription} value="online">Online</Radio>
                        </Stack>
                      </RadioGroup>
                      {mode === "offline" ? (
                        <Box my={3}>
                          <Text color="orange.400">Please Select Center</Text>

                          <RadioGroup onChange={_setCenter} value={centerObj?.name}>
                            <Stack direction="column">
                              {map(t.centers, (c) => {
                                return (
                                  <Radio my={1} value={c.name}>
                                    <Box>
                                      <Text>{c.name}</Text>
                                      <Text fontSize={"sm"}>{c.address}</Text>
                                    </Box>
                                  </Radio>
                                );
                              })}
                            </Stack>
                          </RadioGroup>
                        </Box>
                      ) : null}
                    </Box>
                  ) : null}
                </Box>
              );
            })}
            {!subscription ? 
              <>
                <Text color="orange.400">
                  Please provide your language preference
                </Text>
                <RadioGroup onChange={setValue} value={value}>
                  <Stack direction="row">
                    <Radio value="hn">Hindi</Radio>
                    <Radio value="en">English</Radio>
                  </Stack>
                </RadioGroup>
              </>
              :
              <>
              <Text color="orange.400">
                Selected language
              </Text>
              <RadioGroup onChange={setValue} value={value}>
                <Stack direction="row">
                  <Radio disabled={true} value="hn">Hindi</Radio>
                  <Radio disabled={true} value="en">English</Radio>
                </Stack>
              </RadioGroup>
              </>
            }
            <Checkbox
              my={5}
              isChecked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
              }}
            >
              I have read and accept these terms and conditions
            </Checkbox>{" "}
            <Button
              size="lg"
              width="100%"
              disabled={!checked || !value}
              mt={2}
              colorScheme="green"
              onClick={_onAgree}
            >
              Agree and pay
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const WalletDetails = ({ topay, useWallet, setUseWallet }) => {
  const dispatch = useDispatch();
  const wallet = useSelector((s) => s.wallet.wallet);
  const status = useSelector((s) => s.wallet.getWalletStatus);

  useEffect(() => {
    dispatch(requestUserWalletAction());
  }, [dispatch]);

  const enabled = useMemo(
    () => wallet?.balance && wallet?.balance > topay,
    [topay, wallet?.balance]
  );

  useEffect(() => {
    if (!enabled) {
      setUseWallet(false);
    }
  }, [enabled, setUseWallet]);

  return (
    <Box
      position="relative"
      p={4}
      filter={!enabled && "grayscale(2)"}
      m={4}
      borderRadius={"md"}
      boxShadow="sm"
      border="0.6px solid #dadada"
    >
      <Checkbox
        colorScheme={"green"}
        size="lg"
        isChecked={useWallet}
        onChange={(e) => setUseWallet(e.target.checked)}
      >
        {!enabled ? (
          <Text fontSize="sm" color="gray.800">
            Your wallet balance is low
          </Text>
        ) : (
          <Text fontSize="sm" color="gray.800">
            Use Your Wallet Balance
          </Text>
        )}
        <Heading color="green.600" fontSize="sm">
          {status === STATUS.FETCHING
            ? "Loading "
            : ` Rs. ${wallet?.balance || 0}`}
        </Heading>
      </Checkbox>
      {!enabled || status === STATUS.FETCHING ? (
        <Flex
          pos="absolute"
          top={0}
          bottom={0}
          left={0}
          justifyContent="center"
          alignItems="center"
          right={0}
          backgroundColor="rgba(255,255,255,0.4)"
        >
          {status === STATUS.FETCHING ? <Spinner size="lg" /> : null}
        </Flex>
      ) : null}
    </Box>
  );
};

const ItemsList = ({ items, remove, moveToWishlist }) => {
  const changeQuantity = () => {};

  return (
    <Box bg="white" p={4}>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        marginBlock="0.5rem"
      >
        <Text>
          MY CART ({items.length} ITEMS{items.length > 1 ? "s" : ""})
        </Text>
        {/* <Text>TOTAL: {items.reduce((t, i) => t + i.price, 0)}</Text> */}
      </Box>
      <Divider />
      <br />
      {items.map((item, i) => {
        const { price, offer } = getPackagePrice(item);
        const carousel =
          (offer && size(offer.carousel) && offer.carousel) ||
          (size(item.carousel) && item.carousel);

        const imgUrl = carousel && carousel[0];

        {
          /* const price = offer ? offer.price : item.price;
        const fakePrice = offer ? offer.fakePrice : item.fakePrice; */
        }
        const quantityOptions = Array.from({ length: 9 }, (_, i) => ++i);
        return (
          <Box
            border="1px solid #E5E7E9"
            marginTop="1rem"
            key={i}
            bg="white"
            p="1rem"
            borderRadius={3}
          >
            <Wrap key={i} spacing="30px" alignItems="flex-start">
              {/* Image */}
              <WrapItem w={["100%", "30%", "30%"]} justifyContent="center">
                <Flex
                  justifyContent="center"
                  bg="white"
                  p={1}
                  border="1px solid #F2F3F4"
                  overflow="hidden"
                >
                  <Image
                    width="100%"
                    height="100px"
                    borderRadius="0"
                    objectFit="cover"
                    src={imgUrl}
                    fallbackSrc={
                      "https://via.placeholder.com/100x100.png?text=%20"
                    }
                  />
                </Flex>
              </WrapItem>

              <WrapItem w={["100%", "60%", "60%"]}>
                {/* Name + Description */}
                <Box flexGrow={1}>
                  <VStack align="stretch">
                    <Flex justifyContent="space-between" flexWrap="wrap">
                      <Text color="text.300" fontSize="" fontWeight="bolder">
                        {item.name.en}
                      </Text>
                      <Text fontSize="lg" p={0}>
                        ₹ {price}
                      </Text>
                    </Flex>
                    <Text
                      noOfLines="1"
                      fontSize="12px"
                      color="#3C4043EA"
                      dangerouslySetInnerHTML={{ __html: item.description.en }}
                    />
                    <Wrap spacing="1rem" width="100%">
                      {/* <Box>
                        <Select w='70px' background='#EDF2F7' onChange={changeQuantity} size='sm'>
                          {quantityOptions?.map(opt => 
                            <option key={opt}>{opt}</option>
                          )}
                          <option key='10'>10+</option>
                        </Select>
                      </Box> */}
                      <WrapItem>
                        <Button
                          border="1px solid #CCD1D1"
                          rightIcon={<AiOutlineHeart />}
                          size="xs"
                          borderRadius={0}
                          fontWeight="light"
                          onClick={() => moveToWishlist(item._id)}
                        >
                          Move to Wishlist
                        </Button>
                      </WrapItem>
                      <WrapItem>
                        <Button
                          border="1px solid #CCD1D1"
                          rightIcon={<AiOutlineDelete />}
                          size="xs"
                          borderRadius={0}
                          fontWeight="light"
                          // boxShadow="0 0 10px 0px rgba(0,0,0,0.1)"
                          onClick={() => remove(item._id)}
                        >
                          Remove
                        </Button>
                      </WrapItem>
                    </Wrap>
                  </VStack>
                </Box>
              </WrapItem>
            </Wrap>
          </Box>
        );
      })}
    </Box>
  );
};

const ItemsTable = ({ items, remove }) => {
  const borderStyle = {
    border: "1px solid #cacaca",
    textAlign: "left",
  };
  return (
    <Box boxShadow="md" borderRadius="lg" bg="white" p="1.5rem">
      <Table size="md">
        <Thead>
          <Tr>
            <Th {...borderStyle} bg="gray.100">
              Package
            </Th>
            <Th {...borderStyle} bg="gray.100">
              Price
            </Th>
            <Th {...borderStyle} bg="gray.100">
              Action
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, i) => {
            return (
              <Tr key={i}>
                <Td {...borderStyle}>
                  <Box display="flex" alignItems="center">
                    {item.carousel?.length ? (
                      <Box flex={1} p={2}>
                        <Box border="1px solid #AEB6BF" p="1">
                          <Image
                            width="100%"
                            border="1px solid #D6DBDF"
                            objectFit="cover"
                            src={
                              item.carousel[0] ||
                              "https://via.placeholder.com/200x200.png?text=CO+CO"
                            }
                          />
                        </Box>
                      </Box>
                    ) : null}
                    <Box flex={4} p={2}>
                      <b>{item.name.en}</b>
                      <br />
                      <Text fontSize="sm" isTruncated noOfLines={2}>
                        {item.description?.en}
                      </Text>
                    </Box>
                  </Box>
                </Td>
                <Td {...borderStyle}>
                  <div style={{ display: "flex", alignItems: "top" }}>
                    <Text>
                      <b>₹{item.price}</b>
                    </Text>
                    <BsFillTagFill
                      style={{ fontSize: "18px", margin: "0 5px" }}
                    />
                  </div>
                  <Text color="#808B96" fontSize="sm" as="del">
                    ₹{item.fakePrice}
                  </Text>
                </Td>
                <Td {...borderStyle}>
                  <Button
                    variant="ghost"
                    colorScheme="red"
                    size="xs"
                    onClick={() => remove(item._id)}
                  >
                    Remove
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};
