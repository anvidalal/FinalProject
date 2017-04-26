const THREE = require('three');
import Framework from './framework'
import Parser from './house-parser'

var input = {
  layout: false,
  shapeGrammar: true
};

function onLoad(framework) {
  var {scene, camera, renderer, gui, stats} = framework; 

  lightsCamera(scene, camera);
  showShapeGrammar(scene, camera);
  showLayout(scene, camera);

  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(input, "shapeGrammar").onChange(function(newVal) {
    clearScene(scene, camera);
    showShapeGrammar(scene, camera);
    showLayout(scene, camera);
  });

  gui.add(input, "layout").onChange(function(newVal) {
    clearScene(scene, camera);
    showShapeGrammar(scene, camera);
    showLayout(scene, camera);
  });

}

function clearScene(scene, camera) {
  while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
  }

  lightsCamera(scene, camera);
}

function lightsCamera(scene, camera) {
  camera.position.set(1, 100, 200);
  camera.lookAt(new THREE.Vector3(0,0,0));

  var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light );

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
  directionalLight.position.set(75, 100, 0);
  scene.add( directionalLight );
}

function showShapeGrammar(scene, camera) {
  if (input.shapeGrammar && !input.layout)
  {
    camera.position.set(1, 10, 10);
    camera.lookAt(new THREE.Vector3(0,0,0));

    var position = new THREE.Vector3(0, 0, 0);
    var direction = new THREE.Vector3(0, 1, 0);
    var parser = new Parser(position, direction, scene, 4, 10);
    parser.render();
  }
}

function showLayout(scene, camera) {
    if (input.layout) {
    camera.position.set(1, 100, 200);
    camera.lookAt(new THREE.Vector3(0,0,0));

    var height = 100;
    var radius = 50;

    //speaker mid
    var spkMG = new THREE.CylinderGeometry( radius, radius, height, 32 );
    var spkMM = new THREE.MeshLambertMaterial({color: 0xa9a9a9});
    var spkM = new THREE.Mesh(spkMG, spkMM);
    scene.add(spkM);

    //speaker top
    var spkTG = new THREE.CylinderGeometry( 2 * radius / 3, radius, height / 4, 32 );
    var spkTM = new THREE.MeshLambertMaterial({color: 0xa9a9a9});
    var spkT = new THREE.Mesh(spkTG, spkTM);
    spkT.position.set(0, 10 * height / 16, 0);
    scene.add(spkT);

    //speaker base
    var spkBG = new THREE.CylinderGeometry(radius, 2 * radius / 3, height / 4, 32);
    var spkBM = new THREE.MeshLambertMaterial({color: 0xa9a9a9});
    var spkB = new THREE.Mesh(spkBG, spkBM);
    spkB.position.set(0, - 5 * height / 8, 0);
    scene.add(spkB);
    
    for (var y = - (height / 2) + 5; y < height / 2; y+= 5) 
    {
      for (var x = 5 - radius; x < radius; x+= 5) 
      {
        var z = Math.sqrt((radius * radius) - (x * x));
        var dir = new THREE.Vector3(-x, y, -z);
        var dirO = new THREE.Vector3(-x, y, z);

        var cg = new THREE.CylinderGeometry(2.5, 2.5, 2, 16);
        var m = new THREE.MeshLambertMaterial({color: 0xffff00});
        var cyl = new THREE.Mesh(cg, m);
        
        cyl.position.set(x, y, z);
        cyl.lookAt(dir);
        cyl.rotateX(Math.PI / 2);
        scene.add(cyl);

        var cg2 = new THREE.CylinderGeometry(2.5, 2.5, 2, 16);
        var cyl2 = new THREE.Mesh(cg2, m);
        
        cyl2.position.set(x, y, -z);
        cyl2.lookAt(dirO);
        cyl2.rotateX(Math.PI / 2);
        scene.add(cyl2);

        if (input.shapeGrammar) {
          var position = new THREE.Vector3(x, y, -z);
          var direction = dir.normalize();
          var parser = new Parser(position, direction, scene, 4, 2.5);
  
          var position2 = new THREE.Vector3(x, y, z);
          var direction2 = dirO.normalize();
          var parser2 = new Parser(position2, direction2, scene, 4, 2.5);
  
          parser.render();
          parser2.render();
        }
      }
    }
  }
}

function onUpdate(framework) {

}

Framework.init(onLoad, onUpdate);
