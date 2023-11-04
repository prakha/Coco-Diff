import { useToast } from "@chakra-ui/toast";
import React from "react";
import { useSelector } from "react-redux";
import { LoadingRef } from "../../App/AppProvider";
import { apis } from "../../services/api/apis";

export const usePaymentVerify = ({ mode = "cart", onSuccess }) => {
  const toast = useToast();
  const user = useSelector((s) => s.user.user);

  const _verify = async (resp, orderId) => {
    const response = await apis.verifyOrderPaymentApi({
      response: resp,
      orderId,
    });
    const { ok, data, status } = response;
    if (ok && data) {
      if (data.status === "Success") {
        onSuccess && onSuccess(data, orderId, resp);
        // history.push(ROUTES.ORDER);
      } else {
        console.log("verifyOrderPaymentApi Failed");
      }
    } else {
      toast({
        status: "error",
        title: "Payment error",
      });
    }
  };

  const _checkout = async (payload) => {
    if (mode === "cart" && payload.type ==="Wallet") {
      return _checkoutWallet(payload);
    }
    LoadingRef.current.show();
    // Order will be Created
    // console.log({ payload, mode });
    const api =
      mode === "cart" ? apis.checkoutOrderApi : apis.checkoutWalletOrderApi;
    const { ok, data } = await api(payload);
    LoadingRef.current.hide();

    console.log('data', data, payload, mode)
    if (ok) {
      const { payment, razorpay } = data;
      const orderId = payment.txnId;

      const paymentData = payment.data;
      //   console.log("responsedd", data, paymentData.amount, paymentData.currency);

      const options = {
        key: razorpay.keyId, // Enter the Key ID generated from the Dashboard
        amount: paymentData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: paymentData.currency,
        name: "Competition Community",
        description:
          mode === "cart" ? "Purchase Payment" : "Wallet Load Payment",
        image: "https://student.competitioncommunity.com/logo_white.png",
        order_id: razorpay.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response) {
          console.log("rzp response", { response });
          _verify(response, orderId);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.contact,
        },
        notes: { address: "Competition Community" },
        theme: { color: "#3399cc" },
      };

      const rzpClient = new Razorpay(options);
      rzpClient.on("payment.failed", function (response) {
        console.log("failed", response);

        toast({
          status: "error",
          title: "Payment failed, Retry or cancel",
          description: response.error.reason,
          duration: 3000,
          position: "bottom-right",
        });

        _verify(response, orderId);
      });
      rzpClient.open();
    } else {
      toast({
        status: "error",
        title: data?.message,
        position: "top",
      });
    }
  };

  const _checkoutWallet = async (payload) => {
    LoadingRef.current.show();

    const api = apis.purchaseUsingWallet;
    const { ok, data } = await api(payload);
    LoadingRef.current.hide();

    if (ok && data) {
      if (data.status === "Success") {
        onSuccess && onSuccess(data);
      } else {
        console.log("Wallet Payment Failed");
        toast({
            status:"error",
            title:data?.message || "Wallet payment failed",        
            position:"bottom-right"
        })
      }
    } else {
      toast({
        status: "error",
        title: "Payment error",
      });
    }
  };

  return {
    _checkout,
  };
};
