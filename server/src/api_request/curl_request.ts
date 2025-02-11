import axios from 'axios';
import { RESPONSE_CODES } from '../config/constants';
import fs from 'fs';

const filename = 'tokens.json';

// Function to write data to the JSON fileddd
function writeDataToFile(data: any) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

// Function to read data from the JSON file
function readDataFromFile() {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, return an empty array
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}


export const getHighlevelToken = async (params: any) => {
  try {

    const response = await axios.post(
      'https://services.leadconnectorhq.com/oauth/token',
      new URLSearchParams({
        client_id: process.env.clientId,
        client_secret: process.env.clientSecret,
        grant_type: 'refresh_token',
        // code: params.code,
        refresh_token: params.refresh_token,
        user_type: 'Location',
        // redirect_uri: ''
      }).toString(),
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Prefer': 'code=200, dynamic=true'
        }
      }
    );
    writeDataToFile(response.data);
    return response.data;
  } catch (error) {
    return {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.response.data,
    };
  }
}

export const goHighLevelCurl = async (options: any) => {
  try {

    const access_token = options.access_token ? options.access_token : readDataFromFile().access_token;
    const request_options: any = {
      method: options.method,
      url: options.url,
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${access_token}`,
        'Version': '2021-07-28',
        ...options?.headers
      },
    };

    request_options.data = options.data ? options.data : {};

    const response = await axios(request_options);

    return {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: '',
      data: response.data
    };
  } catch (error) {
    const error_response = error?.response?.data;
    // console.log("goHighLevelCurl----------------------", error_response)
    if (error_response?.statusCode === 401 && error_response?.message == 'Invalid JWT') {
      const refresh_token = readDataFromFile().refresh_token;
      const params = {
        refresh_token: refresh_token
      };

      const get_token = await getHighlevelToken(params);
      let api_response: any;
      if (get_token.status) {
        options.access_toke = get_token.access_token;
        api_response = await goHighLevelCurl(options);
      } else{
        console.log("error while generating new token----------",get_token.message);
      }

      return api_response;
    } else {
      throw {
        status: 0,
        status_code: error_response?.statusCode ? error_response?.statusCode : error_response?.status,
        message: error_response?.error ? error_response?.error : error_response?.message
      };
    }

  }

}