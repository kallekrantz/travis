var map  = null;
var linkoping = new THREE.Vector3(15.631739666978488, 58.40902369960166, 0);
var fov = 53.13010235415599;
var camera, scene, renderer;
var geometry, material;
var slab;

var wBound, sBound, eBound, nBound;

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}

function initialize() {
    initMap();
    initThree();
    strada.init(function(objects){

        /*        addObjects(objects, {svarhetsgrad:'Lindrig olycka', ljusforhallande: "Dagsljus", });
                  setTimeout(function(){
                  clearObjects();
                  setTimeout(function(){
                  addObjects(objects, {svarhetsgrad:'Lindrig olycka'});
                  },2000);
                  }, 2000);
        */
        addObjects(objects, {});
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
        0.0008
    );
}

function clearObjects(){
    var obj, i;
    for ( i = scene.children.length - 1; i >= 0 ; i -- ) {
        obj = scene.children[ i ];
        if ( obj.stradaData) {
            scene.remove(obj);
        }
    }
}

function colorMeshes(meshes, colorMap){
    Object.keys(colorMap).forEach(function(key){
        unfiltered = meshes
        colorMap[key].maps.forEach(function(colorObject){
            filterinput = new Object();
            filterinput[key] = colorObject.value;
            filter = filterMeshes(unfiltered, filterinput);
            colorFilter = filter.filtered;
            unfiltered = filter.unfiltered;
            colorFilter.forEach(function(mesh){
                mesh.material.color.setHex(colorObject.color)
            });
            if(colorMap[key].defaultColor){
                unfiltered.forEach(function(mesh){
                    mesh.material.color.setHex(colorMap[key].defaultColor);
                });
            }
        });
    });
}

function filterMeshes(meshes, filter){
    if(Object.keys(filter).length === 0){
        return meshes;
    }
    console.log(filter);
    var unfilt = [], filt = [];
    Object.keys(filter).forEach(function(key){
        meshes.forEach(function(mesh){

            if(mesh.stradaData === undefined){
                return;
            }
            if(mesh.stradaData[key] === filter[key]){
                filt.push(mesh);
                return;
            }
            unfilt.push(mesh);
        });
    });
    return {filtered:filt,
            unfiltered:unfilt
           };
}

function filterVisibleMeshes(meshes, filter){
    filter = filterMeshes(meshes, filter);
    filter.unfiltered.forEach(function(mesh){
        mesh.visible = false;
        mesh.hiddenByFilter = true;
    });
    filter.filtered.forEach(function(mesh){
        mesh.visible = true;
        mesh.hiddenByFilter = false;
    });
    return filter
}
function yearFilter(year){
    return filterVisibleMeshes(scene.children, {ar:year});
}
function monthFilter(month){
    return filterVisibleMeshes(scene.children, {manad:month});
}
function monthAndYearFilter(year, month){
    return filterVisibleMeshes(scene.children, {ar:year, manad:month});
}
function addObjects(objects, filter) {
    (typeof filter === "undefined") ? {} : filter;
    var i = 0;
    objects.forEach(function (v, k) {
        //        mesh.position = new THREE.Vector3(x, y, 0);
        if (k > 20)
            return;
        var mesh, material;


        switch (v['svarhetsgrad'][0]) {
        case 'L':
            material = slightMaterial;
            break;
        case 'S':
            material = severeMaterial;
            break;
        case 'D':
            material = deathMaterial;
            break;
        default:
            material = defaultMaterial;
            break;

        }

        mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(-Math.PI/2, 0, 0);
        mesh.scale.set(1, 1, 1/2);
        mesh.stradaData = v;
        scene.add(mesh);
        mesh.position = rt2latlon(v['x-koordinat'], v['y-koordinat']);

    });
}


function updateObjects() {
    scene.children.forEach(function (c) {
        if (c.hiddenByFilter){
            return;
        }
        if (c.stradaData) {
            if (c.position.x > eBound || c.position.x < wBound) {
                c.visible = false;
            } else {
                c.visible = true;
            }

            if (c.position.y > nBound || c.position.y < sBound) {
                c.visible = false;
            }
        }

    });
}

function initMap() {
    var mapOptions = {
        center: new google.maps.LatLng(linkoping.y, linkoping.x),
        zoom: 14,
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

    wBound = map.getBounds().getSouthWest().lng();
    sBound = map.getBounds().getSouthWest().lat();
    eBound = map.getBounds().getNorthEast().lng();
    nBound = map.getBounds().getNorthEast().lat();

    var width = eBound - wBound;
    var height = nBound - sBound;

    camera.position.set(
        xy.lng(),
        xy.lat(),
        height*0.7
    );

    camera.position.y -= height*0.7;
    camera.rotation.set(Math.PI/4, 0, 0);


    replaceSlab(xy.lng(), xy.lat(), width, height);

    camera.aspect = width/height;
    camera.updateProjectionMatrix();

    //    camera.updateMatrix();
    //    camera.updateMatrixWorld();

}


function initThree() {


    init();
    animate();

    function init() {

        camera = new THREE.PerspectiveCamera( fov, 1 //window.innerWidth / window.innerHeight
                                              , 0.0000001, 10000 );
        scene = new THREE.Scene();


        //       geometry = new THREE.CubeGeometry( 0.002, 0.001, 0.002 );
        //        geometry = new THREE.CylinderGeometry(0, 30, 80, 4, 1, true);
        geometry = new THREE.CylinderGeometry(0, 0.001, 0.002, 10, 1, false);

        deathMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
        severeMaterial = new THREE.MeshLambertMaterial( { color: 0xffff00 } );
        slightMaterial = new THREE.MeshLambertMaterial( { color: 0x00aa00 } );
        defaultMaterial = new THREE.MeshLambertMaterial( { color: 0x333333 } );


        var pointLight1 = new THREE.PointLight(0xFFFFFF);
        pointLight1.position.x = 10;
        pointLight1.position.y = 50;
        pointLight1.position.z = 130;
        scene.add(pointLight1);

        var pointLight2 = new THREE.PointLight(0xFFFFFF);
        pointLight2.position.x = 80;
        pointLight2.position.y = -50;
        pointLight2.position.z = 20;
        scene.add(pointLight2);

        var container = document.getElementById('three-canvas');

        renderer = new THREE.CanvasRenderer();
        renderer.setSize($(container).width(), $(container).height());

        container.appendChild( renderer.domElement );
    }



    function animate() {
        requestAnimationFrame(animate);
        updateCamera();
        updateObjects();
        renderer.render(scene, camera);
    }
}




function replaceSlab(x, y, width, height) {
    if (slab) {
        scene.remove(slab);
    }
    var mat = new THREE.MeshBasicMaterial({color: 0x00aa00, opacity: 0.5});
    slab = new THREE.Mesh(new THREE.CubeGeometry(width, height, 0.0001), mat);
    //    scene.add(slab);
    slab.position.set(linkoping.x, linkoping.y, 0);
    slab.position.set(x, y, 0);
}




google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function() {
    $(window).resize(function () {
        updateCamera();
    });
});


$(function() {
    console.log("woo");
    console.log($("#slider-range"));
    
    $("#slider-range").slider({
        range: true,
        min: 2003,
        max: 2012,
        values: [ 2006, 2012 ],
        slide: function( event, ui ) {
            //            $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
            console.log("yo");
        }
    });
//    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
 //                       " - $" + $( "#slider-range" ).slider( "values", 1 ) );
});
