const onMessage = (message) => {
  name = message.name;
  switch (message.action) {
    case 'START':
      start(message.name,message.studentID);
      break;
    default:
      break;
  }
}
var newCanvas = document.createElement('canvas');
var context = newCanvas.getContext('2d');
var video;
chrome.runtime.onMessage.addListener(onMessage);
function start(name,studentID){
  if(name == '' || studentID == ''){
    alert("請填入Google Meet名字和學號");
  }
  else{
    console.log("開始上課");
    //   console.log("name"+name);
    //   console.log("studentID"+studentID);
    //抓各個視頻的名字
    var student_everyone=document.querySelectorAll(".YBp7jf")
    student_everyone.forEach(function(student){
        if(student.innerHTML=="你"){
          console.log("名字"+name+"學號"+studentID);
          //抓視頻
          // console.log("student.parentElement"+student.parentElement.nextElementSibling.nextElementSibling.firstElementChild);
          // video = document.querySelector(".p2hjYe").firstElementChild;
          video = student.parentElement.nextElementSibling.nextElementSibling.firstElementChild;
          video.parentElement.parentElement.style.boxSizing = "border-box";
          //   console.log("video.getAttribute(attributeName) "+video.getAttribute("data-uid"));
          newCanvas.width = parseInt(video.parentElement.style.width);
          newCanvas.height = parseInt(video.parentElement.style.height);
          newCanvas.style.display='none';
          waitSeconds()
        }
    });
  }
  
}


function waitSeconds(){
    // video.style.border="transparent 6px solid"
    window.setInterval("drawPicture()",5000);
    console.log("name:"+name);
}
// window.onload = waitSeconds;

// Trigger photo take
var drawPicture=()=>{
    context.drawImage(video, 0, 0, parseInt(video.parentElement.style.width), parseInt(video.parentElement.style.height));
    let imgData = context.getImageData( 0, 0,parseInt(video.parentElement.style.width), parseInt(video.parentElement.style.height));
    let pixels = imgData.data;
    for (var i = 0; i < pixels.length; i += 4) {

    let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);

    pixels[i] = lightness;
    pixels[i + 1] = lightness;
    pixels[i + 2] = lightness;
  }
    context.putImageData(imgData, 0, 0);
    document.body.appendChild(newCanvas);
    var dataURL = newCanvas.toDataURL("image/jpeg",1);
    // console.log(dataURL);
    fetch(dataURL)
        .then(async(response)=>{
            const file = await response.blob();
                let formData = new FormData();
                formData.append("file", file); 

                    return axios({
                        method: 'POST',
                        url: 'https://concern-server-2020.herokuapp.com/upload',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        data: formData,
                    })

        })
        .then((response) => {
            console.log(response.data)
            addborder(response.data)
            send(response.data)
        })
        function send(number){
          $.ajax({
            type:"GET",
            dataType: "jsonp",
            jsonp: "callback", //Jquery生成驗證引數的名稱
            // a/grad.ntue.edu.tw/
            url: "https://script.google.com/a/grad.ntue.edu.tw/macros/s/AKfycby8KOoQDDk421wDDhiUjoDBRMJGCu8BGX6B_519cW-b3uF610ww/exec?prefix=calltest",
            data: {
              "name": name,
              "number": number
            },
            success: function() {
                alert("成功")
            },
            error: function(){
              alert("失敗！")
            }
          });
        }
};

function addborder(color_str){
    if(color_str !="No Face"){
        const color = parseFloat(color_str)
        if(color<0.4){
            video.parentElement.parentElement.style.border="6px solid red";
            // document.querySelector(".koV58").style.border="6px solid red";

        }
        else if(color>0.4&&color<0.65){
            video.parentElement.parentElement.style.border="6px solid yellow";
            // document.querySelector(".koV58").style.border="6px solid yellow";

        }
        else if(color>0.65){
            video.parentElement.parentElement.style.border="6px solid green";
            // document.querySelector(".koV58").style.border="6px solid green";
        }
    }
    else{
        alert("No Face")
    }
}

// function send(number){
//   $.ajax({
//     dataType: "jsonp",
//     jsonp: "callback", //Jquery生成驗證引數的名稱
//     url: "https://script.google.com/macros/s/AKfycby8KOoQDDk421wDDhiUjoDBRMJGCu8BGX6B_519cW-b3uF610ww/exec?prefix=calltest",
//     data: {
//       "name": name,
//       "number": number
//     },
//     success: function() {
//         alert("成功")
//     },
//     error: function(){
//       alert("失敗！")
//     }
//   });
// }



