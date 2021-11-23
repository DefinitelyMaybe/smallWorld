<script>
  import { onMount } from "svelte";
  import { browser } from '$app/env';
  import * as THREE from "three";
  import * as SC from "svelte-cubed";

  let check = false

  let spin = 0
  let height = 1
  const inventory = [1,2,3,4,5,6,7,8,9,10]

  // raycasting
  // const rayCaster = new Raycaster();
  // const pointer = new Vector2();
  // geometry = new SphereGeometry(0.1, 5, 5);
  // const rayObject = new Mesh(
  //   geometry,
  //   new MeshBasicMaterial({ color: 0xff0000 })
  // );
  // rayObject.visible = false;
  // scene.add(rayObject);

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
    console.log("hello world");
  })

  if (browser) {
    SC.onFrame(() => {
      // spin += 0.01
    }) 
  }
</script>

<svelte:head>
  <title>Small World</title>
</svelte:head>

<SC.Canvas
  antialias
  shadows
  background={new THREE.Color('papayawhip')}
  fog={new THREE.FogExp2('papayawhip', 0.1)}>
  <SC.Mesh geometry={new THREE.BoxGeometry()}
      material={new THREE.MeshStandardMaterial({color:0xff3e00})}
      rotation={[0, spin, 0]}
      castShadow/>
  <SC.Group position={[0, -height / 2, 0]}>
    <SC.Mesh geometry={new THREE.PlaneGeometry(50, 50)}
      material={new THREE.MeshStandardMaterial({ color: 'burlywood' })}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow/>
    <SC.Primitive object={new THREE.GridHelper(50, 50, 0x444444, 0x555555)}
      position={[0, 0.001, 0]}/>
  </SC.Group>
  <SC.PerspectiveCamera position={[1,1,3]}/>
  <SC.OrbitControls maxPolarAngle={Math.PI * 0.51}/>
  <SC.AmbientLight intensity={0.6}/>
  <SC.DirectionalLight intensity={0.6}
    position={[-2,3,2]}
    shadow={{ mapSize: [2048, 2048] }}/>
</SC.Canvas>

<div>
  <ul>
    {#each inventory as item}
      <li>{item}</li>
    {/each}
  </ul>
</div>
<input type="checkbox" bind:checked={check} on:change={() => {console.log(check);}}>

<style>
  /* :global(body, html) {
    margin: 0px;
    width: 100%;
    height: 100%;
    /* background-color: black; */
    /*color: white;
    pointer-events: none;
    overflow: hidden;
  } */

  /* canvas {
    position: absolute;
    top: 0em;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: all;
  } */

  div {
    position: absolute;
  }

  ul {
    display: grid;
    gap: 1em;
    grid-template-columns: repeat(4, minmax(100px, 1fr));
  }

  input {
    position: absolute;
  }
</style>
