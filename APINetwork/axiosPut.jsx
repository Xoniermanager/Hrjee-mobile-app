import axios from "axios";
const axiosPut=async(url,data,token,form)=>{
 
    var config = {
        method: 'put',
        url: url,
        headers: { 
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data',
          'Content-Type':form==1? 'multipart/form-data':'application/json', 
        },
        data
      };
     
   const response=await axios(config)
    .then(function (response) {
     
      return(response)
    })
    .catch(function (error) {
      console.log(error,'error')
      return (error)
    });


return response;
    
}

export default axiosPut;
