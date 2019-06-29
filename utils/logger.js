colors = require("colors");
logger = require("tracer").colorConsole({
  format:
    "{{timestamp.green}} <{{title.yellow}}> {{message.cyan}} (in {{file.red}}:{{line}})",
  dateformat: "HH:MM:ss.L"
});


console.log(document.querySelectorAll('span.sec-cbe-highlight-inline').length)
// .forEach(span=>{
//   if(span.getAttribute('class')){
//     console.log(span);
//     console.log(span.getAttribute('class'))
//   }
// })
  