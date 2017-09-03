
$(window).load(function() {
  $('.flexslider').flexslider();
});


$('.button-collapse').sideNav({
            menuWidth: 300, // Default is 300
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true // Choose whether you can drag to open on touch screens
          }
          );


if ( $(window).width() > 993) {  
 document.getElementById("search").style.display="block";
 document.getElementById("search").style.marginLeft="33%";
 document.getElementById("backimg").style.height="40vw";
} 
else {
 document.getElementById("dis").style.display="block";
 document.getElementById("backimg").style.height="70vw";
}

$("#icon1").click(function(){
  $("#search").fadeToggle("2000");
  document.getElementById("search").focus();
});

function myfocus(){
  if ( $(window).width() > 993) {  
    document.getElementById("search").style.border="2px solid #ccc";
    document.getElementById("search").style.backgroundColor="white";
  } 
  else {
    document.getElementById("search").style.width= "100%" ;
    document.getElementById("search").style.border="2px solid #ccc";
    document.getElementById("search").style.backgroundColor="white";}
  }

function myblur(){
  if ( $(window).width() > 993) {  
    document.getElementById("search").style.border="1px solid #ccc";
    document.getElementById("search").style.backgroundColor="#00897B";} 
  else {
    document.getElementById("search").style.display="none"}
  }




