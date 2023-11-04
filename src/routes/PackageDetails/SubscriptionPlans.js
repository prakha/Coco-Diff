import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Badge, Box, Button, Divider, Flex, HStack, Menu, MenuButton, MenuItem, MenuList, Radio, RadioGroup, Text, useToast, VStack } from '@chakra-ui/react'
import { CheckIcon, TriangleDownIcon } from '@chakra-ui/icons'
import _, { capitalize, filter } from 'lodash'
import moment from 'moment'
import { FormReducer } from '../../utils/FormReducer'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useApiRequest } from '../../services/api/useApiRequest'
import { URIS } from '../../services/api'
import { useAppContext, useIsAuthenticated } from '../../App/Context'
import { useLoginModal } from '../../App/useLoginModal'
import { getSinglePackageAction } from '../../redux/reducers/packages'
import { useQueryParams } from '../../utils/useQueryParams'
import { startTrialAction } from '../../redux/reducers/user'
import { STATUS } from '../../Constants'
import { SubscribeModal } from './SubscribeModal'
import { useCheckStatus } from '../../utils/useCheckStatus'

export const subModes = ['online', 'offline']
export const subLanguages = ['english', 'hindi', 'bilingual']
export const DURATION_TYPE = {
    "d": "Days",
    "w": "Weeks",
    "m": "Months",
    "y": "Years"
}

export const SubscriptionPlans = ({ packageData, lmsData }) => {
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
    const [trialAlert, openTrialAlert] = useState()
    const toast = useToast()
    const { getPackageContent } = useAppContext()

    useCheckStatus({
        status: startTrialStatus,
        onSuccess: () => {
            openTrialAlert(false)
            toast({
                status: "success",
                title: "Trial unlocked",
                description: "You can now view courses in trial mode.",
            });
            if (student) {
                // student && dispatch(setStudentData(data));
                getPackageContent(student);
            }
        }
    })

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
            changeFilters({ type: 'reset', value: { mode: subscriptionPlans[0].mode, lang: subscriptionPlans[0].lang, center } })
        }
    }, [subscriptionPlans, lmsData])

    const handleChange = (type, value) => {
        changeFilters({ type, value })
    }

    const trailDuration = useMemo(() => {
        const arr = lmsData?.trial?.active && lmsData.trial.durationString?.split(/([0-9]+)/)
        return arr ? { duration: arr[1], type: arr && DURATION_TYPE[arr[2]] } : {}
    }, [lmsData])

    const _subscriptionModal = (plan) => {
        if (isAuthenticated)
            openSubscriptionModal(d => d ? null : plan)
        else
            toggleLoginModal()
    }

    const isSubscribed = useMemo(() => {
        if (student && lmsData?._id) {
            const packages = student?.packages || [];
            const is = filter(packages, (p) => {
                const pid = typeof p?.package === "string" ? p?.package : p.package?._id;
                return pid === lmsData?._id;
            })?.[0]

            if (is) {
                return true;
            }
        }
        return false;
    }, [student, lmsData?._id]);

    const _goToDashboard = () => {
        let path = ''
        if (lmsData.type === "TEST") {
            path = "/test-packages/" + lmsData._id
        } else if (lmsData.type === "COURSE") {
            path = "/courses"
        }

        history.push('/dashboard' + path)
    }

    const handleTrailAlert = () => {
        if (isAuthenticated)
            openTrialAlert(d => !d)
        else
            toggleLoginModal()
    }

    const packageTrialStatus = useMemo(() => {
        if (lmsData && student?.trials?.length) {
            const trial = _.find(student.trials, t => t.packageId?._id === lmsData._id)
            console.log('trial', trial)
            if (trial)
                return { trial, expired: moment(trial.expiredOn).isBefore(moment()) }
            else
                return false
        } return false
    }, [student, lmsData])

    return isSubscribed ?
        (
            <Box>
                <Text color='brand.green' fontWeight={'bold'}><CheckIcon /> Already Subscribed</Text>
            </Box>
        )
        :
        (
            <VStack width={400} spacing={4} align={'stretch'}>
                <Box
                    p={{ base: 0, md: 6 }}
                    px={{ md: 5 }}
                    mt={{ base: 20, md: 0 }}
                    border={{ base: 0, md: "1px solid #dadada" }}
                    borderRadius="md"
                >
                    <Text textAlign={'center'} mb={6} fontSize={'xl'} fontWeight='bold' color={'blue.400'}>Subscription Plans</Text>
                    <Flex justifyContent={'space-between'}>
                        <Box>
                            <Menu>
                                <MenuButton size={'xs'} as={Button} borderRadius={15} rightIcon={<TriangleDownIcon />}>
                                    {capitalize(filters.lang) || 'Language'}
                                </MenuButton>
                                <MenuList fontSize={'sm'}>
                                    {subLanguages.map((lang, i) =>
                                        <MenuItem onClick={(e) => handleChange('lang', e.target.value)} key={i} value={lang}>{capitalize(lang)}</MenuItem>
                                    )}
                                </MenuList>
                            </Menu>
                        </Box>
                        <Box>
                            <Menu>
                                <MenuButton size={'xs'} as={Button} borderRadius={15} rightIcon={<TriangleDownIcon />}>
                                    {capitalize(filters.mode) || 'Mode'}
                                </MenuButton>
                                <MenuList fontSize={'sm'}>
                                    {subModes.map((mode, i) =>
                                        <MenuItem onClick={(e) => handleChange('mode', e.target.value)} key={i} value={mode}>{capitalize(mode)}</MenuItem>
                                    )}
                                </MenuList>
                            </Menu>
                        </Box>
                        <Box>
                            {filters.mode === 'offline' && examCenters?.length ?
                                <Menu>
                                    <MenuButton size={'xs'} as={Button} borderRadius={15} rightIcon={<TriangleDownIcon />}>
                                        {capitalize(filters.center?.name) || 'Center'}
                                    </MenuButton>
                                    <MenuList fontSize={'sm'}>
                                        {examCenters?.map((center, i) =>
                                            <MenuItem onClick={(e) => handleChange('center', center)} key={i} value={center._id}>
                                                {capitalize(center.name)}
                                            </MenuItem>
                                        )}
                                    </MenuList>
                                </Menu>
                                :
                                null
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
                                                    <Badge borderRadius={15} fontSize={10} colorScheme={'orange'} variant='solid'>OFFERS</Badge>
                                                </Box>
                                                <HStack>
                                                    <Text fontSize={'lg'} fontWeight={'bold'}>&#8377;{planPrice}</Text>
                                                    <HStack spacing={0}>
                                                        <Text fontSize={'sm'} color='gray.500'>&#8377;</Text>
                                                        <Text fontSize={'sm'} textDecoration="line-through" color='gray.500'>{planFakePrice}</Text>
                                                    </HStack>
                                                    <Text>/</Text>
                                                    <Text fontSize={''} color={'brand.secondary'}>{duration} {type}</Text>
                                                </HStack>
                                            </VStack>
                                            <Button onClick={() => _subscriptionModal(plan)} size={'xs'} borderRadius={15} color='red.600'>Subscribe Now</Button>
                                        </HStack>
                                        <Divider my={4} />
                                    </Box>
                                    :
                                    <Box key={plan.id}>
                                        <HStack justify={'space-between'}>
                                            <HStack>
                                                <Text fontSize={'lg'} fontWeight={'bold'}>&#8377;{planPrice}</Text>
                                                <Text>/</Text>
                                                <Text fontSize={'sm'} color={'brand.secondary'}>{duration} {type}</Text>
                                            </HStack>
                                            <Button onClick={() => _subscriptionModal(plan)} size={'xs'} borderRadius={15} color='red.600'>Subscribe Now</Button>
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
                <Button
                    onClick={() => history.push("/package-demo/" + lmsData?._id)}
                    colorScheme='red' variant={'outline'}
                >
                    View Demo
                </Button>
                {trailDuration.duration ?
                    packageTrialStatus ?
                        packageTrialStatus.expired ?
                            <Button onClick={handleTrailAlert} colorScheme='red'>{trailDuration.duration} {trailDuration.type} Trial for Free</Button>
                            :
                            <Button onClick={_goToDashboard} colorScheme='green'>Trial Accessed</Button>
                        :
                        <Button onClick={handleTrailAlert} colorScheme='red'>{trailDuration.duration} {trailDuration.type} Trial for Free</Button>
                    :
                    null
                }

                {subscriptionModal &&
                    <SubscribeModal center={filters.center} packageData={lmsData} durationType subscription={subscriptionModal} visible={subscriptionModal} closeModal={_subscriptionModal} />
                }
                {trialAlert && <StartTrialAlert lmsData={lmsData} isOpen={trialAlert} onClose={handleTrailAlert} />}
            </VStack>
        )
}

