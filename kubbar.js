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
var texYellow;

var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var scaleY = 0.25;
var redOff = 2.75;
var blueOff = 2.62;
var stopDrop = 0;
var stig = 0;

var zDist = 7.0;

var counter = 0; // Klukka fyrir hreyfingu niður

var proLoc;
var mvLoc;

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

  // skuggi
  vec4(  1.0, -1.0 ,  1.0, 1.0),
  vec4( -1.0, -1.0 ,  1.0, 1.0),
  vec4( -1.0, -1.0 , -1.0, 1.0),
  vec4( -1.0, -1.0 , -1.0, 1.0),
  vec4(  1.0, -1.0 , -1.0, 1.0),
  vec4(  1.0, -1.0 ,  1.0, 1.0)
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
    vec2( 0.0, 0.0 ),

    // Skuggi
    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),
];

var locations = []; // 0 þýðir að viðeigandi reitur sé tómur, 1 þýðir að það sé kominn kubbur í hann
for(i=0; i < 20 * 36; i++){
  locations.push(0);
}
for(i=0; i < 36; i++){
  locations.push(1); // Falskur botn
}
var currentPos = [0, 0, 0]; // Hvaða reiti í locations erum við að hreyfa
var gamlirkubbar = [];
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

    // Lesa inn og skilgreina mynstur fyrir botninn (hvítur)
    var whiteImage = document.getElementById("WhiteImage");
    texWhite = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texWhite );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, whiteImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    // Lesa inn og skilgreina mynstur fyrir skuggann (gulur)
    var yellowImage = document.getElementById("YellowImage");
    texYellow = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texYellow );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, yellowImage );
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
            case 65:	// A - snúa jákvætt X
                nyrkubbur[2] += 1;
                break;
            case 90:	// Z - snúa neikvætt X
                nyrkubbur[2] -= 1;
                break;
            case 83:	// S - snúa jákvætt Y
                nyrkubbur[3] += 1;
                break;
            case 88:	// X - snúa neikvætt Y
                nyrkubbur[3] -= 1;
                break;
            case 68:	// D - snúa jákvætt Z
                nyrkubbur[4] += 1;
                break;
            case 67:	// C - snúa neikvætt Z
                nyrkubbur[4] -= 1;
                break;
            case 38:	// Upp
                if ( nyrkubbur[5] <= 0.4){
                  changeCurrentPos('n');
                }
                break;
            case 40:	// Niður
                if ( nyrkubbur[5] >= -0.6 && nyrkubbur[0]== 0){
                  changeCurrentPos('s');
                } else if (nyrkubbur[5] >= -0.7 && nyrkubbur[0] == 1) {
                  changeCurrentPos('s');
                }
                break;
            case 37:	// Vinstri
                if( nyrkubbur[6] >= -0.7){
                  changeCurrentPos('w');
                }
                break;
            case 39:	// Hægri
                if (nyrkubbur[6] < 0.6) {
                  changeCurrentPos('e');
                }
                break;
            case 32:	// Space (Fast drop)
                changeCurrentPos('d');
                break;
            case 13: // Entar (Hard drop)
                stopDrop = 0;
                console.log(stopDrop);
            	  while(stopDrop == 0){
                  changeCurrentPos('d');
                }
                changePoints('enter');
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
    newCube();
    render();

}

// Býr til nýjan kubb og sér um að halda utan um kubba sem búið er að spila
function newCube() {
  var annarhvor = Math.random();
  //annarhvor = 1;
  if (annarhvor <= 0.5){
    nyrkubbur[0] = 0; // v kubbur (rauður)
  } else {
    nyrkubbur[0] = 1; // l kubbur (blár)
  };
  nyrkubbur[1] = 0; // Hversu mikið er hann búinn að fara niður
  nyrkubbur[2] = 0; // Hversu oft snúið um X
  nyrkubbur[3] = 0; // Hversu oft snúið um Y
  nyrkubbur[4] = 0; // Hversu oft snúið um Z
  nyrkubbur[5] = 0; // Hversu mikið hreyfður í N/S
  nyrkubbur[6] = 0; // Hversu mikið hreyfður í E/W
  changeCurrentPos('start');  // Setur currentPos og athugar árekstra í locations
};

