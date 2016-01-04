var scene,	cube,	plane1, plane2,	plane3, sphere, zerosen, propeller, snowbiom,
	camera,	light,	ambient, axis,
	renderer,	controls;

var a_push, s_push, d_push, w_push, up_push, down_push,
	q_push, e_push;

var seaX = 3500 * 3,
	seaZ = 3000 * 3;

init();
animate();

function　init (){

	var width  = 1000,
		height = 800;

	scene = new THREE.Scene();

	var Geometry = new THREE.CubeGeometry(50, 50, 50);
	var Material = new THREE.MeshLambertMaterial({color: "red"});
	cube = new THREE.Mesh(Geometry, Material);
	cube.castShadow = true;
	cube.position.set(0, 50,0); //position, rotate, scale
	//scene.add(cube);


	var p1Geometry = new THREE.PlaneGeometry(seaX, seaZ);
	var p1Material = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture("sea.jpg"),
		side: THREE.DoubleSide});
	plane1 = new THREE.Mesh(p1Geometry, p1Material);
	plane1.receiveShadow = true;
	plane1.position.set(0, -700, -seaZ);
	plane1.rotation.x = 90 * Math.PI / 180;
	scene.add(plane1);

	var p2Geometry = new THREE.PlaneGeometry(seaX, seaZ);
	var p2Material = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture("sea.jpg"),
		side: THREE.DoubleSide});
	plane2 = new THREE.Mesh(p2Geometry, p2Material);
	plane2.receiveShadow = true;
	plane2.position.set(0, -700, 0);
	plane2.rotation.x = 90 * Math.PI / 180;
	scene.add(plane2);

	var p3Geometry = new THREE.PlaneGeometry(seaX, seaZ);
	var p3Material = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture("sea.jpg"),
		side: THREE.DoubleSide});
	plane3 = new THREE.Mesh(p3Geometry, p3Material);
	plane3.receiveShadow = true;
	plane3.position.set(0, -700, seaZ);
	plane3.rotation.x = 90 * Math.PI / 180;
	scene.add(plane3);

	var sphereGeo = new THREE.SphereGeometry(3000, 36, 36);  // 半径2000の球
	var greanMaterial = new THREE.MeshLambertMaterial( {  
		map: THREE.ImageUtils.loadTexture("sky2.png"),
        side:THREE.DoubleSide} );
	sphere = new THREE.Mesh( sphereGeo, greanMaterial );
	sphere.position.y = -800;
	scene.add( sphere );

	var propellerGEO = new THREE.CircleGeometry(100, 36); // 半径100、正36角形
	var propellerMTL = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("object/A6M_ZERO/propeller_rotation_D_thin.jpg"),
        side:THREE.DoubleSide, opacity:0.7, transparent: true});
	propeller = new THREE.Mesh( propellerGEO, propellerMTL );
	propeller.position.z = 382;
	propeller.position.y = -8;
	scene.add( propeller );

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
	};

	var onError = function ( xhr ) {	};

	var ZerosenLoader = new THREE.OBJMTLLoader();
  
    ZerosenLoader.load("object/A6M_ZERO/zero2.obj", "object/A6M_ZERO/zero2.mtl",  function (object){
		zerosen = object.clone();
		zerosen.scale.set(30, 30, 30);
		zerosen.rotation.set(0, 0, 0);
		zerosen.position.set(0, 0, 0);
		scene.add(zerosen);
	}, onProgress, onError);

	//light
	light = new THREE.DirectionalLight("white", 1);
	light.position.set(30, 200, 30);
	light.castShadow = true;
	scene.add(light);

	ambient = new THREE.AmbientLight(0xffffff);
	scene.add(ambient);

	//camera
	camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
	camera.position.set(200, 200, 1000);
	//camera.position.x = 0;
	//camera.position = new THREE.Vectror3(0,0,0); のような書き方もある
	//camera.lookAt(cube.position);

	// hepler
	axis = new THREE.AxisHelper(2000);
	axis.position.set(0,0,0);
	scene.add(axis);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	renderer.setClearColor(0xeeeeee, 1);
	renderer.shadowMapEnabled = true;
	document.getElementById('container').appendChild(renderer.domElement);


}

function animate() {
    requestAnimationFrame(animate);
    cameramove();
    seamove();
	//camera.lookAt(zerosen.position);
    render();
}

function render() {
	propeller.rotation.z += 10;
    renderer.render(scene, camera);
}

function cameramove(){
	if(a_push)   { camera.position.x -= 10; }
	if(s_push)   { camera.position.y -= 10; }
	if(d_push)   { camera.position.x += 10; }
	if(w_push)   { camera.position.y += 10; }
	if(up_push)  { camera.position.z += 10; }
	if(down_push){ camera.position.z -= 10; }
	if(q_push)   { camera.rotation.y -= 0.05;}
	if(e_push)	 { camera.rotation.y += 0.05;}
}

function seamove() {
	if(plane1.position.z <= -seaZ){ plane1.position.z = seaZ; }
	if(plane2.position.z <= -seaZ){ plane2.position.z = seaZ; }
	if(plane3.position.z <= -seaZ){ plane3.position.z = seaZ; }
	plane1.position.z -= 10;
	plane2.position.z -= 10;
	plane3.position.z -= 10;
}

document.onkeydown = KeyDownFunc;
function KeyDownFunc(e){

	// カメラをキャラに合わせる R
	if(e.keyCode == 82){ camera.lookAt(zerosen.position); }

	// 左 A
	if(e.keyCode == 65){ a_push = true; }
	// 下 S
	if(e.keyCode == 83){ s_push = true; }
	// 右 D
	if(e.keyCode == 68){ d_push = true; }
	// 上 W
	if(e.keyCode == 87){ w_push = true; }
	// 手前 down
	if(e.keyCode == 38){ down_push = true; }
	// 奥 up
	if(e.keyCode == 40){ up_push = true; }
	// 時計回り Q
	if(e.keyCode == 81){ q_push = true; }
	// 逆時計回り E
	if(e.keyCode == 69){ e_push = true; }
};

document.onkeyup = KeyUpFunc;
function KeyUpFunc(e){
	// 左 A
	if(e.keyCode == 65){ a_push = false; }
	// 下 S
	if(e.keyCode == 83){ s_push = false; }
	// 右 D
	if(e.keyCode == 68){ d_push = false; }
	// 上 W
	if(e.keyCode == 87){ w_push = false; }
	// 手前 down
	if(e.keyCode == 38){ down_push = false; }
	// 奥 up
	if(e.keyCode == 40){ up_push = false; }
	// 時計回り Q
	if(e.keyCode == 81){ q_push = false; }
	// 逆時計回り E
	if(e.keyCode == 69){ e_push = false; }
}

document.write("Test Text");