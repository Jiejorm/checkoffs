import { notifications } from '@mantine/notifications';
//  import { IconX, IconCheck, IconAlertTriangle } from '@tabler/icons';
import {BiError ,BiCheckDouble} from "react-icons/bi"
import React from 'react';
const notify = {
  success: (props) => {
    notifications.show({
      color: 'white',
       icon: <BiError className="w-10 h-10" />,
      ...props,
      radius: 'md',
      classNames: {
        title: 'text-primary text-[16px]',
        root: 'bg-white before:bg-white p-3',
        body: 'bg-white',
        icon: 'text-green-600  font-bold',
        loader: 'bg-green-500',
        description: 'font-medium',
        closeButton: 'text-red-500 hover:bg-white hover:text-green-500',
      },
    });
  },
  warn: (props) => {
    notifications.show({
      color: 'white',
    //   icon: <IconAlertTriangle className="w-6 h-6" />,
      ...props,
      radius: 'md',
      classNames: {
        title: 'text-primary text-[16px]',
        root: 'bg-yellow-400 before:bg-white p-3',
        body: 'bg-yellow-400',
        icon: 'bg-amber-500  font-bold ',
        loader: 'bg-yellow-400',
        description: 'font-medium',
        closeButton: 'text-white hover:bg-white hover:text-yellow-400',
      },
    });
  },
  error: (props) => {
    notifications.show({
      color: 'red',
      icon: <BiError className="w-6 h-6 "/>,
      ...props,
      autoClose: 3000,
      radius: 'md',
      classNames: {
        title: 'text-red-600 text-[16px]',
        root: 'bg-white p-3',
        body: 'bg-white',
        icon: 'text-white-600  font-bold ',
        loader: 'bg-white-500',
        description: 'text-black font-medium',
        closeButton: 'text-red-500 hover:bg-red-500 hover:text-red-500',
      },
    });
  },
};

export default notify;