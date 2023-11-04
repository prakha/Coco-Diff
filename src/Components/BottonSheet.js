import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {FaLocationArrow} from "react-icons/fa"


const BottomSheet = ({ id }) => {
  const [datas, setDatas] = useState([]);
  const [messages, setMessages] = useState([])
 
  const [inputValue, setInputValue] = useState('');
 
  const videoId = id;
  const chatContainerRef = useRef(null);
  const user = useSelector((s) => s.user.user);
  const inputRef = useRef();


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
        
          const res = await axios.post('https://api.stage.competitioncommunity.com/chats', {
            GroupId: videoId,
            userName: user?.name,
            message: inputValue,
          });
          const data = res.data.chat
          setDatas((prevDatas) => [...prevDatas, data]);
        
      } catch (error) {
        console.error('Error occurred while adding message:', error);
      }

      setInputValue('');
      setReply(null)
    }
  };

  
  
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

 
  


  const handleChatContainerClick = (e) => {
    e.stopPropagation();
  };

  
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  
  return (
    <div style={getSheetStyles()}>
      <div  style = {getHeaderStyle()}>
        <span className="headerText">Live Chat</span>
      </div>

        <div style={getChatContainerStyle()} ref={chatContainerRef} onClick={handleChatContainerClick} >
          {datas.map((data, index) => (
              <>
                <div id={data._id} style={getMessageContainer()}>
                      <h5 style = {getDisplayNameStyle()}>{data.userName}</h5>
                    <div key={index} style = {getMessageStyle()}>
                      <span style = {getMessageTextStyle()}>{data.message}</span>
                    </div>
                </div>
              </>
            ))}
        </div>

      <div style={getInputContainerStyle()}>
        
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