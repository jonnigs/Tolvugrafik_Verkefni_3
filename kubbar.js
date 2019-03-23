/////////////////////////////////////////////////////////////////
//    Verkefni 3 í Tölvugrafík
//    Notandi getur spilað Þríris
//
//    Jónas G. Sigurðsson, mars 2019
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var numVertices  = 60;

var program;

var texRed;
var texBlue;
var texWhite;

var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = 10.0;

var flipX = 0;
var flipY = 0;
var flipZ = 0;
var north = 0;
var west = 0;

var counter = 0; // Klukka fyrir hreyfingu niður
var drop = 0;

var proLoc;
var mvLoc;

var rand = Math.random();

var vertices = [
  // V - kubbur
  vec4(  0.0,  1.0 , 0.5, 1.0), //Framhlið
  vec4( -1.0,  1.0 , 0.5, 1.0),
  vec4( -1.0, -1.0 , 0.5, 1.0),
  vec4( -1.0, -1.0 , 0.5, 1.0),
  vec4(  0.0, -1.0 , 0.5, 1.0),
  vec4(  0.0,  1.0 , 0.5, 1.0),

  vec4(  1.0,  0.0 , 0.5, 1.0),
  vec4(  0.0,  0.0 , 0.5, 1.0),
  vec4(  0.0, -1.0 , 0.5, 1.0),
  vec4(  0.0, -1.0 , 0.5, 1.0),
  vec4(  1.0, -1.0 , 0.5, 1.0),
  vec4(  1.0,  0.0 , 0.5, 1.0),

  vec4(  0.0,  1.0 , -0.5, 1.0), //Bakhlið
  vec4( -1.0,  1.0 , -0.5, 1.0),
  vec4( -1.0, -1.0 , -0.5, 1.0),
  vec4( -1.0, -1.0 , -0.5, 1.0),
  vec4(  0.0, -1.0 , -0.5, 1.0),
  vec4(  0.0,  1.0 , -0.5, 1.0),

  vec4(  1.0,  0.0 , -0.5, 1.0),
  vec4(  0.0,  0.0 , -0.5, 1.0),
  vec4(  0.0, -1.0 , -0.5, 1.0),
  vec4(  0.0, -1.0 , -0.5, 1.0),
  vec4(  1.0, -1.0 , -0.5, 1.0),
  vec4(  1.0,  0.0 , -0.5, 1.0),

  vec4( -1.0,  1.0 ,  0.5, 1.0), // Brún 1
  vec4( -1.0, -1.0 ,  0.5, 1.0),
  vec4( -1.0, -1.0 , -0.5, 1.0),
  vec4( -1.0, -1.0 , -0.5, 1.0),
  vec4( -1.0,  1.0 , -0.5, 1.0),
  vec4( -1.0,  1.0 ,  0.5, 1.0),

  vec4( -1.0,  1.0 ,  0.5, 1.0), // Brún 2
  vec4(  0.0,  1.0 ,  0.5, 1.0),
  vec4(  0.0,  1.0 , -0.5, 1.0),
  vec4(  0.0,  1.0 , -0.5, 1.0),
  vec4( -1.0,  1.0 , -0.5, 1.0),
  vec4( -1.0,  1.0 ,  0.5, 1.0),

  vec4(  0.0,  1.0 ,  0.5, 1.0), // Brún 3
  vec4(  0.0,  0.0 ,  0.5, 1.0),
  vec4(  0.0,  0.0 , -0.5, 1.0),
  vec4(  0.0,  0.0 , -0.5, 1.0),
  vec4(  0.0,  1.0 , -0.5, 1.0),
  vec4(  0.0,  1.0 ,  0.5, 1.0),

  vec4( 0.0,  0.0 ,  0.5, 1.0), // Brún 4
  vec4( 1.0,  0.0 ,  0.5, 1.0),
  vec4( 1.0,  0.0 , -0.5, 1.0),
  vec4( 1.0,  0.0 , -0.5, 1.0),
  vec4( 0.0,  0.0 , -0.5, 1.0),
  vec4( 0.0,  0.0 ,  0.5, 1.0),

  vec4( 1.0,  0.0 ,  0.5, 1.0), // Brún 5
  vec4( 1.0, -1.0 ,  0.5, 1.0),
  vec4( 1.0, -1.0 , -0.5, 1.0),
  vec4( 1.0, -1.0 , -0.5, 1.0),
  vec4( 1.0,  0.0 , -0.5, 1.0),
  vec4( 1.0,  0.0 ,  0.5, 1.0),

  vec4(  1.0, -1.0 ,  0.5, 1.0), // Brún 6
  vec4( -1.0, -1.0 ,  0.5, 1.0),
  vec4( -1.0, -1.0 , -0.5, 1.0),
  vec4( -1.0, -1.0 , -0.5, 1.0),
  vec4(  1.0, -1.0 , -0.5, 1.0),
  vec4(  1.0, -1.0 ,  0.5, 1.0),

  // L-kubbur
  vec4(  0.5,  1.5 , 0.5, 1.0), //Framhlið
  vec4( -0.5,  1.5 , 0.5, 1.0),
  vec4( -0.5, -1.5 , 0.5, 1.0),
  vec4( -0.5, -1.5 , 0.5, 1.0),
  vec4(  0.5, -1.5 , 0.5, 1.0),
  vec4(  0.5,  1.5 , 0.5, 1.0),

  vec4(  0.5,  1.5 , -0.5, 1.0), //Bakhlið
  vec4( -0.5,  1.5 , -0.5, 1.0),
  vec4( -0.5, -1.5 , -0.5, 1.0),
  vec4( -0.5, -1.5 , -0.5, 1.0),
  vec4(  0.5, -1.5 , -0.5, 1.0),
  vec4(  0.5,  1.5 , -0.5, 1.0),

  vec4( -0.5,  1.5 ,  0.5, 1.0), //Hlið 1
  vec4( -0.5, -1.5 ,  0.5, 1.0),
  vec4( -0.5, -1.5 , -0.5, 1.0),
  vec4( -0.5, -1.5 , -0.5, 1.0),
  vec4( -0.5,  1.5 , -0.5, 1.0),
  vec4( -0.5,  1.5 ,  0.5, 1.0),

  vec4( -0.5,  1.5 ,  0.5, 1.0), //Hlið 2
  vec4(  0.5,  1.5 ,  0.5, 1.0),
  vec4(  0.5,  1.5 , -0.5, 1.0),
  vec4(  0.5,  1.5 , -0.5, 1.0),
  vec4( -0.5,  1.5 , -0.5, 1.0),
  vec4( -0.5,  1.5 ,  0.5, 1.0),

  vec4(  0.5,  1.5 ,  0.5, 1.0), //Hlið 1
  vec4(  0.5, -1.5 ,  0.5, 1.0),
  vec4(  0.5, -1.5 , -0.5, 1.0),
  vec4(  0.5, -1.5 , -0.5, 1.0),
  vec4(  0.5,  1.5 , -0.5, 1.0),
  vec4(  0.5,  1.5 ,  0.5, 1.0),

  vec4( -0.5, -1.5 ,  0.5, 1.0), //Hlið 4
  vec4(  0.5, -1.5 ,  0.5, 1.0),
  vec4(  0.5, -1.5 , -0.5, 1.0),
  vec4(  0.5, -1.5 , -0.5, 1.0),
  vec4( -0.5, -1.5 , -0.5, 1.0),
  vec4( -0.5, -1.5 ,  0.5, 1.0),

  // Botn
  vec4(  1.0, -1.0 ,  1.0, 1.0),
  vec4( -1.0, -1.0 ,  1.0, 1.0),
  vec4( -1.0, -1.0 , -1.0, 1.0),
  vec4( -1.0, -1.0 , -1.0, 1.0),
  vec4(  1.0, -1.0 , -1.0, 1.0),
  vec4(  1.0, -1.0 ,  1.0, 1.0),

  // Hliðar
  vec4(  1.0, -1.0 ,  1.0, 0.2),
  vec4( -1.0, -1.0 ,  1.0, 0.2),
  vec4( -1.0, -1.0 , -1.0, 0.2),
  vec4( -1.0, -1.0 , -1.0, 0.2),
  vec4(  1.0, -1.0 , -1.0, 0.2),
  vec4(  1.0, -1.0 ,  1.0, 0.2),
];

