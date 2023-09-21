import"./style.css";import*as THREE from"three";import{CSS2DObject}from"three/examples/jsm/renderers/CSS2DRenderer";import{OrbitControls}from"three/examples/jsm/controls/OrbitControls";import{DRACOLoader}from"three/examples/jsm/loaders/DRACOLoader";import{GLTFLoader}from"three/examples/jsm/loaders/GLTFLoader";const canvas=document.querySelector("canvas.webgl"),cursorCircle=document.querySelector(".cursor-circle"),navbarDetailsLink=document.querySelector(".navbar-right li:first-child a"),detailsDiv=document.querySelector(".details");navbarDetailsLink.addEventListener("click",(()=>{detailsDiv.classList.toggle("hidden")}));const sizes={width:window.innerWidth,height:window.innerHeight},scene=new THREE.Scene,camera=new THREE.PerspectiveCamera(75,sizes.width/sizes.height);camera.position.set(0,9,9),scene.add(camera);const dracoLoader=new DRACOLoader;dracoLoader.setDecoderPath("draco/");const gltfLoader=new GLTFLoader;gltfLoader.setDRACOLoader(dracoLoader);const spotLight=new THREE.AmbientLight(16777215);spotLight.position.set(1,1,0),scene.add(spotLight);const newSpotLight=new THREE.DirectionalLight(16777215);newSpotLight.position.set(0,1,0),scene.add(newSpotLight);const groundGeometry=new THREE.PlaneGeometry(500,1e3,1,1),groundMaterial=new THREE.MeshStandardMaterial({color:5064789,roughness:0,metalness:.9}),ground=new THREE.Mesh(groundGeometry,groundMaterial);ground.rotation.x=-.5*Math.PI,ground.position.set(0,.3,0),scene.add(ground);const runwayLength=100,runwayWidth=1e3,runwayGeometry=new THREE.PlaneGeometry(100,1e3,1,1),runwayMaterial=new THREE.MeshStandardMaterial({color:8421504,roughness:.2,metalness:0}),textureLoader=new THREE.TextureLoader,stripeTexture=textureLoader.load("ground.png");stripeTexture.wrapS=THREE.RepeatWrapping,stripeTexture.wrapT=THREE.RepeatWrapping,stripeTexture.repeat.set(10,1),runwayMaterial.map=stripeTexture;const runway=new THREE.Mesh(runwayGeometry,runwayMaterial);let car;runway.rotation.x=-Math.PI/2,runway.position.set(0,.4,0),scene.add(runway),gltfLoader.load("dream.glb",(e=>{car=e.scene,scene.add(car)}));const cursor={x:0,y:0};window.addEventListener("mousemove",(e=>{const t=e.clientX,r=e.clientY;cursorCircle.style.left=`${t}px`,cursorCircle.style.top=`${r}px`}));const renderer=new THREE.WebGLRenderer({canvas});renderer.setSize(sizes.width,sizes.height);const controls=new OrbitControls(camera,canvas);function createSphereMarker(e,t){const r=new THREE.SphereGeometry(.06,64,64,Math.PI,Math.PI),n=new THREE.Mesh(r,e);return n.rotation.x=Math.PI/2,n.position.copy(t),scene.add(n),n}function onClick(e){const t=new THREE.Vector2;t.x=e.clientX/window.innerWidth*2-1,t.y=-e.clientY/window.innerHeight*2+1;const r=new THREE.Raycaster;r.setFromCamera(t,camera);const n=r.intersectObjects(interactiveParts.map((e=>e.marker)));if(n.length>0){const e=n[0].object,t=interactiveParts.find((t=>t.marker===e));t&&showInformation(t.description)}}function showInformation(e){const t=document.createElement("div");t.className="tooltip",t.textContent=e,document.body.appendChild(t),window.addEventListener("click",(()=>{document.body.removeChild(t)}))}window.addEventListener("dblclick",(()=>{document.fullscreenElement?document.exitFullscreen():canvas.requestFullscreen()})),window.addEventListener("resize",(()=>{sizes.width=window.innerWidth,sizes.height=window.innerHeight,camera.aspect=sizes.width/sizes.height,camera.updateProjectionMatrix(),renderer.setSize(sizes.width,sizes.height),renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))})),window.addEventListener("click",onClick);const detailLines=[],lineMaterial=new THREE.LineBasicMaterial({color:0,linewidth:10}),points1=[new THREE.Vector3(0,0,0),new THREE.Vector3(1,1,1),new THREE.Vector3(.1,.1,.05)],points2=[new THREE.Vector3(0,0,0),new THREE.Vector3(1,0,0)];points1.forEach((e=>{e.y-=0})),points2.forEach((e=>{e.y-=.2}));const lineGeometry1=(new THREE.BufferGeometry).setFromPoints(points1),lineGeometry2=(new THREE.BufferGeometry).setFromPoints(points2),line1=new THREE.Line(lineGeometry1,lineMaterial);line1.visible=!1,scene.add(line1),detailLines.push(line1);const line2=new THREE.Line(lineGeometry2,lineMaterial);function toggleDetailLines(){const e=detailLines[0].visible;detailLines.forEach((t=>{t.visible=!e}))}line2.visible=!1,scene.add(line2),detailLines.push(line2);const starPositions=[],numStars=1e3;for(let e=0;e<1e3;e++){const e=2e3*Math.random()-1e3,t=2e3*Math.random()-1e3,r=2e3*Math.random()-1e3;starPositions.push({x:e,y:t,z:r})}const starSpheres=[],starMaterial=new THREE.MeshBasicMaterial({color:16777215});for(const e of starPositions){const t=new THREE.SphereGeometry(1,16,16),r=new THREE.Mesh(t,starMaterial);r.position.set(e.x,e.y,e.z),starSpheres.push(r),scene.add(r)}starSpheres.forEach((e=>{e.renderOrder=-1}));const keyboard={ArrowUp:!1,ArrowLeft:!1,ArrowRight:!1,ArrowDown:!1},handleKeyDown=e=>{"ArrowUp"===e.key&&(keyboard.w=!0),"ArrowLeft"===e.key&&(keyboard.a=!0),"ArrowRight"===e.key&&(keyboard.d=!0),"ArrowDown"===e.key&&(keyboard.s=!0)},handleKeyUp=e=>{"ArrowUp"===e.key&&(keyboard.w=!1),"ArrowLeft"===e.key&&(keyboard.a=!1),"ArrowRight"===e.key&&(keyboard.d=!1),"ArrowDown"===e.key&&(keyboard.s=!1)};function resetCameraPosition(){camera.position.set(.18,.145,.18)}window.addEventListener("keydown",handleKeyDown),window.addEventListener("keyup",handleKeyUp),window.addEventListener("keydown",(e=>{"r"===e.key&&resetCameraPosition()}));const animate=()=>{renderer.render(scene,camera),controls.update(),requestAnimationFrame(animate)};animate();const glowLight=new THREE.AmbientLight(2039842);scene.add(glowLight),window.addEventListener("keydown",(e=>{if("c"===e.key||"C"===e.key){const e=16777215*Math.random();glowLight.color.set(e)}})),window.addEventListener("keydown",(e=>{if("r"===e.key||"R"===e.key){const e=2039842;glowLight.color.set(e)}}));