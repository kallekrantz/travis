var map  = null;
var linkoping = new THREE.Vector3(15.631739666978488, 58.40902369960166, 0);
var apiUrl = 'http://api.apitekt.se/transportstyrelsen/olyckor-2003-2012/list.json';
var fov = 53.13010235415599;
var camera, scene, renderer;
var geometry, material, mesh;


function initialize() {
    initMap();
    initThree();
    strada.init(addObjects);
}

function addObjects(objects) {
    objects.forEach(function (v, k) {
        if (k > 1000)
            return;
        mesh = new THREE.Mesh( geometry, material );
        scene.add(mesh);
        mesh.position = linkoping;
    });
    console.log(objects);

}

function initMap() {
    var mapOptions = {
        center: new google.maps.LatLng(linkoping.y, linkoping.x),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}


function updateCamera () {
    if (!map) return;
    var bounds = map.getBounds();
    if (!bounds) {
        console.log("no bounds!");
        return;
    }

    var xy = map.getCenter();
        
    var s = map.getBounds().getSouthWest().lng();
    var w = map.getBounds().getSouthWest().lat();
    var n = map.getBounds().getNorthEast().lng();
    var e = map.getBounds().getNorthEast().lat();
    
    var width = e - w;
    var height = n - s;
    
    camera.position.set(
        xy.lng(),
        xy.lat(),
        width
    );

    camera.aspect = height/width;
    camera.updateProjectionMatrix();
    
    camera.updateMatrix();
    camera.updateMatrixWorld();

}


function initThree() {


    init();
    animate();

    function init() {

        camera = new THREE.PerspectiveCamera( fov, 1 //window.innerWidth / window.innerHeight
, 0.000001, 10000 );


        scene = new THREE.Scene();

        geometry = new THREE.CubeGeometry( 0.002, 0.002, 0.002 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: false } );


        var container = document.getElementById('three-canvas');
        
        renderer = new THREE.CanvasRenderer();
        renderer.setSize($(container).width(), $(container).height());

        container.appendChild( renderer.domElement );



    }

    function animate() {

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame( animate );

//        mesh.rotation.x += 0.01;
//        mesh.rotation.y += 0.02;
        updateCamera();

        renderer.render( scene, camera );

    }    
}




google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function() {
    console.log("woot");
    $(window).resize(function () {
        updateCamera();
        
    });
});