var texCoords = [
    // V - kubbur
    vec2( 0.0, 0.0 ), // Framhlið
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 2.0 ),
    vec2( 1.0, 2.0 ),
    vec2( 0.0, 2.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ), // Bakhlið
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 2.0 ),
    vec2( 1.0, 2.0 ),
    vec2( 0.0, 2.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ), // Hlið 1
    vec2( 2.0, 0.0 ),
    vec2( 2.0, 1.0 ),
    vec2( 2.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ), // Hlið 6
    vec2( 2.0, 0.0 ),
    vec2( 2.0, 1.0 ),
    vec2( 2.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    // L - kubbur
    vec2( 0.0, 0.0 ), //Framhlið
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 3.0 ),
    vec2( 1.0, 3.0 ),
    vec2( 0.0, 3.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ), //Bakhlið
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 3.0 ),
    vec2( 1.0, 3.0 ),
    vec2( 0.0, 3.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ), //Hlið 1
    vec2( 3.0, 0.0 ),
    vec2( 3.0, 1.0 ),
    vec2( 3.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ), //Hlið 2
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ), //Hlið 3
    vec2( 3.0, 0.0 ),
    vec2( 3.0, 1.0 ),
    vec2( 3.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ), //Hlið 4
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    // Botn
    vec2( 0.0, 0.0 ),
    vec2( 6.0, 0.0 ),
    vec2( 6.0, 6.0 ),
    vec2( 6.0, 6.0 ),
    vec2( 0.0, 6.0 ),
    vec2( 0.0, 0.0 ),

    // Hliðar
    vec2( 0.0, 0.0 ),
    vec2( 6.0, 0.0 ),
    vec2( 6.0, 20.0 ),
    vec2( 6.0, 20.0 ),
    vec2( 0.0, 20.0 ),
    vec2( 0.0, 0.0 )
];

