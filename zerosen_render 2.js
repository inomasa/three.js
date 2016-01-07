var scene,	cube,	plane1, plane2,	plane3, sphere, zerosen, propeller, snowbiom,
	camera,	light,	ambient, axis,
	renderer,	controls;

var a_push, s_push, d_push, w_push, up_push, down_push,
	q_push, e_push, r_push, zeroLook;


var statusValue = [];	//0:重量 1:空気密度 2:飛行速度 3:翼面積 4:迎え角 5:揚力 6:揚力係数 7:抗力 8: 抗力係数
var seaX = 3500 * 3,
	seaZ = 3000 * 3;

var test = 100,
	Xrotate = 0,	Yrotate = 0, Radius;

init();
animate();

function　init (){

	var width  = 1000,	// 表示させるサイズ 横
		height = 600;	// 　　　　　　　　 縦

		Radius = 500;	// カメラの半径の初期値

	scene = new THREE.Scene();		// 表示させるための大元、すべてのデータをこれに入れ込んでいく。

	// var Geometry = new THREE.CubeGeometry(50, 50, 50);
	// var Material = new THREE.MeshLambertMaterial({color: "red"});
	// cube = new THREE.Mesh(Geometry, Material);
	// cube.castShadow = true;
	// cube.position.set(0, 50,0); //position, rotate, scale
	//scene.add(cube);

	// 海面が動いているようみ見せるため、３つ生成
	// 海面その１
	var p1Geometry = new THREE.PlaneGeometry(seaX, seaZ);	// 四角形の primitive を使用
	var p1Material = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture("sea.jpg"),		// 用意していた海面のテクスチャを指定
		side: THREE.DoubleSide});							// 両面表示するように設定
	plane1 = new THREE.Mesh(p1Geometry, p1Material);		// Geometry + Material = Mesh 
	plane1.receiveShadow = true;							// 影がつくようにする
	plane1.position.set(0, -700, -seaZ);					// 初期値設定
	plane1.rotation.x = 90 * Math.PI / 180;					// x, z 軸に平行になるよう調整
	scene.add(plane1);										// sceneに追加
	
	// 海面その２
	var p2Geometry = new THREE.PlaneGeometry(seaX, seaZ);	// 以下同文
	var p2Material = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture("sea.jpg"),
		side: THREE.DoubleSide});
	plane2 = new THREE.Mesh(p2Geometry, p2Material);
	plane2.receiveShadow = true;
	plane2.position.set(0, -700, 0);
	plane2.rotation.x = 90 * Math.PI / 180;
	scene.add(plane2);
	
	// 海面その３
	var p3Geometry = new THREE.PlaneGeometry(seaX, seaZ);	// 以下同文
	var p3Material = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture("sea.jpg"),
		side: THREE.DoubleSide});
	plane3 = new THREE.Mesh(p3Geometry, p3Material);
	plane3.receiveShadow = true;
	plane3.position.set(0, -700, seaZ);
	plane3.rotation.x = 90 * Math.PI / 180;
	scene.add(plane3);

	// 球体の上半分を表示させ、空として演出
	var sphereGeo = new THREE.SphereGeometry(3000, 36, 36);  // 半径2000の球 空のテクスチャ
	var greanMaterial = new THREE.MeshLambertMaterial( {  
		map: THREE.ImageUtils.loadTexture("sky2.png"),
        side:THREE.DoubleSide} );
	sphere = new THREE.Mesh( sphereGeo, greanMaterial );
	sphere.position.y = -800;
	scene.add( sphere );

	// 零戦のプロペラ
	var propellerGEO = new THREE.CircleGeometry(60, 36); // 半径100、正36角形
	var propellerMTL = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("object/A6M_ZERO/propeller_rotation_D_thin.jpg"),
        side:THREE.DoubleSide, opacity:0.7, transparent: true});
	propeller = new THREE.Mesh( propellerGEO, propellerMTL );
	propeller.position.z = 229;
	propeller.position.y = -5;
	scene.add( propeller );

	// obj mtl データを読み込んでいるときの処理
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
	};

	// obj mtl が読み込めなかったときのエラー処理
	var onError = function ( xhr ) {	};

	// 零戦の読み込み
	var ZerosenLoader = new THREE.OBJMTLLoader(); 
    ZerosenLoader.load("object/A6M_ZERO/zero2.obj", "object/A6M_ZERO/zero2.mtl",  function (object){
		zerosen = object.clone();
		zerosen.scale.set(30, 30, 30);			// 元データが小さすぎるので縮尺を調整
		zerosen.rotation.set(0, 0, 0);			// 角度の初期化
		zerosen.position.set(0, 0, 0);			// 位置の初期化
		scene.add(zerosen);						// sceneに追加
	}, onProgress, onError);		// obj mtl データは(.obj, .mtl. 初期処理, 読み込み時の処理, エラー処理)
    								// と指定する。
	//light
	light = new THREE.DirectionalLight("white", 1);
	light.position.set(30, 200, 30);
	light.castShadow = true;
	scene.add(light);

	ambient = new THREE.AmbientLight(0xffffff);
	scene.add(ambient);

	//camera
	camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
	camera.position.set(0, 0, 500);
	//camera.position.x = 0;
	//camera.position = new THREE.Vectror3(0,0,0); のような書き方もある
	//camera.lookAt(cube.position);

	// hepler
	axis = new THREE.AxisHelper(2000);	// 補助線を2000px分表示
	axis.position.set(0,-4,0);			// 零戦の真ん中に合わせるため、少しずらす
	scene.add(axis);

	// 画面表示
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);		// 画面の大きさを設定
	renderer.setClearColor(0xeeeeee, 1);	
	renderer.shadowMapEnabled = true;		
	// html の container というid に追加
	document.getElementById('container').appendChild(renderer.domElement);

	// ステータスの初期化
	DefaultStatusValueSet();
}

