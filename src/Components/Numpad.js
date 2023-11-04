import React, { useState, useEffect } from 'react';
import { Button, Input } from "@chakra-ui/react";
import { BsBackspace } from "react-icons/bs";


export const Numpad = ({defaultData = '', onChangeData, id}) => {
  const [state, setState] = useState({data: defaultData})

  useEffect(() => {
    setState({data: defaultData})
  }, [id])

  const changeInData = (data) => {
    if(data != '-'){
      setState({ data: state.data + data })
      onChangeData([state.data+data])
    }
    else{
      let newData = _.includes(state.data, '-') == true ? _.trim(state.data, '-') : '-'+state.data
      setState({ data: newData})
      onChangeData([newData])
    }
  }

  // console.log('STATEDATA::', state, id, defaultData)

  return (
    <div>
      <div style={{ marginBottom: '5px' }}>
        <Input
          id="trigger"
          variant="filled"
          style={{ width: '150px', height: '40px', color: '#000000', marginLeft: '3px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', backgroundColor: '#bcdadf', borderTop: '0px'}}
          placeholder="Enter Answer"
          value={state.data}
          disabled={true}
        />
        <Button
          variant="outline"
          style={{ width: '47px', height: '40px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px'}}
          onClick={() =>
            setState({ data: state.data.slice(0, state.data.length - 1) })
          }
        >
          <BsBackspace fontSize='heading'/>
        </Button>
      </div>
      <div>
        <Button
          variant="outline"
          style={{ width: '60px', height: '40px', margin: '4px' }}
          size="large"
          onClick={() => changeInData('1')}
        >
          1
        </Button>
        <Button
          variant="outline"
          style={{ width: '60px', height: '40px', margin: '4px' }}
          size="large"
          onClick={() => changeInData('2')}
        >
          2
        </Button>
        <Button
          variant="outline"
          style={{ width: '60px', height: '40px', margin: '4px' }}
          size="large"
          onClick={() => changeInData('3')}
        >
          3
        </Button>
      </div>
      <div>
        <Button
          variant="outline"
          style={{ width: '60px', height: '40px', margin: '4px' }}
          size="large"
          onClick={() => changeInData('4')}
        >
          4
        </Button>
        <Button
          variant="outline"
          style={{ width: '60px', height: '40px', margin: '4px' }}
          size="large"
          onClick={() => changeInData('5')}
        >
          5
        </Button>
        <Button
          variant="outline"
          style={{ width: '60px', height: '40px', margin: '4px' }}
          size="large"
          onClick={() => changeInData('6')}
        >
          6
        </Button>
      </div>
      <div>
        <Button
          variant="outline"
          style={{ width: '60px', height: '40px', margin: '4px' }}
          size="large"
          onClick={() => changeInData('7')}
        >
          7
        </Button>
        <Button
          variant="outline"
          style={{ width: '60px', height: '40px', margin: '4px' }}
          size="large"
          onClick={() => changeInData('8')}
        >
          8
        </Button>
        <Button
          variant="outline"
          style={{ width: '60px', height: '40px', margin: '4px' }}
          size="large"
          onClick={() => changeInData('9')}
        >
          9
        </Button>
      </div>
      <div>
        <Button
          variant="outline"
          style={{ width: '60px', height: '40px', margin: '4px' }}
          size="large"
          onClick={() => changeInData(state.data == '' ? '0.' : '.')}
        >
          .
        </Button>
        <Button
          variant="outline"
          style={{ width: '60px', height: '40px', margin: '4px' }}
          size="large"
          onClick={() => changeInData('0')}
        >
          0
        </Button>
        <Button
          variant="outline"
          style={{ width: '60px', height: '40px', margin: '4px' }}
          size="large"
          onClick={() => changeInData('-')}
        >
          -
        </Button>
      </div>
      {/*<div>
        <Button variant="outline" onClick={() => props.onChangeData(state.data)} style={{ width: '198px', height: '40px',  marginLeft: '3px'}} size="large">
          Save
        </Button>
      </div>*/}
    </div>
  )
}
