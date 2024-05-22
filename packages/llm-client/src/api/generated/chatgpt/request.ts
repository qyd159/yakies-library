import { createAxios, createRequest, setTokenToLocal } from '@yakies/http';

export default createRequest('/chat-api', {
  errorCaptured: (err) => {
    if (err.data?.code === 11002 || err.data?.code === 11001) {
      setTokenToLocal('');
    }
  },
  joinTime: false,
  axiosInstance: createAxios({
    authenticationScheme: 'Bearer',
  }),
});
