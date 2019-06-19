import jQuery from 'jquery'
jQuery(($) => {
  let $w = $( window ).width();
  let $dW = $('.bb8').css('width');
  $dW = $dW.replace('px', '');
  $dW = parseInt($dW);
  let $dPos = 0;
  let $dSpeed = 1;
  let $dMinSpeed = 1;
  let $dMaxSpeed = 4;
  let $dAccel = 1.04;
  let $dRot = 0;
  let $mPos = $w - $w/5;
  let $slowOffset = 120;
  let $movingRight = false;

  function moveDroid(){
    if($mPos > $dPos + ($dW/4)){
      // moving right
      if(!$movingRight){
        $movingRight = true;
        $('.antennas').addClass('right');
        $('.eyes').addClass('right');
      }
      if($mPos - $dPos > $slowOffset){
        if($dSpeed < $dMaxSpeed){
          // speed up
          $dSpeed = $dSpeed * $dAccel;
        }
      } else if($mPos-$dPos < $slowOffset){
        if($dSpeed > $dMinSpeed){
          // slow down
          $dSpeed = $dSpeed / $dAccel;
        }
      }
      $dPos = $dPos + $dSpeed;
      $dRot = $dRot + $dSpeed;
    } else if($mPos < $dPos - ($dW/4)){
      // moving left
      if($movingRight){
        $movingRight = false;
        $('.antennas').removeClass('right');
        $('.eyes').removeClass('right');
      }
      if($dPos - $mPos > $slowOffset){
        if($dSpeed < $dMaxSpeed){
          // speed up
          $dSpeed = $dSpeed * $dAccel;
        }
      } else if($dPos - $mPos < $slowOffset){
        if($dSpeed > $dMinSpeed){
          // slow down
          $dSpeed = $dSpeed / $dAccel;
        }
      }
      $dPos = $dPos - $dSpeed;
      $dRot = $dRot - $dSpeed;
    } else { }
    $('.bb8').css('left', $dPos);
    $('.ball').css({ WebkitTransform: 'rotate(' + $dRot + 'deg)'});
    $('.ball').css({ '-moz-transform': 'rotate(' + $dRot + 'deg)'});
  }

  setInterval(moveDroid, 10);

  $( document ).on( "mousemove", function( event ) {
    $mPos = event.pageX;
    return $mPos;
  });
});