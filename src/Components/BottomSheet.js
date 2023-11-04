import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {FaLocationArrow} from "react-icons/fa"
import {TiArrowForwardOutline} from "react-icons/ti"
import {MdClose} from "react-icons/md"

const scrollingValue = 0
const BottomSheet = ({ id }) => {
  const [datas, setDatas] = useState([]);
  const [messages, setMessages] = useState([])
  const [scrollingValue,setScrollingValue] = useState(1)
  const [inputValue, setInputValue] = useState('');
  const [reply,setReply] = useState(null)
  const videoId = id;
  const chatContainerRef = useRef(null);
  const user = useSelector((s) => s.user.user);
  const inputRef = useRef()


  useEffect(() => {
    const ws = new WebSocket('wss://api.stage.competitioncommunity.com/chats');

    ws.onopen = () => {
      ws.send('something');
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);

      if (data.GroupId === videoId) {
        // setMessages((prev)=>[...prev,data])
        // setDatas((prevDatas) => [...prevDatas, data].slice(-10)); 
        setDatas((prevDatas) => [...prevDatas, data]); 
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }
    };

    ws.onerror = (e) => {
      console.log(e.data);
    };

    return () => {
      ws.onclose = (e) => {
        console.log('Component unmounted');
      };
    };
  }, [videoId]);


  useEffect(() => {
    
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [datas]);

  const handleChatButtonPress = async (e) => {
  setScrollingValue(0)
    if(e.key){
      if(e.key !== "Enter") return
    }
    if (inputValue) {
      try {
        // if(reply){
        //   await axios.post('https://api.stage.competitioncommunity.com/chats', {
        //   GroupId: videoId,
        //   userName: user?.name,
        //   message: inputValue,
        //   parentId:reply.id,
        //   parentUsername:reply.username,
        //   parentText:reply.text
        // });
        // }else{
          const res = await axios.post('https://api.stage.competitioncommunity.com/chats', {
            GroupId: videoId,
            userName: user?.name,
            message: inputValue,
          });
          const data = res.data.chat
          setDatas((prevDatas) => [...prevDatas, data]);
        // }
      } catch (error) {
        console.error('Error occurred while adding message:', error);
      }

      setInputValue('');
      setReply(null)
    }
  };

  const handleReplyClick = (id,username,text)=>{
    setReply({
      id,
      username,
      text
    })
    inputRef.current.style.border = "none"
    inputRef.current.focus()
  }

  const handleRemoveReplyClick = ()=>{
    setReply(null)
    inputRef.current.style.border = "1px solid #CCC"
  }
  
  const getSheetStyles = () => ({
    width: '30%',
    height: '100%',
    position: 'fixed',
    right: 0,
    bottom: 0,
    backgroundColor: '#F0F0F0', 
    zIndex: 1,
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)', 
    display: 'flex',
    flexDirection: 'column',
    backgroundColor:"#ffff",
    "-webkit-box-shadow": "-2px 0px 5px 0px rgba(0,0,0,0.75)",
    "-moz-box-shadow": "-2px 0px 5px 0px rgba(0,0,0,0.75)",
    "box-shadow": "-2px 0px 5px 0px rgba(0,0,0,0.75)"
  });
  
  const getHeaderStyle = () => ({
    // background: '#666699', 
    // color: '#fff',
    padding: '10px', 
    textAlign: 'center',
    fontWeight:"600",
    fontSize:"1rem",
    wordSpacing:"4px",
    "-webkit-box-shadow": "0px 1px 2px 0px rgba(0,0,0,0.75)",
    "-moz-box-shadow": "0px 1px 2px 0px rgba(0,0,0,0.75)",
    "box-shadow": "0px 1px 2px 0px rgba(0,0,0,0.75)",
  });
  
  const getChatContainerStyle = () => ({
    flex: 1,
    overflowY: 'auto',
    padding: '10px 15px', 
    marginTop:".25rem",
  });

  const getMessageContainer = ()=>({
    marginBottom:"1rem"
  })
  
  const getMessageStyle = () => ({
    backgroundColor: '#ADD8E6',
    color: '#333333',
    padding: '5px 10px',
    borderRadius: '0 10px 10px 10px',
    maxWidth: 'fit-content', 
    alignSelf: 'flex-end',

  });
  
  const getDisplayNameStyle = () => ({
    marginRight: '8px', 
    fontSize:".75rem",
    color:"#666968"
  });
  
  const getMessageTextStyle = () => ({
    fontSize: '14px', 
  });
  
  const getInputContainerStyle = () => ({
    backgroundColor: '#fff',
    padding: '10px 20px', 
    borderTop: '1px solid #CCC',
    marginTop: 'auto',
    position:"relative"
  });

  const getInputSection=()=>({
    display: 'flex',
    alignItems: 'center',
  })
  
  const getInputStyle = () => ({
    flex: 1,
    padding: '10px',
    border:'1px solid #CCC',
    borderRadius: '5px',
    marginRight: '10px',
    fontSize: '14px', 
    outline:"none"
  });
  
  const getSendButtonStyle = () => ({
    width:"1.8rem",
    height:"1.8rem",
    color:"#0accc2",
    cursor:"pointer",
    alignItems:"flex-end"
  });

  const getReplySectionStyle = () => ({
    display:"flex",
    alignItems:"center",
    cursor:"pointer"
  })

  const getReplyIcon = () =>({
    transform: "scaleY(-1)",
    color:"#666968"
  })
  
  const getReplyBtnStyle=()=>({
    fontSize:".75rem",
    color:"#666968"
  })

  const getInputReplySection = () =>({
    flex:"1",
    display:"flex",
    flexDirection:"column"
  })

  const getInputReplyBox=()=>({
    display:"flex",
    alignItems:"center",
    backgroundColor: '#787878',
    color:"#ffff",
    padding:".5rem",
    width:"100%",
    position:"relative",
    opacity:"90",
    borderRadius: '10px 0px 10px 10px',
    opacity:"0.7"
  })

  const getInputReplyIcon=()=>({
    transform: "scale(-1,-1)",
    width:"1.6rem",
    height:"1.6rem",
  })

  const getInputReplyCloseBtn=()=>({
    position:"absolute",
    right:"0",
    top:"0",
    width:"1.3rem",
    height:"1.3rem",
    color:"#ffff",
    cursor:"pointer"
  })
  
  const getInputReplayDisplayNameStyle = () =>({
    marginRight: '8px', 
    fontSize:".75rem",
    color:"#f0eded"
  })

  const getParentReplySection = () =>({
    borderBottom:"1px solid #CCC",
  })

  const getParentReplyIcon = () =>({
    transform: "scale(-1,-1)",
    width:"1.6rem",
    height:"1.6rem",
    
  })

  const getParentReplyText = () =>({
    fontSize: '1.05rem',
    marginBottom:"0.3rem"
  })

  const getParentReplyUsername = () =>({
    fontSize:".75rem",
  })

  const handleChatContainerClick = (e) => {
    e.stopPropagation();
  };

  const handleScroll = (e)=>{
    if(e.target.scrollTop == 0){
      setScrollingValue(prev=>{
        let current = prev+1
        if(Math.floor(messages.length/10) > current){
          setDatas(messages.slice(-(current*10)))
          e.target.scrollTop = e.target.scrollHeight/2
          return prev +=1
        }
      })
    }
  }
  
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  // console.log(messages);
  return (
    <div style={getSheetStyles()}>
      
      <div  style = {getHeaderStyle()}>
        <span className="headerText">Live Chat</span>
      </div>

      {/* <div style={getChatContainerStyle()} ref={chatContainerRef} onClick={handleChatContainerClick} onScroll={handleScroll}> */}
      <div style={getChatContainerStyle()} ref={chatContainerRef} onClick={handleChatContainerClick} >
          
            {datas.map((data, index) => (
              <>
                <div id={data._id} style={getMessageContainer()}>
                      <h5 style = {getDisplayNameStyle()}>{data.userName}</h5>
                    <div key={index} style = {getMessageStyle()}>
                      {/* {
                        data?.parentId && <div style={getParentReplySection()}>
                            <a href={`#${data.parentId}`}>
                              <p style={getParentReplyText()}>{data.parentText}</p>
                              <p style={getParentReplyUsername()}>{data.parentUsername}, 1:17 PM</p>
                            </a>
                          </div>
                      } */}
                      <span style = {getMessageTextStyle()}>{data.message}</span>
                    </div>
                    {/* <div style={getReplySectionStyle()} onClick={()=>handleReplyClick(data._id,data.userName,data.message)}>
                      <TiArrowForwardOutline style={getReplyIcon()}/>
                      <p style={getReplyBtnStyle()}>Reply</p>
                    </div> */}
                </div>
              </>
            ))}
          
      </div>

      <div style={getInputContainerStyle()}>
        {/* {
          reply && <div style={getInputReplySection()}>
          <div style={getInputReplyBox()}>
            <MdClose style={getInputReplyCloseBtn()} onClick={handleRemoveReplyClick}/>
            <TiArrowForwardOutline style={getInputReplyIcon()}/>
              <div style={{width:"100%"}}>
                <p style={getInputReplayDisplayNameStyle()}>Rahul sarkar, 1:17 PM</p>
                <p style={{wordWrap:"break-word",width:"100%"}}>{reply.text}</p>
              </div>
            </div>
          </div>
        } */}
        <div style={getInputSection()}>
          <input
            style={getInputStyle()}
            // className='chat-send-btn:focus'
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type a message..."
            onKeyDown={handleChatButtonPress}
          />
          <FaLocationArrow style={getSendButtonStyle()} onClick={handleChatButtonPress}/>
        </div>
      </div>
    </div>
  );
}

export default BottomSheet;