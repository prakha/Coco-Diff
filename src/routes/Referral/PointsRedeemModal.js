import { Button } from '@chakra-ui/button'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Box, Code, HStack, Text } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { useToast } from '@chakra-ui/toast'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../../App/Constants'
import { redeemPointsAction, resetRedeemPoints } from '../../redux/reducers/wallet'

export const PointsRedeemModal = ({visible, closeModal, availablePoints}) => {
    const dispatch = useDispatch()
    const toast = useToast()

    const {myReferral, redeemPointsStatus} = useSelector(state => ({
        myReferral:state.wallet.myReferral.myReferral,
        redeemPointsStatus:state.wallet.redeemPointsStatus
    }))

    const [points, changePoints] = useState(0)
    const [walletPoints, changeWalletPoint] = useState(0)

    useEffect(() => {
        return () => dispatch(resetRedeemPoints())
    }, [dispatch])

    useEffect(() => {
        if(redeemPointsStatus === STATUS.SUCCESS){
            toast({title:'Points Redeemed!', status:'success'})
            closeModal()
        }
    }, [closeModal, redeemPointsStatus, toast])

    const handleRedeem = (e) => {
        e.preventDefault()

        if(points < 50)
            toast({title:"can't redeem less then 50 points", status:'error' })
        else
            dispatch(redeemPointsAction({points}))
    }

    const handlePoints = (e) => {
        let pnts = parseInt(e.target.value, 10)

        if(pnts){
            if(pnts <= availablePoints){
                changePoints(pnts)
                changeWalletPoint(pnts/2)
            }
            else{
                changePoints(availablePoints)
                changeWalletPoint(availablePoints/2)
            }
        }else{
            changePoints('')
            changeWalletPoint('')
        }
    }

    return(
        <Modal isOpen={visible} onClose={closeModal} size='xl'>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Redeem Referral Points</ModalHeader>
                <ModalCloseButton/>
                <form onSubmit={handleRedeem}>
                    <ModalBody>
                        <Box>
                            <Code color='brand.secondary'>2 Points = 1 Wallet Balance</Code>
                            <Code color='brand.secondary'>You can't redeem less then 50 points</Code>
                            <br/><br/>
                            <HStack mb={2}>
                                <Text>Available Points: </Text>
                                <Text fontSize={22} color='brand.secondary' fontWeight='bold'>{availablePoints}</Text>
                            </HStack>
                            <FormControl>
                                <FormLabel>Referral Points</FormLabel>
                                <Input type='number' onChange={handlePoints} value={points} placeholder='points you want to redeem' min={0} max={101}  />
                                {walletPoints ? <Text color='brand.secondary'>converted wallet points = {walletPoints}</Text> : null}
                            </FormControl>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <HStack>
                            <Button>Close</Button>
                            <Button type='submit' isLoading={redeemPointsStatus === STATUS.FETCHING} colorScheme='blue'>Redeem</Button>
                        </HStack>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}