var locations = []; // 0 þýðir að viðeigandi reitur sé tómur, 1 þýðir að það sé kominn kubbur í hann
for(i=0; i < 20 * 36; i++){
  locations.push(0);
}
var currentPos = [0, 0, 0]; // Hvaða reiti í locations erum við að hreyfa
var gamlirkubbar = [0, 3, 1, 0, 0, 1, 0,
                    1, 4, 1, 2, 0, -1, 0,
                    0, 5, 1, 2, 3, 0, 1];
var nyrkubbur = [0, 0, 0, 0, 0, 0, 0]; // Týpa, d , fX, fY, fZ, north, west

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    // Ná í mynstur úr html-skrá:
    // Lesa inn og skilgreina mynstur fyrir rauða kubbinn
    var redImage = document.getElementById("RedImage");
    texRed = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texRed );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, redImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    // Lesa inn og skilgreina mynstur fyrir bláa kubbinn
    var blueImage = document.getElementById("BlueImage");
    texBlue = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texBlue );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, blueImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    // Lesa inn og skilgreina mynstur fyrir botninn
    var whiteImage = document.getElementById("WhiteImage");
    texWhite = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texWhite );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, whiteImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    var proj = perspective( 50.0, 1.0, 0.2, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));


    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.clientX;
        origY = e.clientY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	      spinY = ( spinY + (origX - e.clientX) ) % 360;
            spinX = ( spinX + (origY - e.clientY) ) % 360;
            origX = e.clientX;
            origY = e.clientY;
        }
    } );

    // Event listener for keyboard
     window.addEventListener("keydown", function(e){
         switch( e.keyCode ) {
            case 65:	// A
                flipX += 1;
                break;
            case 90:	// Z
                flipX -= 1;
                break;
            case 83:	// S
                flipY += 1;
                break;
            case 88:	// X
                flipY -= 1;
                break;
            case 68:	// D
                flipZ += 1;
                break;
            case 67:	// C
                flipZ -= 1;
                break;
            case 38:	// Upp
                north += 1;
                break;
            case 40:	// Niður
                north -= 1;
                break;
            case 37:	// Vinstri
                west += 1;
                break;
            case 39:	// Hægri
                west -= 1;
                break;
         }
     }  );

    // Event listener for mousewheel
     window.addEventListener("wheel", function(e){
         if( e.deltaY > 0.0 ) {
             zDist += 0.2;
         } else {
             zDist -= 0.2;
         }
     }  );

    render();

}

