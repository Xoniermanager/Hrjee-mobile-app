import axios from "axios";
const axiosDelete=async(url,data,token)=>{
 
    var config = {
        method: 'delete',
        url: url,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
     
   const response=await axios(config)
    .then(function (response) {
     
      return(response.data)
    })
    .catch(function (error) {
    

      return JSON.parse(error.request._response)
    });


return response;
    
}

export default axiosDelete;