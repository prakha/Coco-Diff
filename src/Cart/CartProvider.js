import { useToast } from "@chakra-ui/react";
import { find, omitBy, reduce } from "lodash";
import React, { useEffect, useState } from "react";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useIsAuthenticated } from "../App/Context";
import { useLoginModal } from "../App/useLoginModal";
import CartContext from "./useCart";

export const addToCart = (item, toast) => {
  // Expect an id of the package
  let cart = getCart();
  cart.push(item);
  cart = JSON.stringify(cart);
  localStorage.setItem("userCart", cart);
  toast.closeAll();
  toast({
    title: "Item Added.",
    description: "Your item is added to The Cart.",
    status: "success",
    duration: 2000,
    isClosable: true,
  });
};

export const removeFromCart = (item, toast) => {
  // Expect an id of the package
  let cart = getCart();
  if (cart.includes(item)) {
    cart.pop(item);
  }
  cart = JSON.stringify(cart);
  localStorage.setItem("userCart", cart);
  toast.closeAll();
  toast({
    title: "Item Removed.",
    description: "Your item is removed from The Cart.",
    status: "error",
    duration: 2000,
    isClosable: true,
  });
};

export const getCart = () => {
  return typeof window === "undefined"
    ? null
    : JSON.parse(localStorage.getItem("userCart")) ?? [];
};

export const CartProvider = ({ children }) => {
  // const [packagesData, setPackagesData] = useState([]);

  const { student } = useSelector((s) => ({
    student: s.user.student,
  }));

  // const cartAnalysis = cartSelector(cart);

  // useEffect(() => {
  //   if (packages?.length && cart.userCart) {
  //     const final = packages.filter((pkg) => {
  //       return _.find(cart.userCart.packages, (p) => p._id === pkg._id)
  //         ? true
  //         : false;
  //     });
  //     setPackagesData(final);
  //   } else {
  //     setPackagesData([]);
  //   }
  // }, [packages, cart.userCart]);

  // const isAuthenticated = useIsAuthenticated();
  // const history = useHistory();

  // const dispatch = useDispatch();

  // const { toggleLoginModal } = useLoginModal();

  // const toast = useToast();

  const isPackagePurchased = useCallback(
    (pkgId) => {
      if (student?.packages?.length) {
        return find(
          student?.packages,
          (p) => (p.package?._id || p.package) === pkgId
        )
          ? true
          : false;
      }
    },
    [student?.packages]
  );
  // const addPackageToCart = useCallback(
  //   (pid, callback) => {
  //     if (isAuthenticated) {
  //       if (isPackagePurchased(pid)) {
  //         toast({
  //           status: "info",
  //           title: "Already purchased",
  //         });
  //       } else {
  //         dispatch(addPackageToCartAction({ packageId: pid }));
  //       }
  //       if (callback) {
  //         callback();
  //       }
  //     } else {
  //       // alert("login")
  //       toggleLoginModal();
  //     }
  //   },
  //   [dispatch, isAuthenticated, isPackagePurchased, toast, toggleLoginModal]
  // );

  // const unlockPackage = useCallback(
  //   (packages, callback) => {
  //     if (isAuthenticated) {
  //       dispatch(unlockPackageAction(packages));
  //       if (callback) {
  //         callback();
  //       }
  //     } else {
  //       // alert("login")
  //       toggleLoginModal();
  //     }
  //   },
  //   [dispatch, isAuthenticated, toggleLoginModal]
  // );

  // const removePackageFromCart = useCallback(
  //   (pkgId) => {
  //     setPackagesData((p) => {
  //       let finalPackages = _.filter(p, (pk) => pk._id !== pkgId);
  //       dispatch(
  //         addPackageToCartAction({
  //           packageId: _.map(finalPackages, (pk) => pk._id),
  //         })
  //       );
  //       return finalPackages;
  //     });
  //   },
  //   [dispatch]
  // );

  // const isPackageInCart = useCallback(
  //   (pkgId) => {
  //     if (packagesData?.length) {
  //       return _.find(packagesData, (p) => p._id === pkgId) ? true : false;
  //     }
  //   },
  //   [packagesData]
  // );

  // const goToCheckout = useCallback(
  //   (obj) => {
  //     if (isAuthenticated) {
  //       const data = omitBy(obj, (d) => !d);
  //       const queries = reduce(
  //         data,
  //         (query, val, key) =>
  //           val ? (!query ? `${key}=${val}` : query + `&${key}=${val}`) : "",
  //         ""
  //       );
  //       history.push(`/cart/checkout?${queries}`);
  //     }
  //   },
  //   [isAuthenticated, history]
  // );

  const finalSubscriptionPrice = useCallback((packageData, subscription) => {
    const price = parseInt(subscription.price || 0);
    const fakePrice = parseInt(subscription.fakePrice || 0);
    const registrationFee = parseInt(packageData.subRegistrationFee || 0)

    const finalPrice = price + registrationFee
    let gst = parseInt(packageData.gst || 0);
    gst = (finalPrice * gst) / 100;

    const discount = fakePrice ? fakePrice - price : 0;
    const topay = finalPrice + gst;

    return { discount, finalPrice, fakePrice, topay, gst };
  }, []);

  const contextValue = useMemo(
    () => ({
      finalSubscriptionPrice,
      // cart: cart.userCart,
      // unlockPackage,
      // addPackageToCart,
      // updateCart,
      // removePackageFromCart,
      // isPackageInCart,
      isPackagePurchased,
      // packagesData,
      // cartAnalysis,
      // goToCheckout,
    }),
    [finalSubscriptionPrice, isPackagePurchased]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
