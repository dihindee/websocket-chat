$.get('/',{ajax:'true'}).done((data)=>{
    JSON.parse(data).forEach((e)=>{
        $('#channels').append("<li onclick='location.href+=\""+e+"\"'>"+e+"</li>");
   });
});
function saveLogin(){
    if($('#username').val()!='') {
        sessionStorage['username'] = $('#username').val();
        $('.modal').hide();
        $('#login-info').text("Logged as "+ sessionStorage['username']);
    }
}
$('#username').keypress((e)=>{
    if(e.key == 'Enter')
        saveLogin();
});
$('#myBtn').on('click',()=>{
    saveLogin();
});
if(!sessionStorage.hasOwnProperty("username")){
    $('.modal').show();
}
else{
    $('#login-info').text("Logged as "+ sessionStorage['username']);
}