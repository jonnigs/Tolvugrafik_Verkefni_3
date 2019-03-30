/////////////////////////////////////////////////////////////////
//    Verkefni 3 í Tölvugrafík
//    Notandi getur spilað Þríris
//
//    Jónas G. Sigurðsson, mars 2019
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var program;

// Mynstur sem eru notuð í leiknum
var texRed;
var texBlue;
var texWhite;
var texYellow;

var speed = 1; // Hraðar á leiknum eftir því sem að fleiri hæðum er eytt
var floorsDeleted = 0; // Sýnir notenda hversu mörgum hæðum hefur veri eytt

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
var waitResponse = false; // Stöðvar leikinn ef að leik líkur og bíður eftir svari.

var zDist = 8.0;

var counter = 0; // Klukka fyrir hreyfingu niður á við

var proLoc;
var mvLoc;

/* Vertices:  Punktar sem við notum til að teikna eftir, inniheldur Rauða
              kubbinn, bláa kubbinn, spjald sem er notað í leikvöll og skugga
              og svo teningur til að teikna gamla kubba eftir.
   TexCoords: Heldur utan um hvernig á að setja viðeigandi mynstur á hnitin úr
              vertices
*/
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
  vec4(  1.0, -1.0 ,  1.0, 1.0),

  // Teningur
  vec4( -1.0, -1.0,  1.0, 1.0 ),
  vec4(  1.0, -1.0,  1.0, 1.0 ),
  vec4(  1.0, -1.0, -1.0, 1.0 ),
  vec4(  1.0, -1.0, -1.0, 1.0 ),
  vec4( -1.0, -1.0, -1.0, 1.0 ),
  vec4( -1.0, -1.0,  1.0, 1.0 ),

  vec4( -1.0, 1.0,  1.0, 1.0 ),
  vec4(  1.0, 1.0,  1.0, 1.0 ),
  vec4(  1.0, 1.0, -1.0, 1.0 ),
  vec4(  1.0, 1.0, -1.0, 1.0 ),
  vec4( -1.0, 1.0, -1.0, 1.0 ),
  vec4( -1.0, 1.0,  1.0, 1.0 ),

  vec4( -1.0, -1.0, 1.0, 1.0 ),
  vec4(  1.0, -1.0, 1.0, 1.0 ),
  vec4(  1.0,  1.0, 1.0, 1.0 ),
  vec4(  1.0,  1.0, 1.0, 1.0 ),
  vec4( -1.0,  1.0, 1.0, 1.0 ),
  vec4( -1.0, -1.0, 1.0, 1.0 ),

  vec4( -1.0, -1.0, -1.0, 1.0 ),
  vec4(  1.0, -1.0, -1.0, 1.0 ),
  vec4(  1.0,  1.0, -1.0, 1.0 ),
  vec4(  1.0,  1.0, -1.0, 1.0 ),
  vec4( -1.0,  1.0, -1.0, 1.0 ),
  vec4( -1.0, -1.0, -1.0, 1.0 ),

  vec4(  1.0, -1.0, -1.0, 1.0 ),
  vec4(  1.0,  1.0, -1.0, 1.0 ),
  vec4(  1.0,  1.0,  1.0, 1.0 ),
  vec4(  1.0,  1.0,  1.0, 1.0 ),
  vec4(  1.0, -1.0,  1.0, 1.0 ),
  vec4(  1.0, -1.0, -1.0, 1.0 ),

  vec4(  -1.0, -1.0, -1.0, 1.0 ),
  vec4(  -1.0,  1.0, -1.0, 1.0 ),
  vec4(  -1.0,  1.0,  1.0, 1.0 ),
  vec4(  -1.0,  1.0,  1.0, 1.0 ),
  vec4(  -1.0, -1.0,  1.0, 1.0 ),
  vec4(  -1.0, -1.0, -1.0, 1.0 ),
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

    // Teningur
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
];

/* Locations: 20*6*6 staka vigur sem heldur utan um hvort að það sé gamall
              kubbur í svæði sem verið er að reyna að fara í. Einnig eru
              gamlir kubbar teinaðir eftir locations.
   Types:     Hvort er Rauður eða blár kubbur í samsvarandi locations svæði.
*/
var locations = [];
var types = [];
for(i=0; i < 20 * 36; i++){
  locations.push(0);
  types.push(2);
}
for(i=0; i < 36; i++){
  locations.push(1); // Falskur botn
}

// Heldur utan um hvar núverandi kubbur er staðsettur
var currentPos = [0, 0, 0];

/* Nýrkubbur: Týpa  (Rauður/Blár),
              d     (Hversu margar hæðir hefur hann farið niður),
              north (Upp/Niður hreyfing í plani),
              west  (Vinstri/Hægri hreyfing í plani),
              pos   (Stelling sem kubburinn er í) */
