import { useEffect, useRef } from 'react';
import { getSocket } from '../utils/socket';

const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = getSocket();
    return () => {
      // Don't disconnect on unmount - socket should persist
    };
  }, []);

  return socketRef.current;
};

export default useSocket;