// Tekur við d, n, e, s, w, fX, fY, fZ, end og start
function changeCurrentPos(x){
  if (x == 'd') { // Down
    if ( locations[ currentPos[0] + 36] == 1 || locations[ currentPos[1] + 36] == 1 || locations[ currentPos[2] + 36] == 1) {
      for(i=0;i<7;i++) {
        gamlirkubbar.push(nyrkubbur[i]);
      }
      locations[currentPos[0]] = 1;
      locations[currentPos[1]] = 1;
      locations[currentPos[2]] = 1;
      newCube();
      stopDrop = 1;
      changePoints('k');
    } else {
      currentPos[0] += 36;
      currentPos[1] += 36;
      currentPos[2] += 36;
      nyrkubbur[1] += 0.25;
    }
  } else if ( x == 'n') { // Norður/upp ör
    if ( locations[currentPos[0] - 6] == 1 || locations[currentPos[1] - 6] == 1 || locations[currentPos[2] - 6 ] == 1) {
      console.log('engin breyting');
    } else {
      currentPos[0] -= 6;
      currentPos[1] -= 6;
      currentPos[2] -= 6;
      nyrkubbur[5] += 2/6;
    }
  } else if ( x == 'e') { // Austur/hægri ör
    if ( locations[currentPos[0] + 1] == 1 || locations[currentPos[1] + 1] == 1 || locations[currentPos[2] + 1 ] == 1) {
      console.log('engin breyting');
    } else {
      currentPos[0] += 1;
      currentPos[1] += 1;
      currentPos[2] += 1;
      nyrkubbur[6] += 2/6;
    }
  } else if ( x == 'w') { // Vestur/vinstri ör
    if ( locations[currentPos[0] - 1] == 1 || locations[currentPos[1] - 1] == 1 || locations[currentPos[2] - 1 ] == 1) {
      console.log('engin breyting');
    } else {
      currentPos[0] -= 1;
      currentPos[1] -= 1;
      currentPos[2] -= 1;
      nyrkubbur[6] -= 2/6;
    }
  } else if ( x == 's') { // Suður/niður ör
    if ( locations[currentPos[0] + 6] == 1 || locations[currentPos[1] + 6] == 1 || locations[currentPos[2] + 6 ] == 1) {
      console.log('engin breyting');
    } else {
      currentPos[0] += 6;
      currentPos[1] += 6;
      currentPos[2] += 6;
      nyrkubbur[5] -= 2/6;
    }
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
  } else if ( x == 'end') {
    for(i=0; i < 20 * 36; i++){
      locations[i] = 0;
    }
    currentPos[0] = 0;
    currentPos[0] = 0;
    currentPos[0] = 0;
    endGame();
  } else if ( x == 'start') { // Start staða
    if (nyrkubbur[0] == 0) { // Rauður
      if (locations[16] == 1 || locations[52] == 1 || locations[53] == 1){ // Tékka hvort eitthvað sé fyrir
        endGame();
      } else {
        currentPos[0] = 21;
        currentPos[1] = 51;
        currentPos[2] = 57;
      }
    } else if (nyrkubbur[0] == 1){                 // Blár
      if (locations[21] == 1 || locations[57] == 1 || locations[93] == 1){
        endGame();
      } else {
        currentPos[0] = 15;
        currentPos[1] = 51;
        currentPos[2] = 87;
      }
    }
  }
};

// Lætur vita að leik sé lokið
function endGame() {
  console.log('Leik lokið');
}