var nyrkubbur = [0, 0, 0, 0, 0];

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

    // Lesa inn og skilgreina mynstur fyrir bláa kubbinn
    var blueImage = document.getElementById("BlueImage");
    texBlue = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texBlue );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, blueImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

    // Lesa inn og skilgreina mynstur fyrir botninn (hvítur)
    var whiteImage = document.getElementById("WhiteImage");
    texWhite = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texWhite );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, whiteImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

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
              if (nyrkubbur[0] == 0){
                if (nyrkubbur[4] == 1 && nyrkubbur[3] >= -0.7) {
                  changeCurrentPos('10');
                } else if (nyrkubbur[4] == 2 && nyrkubbur[3] >= -0.7) {
                  changeCurrentPos('4');
                } else if (nyrkubbur[4] == 3 && nyrkubbur[3] >= -0.7) {
                  changeCurrentPos('9');
                } else if (nyrkubbur[4] == 4) {
                  changeCurrentPos('8');
                } else if (nyrkubbur[4] == 5 && nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('11');
                } else if (nyrkubbur[4] == 6) {
                  changeCurrentPos('2');
                } else if (nyrkubbur[4] == 7 && nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('12');
                } else if (nyrkubbur[4] == 8 && nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('6');
                } else if (nyrkubbur[4] == 9) {
                  changeCurrentPos('7');
                } else if (nyrkubbur[4] == 10) {
                  changeCurrentPos('5');
                } else if (nyrkubbur[4] == 11) {
                  changeCurrentPos('1');
                } else if (nyrkubbur[4] == 12) {
                  changeCurrentPos('3');
                }
              }
              else if (nyrkubbur[0] == 1) {
                if ( nyrkubbur[4] == 1 && nyrkubbur[3] >= -0.7 && nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('2');
                } else if (nyrkubbur[4] == 2) {
                  changeCurrentPos('1');
                } else if (nyrkubbur[4] == 3) {
                  changeCurrentPos('3');
                }
              }
                break;
            case 90:	// Z - snúa neikvætt X
              if (nyrkubbur[0] == 0){
                if (nyrkubbur[4] == 1 && nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('11');
                } else if (nyrkubbur[4] == 2) {
                  changeCurrentPos('6');
                } else if (nyrkubbur[4] == 3 && nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('12');
                } else if (nyrkubbur[4] == 4 && nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('2');
                } else if (nyrkubbur[4] == 5 && nyrkubbur[3] >= -0.7) {
                  changeCurrentPos('10');
                } else if (nyrkubbur[4] == 6 && nyrkubbur[3] >= -0.7) {
                  changeCurrentPos('8');
                } else if (nyrkubbur[4] == 7 && nyrkubbur[3] >= -0.7) {
                  changeCurrentPos('9');
                } else if (nyrkubbur[4] == 8) {
                  changeCurrentPos('4');
                } else if (nyrkubbur[4] == 9) {
                  changeCurrentPos('3');
                } else if (nyrkubbur[4] == 10) {
                  changeCurrentPos('1');
                } else if (nyrkubbur[4] == 11) {
                  changeCurrentPos('5');
                } else if (nyrkubbur[4] == 12) {
                  changeCurrentPos('7');
                }
              }
              else if (nyrkubbur[0] == 1) {
                if ( nyrkubbur[4] == 1 && nyrkubbur[3] >= -0.7 && nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('2');
                } else if (nyrkubbur[4] == 2) {
                  changeCurrentPos('1');
                } else if (nyrkubbur[4] == 3) {
                  changeCurrentPos('3');
                }
              }
                break;
            case 83:	// S - snúa jákvætt Y
              if (nyrkubbur[0] == 0) {
                if (nyrkubbur[4] == 1 && nyrkubbur[3] >= -0.7) {
                  changeCurrentPos('4');
                } else if (nyrkubbur[4] == 2 && nyrkubbur[2] <= 0.7) {
                  changeCurrentPos('1');
                } else if (nyrkubbur[4] == 3 && nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('2');
                } else if (nyrkubbur[4] == 4 && nyrkubbur[2] >= -0.4) {
                  changeCurrentPos('3');
                } else if (nyrkubbur[4] == 5 && nyrkubbur[3] >= -0.7) {
                  changeCurrentPos('8');
                } else if (nyrkubbur[4] == 6 && nyrkubbur[2] <= 0.7) {
                  changeCurrentPos('5');
                } else if (nyrkubbur[4] == 7 && nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('6');
                } else if (nyrkubbur[4] == 8 && nyrkubbur[2] >= -0.4) {
                  changeCurrentPos('7');
                } else if (nyrkubbur[4] == 9 && nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('12');
                } else if (nyrkubbur[4] == 10 && nyrkubbur[2] >= -0.4) {
                  changeCurrentPos('9');
                } else if (nyrkubbur[4] == 11 && nyrkubbur[3] >= -0.7) {
                  changeCurrentPos('10');
                } else if (nyrkubbur[4] == 12 && nyrkubbur[2] <= 0.7) {
                  changeCurrentPos('11');
                }
              }
              else if (nyrkubbur[0] == 1) {
                  if (nyrkubbur[4] == 1) {
                    changeCurrentPos('1');
                  } else if (nyrkubbur[4] == 2 && nyrkubbur[2] <= 0.4 && nyrkubbur[2] >= -0.7) {
                    changeCurrentPos('3');
                  } else if (nyrkubbur[4] == 3 && nyrkubbur[3] >= -0.7 && nyrkubbur[3] <= 0.4) {
                    changeCurrentPos('2');
                  }
              }
                break;
            case 88:	// X - snúa neikvætt Y
            if (nyrkubbur[0] == 0) {
              if (nyrkubbur[4] == 1 && nyrkubbur[3] <= 0.4) {
                changeCurrentPos('2');
              } else if (nyrkubbur[4] == 2 && nyrkubbur[2] >= -0.4) {
                changeCurrentPos('3');
              } else if (nyrkubbur[4] == 3 && nyrkubbur[3] >= -0.7) {
                changeCurrentPos('4');
              } else if (nyrkubbur[4] == 4 && nyrkubbur[2] <= 0.7) {
                changeCurrentPos('1');
              } else if (nyrkubbur[4] == 5 && nyrkubbur[3] <= 0.4) {
                changeCurrentPos('6');
              } else if (nyrkubbur[4] == 6 && nyrkubbur[2] >= -0.4) {
                changeCurrentPos('7');
              } else if (nyrkubbur[4] == 7 && nyrkubbur[3] >= -0.7) {
                changeCurrentPos('8');
              } else if (nyrkubbur[4] == 8 && nyrkubbur[2] <= 0.7) {
                changeCurrentPos('5');
              } else if (nyrkubbur[4] == 9 && nyrkubbur[2] <= 0.7) {
                changeCurrentPos('10');
              } else if (nyrkubbur[4] == 10 && nyrkubbur[3] <= 0.4) {
                changeCurrentPos('11');
              } else if (nyrkubbur[4] == 11 && nyrkubbur[2] >= -0.4) {
                changeCurrentPos('12');
              } else if (nyrkubbur[4] == 12 && nyrkubbur[3] >= -0.7) {
                changeCurrentPos('9');
              }
            }
            else if (nyrkubbur[0] == 1) {
                if (nyrkubbur[4] == 1) {
                  changeCurrentPos('1');
                } else if (nyrkubbur[4] == 2 && nyrkubbur[2] <= 0.4 && nyrkubbur[2] >= -0.7) {
                  changeCurrentPos('3');
                } else if (nyrkubbur[4] == 3 && nyrkubbur[3] >= -0.7 && nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('2');
                }
            }
                break;
            case 68:	// D - snúa jákvætt Z
            if (nyrkubbur[0] == 0) {
              if (nyrkubbur[4] == 1 && nyrkubbur[2] >= -0.4) {
                changeCurrentPos('3');
              } else if (nyrkubbur[4] == 2 && nyrkubbur[2] >= -0.4) {
                changeCurrentPos('12');
              } else if (nyrkubbur[4] == 3) {
                changeCurrentPos('7');
              } else if (nyrkubbur[4] == 4 && nyrkubbur[2] >= -0.4) {
                changeCurrentPos('9');
              } else if (nyrkubbur[4] == 5) {
                changeCurrentPos('1');
              } else if (nyrkubbur[4] == 6 && nyrkubbur[2] <= 0.7) {
                changeCurrentPos('11');
              } else if (nyrkubbur[4] == 7 && nyrkubbur[2] <= 0.7) {
                changeCurrentPos('5');
              } else if (nyrkubbur[4] == 8 && nyrkubbur[2] <= 0.7) {
                changeCurrentPos('10');
              } else if (nyrkubbur[4] == 9) {
                changeCurrentPos('8');
              } else if (nyrkubbur[4] == 10) {
                changeCurrentPos('4');
              } else if (nyrkubbur[4] == 11) {
                changeCurrentPos('2');
              } else if (nyrkubbur[4] == 12) {
                changeCurrentPos('6');
              }
            }
            else if (nyrkubbur[0] == 1) {
                if (nyrkubbur[4] == 1 && nyrkubbur[2] <= 0.4 && nyrkubbur[2] >= -0.7) {
                  changeCurrentPos('3');
                } else if (nyrkubbur[4] == 2) {
                  changeCurrentPos('2');
                } else if (nyrkubbur[4] == 3) {
                  changeCurrentPos('1');
                }
            }
                break;
            case 67:	// C - snúa neikvætt Z
            if (nyrkubbur[0] == 0) {
              if (nyrkubbur[4] == 1) {
                changeCurrentPos('5');
              } else if (nyrkubbur[4] == 2 && nyrkubbur[2] <= 0.7) {
                changeCurrentPos('11');
              } else if (nyrkubbur[4] == 3 && nyrkubbur[2] <= 0.7) {
                changeCurrentPos('1');
              } else if (nyrkubbur[4] == 4 && nyrkubbur[2] <= 0.7) {
                changeCurrentPos('10');
              } else if (nyrkubbur[4] == 5 && nyrkubbur[2] >= -0.4) {
                changeCurrentPos('7');
              } else if (nyrkubbur[4] == 6 && nyrkubbur[2] >= -0.4) {
                changeCurrentPos('12');
              } else if (nyrkubbur[4] == 7) {
                changeCurrentPos('3');
              } else if (nyrkubbur[4] == 8 && nyrkubbur[2] >= -0.4) {
                changeCurrentPos('9');
              } else if (nyrkubbur[4] == 9) {
                changeCurrentPos('4');
              } else if (nyrkubbur[4] == 10) {
                changeCurrentPos('8');
              } else if (nyrkubbur[4] == 11) {
                changeCurrentPos('6');
              } else if (nyrkubbur[4] == 12) {
                changeCurrentPos('2');
              }
            }
            else if (nyrkubbur[0] == 1) {
                if (nyrkubbur[4] == 1 && nyrkubbur[2] <= 0.4 && nyrkubbur[2] >= -0.7) {
                  changeCurrentPos('3');
                } else if (nyrkubbur[4] == 2) {
                  changeCurrentPos('2');
                } else if (nyrkubbur[4] == 3) {
                  changeCurrentPos('1');
                }
            }
                break;
            case 38:	// Upp
              if (nyrkubbur[0] == 0) {
                if (nyrkubbur[4] == 1 || nyrkubbur[4] == 5 || nyrkubbur[4] == 10 || nyrkubbur[4] == 11) {
                  if (nyrkubbur[2] <= 0.4) {
                    changeCurrentPos('n');
                  }
                } else {
                  if (nyrkubbur[2] <= 0.7) {
                    changeCurrentPos('n');
                  }
                }
              } else if (nyrkubbur[0] == 1) {
                if (nyrkubbur[4] == 1 || nyrkubbur[4] == 2) {
                  if (nyrkubbur[2] <= 0.4) {
                    changeCurrentPos('n');
                  }
                } else if (nyrkubbur[4] == 3 && nyrkubbur[2] <= 0.2) {
                    changeCurrentPos('n');
                }
              }
                break;
            case 40:	// Niður
            if (nyrkubbur[0] == 0) {
              if (nyrkubbur[4] == 1 || nyrkubbur[4] == 2 || nyrkubbur[4] == 4 || nyrkubbur[4] == 5 || nyrkubbur[4] == 6 || nyrkubbur[4] == 8 || nyrkubbur[4] == 10 || nyrkubbur[4] == 11) {
                if (nyrkubbur[2] >= -0.4) {
                  changeCurrentPos('s');
                }
              } else {
                if (nyrkubbur[2] >= -0.2) {
                  changeCurrentPos('s');
                }
              }
            } else if (nyrkubbur[0] == 1) {
              if (nyrkubbur[4] == 1 || nyrkubbur[4] == 2) {
                if (nyrkubbur[2] >= -0.7) {
                  changeCurrentPos('s');
                }
              } else if (nyrkubbur[4] == 3 && nyrkubbur[2] >= -0.4) {
                  changeCurrentPos('s');
              }
            }
                break;
            case 37:	// Vinstri
            if (nyrkubbur[0] == 0) {
              if (nyrkubbur[4] == 1 || nyrkubbur[4] == 2 || nyrkubbur[4] == 3 || nyrkubbur[4] == 5 || nyrkubbur[4] == 6 || nyrkubbur[4] == 7 || nyrkubbur[4] == 11 || nyrkubbur[4] == 12) {
                if (nyrkubbur[3] >= -0.7) {
                  changeCurrentPos('w');
                }
              } else {
                if (nyrkubbur[3] >= -0.4) {
                  changeCurrentPos('w');
                }
              }
            } else if (nyrkubbur[0] == 1) {
              if (nyrkubbur[4] == 1 || nyrkubbur[4] == 3) {
                if (nyrkubbur[3] >= -0.7) {
                  changeCurrentPos('w');
                }
              } else if (nyrkubbur[4] == 2 && nyrkubbur[3] >= -0.4) {
                  changeCurrentPos('w');
              }
            }
                break;
            case 39:	// Hægri
            if (nyrkubbur[0] == 0) {
              if (nyrkubbur[4] == 1 || nyrkubbur[4] == 3 || nyrkubbur[4] == 4 || nyrkubbur[4] == 5 || nyrkubbur[4] == 7 || nyrkubbur[4] == 8 || nyrkubbur[4] == 9 || nyrkubbur[4] == 10) {
                if (nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('e');
                }
              } else {
                if (nyrkubbur[3] <= 0.2) {
                  changeCurrentPos('e');
                }
              }
            } else if (nyrkubbur[0] == 1) {
              if (nyrkubbur[4] == 1 || nyrkubbur[4] == 3) {
                if (nyrkubbur[3] <= 0.4) {
                  changeCurrentPos('e');
                }
              } else if (nyrkubbur[4] == 2 && nyrkubbur[3] <= 0.2) {
                  changeCurrentPos('e');
              }
            }
                break;
            case 32:	// Space (Fast drop)
                if ( waitResponse == false){
                  changeCurrentPos('d');
                }
                break;
            case 13: // Entar (Hard drop)
                if (waitResponse == false) {
                  stopDrop = 0;
                  while(stopDrop == 0){
                    changeCurrentPos('d');
                  }
                  changePoints('enter');
                }
                break;
            case 71: // G - new game
              if (waitResponse) {
                empty(document.querySelector('.leiklokid'));
                changePoints('start');
                newCube();
                waitResponse = false;
                speed = 1;
                floorsDeleted = 0;
                updateSpeedAndDeleted();
              }
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
  if (annarhvor <= 0.5){
    nyrkubbur[0] = 0; // v kubbur (rauður)
  } else {
    nyrkubbur[0] = 1; // l kubbur (blár)
  };
  nyrkubbur[1] = 0; // Hversu mikið er hann búinn að fara niður
  nyrkubbur[2] = 0; // Hversu mikið hreyfður í N/S
  nyrkubbur[3] = 0; // Hversu mikið hreyfður í E/W
  nyrkubbur[4] = 1; // Staðan sem kubburinn er í. 1-3 Fyrir bláan og 1-12 fyrir rauðan
  changeCurrentPos('start');  // Setur currentPos og athugar árekstra í locations
  updateSpeedAndDeleted();
};

