var map  = null;
var linkoping = new THREE.Vector3(15.631739666978488, 58.40902369960166, 0);
var apiUrl = 'http://api.apitekt.se/transportstyrelsen/olyckor-2003-2012/list.json';
var fov = 53.13010235415599;
var camera, scene, renderer;
var geometry, material, mesh;


function initialize() {
    initMap();
    initThree();
    strada.init(function(objects){
        addObjects(objects, {svarhetsgrad:'Lindrig olycka', ljusforhallande: "Dagsljus", });
        setTimeout(function(){
            clearObjects();
            setTimeout(function(){
                addObjects(objects, {svarhetsgrad:'Lindrig olycka'});
            },2000);
        }, 2000);
        
        

    });
}



function rt2latlon(x, y) {
    swedish_params('rt90_2.5_gon_v');

    var lat_lon = grid_to_geodetic(x, y);
    latitude = lat_lon[0];
    longitude = lat_lon[1];

    return new THREE.Vector3(
        longitude,
        latitude,
        0
    );
}

function clearObjects(){
    var obj, i;
    for ( i = scene.children.length - 1; i >= 0 ; i -- ) {
        obj = scene.children[ i ];
        if ( obj !== camera) {
            scene.remove(obj);
        }
    }
}

function filterObjects(objects, filter){
    if(Object.keys(filter).length === 0){
        return objects;
    }
    Object.keys(filter).forEach(function(key){
        objects = objects.filter(function(object){
            if(object[key] == filter[key]){
                return true;
            }
        })
    });
    return objects
}

function addObjects(objects, filter) {
    (typeof filter === "undefined") ? {} : filter;
    var i = 0;
    console.log(objects.length);
    objects = filterObjects(objects, filter);
    console.log(objects.length);
    objects.forEach(function (v, k) {
        mesh = new THREE.Mesh( geometry, material );
        scene.add(mesh);
        mesh.position = rt2latlon(v['x-koordinat'], v['y-koordinat']);
//        mesh.position = new THREE.Vector3(x, y, 0);

    });

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
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );


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