const StartTrialAlert = ({ isOpen, duration, onClose, lmsData }) => {
    const dispatch = useDispatch()

    const trailDuration = useMemo(() => {
        const arr = lmsData?.trial?.active && lmsData.trial.durationString?.split(/([0-9]+)/)
        return arr ? { duration: arr[1], type: arr && DURATION_TYPE[arr[2]] } : {}
    }, [lmsData])

    const { student, startTrialStatus } = useSelector((state) => ({
        student: state.user.student,
        startTrialStatus: state.user.startTrialStatus
    }))

    const cancelRef = useRef()
    const formatData = (date) => {
        const offset = date.getTimezoneOffset()
        date = new Date(date.getTime() - (offset * 60 * 1000))
        return date.toISOString().split('T')[0]
    }

    const handleStartTrial = () => {
        const data = { studentId: student?._id, packageId: lmsData?._id, assignedOn: formatData(new Date()), lang: language }
        dispatch(startTrialAction(data))
        // request({method:'PATCH', data})
    }

    const [language, setLanguage] = useState()
    const handleChange = (e) => {
        setLanguage(e)
    }

    const languages = _.map(lmsData?.trial?.lang, (l, k) => k)

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Are you sure you want to unlock the {trailDuration.duration} {trailDuration.type} trial for free ?
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <HStack>
                            <Text>Select Language: </Text>
                            <RadioGroup name='lang' onChange={handleChange}>
                                <HStack>
                                    {languages.map((d, i) => d ?
                                        <Radio value={d === 'english' ? 'en' : 'hn'}>{capitalize(d)}</Radio>
                                        :
                                        null
                                    )}
                                </HStack>
                            </RadioGroup>
                        </HStack>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button disabled={!language} isLoading={startTrialStatus === STATUS.FETCHING} colorScheme='green' onClick={handleStartTrial} ml={3}>
                            Start Trial
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}