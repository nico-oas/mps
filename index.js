window.addEventListener("load", function(){
    /*$("#test-button").click(function(){
        alert("The button has been clicked!");
    });*/

                                                       

        var countdown = new Date(new Date().getFullYear(), 07, 22);
        $('#clock').countdown(countdown, {elapse: true})
        .on('update.countdown', function(event) {
          var $this = $(this);
          var clock = '<div class="d-flex flex-wrap justify-content-center pt-4" > <span class="h1 font-weight-bold">%D</span> Day%!d' +
          '<span class="h1 font-weight-bold">%H</span> Hr' +
          '<span class="h1 font-weight-bold">%M</span> Min' +
          '<span class="h1 font-weight-bold">%S</span> Sec </div>';  
          if (!event.elapsed) {
            $this.html(event.strftime('<p class="headline" >time left until Earth Overshootday:</p>' + clock));
          } else {
            $this.html(event.strftime( '<p class="headline" >time passed since Earth Overshootday:</p>' + clock));
          }
        });   
           
         
       
      
});