// Tekur við d, n, e, s, w, 1-12, end og start
function changeCurrentPos(x, mv){
  if (x == 'd') { // Down
    if ( locations[ currentPos[0] + 36] == 1 || locations[ currentPos[1] + 36] == 1 || locations[ currentPos[2] + 36] == 1) {
      locations[currentPos[0]] = 1;
      locations[currentPos[1]] = 1;
      locations[currentPos[2]] = 1;
      types[currentPos[0]] = nyrkubbur[0];
      types[currentPos[1]] = nyrkubbur[0];
      types[currentPos[2]] = nyrkubbur[0];

      checkIfFullFloor();
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
    if ( locations[currentPos[0] - 6] == 0 && locations[currentPos[1] - 6] == 0 && locations[currentPos[2] - 6 ] == 0) {
      currentPos[0] -= 6;
      currentPos[1] -= 6;
      currentPos[2] -= 6;
      nyrkubbur[2] += 2/6;
    }
  } else if ( x == 'e') { // Austur/hægri ör
    if ( locations[currentPos[0] + 1] == 0 && locations[currentPos[1] + 1] == 0 && locations[currentPos[2] + 1 ] == 0) {
      currentPos[0] += 1;
      currentPos[1] += 1;
      currentPos[2] += 1;
      nyrkubbur[3] += 2/6;
    }
  } else if ( x == 'w') { // Vestur/vinstri ör
    if ( locations[currentPos[0] - 1] == 0 && locations[currentPos[1] - 1] == 0 && locations[currentPos[2] - 1 ] == 0) {
      currentPos[0] -= 1;
      currentPos[1] -= 1;
      currentPos[2] -= 1;
      nyrkubbur[3] -= 2/6;
    }
  } else if ( x == 's') { // Suður/niður ör
    if ( locations[currentPos[0] + 6] == 0 && locations[currentPos[1] + 6] == 0 && locations[currentPos[2] + 6 ] == 0 ) {
      currentPos[0] += 6;
      currentPos[1] += 6;
      currentPos[2] += 6;
      nyrkubbur[2] -= 2/6;
    }
  } else if ( x == '1') {
    if(nyrkubbur[0] == 0 && locations[currentPos[1] - 36] == 0 && locations[currentPos[1] - 6] == 0) {
      currentPos[0] = currentPos[1] - 36;
      currentPos[2] = currentPos[1] - 6;
      nyrkubbur[4] = 1;
    } else if (nyrkubbur[0] == 1 && locations[currentPos[1] - 36] == 0 && locations[currentPos[1] + 36] == 0) {
      currentPos[0] = currentPos[1] - 36;
      currentPos[2] = currentPos[1] + 36;
      nyrkubbur[4] = 1;
    }
  } else if ( x == '2') {
    if(nyrkubbur[0] == 0 && locations[currentPos[1] - 36] == 0 && locations[currentPos[1] + 1] == 0) {
      currentPos[0] = currentPos[1] - 36;
      currentPos[2] = currentPos[1] + 1;
      nyrkubbur[4] = 2;
    } else if (nyrkubbur[0] == 1 && locations[currentPos[1] - 1] == 0 && locations[currentPos[1] + 1] == 0) {
      currentPos[0] = currentPos[1] - 1;
      currentPos[2] = currentPos[1] + 1;
      nyrkubbur[4] = 2;
    }
  } else if ( x == '3') {
    if(nyrkubbur[0] == 0 && locations[currentPos[1] - 36] == 0 && locations[currentPos[1] + 6] == 0) {
      currentPos[0] = currentPos[1] - 36;
      currentPos[2] = currentPos[1] + 6;
      nyrkubbur[4] = 3;
    } else if (nyrkubbur[0] == 1 && locations[currentPos[1] - 6] == 0 && locations[currentPos[1] + 6] == 0) {
      currentPos[0] = currentPos[1] - 6;
      currentPos[2] = currentPos[1] + 6;
      nyrkubbur[4] = 3;
    }
  } else if ( x == '4') {
    if (locations[currentPos[1] - 36] == 0 && locations[currentPos[1] - 1] == 0) {
      currentPos[0] = currentPos[1] - 36;
      currentPos[2] = currentPos[1] - 1;
      nyrkubbur[4] = 4;
    }
  } else if ( x == '5') {
    if (locations[currentPos[1] + 36] == 0 && locations[currentPos[1] - 6] == 0) {
      currentPos[0] = currentPos[1] + 36;
      currentPos[2] = currentPos[1] - 6;
      nyrkubbur[4] = 5;
    }
  } else if ( x == '6') {
    if (locations[currentPos[1] + 36] == 0 && locations[currentPos[1] + 1] == 0) {
      currentPos[0] = currentPos[1] + 36;
      currentPos[2] = currentPos[1] + 1;
      nyrkubbur[4] = 6;
    }
  } else if ( x == '7') {
    if (locations[currentPos[1] + 36] == 0 && locations[currentPos[1] + 6] == 0) {
      currentPos[0] = currentPos[1] + 36;
      currentPos[2] = currentPos[1] + 6;
      nyrkubbur[4] = 7;
    }
  } else if ( x == '8') {
    if (locations[currentPos[1] + 36] == 0 && locations[currentPos[1] - 1] == 0) {
      currentPos[0] = currentPos[1] + 36;
      currentPos[2] = currentPos[1] - 1;
      nyrkubbur[4] = 8;
    }
  } else if ( x == '9') {
    if (locations[currentPos[1] - 1] == 0 && locations[currentPos[1] + 6] == 0) {
      currentPos[0] = currentPos[1] - 1;
      currentPos[2] = currentPos[1] + 6;
      nyrkubbur[4] = 9;
    }
  } else if ( x == '10') {
    if (locations[currentPos[1] - 1] == 0 && locations[currentPos[1] - 6] == 0) {
      currentPos[0] = currentPos[1] - 1;
      currentPos[2] = currentPos[1] - 6;
      nyrkubbur[4] = 10;
    }
  } else if ( x == '11') {
    if (locations[currentPos[1] + 1] == 0 && locations[currentPos[1] - 6] == 0) {
      currentPos[0] = currentPos[1] + 1;
      currentPos[2] = currentPos[1] - 6;
      nyrkubbur[4] = 11;
    }
  } else if ( x == '12') {
    if (locations[currentPos[1] + 1] == 0 && locations[currentPos[1] + 6] == 0) {
      currentPos[0] = currentPos[1] + 1;
      currentPos[2] = currentPos[1] + 6;
      nyrkubbur[4] = 12;
    }
  } else if ( x == 'end') {
    for(i=0; i < 20 * 36; i++){
      locations[i] = 0;
    }
    currentPos[0] = 0;
    currentPos[0] = 0;
    currentPos[0] = 0;
    endGame();
  } else if ( x == 'start') {      // Start staða
    if (nyrkubbur[0] == 0) {       // Rauður
      if (locations[16] == 1 || locations[52] == 1 || locations[53] == 1){ // Tékka hvort eitthvað sé fyrir
        endGame();
      } else {
        currentPos[0] = 21;
        currentPos[1] = 57;
        currentPos[2] = 51;
      }
    } else if (nyrkubbur[0] == 1){  // Blár
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
  var leiklokid = document.querySelector('.leiklokid');
  empty(leiklokid);
  var skilabod = document.createElement('h3'); // Div fyrir hvern flokk
  skilabod.textContent = "Leik lokið, ýttu á 'G' til að hefja nýjan leik";
  leiklokid.appendChild(skilabod);

  // Reset á locations
  locations = [];
  for(i=0; i < 20 * 36; i++){
    locations.push(0);
  }
  for(i=0; i < 36; i++){
    locations.push(1); // Falskur botn
  }
  waitResponse = true;

}

// Breytir hraða og hversu mörgum hæðum hefur verið breytt
function updateSpeedAndDeleted() {
  var fjoldihaeda = document.querySelector('.fjoldihaeda');
  empty(fjoldihaeda);
  var skilabod = document.createElement('h3');
  if(floorsDeleted == 1) {
      skilabod.textContent = "Þú hefur eytt " + floorsDeleted + " hæð";
  } else {
    skilabod.textContent = "Þú hefur eytt " + floorsDeleted + " hæðum";
  }
  fjoldihaeda.appendChild(skilabod);

  var hradi = document.querySelector('.hradi');
  empty(hradi);
  skilabod = document.createElement('h3');
  skilabod.textContent = "Hraði: " + speed;
  hradi.appendChild(skilabod);
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
  } else if (x == 'h') { // Heilli hæð eytt - 10.000 stig
    stig += 9850;
  } else if (x == 'start') {
    stig = 0;
  }

  var uppfaerdstig = document.createElement('h2'); // Div fyrir hvern flokk
  uppfaerdstig.textContent = stig;
  stigagluggi.appendChild(uppfaerdstig);
}

// Athugar hvort að hægt sé að hæð sé full og hægt að eyða
function checkIfFullFloor(){
  var haed = 0;
  for (i=0; i<20; i++) {
    for (j=0; j<36; j++){
      haed += locations[i*36 +j];
    }
    if (haed == 36){
      for (l=i*36-1; l>-1; l--) {
        locations[l+36] = locations[l];
      }
      for (h=0; h<36; h++) {
        locations[h] = 0;
      }
      changePoints('h');
      floorsDeleted += 1;
      if (floorsDeleted % 4 == 0) {
        speed += 1;
        if (speed >= 11) {
          speed = 10;
        }
      }
      haed = 0;
    } else {
      haed = 0;
    }
  }
}

// Teikna kubba sem hafa lent eftir hniti í locations[i]
function renderOldByLocation(mv){
  mv1 = mult( mv, translate( 0.83, 0.13, 0.166 ) );
  mv1 = mult( mv1, scalem( 0.33/2, scaleY/2, 0.33/2 ) );
  mv1 = mult( mv1, translate( 0.0, 22.0, -6.0 ) ); // Kubbur í sæti 1
  mv = mult(mv1 , rotateY(-90) );

  // Test til að setja kubbinn í sæti 702
  for (i=0; i<20*36; i++) {
    if (locations[i] == 1){
      var test1 = Math.floor(i/36);
      var test2 = Math.floor( (i - test1*36)/6 );
      var test3 = i - 36*test1 - 6*test2;
      mv1 = mult( mv, translate( 2*test3, -2 * test1, 2*test2 ) );
      if (types[i] == 0) {
        gl.bindTexture( gl.TEXTURE_2D, texRed );
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
        gl.drawArrays( gl.TRIANGLES, 114, 36 );
      } else if (types[i] == 1) {
        gl.bindTexture( gl.TEXTURE_2D, texBlue );
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
        gl.drawArrays( gl.TRIANGLES, 114, 36 );
      }
    }
  }
}

// Snýr kubbum fyrir teiningu
function rotateCube(mv1, type, pos) {
  if (type == 0) { // Rauður
    if (pos == 2) {
      mv1 = mult(mv1, rotateY( -90 ) );
      mv1 = mult(mv1, translate(0.5, 0.0, 0.5));
    } else if (pos == 3) {
      mv1 = mult(mv1, rotateY( 180 ) );
      mv1 = mult(mv1, translate(1.0, 0.0, 0.0));
    } else if (pos == 4) {
      mv1 = mult(mv1, rotateY( 90 ) );
      mv1 = mult(mv1, translate(0.5, 0.0, -0.5));
    } else if (pos == 5) {
      mv1 = mult(mv1, rotateZ( -90 ) );
      mv1 = mult(mv1, translate(1.0, 0.0, 0.0));
    } else if (pos == 6) {
      mv1 = mult(mv1, rotateY( -90 ) );
      mv1 = mult(mv1, rotateX( 180 ) );
      mv1 = mult(mv1, translate(0.5, 1.0, -0.5));
    } else if (pos == 7) {
      mv1 = mult(mv1, rotateZ( 90 ) );
      mv1 = mult(mv1, rotateY( 180 ) );
      mv1 = mult(mv1, translate(1.0, 1.0, 0.0));
    } else if (pos == 8) {
      mv1 = mult(mv1, rotateY( 90 ) );
      mv1 = mult(mv1, rotateX( 180 ) );
      mv1 = mult(mv1, translate(0.5, 1.0, 0.5));
    } else if (pos == 9) {
      mv1 = mult(mv1, rotateX( 90 ) );
      mv1 = mult(mv1, rotateZ( 180 ) );
      mv1 = mult(mv1, translate(1.0, 0.5, 0.5));
    } else if (pos == 10) {
      mv1 = mult(mv1, rotateX( 90 ) );
      mv1 = mult(mv1, rotateZ( 270 ) );
      mv1 = mult(mv1, translate(0.5, 0.0, 0.5));
    } else if (pos == 11) {
      mv1 = mult(mv1, rotateX( 90 ) );
      mv1 = mult(mv1, translate(0.0, 0.5, 0.5));
    } else if (pos == 12) {
      mv1 = mult(mv1, rotateX( 90 ) );
      mv1 = mult(mv1, rotateZ( 90 ) );
      mv1 = mult(mv1, translate(0.5 , 1.0, 0.5));
    }
  } else if (type == 1) { // Blár
    if (pos == 2) {
      mv1 = mult(mv1, rotateX( 90 ) );
    } else if (pos == 3) {
      mv1 = mult(mv1, rotateX( 90 ) );
      mv1 = mult(mv1, rotateZ( 90 ) );
    }
  }
  return mv1;
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
  var skuggi2 = nyrkubbur[2] * 3 * 2;
  var skuggi3 = nyrkubbur[3] * 3 * 2;

  // Vesturveggur
  mv1 = mult( mv, rotateX( 90 ) );
  mv1 = mult( mv1, scalem( 0.166, 0.2, 0.125 ) );
  if (nyrkubbur[0] == 0) {
    if (nyrkubbur[4] == 1) {
      mv1 = mult( mv1, translate( -1.0 + skuggi2, -3.99, -23.0 + skuggi1 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 2.0, 0.0, 0.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 2 || nyrkubbur[4] == 4) {
      mv1 = mult( mv1, translate( -1.0 + skuggi2, -3.99, -21.0 + skuggi1 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, -2.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 3) {
      mv1 = mult( mv1, translate( -1.0 + skuggi2, -3.99, -21.0 + skuggi1 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, -2.0 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( -2.0, 0.0, 2.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 5) {
      mv1 = mult( mv1, translate( -1.0 + skuggi2, -3.99, -21.0 + skuggi1 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 2.0, 0.0, -2.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 6 || nyrkubbur[4] == 8) {
      mv1 = mult( mv1, translate( -1.0 + skuggi2, -3.99, -21.0 + skuggi1 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 7) {
      mv1 = mult( mv1, translate( -1.0 + skuggi2, -3.99, -21.0 + skuggi1 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( -2.0, 0.0, -2.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 9 || nyrkubbur[4] == 12) {
      mv1 = mult( mv1, translate( -1.0 + skuggi2, -3.99, -21.0 + skuggi1 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( -2.0, 0.0, 0.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 10 || nyrkubbur[4] == 11) {
      mv1 = mult( mv1, translate( -1.0 + skuggi2, -3.99, -21.0 + skuggi1 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 2.0, 0.0, 0.0 ) );
      yellowDraw(mv1);
    }

  } else if (nyrkubbur[0] == 1) {
    if ( nyrkubbur[4] == 1) {
      mv1 = mult( mv1, translate( 1.0 + skuggi2, -3.99, -23.0 + skuggi1 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 2) {
      mv1 = mult( mv1, translate( 1.0 + skuggi2, -3.99, -21.0 + skuggi1 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 3) {
      mv1 = mult( mv1, translate( -1.0 + skuggi2, -3.99, -21.0 + skuggi1 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 2.0, 0.0, 0.0 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 2.0, 0.0, 0.0 ) );
      yellowDraw(mv1);
    }
  }

  // Norðurveggur
  mv1 = mult( mv, rotateX( -90 ) );
  mv1 = mult( mv1, rotateZ( 90 ) );
  mv1 = mult( mv1, scalem( 0.166, 0.2, 0.125 ) );
  if (nyrkubbur[0] == 0) {

    if (nyrkubbur[4] == 1 || nyrkubbur[4] == 3) {
      mv1 = mult( mv1, translate( -1.0 - skuggi3, -3.99, 21.0 - skuggi1 ) );
      gl.bindTexture( gl.TEXTURE_2D, texYellow );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 2) {
      mv1 = mult( mv1, translate( -1.0 - skuggi3, -3.99, 23.0 - skuggi1 ) );
      gl.bindTexture( gl.TEXTURE_2D, texYellow );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, -2.0 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( -2.0, 0.0, 0.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 4) {
      mv1 = mult( mv1, translate( -1.0 - skuggi3, -3.99, 23.0 - skuggi1 ) );
      gl.bindTexture( gl.TEXTURE_2D, texYellow );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, -2.0 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 2.0, 0.0, 0.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 5 || nyrkubbur[4] == 7) {
      mv1 = mult( mv1, translate( -1.0 - skuggi3, -3.99, 21.0 - skuggi1 ) );
      gl.bindTexture( gl.TEXTURE_2D, texYellow );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, -2.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 6 ) {
      mv1 = mult( mv1, translate( -1.0 - skuggi3, -3.99, 21.0 - skuggi1 ) );
      gl.bindTexture( gl.TEXTURE_2D, texYellow );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, -2.0 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( -2.0, 0.0, 2.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 8) {
      mv1 = mult( mv1, translate( -1.0 - skuggi3, -3.99, 21.0 - skuggi1 ) );
      gl.bindTexture( gl.TEXTURE_2D, texYellow );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, -2.0 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 2.0, 0.0, 2.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 9 || nyrkubbur[4] == 10) {
      mv1 = mult( mv1, translate( -1.0 - skuggi3, -3.99, 21.0 - skuggi1 ) );
      gl.bindTexture( gl.TEXTURE_2D, texYellow );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 2.0, 0.0, 0.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 11 || nyrkubbur[4] == 12) {
      mv1 = mult( mv1, translate( -1.0 - skuggi3, -3.99, 21.0 - skuggi1 ) );
      gl.bindTexture( gl.TEXTURE_2D, texYellow );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( -2.0, 0.0, 0.0 ) );
      yellowDraw(mv1);
    }
  } else if (nyrkubbur[0] == 1) {
    if (nyrkubbur[4] == 1) {
      mv1 = mult( mv1, translate( -1.0 - skuggi3, -3.99, 19.0 - skuggi1 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 0.0, 0.0, 2.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 2) {
      mv1 = mult( mv1, translate( -3.0 - skuggi3, -3.99, 21.0 - skuggi1 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 2.0, 0.0, 0.0 ) );
      yellowDraw(mv1);
      mv1 = mult( mv1, translate( 2.0, 0.0, 0.0 ) );
      yellowDraw(mv1);
    } else if (nyrkubbur[4] == 3) {
      mv1 = mult( mv1, translate( -1.0 - skuggi3, -3.99, 21.0 - skuggi1 ) );
      yellowDraw(mv1);
    }
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
    mv = mult( mv, translate( 0.0, -0.3, 0.0) );

    // Teikna leikvöllinn
    renderSuroundings(mv);
    // Teikna alla eldri kubba
    renderOldByLocation(mv);
    // Færa kubb niður um einn á visst margra ramma fresti (Ef leik er ekki lokið)
    if (waitResponse == false){
      if(counter % (120 - 10*speed) == 0 ){ // Hraði eykst eftir því sem fleiri hæðum er eytt
        changeCurrentPos('d', mv); // Droppa niður um einn
      }
      // Teikna skuggann á veggjunum sem fylgir
      renderShadow(mv);

      // Teikna núverandi kubb
      if(nyrkubbur[0] == 0) {
        mv1 = mult( mv, translate( nyrkubbur[2], redOff - nyrkubbur[1], 0.166 + nyrkubbur[3] ) );
        mv1 = mult(mv1, scalem( 0.33, scaleY, 0.33 ) );

        if ( nyrkubbur[4] == 2) {
          mv1 = rotateCube(mv1, 0, 2);
        } else if (nyrkubbur[4] == 3) {
          mv1 = rotateCube(mv1, 0, 3);
        } else if (nyrkubbur[4] == 4) {
          mv1 = rotateCube(mv1, 0, 4);
        } else if (nyrkubbur[4] == 5) {
          mv1 = rotateCube(mv1, 0, 5);
        } else if (nyrkubbur[4] == 6) {
          mv1 = rotateCube(mv1, 0, 6);
        } else if (nyrkubbur[4] == 7) {
          mv1 = rotateCube(mv1, 0, 7);
        } else if (nyrkubbur[4] == 8) {
          mv1 = rotateCube(mv1, 0, 8);
        } else if (nyrkubbur[4] == 9) {
          mv1 = rotateCube(mv1, 0, 9);
        } else if (nyrkubbur[4] == 10) {
          mv1 = rotateCube(mv1, 0, 10);
        } else if (nyrkubbur[4] == 11) {
          mv1 = rotateCube(mv1, 0, 11);
        } else if (nyrkubbur[4] == 12) {
          mv1 = rotateCube(mv1, 0, 12);
        }

        gl.bindTexture( gl.TEXTURE_2D, texRed );
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
        gl.drawArrays( gl.TRIANGLES, 0, 60 );
      }
      else if (nyrkubbur[0] == 1){
        mv1 = mult( mv, translate( 0.166 + nyrkubbur[2], blueOff - nyrkubbur[1], 0.166 + nyrkubbur[3] ) );
        mv1 = mult(mv1, scalem( 0.33, scaleY, 0.33 ) );

        if (nyrkubbur[4] == 2) {
          mv1 = rotateCube(mv1, 1, 2);
        } else if (nyrkubbur[4] == 3) {
          mv1 = rotateCube(mv1, 1, 3);
        }
        gl.bindTexture( gl.TEXTURE_2D, texBlue );
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
        gl.drawArrays( gl.TRIANGLES, 60, 36 );
      }
    }

    requestAnimFrame(render);
}