// Býr til nýjan kubb og sér um að halda utan um kubba sem búið er að spila
function newCube() {
  var annarhvor = Math.random();
  if (annarhvor <= 0.5){
    // Stilla allt fyrir rauðan v kubb
    if(locations[14] == 0 && locations[50] == 0 && locations[51] == 0) {
      changeCurrentPos('d');

      nyrkubbur[0] = 0; // v kubbur
      nyrkubbur[1] = 0; // Hversu mikið er hann búinn að fara niður
      nyrkubbur[2] = 0; // Hversu oft snúið um X
      nyrkubbur[3] = 0; // Hversu oft snúið um Y
      nyrkubbur[4] = 0; // Hversu oft snúið um Z
      nyrkubbur[5] = 0; // Hversu mikið hreyfður í N/S
      nyrkubbur[6] = 0; // Hversu mikið hreyfður í E/W
    } else {
      endGame();
    };

  } else {
    // Stilla allt fyrir bláan l kubb

    nyrkubbur[0] = 1; // l kubbur
    nyrkubbur[1] = 0; // Hversu mikið er hann búinn að fara niður
    nyrkubbur[2] = 0; // Hversu oft snúið um X
    nyrkubbur[3] = 0; // Hversu oft snúið um Y
    nyrkubbur[4] = 0; // Hversu oft snúið um Z
    nyrkubbur[5] = 0; // Hversu mikið hreyfður í N/S
    nyrkubbur[6] = 0; // Hversu mikið hreyfður í E/W
  };
};

// Tekur við n, e, s, w, fX, fY, fZ, d, end
function changeCurrentPos(x){
  if (X == 'd') { // Down
    currentPos[0] += 36;
    currentPos[1] += 36;
    currentPos[2] += 36;
  } else if ( x == 'n') { // Norður/upp ör
    currentPos[0] -= 6;
    currentPos[1] -= 6;
    currentPos[2] -= 6;
  } else if ( x == 'e') { // Austur/hægri ör
    currentPos[0] += 1;
    currentPos[1] += 1;
    currentPos[2] += 1;
  } else if ( x == 'w') { // Vestur/vinstri ör
    currentPos[0] -= 1;
    currentPos[1] -= 1;
    currentPos[2] -= 1;
  } else if ( x == 's') { // Suður/niður ör
    currentPos[0] += 6;
    currentPos[1] += 6;
    currentPos[2] += 6;
  } else if ( x == 'fX') { // Snúa um X
    currentPos[0] += x;
    currentPos[1] += x;   // Eftir að kóða
    currentPos[2] += x;
  } else if ( x == 'fY') { // Snúa um Y
    currentPos[0] -= x;
    currentPos[1] -= x;   // Eftir að kóða
    currentPos[2] -= x;
  } else if ( x == 'fZ') { // Snúa um Z
    currentPos[0] += x;
    currentPos[1] += x;   // Eftir að kóða
    currentPos[2] += x;
  } else if (x == 'end') {

  }
};

// Lætur vita að leik sé lokið
function endGame() {
  console.log('Leik lokið');
}

function checkIfFullFloor(){

}

