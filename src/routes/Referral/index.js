import { Button, IconButton } from '@chakra-ui/button'
import { Image } from '@chakra-ui/image'
import { Box, Flex, HStack, Link, SimpleGrid, Text, VStack } from '@chakra-ui/layout'
import { useToast } from '@chakra-ui/toast'
import { Tooltip } from '@chakra-ui/tooltip'
import React, { useEffect, useState } from 'react'
import { AiOutlineCopy, AiOutlineShareAlt } from 'react-icons/ai'
import { FaWhatsappSquare } from 'react-icons/fa'
import { IoLogoWhatsapp } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../App/Constants'
import { BaseURL } from '../../BaseUrl'
import { Empty } from '../../Components/Empty'
import { ErrorChecker } from '../../Components/ErrorChecker'
import { SectionHeader } from '../../Components/SectionHeader'
import { getReferralAction } from '../../redux/reducers/wallet'
import { PointsRedeemModal } from './PointsRedeemModal'

export const Referral = () => {
    const dispatch = useDispatch()

    const {getReferralStatus} = useSelector(state => ({
        getReferralStatus:state.wallet.getReferralStatus,
    }))

    useEffect(() => {
        dispatch(getReferralAction())
    }, [dispatch])

    return(
        <Box>
            <SectionHeader title='Referrals' breadcrumbs={[{title : "Home", link: "/"}, {title : "Referral", link: "#"}]} />
            <ErrorChecker status={getReferralStatus}>
                {getReferralStatus === STATUS.SUCCESS ? 
                    <Box>
                        <Flex alignItems='stretch' wrap='wrap'>
                            <ReferalBox/>

                            <MyRewards/>

                            {/* <VStack ml={3} align='stretch'>
                                <Text>three</Text>
                            </VStack> */}
                        </Flex>
                    </Box>
                    :
                    <Empty />
                }
            </ErrorChecker>
        </Box>
    )
}

const MyRewards = () => {
    const blue = 'brand.redAccent'
    const {myReferral} = useSelector(state => ({
        myReferral:state.wallet.myReferral
    }))

    const offerCard = (ref) => {
        return(
            <VStack key={ref._id} boxShadow='0px 2px 6px #C7C7C740' borderRadius={10} border='1px solid #4285F440' p={3}>
                <Text fontSize={23} color='gray.700' fontWeight='bold'>{ref.pointsEarned}</Text>
                <Text fontSize={14} textAlign='center'>{ref.kind === 'Redeemed' ? 'Redeemed' : `You won invite by ${ref.user?.name}`}</Text>
            </VStack>
        )
    }

    return(
        <Box p={3} w={['100%', '100%', '40%']}>
            <VStack borderRadius={15} boxShadow='md' align='stretch'>
                <HStack p={5} justifyContent='space-between' background={blue} borderTopRadius={15} color='white'>
                    <Box>
                        <Text fontSize={16}>My Rewards</Text>
                        <Text fontSize={27} fontWeight={600}>{myReferral.totalPointsEarned || 0} Points</Text>
                        <Text fontSize={18}>Total Rewards</Text>
                    </Box>
                    <Box>
                        <Image src='/images/winners.svg' width={[120, 120, 120, 180]}/>
                    </Box>
                </HStack>
                <Box>
                    <SimpleGrid p={5} height={402} id='scroll-bar' overflow='auto' columns={[1, 2]} spacing={6}>
                        {myReferral.referrals?.length ? 
                            _.orderBy(myReferral.referrals, ['_id'], ['desc']).map(ref => 
                                offerCard(ref)
                            )
                            :
                            <Text color='brand.secondary'>No Rewards</Text>
                        }
                    </SimpleGrid>
                </Box>
            </VStack>
        </Box>
    )
}

