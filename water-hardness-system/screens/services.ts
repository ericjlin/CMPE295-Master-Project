import * as AWS from 'aws-sdk';

const tdsData = [
    {
        timestamp: "06:08:00 PM",
        data: 226.11,
    },
    {
        timestamp: "06:08:03 PM",
        data: 100.11,
    },
    {
        timestamp: "06:08:06 PM",
        data: 110.11,
    },
    {
        timestamp: "06:08:09 PM",
        data: 115.11,
    },
    {
        timestamp: "06:08:12 PM",
        data: 160.11,
    },
    {
        timestamp: "06:08:15 PM",
        data: 300.11,
    },
    {
        timestamp: "06:08:18 PM",
        data: 350.11,
    },
    {
        timestamp: "06:08:21 PM",
        data: 336.11,
    },
];

const tempData = [
    {
        timestamp: "06:08:00 PM",
        data: 100.11,
    },
    {
        timestamp: "06:08:03 PM",
        data: 100.11,
    },
    {
        timestamp: "06:08:06 PM",
        data: 180.11,
    },
    {
        timestamp: "06:08:09 PM",
        data: 115.11,
    },
    {
        timestamp: "06:08:12 PM",
        data: 160.11,
    },
    {
        timestamp: "06:08:15 PM",
        data: 300.11,
    },
    {
        timestamp: "06:08:18 PM",
        data: 350.11,
    },
    {
        timestamp: "06:08:21 PM",
        data: 336.11,
    },
];

const turbidityData = [
    {
        timestamp: "06:08:00 PM",
        data: 90.11,
    },
    {
        timestamp: "06:08:03 PM",
        data: 50.11,
    },
    {
        timestamp: "06:08:06 PM",
        data: 110.11,
    },
    {
        timestamp: "06:08:09 PM",
        data: 90.11,
    },
    {
        timestamp: "06:08:12 PM",
        data: 98.11,
    },
    {
        timestamp: "06:08:15 PM",
        data: 95.11,
    },
    {
        timestamp: "06:08:18 PM",
        data: 100.11,
    },
    {
        timestamp: "06:08:21 PM",
        data: 95.11,
    },
];

const phData = [
    {
        timestamp: "06:08:00 PM",
        data: 20.11,
    },
    {
        timestamp: "06:08:03 PM",
        data: 40.11,
    },
    {
        timestamp: "06:08:06 PM",
        data: 40.11,
    },
    {
        timestamp: "06:08:09 PM",
        data: 30.11,
    },
    {
        timestamp: "06:08:12 PM",
        data: 35.11,
    },
    {
        timestamp: "06:08:15 PM",
        data: 60.11,
    },
    {
        timestamp: "06:08:18 PM",
        data: 63.11,
    },
    {
        timestamp: "06:08:21 PM",
        data: 58.11,
    },
];

/*
    Put all API calls here
*/
export const grabSensorData = (sensorType: string) => {
    if (sensorType === 'tds') {
        return tdsData;
    } else if (sensorType === 'temperature') {
        return tempData;
    } else if (sensorType === 'ph') {
        return phData;
    } else if (sensorType === 'turbidity') {
        return turbidityData;
    }
}

export const getAllSensors = (email: any) => {
    const requestOptions = {
        method: 'GET'
      };

    return fetch("http://127.0.0.1:3000/user/getAllSensors?email=" + email, requestOptions);
}

export const getSensorData = (id: Number, email: any) => {
    const requestOptions = {
        method: 'GET'
    };

    return fetch("http://127.0.0.1:3000/user/getSensorData?email=" + email + "&deviceId=" + id, requestOptions);
} 

export const editSensor = (id: Number, email: any, location: any, ph_threshold: Number, tds_threshold: Number, temp_threshold: Number, turbidity_threshold: Number, name: string) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email, id, location, tds_threshold, turbidity_threshold, temp_threshold, ph_threshold, name
          }),
    };

    return fetch("http://127.0.0.1:3000/user/updateSensorInfo", requestOptions)
}

export const addNewSensor = (id: Number, email: any, location: any) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email, id, location
          }),
    };

    return fetch("http://127.0.0.1:3000/user/addNewSensor", requestOptions)
}