// 値を変更させる処理
function animate() {
    requestAnimationFrame(animate);
    cameramove();	// カメラ移動
    seamove();		// 海面移動
    render();		// 再描画処理
}

function render() {
	propeller.rotation.z += 10;		// プロペラ回転
    renderer.render(scene, camera);	// 再描画
}

function cameramove(){
	if(a_push)   { --Xrotate; }		// 時計回り
	if(d_push)   { ++Xrotate; }		// 反時計回り	
	if(Xrotate == -360 || 360 == Xrotate){ Xrotate = 0; }	// Xrotateが 360 を越えたら 0 で初期化
	// カメラ位置(零戦までの距離)を400〜1000までに制限
	if(400 < Radius){
		if(down_push){ Radius -= 10; }
	}
	if(Radius < 1000){
		if(up_push)  { Radius += 10; }
	}
	if(s_push)   { camera.position.y -= 10; }	// 上移動
	if(w_push)   { camera.position.y += 10; }	// 下移動
	
	// カメラの視点回転の計算
	camera.position.x = Radius * Math.sin(Xrotate * Math.PI / 180);
	camera.position.z = Radius * Math.cos(Xrotate * Math.PI / 180);
	
	// 常時零戦の方向を向かせる
	if(zeroLook) { camera.lookAt(zerosen.position);}
}

// 海面の移動処理
function seamove() {
	if(plane1.position.z <= -seaZ){ plane1.position.z = seaZ; }
	if(plane2.position.z <= -seaZ){ plane2.position.z = seaZ; }
	if(plane3.position.z <= -seaZ){ plane3.position.z = seaZ; }
	plane1.position.z -= 10;
	plane2.position.z -= 10;
	plane3.position.z -= 10;
}

function LiftResCal(){	// 揚力抗力計算 

}		

function TextSet(){
	document.getElementById("Weight").textContent					= '総重量:　 ' + statusValue[0] + ' kg';
	document.getElementById("Air_Density").textContent				= '空気密度: ' + statusValue[1] + ' kg/m^3';
	document.getElementById("Speed").textContent					= '飛行速度: ' + statusValue[2] + ' km/h';
	document.getElementById("Wing_Area").textContent				= '翼面積:　 ' + statusValue[3] + ' m^2';
	document.getElementById("Angle").textContent					= '迎え角: 　' + statusValue[4] + ' °';
	document.getElementById("Lift").textContent						= '揚力:　　 ' + statusValue[5] + ' N';
	document.getElementById("Lift_coefficient").textContent			= '揚力係数: ' + statusValue[6];
	document.getElementById("Resistivity").textContent				= '抗力:　　 ' + statusValue[7] + ' N';
	document.getElementById("Resistivity_coefficient").textContent	= '抗力係数: ' + statusValue[8];
}
// html のデータを更新するため、 TextSetを10ミリ秒毎で実行
setInterval('TextSet()', 10);

function DefaultStatusValueSet(){
	statusValue[0] = 2421; 		// A6M2b 零戦二一式の総重量
	statusValue[1] = 0.8191; 	// 標準大気 上空4000m 地点の空気密度  kg / m^3
	statusValue[2] = 333;		// 大戦時の標準巡航速度 km 	最高速533.4km/h
	statusValue[3] = 22.44;		// 翼面積 m^2
	statusValue[4] = 0.0;		// 迎え角
	statusValue[5] = 0.0;		// 揚力
	statusValue[6] = 0.2434;	// 揚力係数 迎え角0°として計算
	statusValue[7] = 0.0;		// 抗力
	statusValue[8] = 0.00655;	// 揚力係数 迎え角0°として計算
}

// キーを押した時の処理
document.onkeydown = KeyDownFunc;
function KeyDownFunc(e){

	//  R
	// if(e.keyCode == 82){ r_push = true; }
	// 左 A
	if(e.keyCode == 65){ a_push = true; zeroLook = true;}
	// 下 S
	if(e.keyCode == 83){ s_push = true; zeroLook = true;}
	// 右 D
	if(e.keyCode == 68){ d_push = true; zeroLook = true;}
	// 上 W
	if(e.keyCode == 87){ w_push = true; zeroLook = true;}
	// 手前 down
	if(e.keyCode == 38){ down_push = true; }
	// 奥 up
	if(e.keyCode == 40){ up_push = true; }
	// 時計回り Q
	if(e.keyCode == 81){ q_push = true; }
	// 逆時計回り E
	if(e.keyCode == 69){ e_push = true; }
};

// キーを離した時の処理
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
