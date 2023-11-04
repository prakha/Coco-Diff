import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaRegPaperPlane } from "react-icons/fa";
import { database } from '../firebase';



const BottomSheet = ({ id }) => {
  const [datas, setDatas] = useState([]);
  
 
  const [inputValue, setInputValue] = useState('');
 
  const videoId = id;
  const chatContainerRef = useRef(null);
  const user = useSelector((s) => s.user.user);
  const inputRef = useRef();



  useEffect(() => {
    const chatRef = database.ref('chatMessages');
    chatRef
      .orderByChild('GroupId') 
      .equalTo(videoId) 
      .on('value', (snapshot) => {
        const messages = [];
        snapshot.forEach((childSnapshot) => {
          const message = childSnapshot.val();
          messages.push(message);
        });

        if (messages.length > 150) {
          
          const slicedMessages = messages.slice(-150);
          setDatas(slicedMessages);
        } else {
          setDatas(messages);
        }
      });

    return () => {
      chatRef.off('value');
    };
  }, [videoId]);
 

  useEffect(() => {
    
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [datas]);

  const handleChatButtonPress = async (e) => {

    if(e.key){
      if(e.key !== "Enter") return
    }
    if (inputValue) {
      try {
        database.ref("chatMessages").push({
          userName: user?.name,
          GroupId: videoId,
          message: inputValue,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error('Error occurred while adding message:', error);
      }
    }

    setInputValue("");
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
    color:"black",
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
                <div key={data.timestamp} style={getMessageContainer()}>
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
          <FaRegPaperPlane style={getSendButtonStyle()} onClick={handleChatButtonPress}/>
        </div>
      </div>
    </div>
  );
}

export default BottomSheet;