// Klassískt fall sem tæmir element
function empty(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

// Breytir stigum í stigagluga
function changePoints(x){
  var stigagluggi = document.querySelector('.stigagluggi');
  empty(stigagluggi);
  if (x == 'k') { // Kubbur lendir sjálfur - 150 stig
    stig += 150;
  } else if (x == 'enter') { // Kubbur lendir eftir hard drop - 500 stig
    stig += 350 // Hin 150 koma frá lendingunni
  } else if (x == 'h') { // Heilli hæð eytt - 5.000 stig
    stig += 4850;
  }

  var uppfaerdstig = document.createElement('h2'); // Div fyrir hvern flokk
  uppfaerdstig.textContent = stig;
  stigagluggi.appendChild(uppfaerdstig);
}

// Athugar hvort að hægt sé að hæð sé full og hægt að eyða
function checkIfFullFloor(){

}

// Teiknar alla kubba sem búið er að spila með
function renderOldCubes(mv){
  var fjoldiKubba = gamlirkubbar.length/7;
  for (i = 0; i<fjoldiKubba; i++) {
    if(gamlirkubbar[i*7] == 0) {
      mv1 = mult( mv, translate( gamlirkubbar[i*7+5], redOff - gamlirkubbar[i*7+1], 0.166 + gamlirkubbar[i*7+6] ) );
      mv1 = mult(mv1, scalem( 0.33, scaleY, 0.33 ) );
      mv1 = mult(mv1, rotateX( gamlirkubbar[i*7+2] * 90 ) );
      mv1 = mult(mv1, rotateY( gamlirkubbar[i*7+3] * 90 ) );
      mv1 = mult(mv1, rotateZ( gamlirkubbar[i*7+4] * 90 ) );
      gl.bindTexture( gl.TEXTURE_2D, texRed );
      gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
      gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    } else if(gamlirkubbar[i*7] == 1) {
      mv1 = mult( mv, translate( 0.166 + gamlirkubbar[i*7+5], blueOff - gamlirkubbar[i*7+1], 0.166 + gamlirkubbar[i*7+6] ) );
      mv1 = mult(mv1, scalem( 0.33, scaleY, 0.33 ) );
      mv1 = mult(mv1, rotateX( gamlirkubbar[i*7+2] * 90 ) );
      mv1 = mult(mv1, rotateY( gamlirkubbar[i*7+3] * 90 ) );
      mv1 = mult(mv1, rotateZ( gamlirkubbar[i*7+4] * 90 ) );
      gl.bindTexture( gl.TEXTURE_2D, texBlue );
      gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
      gl.drawArrays( gl.TRIANGLES, 60, 36 );
    }
  }
}

// Teiknar leikvöllinn
function renderSuroundings(mv){
  // Botn
  mv1 = mult( mv, translate( 0.0, -1.0, 0.0 ) );
  gl.bindTexture( gl.TEXTURE_2D, texWhite );
  gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
  gl.drawArrays( gl.TRIANGLES, 96, 6 );

  // Veggir
  mv1 = mult( mv, rotateX( 90 ) );
  mv1 = mult( mv1, scalem( 0.2, 1.0, 0.5 ) );
  mv1 = mult( mv1, translate( 0.0, 4.0, -1.0 ) );
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
  mv1 = mult( mv1, scalem( 0.2, 1.0, 0.5 ) );
  mv1 = mult( mv1, translate( 0.0, 4.0, 1.0 ) );
  gl.bindTexture( gl.TEXTURE_2D, texWhite );
  gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
  gl.drawArrays( gl.TRIANGLES, 102, 6 );
}

// Reiknar og teiknar gulann skugga á veggi til að gefa til kynna hvar núverandi kubbur er
function renderShadow(mv){
  var skuggi1 = 2*4*nyrkubbur[1];
  var skuggi2 = nyrkubbur[5] * 3 * 2;
  var skuggi3 = nyrkubbur[6] * 3 * 2;

  // Vesturveggur
  mv1 = mult( mv, rotateX( 90 ) );
  mv1 = mult( mv1, scalem( 0.166, 0.2, 0.125 ) );
  if (nyrkubbur[0] == 0) {
    mv1 = mult( mv1, translate( -1.0 + skuggi2, -3.99, -23.0 + skuggi1 ) );
    yellowDraw(mv1);
    mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
    yellowDraw(mv1);
    mv1 = mult( mv1, translate( 2.0, 0.0, 0.0 ) );
    yellowDraw(mv1);
  } else if (nyrkubbur[0] == 1) {
    mv1 = mult( mv1, translate( 1.0 + skuggi2, -3.99, -23.0 + skuggi1 ) );
    yellowDraw(mv1);
    mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
    yellowDraw(mv1);
    mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
    yellowDraw(mv1);
  }

  // Norðurveggur
  mv1 = mult( mv, rotateX( -90 ) );
  mv1 = mult( mv1, rotateZ( 90 ) );
  mv1 = mult( mv1, scalem( 0.166, 0.2, 0.125 ) );
  if (nyrkubbur[0] == 0) {
    mv1 = mult( mv1, translate( -1.0 - skuggi3, -3.99, 21.0 - skuggi1 ) );
    gl.bindTexture( gl.TEXTURE_2D, texYellow );
    yellowDraw(mv1);
    mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
    yellowDraw(mv1);
  } else if (nyrkubbur[0] == 1) {
    mv1 = mult( mv1, translate( -1.0 - skuggi3, -3.99, 19.0 - skuggi1 ) );
    yellowDraw(mv1);
    mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
    yellowDraw(mv1);
    mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
    yellowDraw(mv1);
  }
}

// Keyrir línur sem koma of oft óbreyttar fyrir í kóða
function yellowDraw(mv1){
  gl.bindTexture( gl.TEXTURE_2D, texYellow );
  gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
  gl.drawArrays( gl.TRIANGLES, 108, 6 );
}

// Heldur utan um allar teikningar
function render(){
    counter += 1;
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // staðsetja áhorfanda og meðhöndla músarhreyfingu
    var mv = lookAt( vec3( 0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
    mv = mult( mv, rotateX( spinX ) );
    mv = mult( mv, rotateY( 45 + spinY ) );
    mv = mult( mv, translate( 0.0, 0.0, 0.0) );

    // Teikna leikvöllinn
    renderSuroundings(mv);
    // Teikna alla eldri kubba
    renderOldCubes(mv);
    // Færa kubb niður um einn á visst margra ramma fresti
    if(counter % 20 == 0 ){
      changeCurrentPos('d'); // Droppa niður um einn
    }
    // Teikna skuggann á veggjunum sem fylgir
    renderShadow(mv);

    // Teikna núverandi kubb
    if(nyrkubbur[0] == 0) {
      mv1 = mult( mv, translate( nyrkubbur[5], redOff - nyrkubbur[1], 0.166 + nyrkubbur[6] ) );
      mv1 = mult(mv1, scalem( 0.33, scaleY, 0.33 ) );
      mv1 = mult(mv1, rotateX( nyrkubbur[2] * 90 ) );
      mv1 = mult(mv1, rotateY( nyrkubbur[3] * 90 ) );
      mv1 = mult(mv1, rotateZ( nyrkubbur[4] * 90 ) );
      gl.bindTexture( gl.TEXTURE_2D, texRed );
      gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
      gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    } else {
      mv1 = mult( mv, translate( 0.166 + nyrkubbur[5], blueOff - nyrkubbur[1], 0.166 + nyrkubbur[6] ) );
      mv1 = mult(mv1, scalem( 0.33, scaleY, 0.33 ) );
      mv1 = mult(mv1, rotateX( nyrkubbur[2] * 90 ) );
      mv1 = mult(mv1, rotateY( nyrkubbur[3] * 90 ) );
      mv1 = mult(mv1, rotateZ( nyrkubbur[4] * 90 ) );
      gl.bindTexture( gl.TEXTURE_2D, texBlue );
      gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
      gl.drawArrays( gl.TRIANGLES, 60, 36 );
    }

    requestAnimFrame(render);
}
