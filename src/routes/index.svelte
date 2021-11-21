<script>
  import { onMount } from "svelte";
  import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PlaneGeometry,
    SphereGeometry,
    GridHelper,
    Raycaster,
    Vector2,
    Vector3,
    DoubleSide,
  } from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

  let renderer, camera, controls;
  const inventory = [1,2,3,4,5,6,7,8,9,10]

  const scene = new Scene();

  // spinning cube
  let geometry = new BoxGeometry();
  let material = new MeshBasicMaterial({ color: 0x00aa00 });
  const cube = new Mesh(geometry, material);
  cube.position.y = 1;
  scene.add(cube);

  // plane
  geometry = new PlaneGeometry(5, 5);
  geometry.rotateX(-Math.PI / 2);
  material = new MeshBasicMaterial({ color: 0x111111 }); //side: DoubleSide
  const plane = new Mesh(geometry, material);
  scene.add(plane);

  // grid
  const gridHelper = new GridHelper(10, 10);
  scene.add(gridHelper);

  // raycasting
  const rayCaster = new Raycaster();
  const pointer = new Vector2();
  geometry = new SphereGeometry(0.1, 5, 5);
  const rayObject = new Mesh(
    geometry,
    new MeshBasicMaterial({ color: 0xff0000 })
  );
  rayObject.visible = false;
  scene.add(rayObject);

  const animate = function () {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  };

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(event) {
    pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    rayCaster.setFromCamera(pointer, camera);

    // See if the ray from the camera into the world hits plane
    const intersects = rayCaster.intersectObjects([plane, cube]);

    // Toggle rotation bool for meshes that we clicked
    if (intersects.length > 0) {
      // rayObject.position.set( 0, 0, 0 );
      // rayObject.lookAt( intersects[ 0 ].face.normal );

      rayObject.position.copy(intersects[0].point);
      rayObject.visible = true;
    } else {
      rayObject.visible = false;
    }
  }

  function makeBox() {
    if (rayObject.visible) {
      geometry = new BoxGeometry(0.1, 0.1, 0.1)
      material = new MeshBasicMaterial({color:0xffffff})
      const newObject = new Mesh(geometry, material)
      scene.add(newObject)
      newObject.position.copy(rayObject.position)
    }
  }

  onMount(() => {
    const canvas = document.querySelector("#three");
    camera = new PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    renderer = new WebGLRenderer({ canvas: canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener("resize", onWindowResize);

    animate();
  });
</script>

<svelte:head>
  <title>Small World</title>
</svelte:head>

<canvas on:mousemove={onMouseMove} on:click="{makeBox}" id="three" />
<div>
  <ul>
    {#each inventory as item}
      <li>{item}</li>
    {/each}
  </ul>
</div>

<style>
  :global(body, html) {
    margin: 0px;
    width: 100%;
    height: 100%;
    /* background-color: black; */
    color: white;
    pointer-events: none;
    overflow: hidden;
  }

  canvas {
    position: absolute;
    top: 0em;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: all;
  }

  div {
    position: absolute;
  }

  ul {
    display: grid;
    gap: 1em;
    grid-template-columns: repeat(4, minmax(100px, 1fr));
  }
</style>
