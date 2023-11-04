import { TriangleDownIcon } from '@chakra-ui/icons'
import { Badge, Box, Button, Divider, Flex, HStack, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, VStack } from '@chakra-ui/react'
import { capitalize, filter, last } from 'lodash'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useIsAuthenticated } from '../../App/Context'
import { useLoginModal } from '../../App/useLoginModal'
import { FormReducer } from '../../utils/FormReducer'
import { bilingualText } from '../../utils/Helper'
import { SubscribeModal } from '../PackageDetails/SubscribeModal'
import { DURATION_TYPE, subLanguages, subModes } from '../PackageDetails/SubscriptionPlans'

export const RenewModal = ({ visible, closeModal, lmsData }) => {

    const history = useHistory()
    const examCenters = lmsData?.centers

    const { student, startTrialStatus } = useSelector((state) => ({
        student: state.user.student,
        startTrialStatus: state.user.startTrialStatus
    }))

    const isAuthenticated = useIsAuthenticated()
    const { toggleLoginModal } = useLoginModal()
    const [filters, changeFilters] = useReducer(FormReducer, {})
    const [subscriptionModal, openSubscriptionModal] = useState()

    useEffect(() => {
        if (lmsData?.subscriptions?.length) {
            const lang = last(lmsData.subscriptions).lang
            const mode = last(lmsData.subscriptions).mode
            changeFilters({ type: 'merge', value: { lang, mode } })
        }
    }, [lmsData])

    const subscriptionPlans = useMemo(() => {
        if (lmsData?.subscriptions?.length) {
            return filter(lmsData.subscriptions, s => s.active)
        } return []
    }, [lmsData])

    const filteredPlans = useMemo(() => {
        if (subscriptionPlans?.length) {
            return filter(subscriptionPlans, s => s.mode === filters.mode && s.lang === filters.lang)
        } return []
    }, [subscriptionPlans, filters])

    useEffect(() => {
        if (subscriptionPlans?.length && lmsData) {
            const center = lmsData.centers?.length ? lmsData.centers[0] : null
            if (lmsData.subscriptions?.length) {
                const lang = last(lmsData.subscriptions).lang
                const mode = last(lmsData.subscriptions).mode
                changeFilters({ type: 'merge', value: { lang, mode, center } })
            } else
                changeFilters({ type: 'merge', value: { mode: subscriptionPlans[0].mode, lang: subscriptionPlans[0].lang, center } })
        }
    }, [subscriptionPlans, lmsData])

    const handleChange = (type, value) => {
        changeFilters({ type, value })
    }

    const _subscriptionModal = (plan) => {
        if (isAuthenticated)
            openSubscriptionModal(d => d ? null : plan)
        else
            toggleLoginModal()
    }


    console.log('lmsData', lmsData, filters.lang)
    return (
        <Modal isOpen={visible} size='lg' onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Subscription Plans</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align={'stretch'}>
                        <Box
                            mt={{ base: 20, md: 0 }}
                            borderRadius="md"
                        >
                            <Text color={'blue.500'} fontSize='lg'>{bilingualText(lmsData.name)}</Text>
                            <Flex justifyContent={'space-between'} mt={6}>
                                <Box flex={1}>
                                    <Menu>
                                        <MenuButton size={'sm'} as={Button} borderRadius={15} rightIcon={<TriangleDownIcon />}>
                                            {capitalize(filters.lang) || 'Language'}
                                        </MenuButton>
                                        <MenuList fontSize={'sm'}>
                                            {subLanguages.map((lang, i) =>
                                                <MenuItem onClick={(e) => handleChange('lang', e.target.value)} key={i} value={lang}>{capitalize(lang)}</MenuItem>
                                            )}
                                        </MenuList>
                                    </Menu>
                                </Box>
                                <Box flex={1}>
                                    <Menu>
                                        <MenuButton size={'sm'} as={Button} borderRadius={15} rightIcon={<TriangleDownIcon />}>
                                            {capitalize(filters.mode) || 'Mode'}
                                        </MenuButton>
                                        <MenuList fontSize={'sm'}>
                                            {subModes.map((mode, i) =>
                                                <MenuItem onClick={(e) => handleChange('mode', e.target.value)} key={i} value={mode}>{capitalize(mode)}</MenuItem>
                                            )}
                                        </MenuList>
                                    </Menu>
                                </Box>
                                <Box flex={1}>
                                    {examCenters?.length ?
                                        <Menu>
                                            <MenuButton size={'sm'} as={Button} borderRadius={15} rightIcon={<TriangleDownIcon />}>
                                                {capitalize(filters.center?.name) || 'Center'}
                                            </MenuButton>
                                            <MenuList fontSize={'sm'}>
                                                {examCenters?.map((center, i) =>
                                                    <MenuItem onClick={(e) => handleChange('center', center)} key={i} value={center._id}>{capitalize(center.name)}</MenuItem>
                                                )}
                                            </MenuList>
                                        </Menu>
                                        : null
                                    }
                                </Box>
                            </Flex>
                            <Divider my={4} />
                            <VStack align={'stretch'} spacing={0}>
                                {filteredPlans?.length ?
                                    filteredPlans.map(plan => {
                                        const arr = plan.durationString?.split(/([0-9]+)/)
                                        const duration = arr ? arr[1] : ''
                                        const type = arr && DURATION_TYPE[arr[2]]

                                        const planPrice = plan.price + parseInt(lmsData.subRegistrationFee || 0)
                                        const planFakePrice = plan.fakePrice + parseInt(lmsData.subRegistrationFee || 0)
                                        return (plan.fakePrice ?
                                            <Box key={plan.id}>
                                                <HStack justify={'space-between'}>
                                                    <VStack align={'stretch'} spacing={0}>
                                                        <Box>
                                                            <Badge borderRadius={15} colorScheme={'orange'} variant='solid'>OFFERS</Badge>
                                                        </Box>
                                                        <HStack>
                                                            <Text fontSize={'xl'} fontWeight={'bold'}>&#8377;{planPrice}</Text>
                                                            <HStack spacing={0}>
                                                                <Text fontSize={'md'} color='gray.500'>&#8377;</Text>
                                                                <Text fontSize={'md'} textDecoration="line-through" color='gray.500'>{planFakePrice}</Text>
                                                            </HStack>
                                                            <Text>/</Text>
                                                            <Text fontSize={''} color={'brand.secondary'}>{duration} {type}</Text>
                                                        </HStack>
                                                    </VStack>
                                                    <Button onClick={() => _subscriptionModal(plan)} size={'sm'} borderRadius={15} color='red.600'>Subscribe Now</Button>
                                                </HStack>
                                                <HStack>

                                                </HStack>
                                                <Divider my={4} />
                                            </Box>
                                            :
                                            <Box key={plan.id}>
                                                <HStack justify={'space-between'}>
                                                    <HStack>
                                                        <Text fontSize={'lg'} fontWeight={'bold'}>&#8377;{planPrice}</Text>
                                                        <Text>/</Text>
                                                        <Text fontSize={''} color={'brand.secondary'}>{duration} {type}</Text>
                                                    </HStack>
                                                    <Button onClick={() => _subscriptionModal(plan)} size={'sm'} borderRadius={15} color='red.600'>Subscribe Now</Button>
                                                </HStack>
                                                <Divider my={4} />
                                            </Box>
                                        )
                                    })
                                    :
                                    <Box>
                                        <Text color={'blackAlpha.500'}>No subscription plans available</Text>
                                        <Divider my={4} />
                                    </Box>
                                }
                                {lmsData.gst ?
                                    <HStack justify={'end'}>
                                        <Text color={'blackAlpha.500'} fontSize='xs'>*GST {lmsData.gst}% extra</Text>
                                    </HStack>
                                    :
                                    null
                                }
                            </VStack>
                        </Box>

                        {subscriptionModal &&
                            <SubscribeModal center={filters.center} renew packageData={lmsData} durationType subscription={subscriptionModal} visible={subscriptionModal} closeModal={_subscriptionModal} />
                        }
                    </VStack>
                    <br />
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}