function renderOldCubes(mv){
  var fjoldiKubba = gamlirkubbar.length/7;
  for (i = 0; i<fjoldiKubba; i++) {
    mv1 = mult( mv, translate( 0.166 + gamlirkubbar[i*7+5], 6.0 - gamlirkubbar[i*7+1], 0.166 + gamlirkubbar[i*7+6] ) );
    mv1 = mult(mv1, scalem( 0.33, 0.33, 0.33 ) );
    mv1 = mult(mv1, rotateX( gamlirkubbar[i*7+2] * 90 ) );
    mv1 = mult(mv1, rotateY( gamlirkubbar[i*7+3] * 90 ) );
    mv1 = mult(mv1, rotateZ( gamlirkubbar[i*7+4] * 90 ) );
    if(gamlirkubbar[i*7] == 0) {
      gl.bindTexture( gl.TEXTURE_2D, texRed );
      gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
      gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    } else if(gamlirkubbar[i*7] == 1) {
      gl.bindTexture( gl.TEXTURE_2D, texBlue );
      gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
      gl.drawArrays( gl.TRIANGLES, 60, 36 );
    }
  }
}

function renderSuroundings(mv){
  // Botn
  mv1 = mult( mv, translate( 0.0, -1.0, 0.0 ) );
  gl.bindTexture( gl.TEXTURE_2D, texWhite );
  gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
  gl.drawArrays( gl.TRIANGLES, 96, 6 );

  // Veggir
  mv1 = mult( mv, rotateX( 90 ) );
  mv1 = mult( mv1, scalem( 0.2, 1.0, 0.8 ) );
  mv1 = mult( mv1, translate( 0.0, 4.0, -2.5 ) );
  gl.bindTexture( gl.TEXTURE_2D, texWhite );
  gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
  gl.drawArrays( gl.TRIANGLES, 102, 6 );
  /*
  mv1 = mult( mv, rotateX( -90 ) );
  mv1 = mult( mv1, scalem( 0.2, 1.0, 0.8 ) );
  mv1 = mult( mv1, translate( 0.0, 4.0, 2.5 ) );
  gl.bindTexture( gl.TEXTURE_2D, texWhite );
  gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
  gl.drawArrays( gl.TRIANGLES, 102, 6 );

  mv1 = mult( mv, rotateX( -90 ) );
  mv1 = mult( mv1, rotateZ( -90 ) );
  mv1 = mult( mv1, scalem( 0.2, 1.0, 0.8 ) );
  mv1 = mult( mv1, translate( 0.0, 4.0, 2.5 ) );
  gl.bindTexture( gl.TEXTURE_2D, texWhite );
  gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
  gl.drawArrays( gl.TRIANGLES, 102, 6 );
  */
  mv1 = mult( mv, rotateX( -90 ) );
  mv1 = mult( mv1, rotateZ( 90 ) );
  mv1 = mult( mv1, scalem( 0.2, 1.0, 0.8 ) );
  mv1 = mult( mv1, translate( 0.0, 4.0, 2.5 ) );
  gl.bindTexture( gl.TEXTURE_2D, texWhite );
  gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
  gl.drawArrays( gl.TRIANGLES, 102, 6 );
}

function render(){
    counter += 1;
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // staðsetja áhorfanda og meðhöndla músarhreyfingu
    var mv = lookAt( vec3( 0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
    mv = mult( mv, rotateX( spinX ) );
    mv = mult( mv, rotateY( spinY ) );
    mv = mult( mv, translate( 0.0, -2.0, 0.0) );
    mv = mult( mv, rotateY(45));

    // Teikna alla eldri kubba
    renderOldCubes(mv);

    // Teikna núverandi kubb
    mv1 = mult( mv, translate( 0.166 + north, 6.0 - drop, 0.166 + west ) );
    mv1 = mult(mv1, scalem( 0.33, 0.33, 0.33 ) );
    mv1 = mult(mv1, rotateX( flipX * 90 ) );
    mv1 = mult(mv1, rotateY( flipY * 90 ) );
    mv1 = mult(mv1, rotateZ( flipZ * 90 ) );
    if(counter % 120 == 0 ){
      drop += 0.2;
    }
    if(rand <= 0.5) {
      gl.bindTexture( gl.TEXTURE_2D, texRed );
      gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
      gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    } else {
      gl.bindTexture( gl.TEXTURE_2D, texBlue );
      gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
      gl.drawArrays( gl.TRIANGLES, 60, 36 );
    }

    // Teikna leikvöllinn
    renderSuroundings(mv);

    requestAnimFrame(render);
}
