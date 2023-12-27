export * from './auth';

import axios, { AxiosResponse } from 'axios';
import { ApiBody_Request_Props } from '../utils';
import { _getAccessToken } from './auth';

// Generic HTTP call to our backend server
export const http = async (props: ApiBody_Request_Props): Promise<AxiosResponse> => {
  try {
    // eslint-disable-next-line
    const { method = 'get', uri = '', data = null, headers = null, params = null } = props;
    const accessToken = await _getAccessToken({});

    const url = `${process.env.REACT_APP_BACKEND_API_URL}/${uri}`.trim();
    const query = { method, url, data: {}, headers: {}, params: {} };

    // Set the data
    // eslint-disable-next-line
    if (data && (method === 'post' || method === 'put' || method === 'delete' || method === 'patch')) query.data = data;

    // Set the params
    // eslint-disable-next-line
    if (params) query.params = params;

    // Set the headers
    // eslint-disable-next-line
    query.headers = headers || {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    // Call our backend's signup endpoint
    const response: AxiosResponse = await axios(query);

    // eslint-disable-next-line
    console.log('http res: ', props);
    return response; // Return the response data directly
  } catch (e) {
    // eslint-disable-next-line
    console.log(`http error`, { props, e });
    throw e; // Re-throw the error to be caught by the caller
  }
};