const ReferalBox = () => {
    const blue = 'brand.redAccent'
    const toast = useToast()

    const {myReferral} = useSelector(state => ({
        myReferral:state.wallet.myReferral
    }))

    const [redeemModal, openRedeemModal] = useState()

    const handleCopyCode = () => {
        navigator.clipboard.writeText(myReferral.code)
        toast({title:'copied', status:'success'})
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${window.host}?referral=${myReferral.code}`)
        toast({title:'copied', status:'success'})
    }

    const handleRedeem = () => {
        openRedeemModal(!redeemModal)
    }

    const availablePoints = myReferral.totalPointsEarned ? myReferral.totalPointsEarned - (myReferral.totalPointsRedeemed || 0) : 0

    return(
        <Box p={3} w={['100%', '100%', '60%']}>
            <VStack borderRadius={15} boxShadow='md' align='stretch'>
                <HStack p={5} justifyContent='space-between' background={blue} borderTopRadius={15} color='white'>
                    <Box>
                        <HStack wrap='wrap'  align='center'>
                            <Text fontSize={22}>Available points </Text>
                            <Text color='brand.yellow' fontSize={32}>
                                {availablePoints}
                            </Text>
                            <Button size='sm' onClick={handleRedeem} variant='outline' color='white'>Redeem</Button>
                        </HStack>
                        <Text fontSize={27}>Refer and Earn Code</Text>
                    </Box>
                    <Box>
                        <Image src='/images/referral.svg' w={[150,150,150,240]} />
                    </Box>
                </HStack>
                <Box p={5}>
                    <Text fontSize={22} color='brand.secondary' textAlign='center'>Invite your friends and earn rewards!!</Text><br/>
                    <Text fontSize={18} textAlign='center'>Your Referral Code</Text>
                    {myReferral ? 
                        <HStack align='baseline' wrap='wrap' mt={4} spacing={6} border='3px dashed #3498DB' justifyContent='space-between' 
                            borderRadius={15} p={4} background='#EBF5FB'
                        >
                            {/* <Text color='brand.secondary' fontSize={18}>Referral Code:</Text> */}
                            <Text fontSize={[30, 30, 30, 36]} color='#34495E' fontWeight={600}>{myReferral.code}</Text>
                            <HStack spacing={6}>
                                {/* <Tooltip label='copy' placement='top'>
                                    <IconButton onClick={handleCopyCode} color='#85929E' variant='link' 
                                        icon={<AiOutlineShareAlt fontSize={36}/>}
                                    ></IconButton>
                                </Tooltip> */}
                                <Tooltip label='copy' placement='top'>
                                    <IconButton onClick={handleCopyCode} fontSize={[30, 30, 30, 36]} color='brand.blue' variant='link' 
                                        icon={<AiOutlineCopy/>}
                                    ></IconButton>
                                </Tooltip>
                            </HStack>
                        </HStack>
                        :
                        null
                    }
                    <Text my={6} fontSize={20} textAlign='center'>OR</Text>
                    <HStack align='baseline' wrap='wrap' alignItems='center' spacing={6} border='3px dashed #3498DB' justifyContent='space-between' 
                        borderRadius={15} p={4} background='#EBF5FB'
                    >
                        {/* <Text color='brand.secondary' fontSize={18}>Referral Code:</Text> */}
                        <Text fontSize={[16, 16, 16, 20]} color='#34495E' fontWeight={600}>
                            {`${window?.location.host}?referral=${myReferral.code}`}
                        </Text>
                        <HStack spacing={6}>
                            {/* <Tooltip label='copy' placement='top'>
                                <IconButton onClick={handleCopyCode} color='#85929E' variant='link' 
                                    icon={<AiOutlineShareAlt fontSize={36}/>}
                                ></IconButton>
                            </Tooltip> */}
                            <Tooltip label='copy' placement='top'>
                                <IconButton onClick={handleCopyLink} fontSize={[30, 30, 30, 36]} color='#3498DB' variant='link' 
                                    icon={<AiOutlineCopy/>}
                                ></IconButton>
                            </Tooltip>
                        </HStack>
                    </HStack>
                    <br/>
                    {/* <VStack justify='center' cursor='pointer' borderRadius={6} border='1px solid #9FFFC5' background='#E6FFF0' height={108} w={141}>
                        <FaWhatsappSquare fontSize={38} color='#25D366'/>
                        <Text fontSize={14}>Whatsapp</Text>
                    </VStack> */}
                </Box>
            </VStack>
            {redeemModal ? <PointsRedeemModal availablePoints={availablePoints} visible={redeemModal} closeModal={handleRedeem} /> : null}
        </Box>
    )
}