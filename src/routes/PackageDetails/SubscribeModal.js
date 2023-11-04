import { Box, Button, Divider, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tag, Text, VStack } from '@chakra-ui/react'
import { capitalize } from 'lodash'
import React, { useMemo } from 'react'
import { useCart } from '../../Cart/useCart'
import { bilingualText } from '../../utils/Helper'
import { cocoWebisteUrl } from '../../BaseUrl'

export const SubscribeModal = ({ visible, closeModal, packageData, subscription, renew, center }) => {
    const { finalSubscriptionPrice, goToCheckout } = useCart()

    const { price, fakePrice, discount, topay, gst } = useMemo(() => {
        if (packageData && subscription) {
            return finalSubscriptionPrice(packageData, subscription)
        } return {}
    }, [packageData, subscription, finalSubscriptionPrice])

    console.log('subscription', subscription)
    const _checkout = () => {
        window.open(`${cocoWebisteUrl}/checkout?id=${packageData._id}&subId=${subscription._id}`)
        // goToCheckout({packageId:packageData._id, subscriptionId:subscription._id, renew, centerId:center?._id})
    }

    return (
        <Modal size={'xl'} isOpen={visible} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader >
                    PRICE DETAILS
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box>
                        <Text>{bilingualText(packageData.name)}</Text>

                        <HStack mt={4} spacing={6}>
                            <HStack>
                                <Text fontWeight={'bold'}>Mode: </Text>
                                <Tag>{capitalize(subscription.mode)}</Tag>
                            </HStack>
                            <HStack>
                                <Text fontWeight={'bold'}>Language: </Text>
                                <Tag>{capitalize(subscription.lang)}</Tag>
                            </HStack>
                            {subscription.mode === 'offline' && center &&
                                <HStack>
                                    <Text fontWeight={'bold'}>Center: </Text>
                                    <Tag>{center.name}</Tag>
                                </HStack>
                            }
                        </HStack>
                    </Box>
                    <br />
                    <Box
                        spacing="1rem"
                        // boxShadow="md"
                        borderRadius="xl"
                        overflow="hidden"
                        p="0"
                    >
                        <Box p="1rem" backgroundColor="white">
                            <VStack spacing="1rem" alignItems="flex-start">
                                <Box display="flex" width="100%" justifyContent="space-between">
                                    <Text>Total MRP</Text>
                                    <Text>₹{fakePrice || price}</Text>
                                </Box>
                                {packageData.subRegistrationFee &&
                                    <Box display="flex" width="100%" justifyContent="space-between">
                                        <Text>Registration Fees </Text>
                                        <Text>+ ₹{packageData.subRegistrationFee}</Text>
                                    </Box>
                                }
                                {/* <Box display="flex" width="100%" justifyContent="space-between">
                                    <Text>Promocode savings </Text>
                                    <Text color="green.500">₹ {promoDiscount}</Text>
                                </Box> */}
                                <Box display="flex" width="100%" justifyContent="space-between">
                                    <Text>GST {packageData.gst ? (packageData.gst + '%') : null}</Text>
                                    <Text>+ ₹{gst}</Text>
                                </Box>
                                <Box display="flex" width="100%" justifyContent="space-between">
                                    <Text>Discount on MRP</Text>
                                    <Text color="green.500">- ₹{discount}</Text>
                                </Box>
                                <Divider marginTop="10px" />
                                <Box display="flex" width="100%" justifyContent="space-between">
                                    <Text fontWeight="bold">Total Amount</Text>
                                    <Text fontWeight="bold">₹{topay}</Text>
                                </Box>
                            </VStack>
                        </Box>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <HStack>
                        <Button size={'sm'} onClick={closeModal}>Cancel</Button>
                        <Button size={'sm'} colorScheme={'red'}
                            onClick={_checkout}
                        // disabled={!isAuthenticated}
                        >
                            Proceed to Checkout
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}