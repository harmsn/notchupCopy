import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as AlertProvider } from 'react-alert';
import {useAlert} from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
const options = {
  position: 'bottom center',
  timeout: 5000,
  offset: '30px',
  transition: 'scale'
}
export default function  Aler({alertMessage}){
  const alert = useAlert()

  return (
    alert.show({alertMessage})
  )
}

