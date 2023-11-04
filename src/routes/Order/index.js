
import React, { useReducer, useState, useEffect } from "react";
import { 
  Box, 
  IconButton, 
  Button,
  Skeleton, 
  useDisclosure,   
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  List,
  ListItem,
  HStack,
  Image,
  Text,
  Spacer,
  Link,
  Flex,
 } from "@chakra-ui/react";
import styled from '@emotion/styled'
import {dateDecompose, getMonth} from '../../utils/datehelper'
import { useDispatch, useSelector } from "react-redux";
import { requestUserOrdersAction } from '../../redux/reducers/orders'
import { SectionHeader } from "../../Components/SectionHeader";

import { useTable, usePagination } from 'react-table'
import { STATUS } from "../../App/Constants";
import { ArrowLeftIcon, ArrowRightIcon, DeleteIcon, DownloadIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import { Empty } from "../../Components/Empty";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { bilingualText } from "../../utils/Helper";
import { ROUTES } from "../../Constants/Routes";
import { AiOutlineDownload } from "react-icons/ai";
import { BaseURL } from "../../BaseUrl";

export const Order = (props) => { 

    const dispatch = useDispatch();
    const history = useHistory();
    const [orderData, setOrderData] = useState(null);
    const status = useSelector(s => s)
    const {order} = useSelector((s) => ({
        order: s.order
    }))
    useEffect(()=>{
        dispatch(requestUserOrdersAction());
    }, [])
    // console.log("Orders GET Status = ", order)

    useEffect(()=>{
        if(order.getOrderStatus === STATUS.SUCCESS){
            // console.log("Order API Fetch Successull Data : ", order.userOrder);
            setOrderData(order.userOrder)
        }
    },[order])

    const columns = React.useMemo(
        () => [
          {
            Header: 'S.N.',
            accessor: 'serial_number', 
          },
          {
            Header: 'Amount',
            accessor: 'amount',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Date',
            accessor: 'updatedAt',
          },
          {
            Header: 'Order ID',
            accessor: '_id', 
          },
          {
            Header: 'Items',
            accessor: 'packages',
          },
          
        ],
        []
      )

    const openPkg = (id) => {
      history.push(ROUTES.PACKAGE_DETAILS + "?id=" + id);
    }

    const handleDownloadInvoice = (order) => {
      window.open(BaseURL+'order/invoice/pdf?orderId='+order._id, '_blank')
    }

    return (
        <Box>
            <SectionHeader title="My Orders" breadcrumbs={[{title : "Home", link: "/"}, {title : "My Orders", link: "#"}]} />
            <Box boxShadow="lg" borderRadius="xl" p="1rem" >
             <Skeleton isLoaded={orderData}>
                {orderData?.length ? 
                  <Box>
                    <List spacing={10}>
                      {_.orderBy(orderData, ['updatedAt'], ['desc']).map(order => 
                        <ListItem key={order._id} border='1px solid #D6DBDF' borderRadius='4px'>
                          <Flex flexWrap='wrap' justifyContent='space-between' background='#EFF3F6' borderBottom='1px solid #D6DBDF'>
                              <Flex flexWrap='wrap' flexGrow={1}>
                                <Box py={3} px={6}>
                                  <Text fontSize='12px'>ORDER PLACED</Text>
                                  <Text fontSize='15px'>{moment(order.updatedAt).format('LL')}</Text>
                                </Box>
                                <Box py={3} px={6}>
                                  <Text fontSize='12px'>TOTAL</Text>
                                  <Text fontSize='15px'>₹ {order.amount || 0}</Text>
                                </Box>
                                <Box py={3} px={6}>
                                  <Text fontSize='12px'>STATUS</Text>
                                  <Text fontSize='15px' fontWeight='bold' color={order.status == 'Processing' ? '#F39C12' : order.status == 'Success' ? '#16A085' : ''}>{order.status}</Text>
                                </Box>
                              </Flex>
                              
                              <Box py={3} fontSize='14px' px={6}>
                                <Text>ORDER # {order._id}</Text>
                                <HStack spacing={6}>
                                  <Link color="brand.redAccent" float={['', '', '', 'right']} 
                                    onClick={() => history.push('/dashboard/order/details/'+order._id)}
                                  >
                                    View order details
                                  </Link>
                                  {order.status === 'Success' ? 
                                    <Tooltip label='Download Invoice'>
                                      <Button size="sm" onClick={() => handleDownloadInvoice(order) } colorScheme='blue' leftIcon={<DownloadIcon/>} variant='link'>
                                        Invoice
                                      </Button>
                                    </Tooltip>
                                    :
                                    null
                                  }
                                </HStack>
                              </Box>
                          </Flex>
                          <Box p={3} background='white'>
                            {order?.packages?.length ?
                              <List justifyContent='center' w='100%' spacing={3}>
                                {order?.packages.map(pkg =>
                                  <ListItem key={pkg._id} p={2}>
                                    <Flex flexWrap='wrap' justifyContent={['center', '']} alignItems='center'>
                                      <Box w={['100%', '70pt']} pb={[4, 0]}>
                                        <Image src={pkg.carousel?.[0]} maxW={['', '60pt']}
                                          fallbackSrc="https://via.placeholder.com/200x200.png?text=CO+CO"
                                        />
                                      </Box>
                                      <Box mx={[0, 0, 4]}>
                                        <Text color='brand.redAccent' cursor='pointer' onClick={() => openPkg(pkg._id)}>{bilingualText(pkg.name)}</Text>
                                      </Box>
                                      <Spacer/>
                                      {/* <HStack color='#5D6D7E'>
                                        <Text fontSize='14px'>Price:</Text> 
                                        <Text fontSize='16px' fontWeight='bold'>₹{pkg.price}</Text>
                                        <Text fontSize='14px' as='s'>₹{pkg.fakePrice}</Text>
                                      </HStack> */}
                                    </Flex>
                                  </ListItem>
                                )}
                              </List>
                              :
                              <Text>Empty</Text>
                            }
                          </Box>
                        </ListItem>
                      )}
                    </List>
                  </Box>
                :
                  <Empty title="No Orders Here" subtitle="Buy Some Packages from our Library" cta={{text : "Explore Packages", action : ()=>history.push("/")}} />
                }
                {/* {
                  (orderData?.length ? 
                    (
                      <Styles>
                        <Table columns={columns} data={orderData} />
                      </Styles>
                    )
                    :
                    (
                      <Empty title="No Orders Here" subtitle="Buy Some Packages from our Library" cta={{text : "Explore Packages", action : ()=>history.push("/")}} />
                    )
                  ) 
                } */}
             </Skeleton>

           </Box>
        </Box>
    );
};


function Table({ columns, data }) {

    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page, // Instead of using 'rows', we'll use page,
      // which has only the rows for the active page
  
      // The rest of these things are super handy, too ;)
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0 },
      },
      usePagination
    )
  
    const renderItem = (index, cell) => {
        let render, dateObj;

        if(cell.column.id === 'updatedAt'){
            dateObj = dateDecompose(cell.value,'short')
        }

        const status_styles = {
            display : 'inline-block',
            fontSize:'13px',
            fontWeight : 'bold' ,
            width : '80px',
            borderRadius : '99px',
            textAlign : 'center',
            padding : '0px 5px',
            textAlign : 'center'
        }
        switch(cell.column.id){
            case 'serial_number':
                render = <span>{index + 1}</span>
                break;
            case 'updatedAt':
                render = <span>{[dateObj.date,dateObj.month[0] + dateObj.month.slice(1).toLocaleLowerCase(),dateObj.year].join('-')}</span>
                break;
            case 'status':
                render = <span style={{
                        ...status_styles,
                        color : {Processing : '#FECD53', Success : '#27A163', Failed : '#DB5149'}[''+cell.value] ,
                        border : `1px solid ${{Processing : '#FECD53', Success : '#27A163', Failed : '#DB5149'}[''+cell.value]}`
                    }} >
                {cell.render('Cell')}</span>
                break;
            case '_id':
                render = <span style={{fontFamily : 'monospace', color : 'rgba(0,0,0,0.6)'}}>{cell.render('Cell')}</span>
                break;
            case 'amount':
              render = <span style={{ fontWeight:'bold', color : 'rgba(0,0,0,0.6)'}}>₹ {cell.render('Cell')}</span>
              break;

            case 'packages':
              render = <OrderListModel cell={cell}/>
              break;
            default:
                render = <span>{cell.render('Cell')}</span>
        }

        return render
    }

    // Render the UI for your table
    return (
      <>
        <table {...getTableProps()} style={{position:'relative'}} >
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} style={{position:'sticky', top:'49px', zIndex:'1'}} >{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    //   console.log("In Table : ", row)
                    return <td {...cell.getCellProps()}>{renderItem(row.index,cell)}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        {/* 
          Pagination can be built however you'd like. 
          This is just a very basic UI implementation:
        */}
        <div className="pagination" style={{position:'sticky', bottom:'0'}} >
            <div className="indicators" >
                Showing Page {pageIndex + 1} of {pageCount}
            </div>
            <div className="controles" >
                <button style={{width:'fit-content'}} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    <ArrowLeftIcon />
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'Previous'}
                </button>
                {
                    pageCount <= 3 
                    ? [...Array(pageCount).keys()].map(x => x+=1).map(p=><button  onClick={() => gotoPage(p - 1)} style={{backgroundColor : p-1 === pageIndex ? '#4F8EF1' : 'auto', color : p-1 === pageIndex ? 'white' : 'auto', width:'fit-content'}}>{p}</button>) 
                    : [...Array(3).keys()].map(x => x+=pageIndex + 1).map(p=>p-1<pageCount && <button onClick={() => gotoPage(p - 1)} style={{backgroundColor : p-1 === pageIndex ? '#4F8EF1' : 'auto', color : p-1 === pageIndex ? 'white' : 'auto', width:'fit-content'}}>{p}</button>)  
                }
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'Next'}
                </button>
                <button style={{width:'fit-content'}} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
      </>
    )
  }

  const OrderListModel = ({cell}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <span>
        <Tooltip label="See the list of Package(s) Purchased" placement="left" >
          <button onClick={onOpen} variant="link" >See List</button>
        </Tooltip>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Order List</ModalHeader>
            {/* <ModalCloseButton /> */}
            <ModalBody>
              <OrdersList
                  items={cell.row.original.cart.packages}
              />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" variant="ghost" mr={3} onClick={onClose}>
                Close
              </Button>
              {/* <Button variant="ghost">Secondary Action</Button> */}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </span>
    )
  }


  const OrdersList = ({items}) => {
    return (
      <Box>
        {
          items.map((item,index)=>{
            return (
              <Box key={item._id}>{index+1}. {item.name.en}</Box>
            )
          })
        }
      </Box>
    )
  }

  const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    // border: 1px solid black;
    width : 100%;
    background-color : white;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th{
        background-color : #EFF3F6;
        text-align : left;
    }

    th,
    td {
      margin: 0;
      padding : 0.5rem 2rem;
      border-bottom: 1px solid #70707017;
    //   border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem 0rem;
    display : flex;
    justify-content : space-between;
  }
  .table-options{
      display : flex;
      padding : 0rem 2.0rem;
      height : 50px;
      align-item : center;
      background-color : white;
      font-size : 15px;
      justify-content : space-between;
  }

  .show-pages{
    width : 250px;
    background-color : #F9F9F9;
    padding : 0.7rem 1rem;
    border-radius : 999px;
  }

  .show-pages:focus-visible{
      outline : none;
  }


  .controles > button{
        background-color : white;
        color : #3C4043C3;
        margin : 5px;
        padding : 0.3rem 0.5rem;
        font-weight : bold;
        text-align : center;
        width : 100px;
        border-radius : 5px
    }

`