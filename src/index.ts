import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  timeout,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  DiamondPlugin,
  FrameFadePlugin,
  GLTFAnimationPlugin,
  GroundPlugin,
  BloomPlugin,
  TemporalAAPlugin,
  AnisotropyPlugin,
  GammaCorrectionPlugin,

  addBasePlugins,
  ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,

  IViewerPlugin, FileTransferPlugin,

  // Color, // Import THREE.js internals
  // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
async function setupViewer(){

  // Initialize the viewer
  const viewer = new ViewerApp({
      canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
      useRgbm:false,
  })
  const camera = viewer.scene.activeCamera;
  const position =camera.position;
  const target = camera.target;
  // Add plugins individually.
  // await viewer.addPlugin(GBufferPlugin)
  // await viewer.addPlugin(new ProgressivePlugin(32))
  // await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
  // await viewer.addPlugin(GammaCorrectionPlugin)
  // await viewer.addPlugin(SSRPlugin)
  // await viewer.addPlugin(SSAOPlugin)
  // await viewer.addPlugin(DiamondPlugin)
  // await viewer.addPlugin(FrameFadePlugin)
  // await viewer.addPlugin(GLTFAnimationPlugin)
  // await viewer.addPlugin(GroundPlugin)
  // await viewer.addPlugin(BloomPlugin)
  // await viewer.addPlugin(TemporalAAPlugin)
  // await viewer.addPlugin(AnisotropyPlugin)
  // and many more...

  // or use this to add all main ones at once.
  await addBasePlugins(viewer) // check the source: https://codepen.io/repalash/pen/JjLxGmy for the list of plugins added.

  // Add a popup(in HTML) with download progress when any asset is downloading.
  await viewer.addPlugin(AssetManagerBasicPopupPlugin)

  // Required for downloading files from the UI
  await viewer.addPlugin(FileTransferPlugin)

  // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
  await viewer.addPlugin(CanvasSnipperPlugin)

  viewer.renderer.refreshPipeline()

  // Import and add a GLB file.
  await viewer.load("./assets/camera.glb")

  // Load an environment map if not set in the glb file
  // await viewer.setEnvironmentMap("./assets/environment.hdr");

  // Add some UI for tweak and testing.
  const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
  // Add plugins to the UI to see their settings.
  uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin)

  viewer.getPlugin(TonemapPlugin).config.clipBackground = true;
 viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})

  let needsUpdate = true; // Initialize needsUpdate before any functi on is called

  function setUpScrollAnimation() {
    const tl = gsap.timeline();
  
    // First section
    tl.to(position, {
      x: 1.56,
      y: -2,
      z: -4,
      scrollTrigger: {
        trigger: ".second",
        start: 'top bottom',
        end: 'top top',
        markers: true,
        scrub: true,
        immediateRender: false
      },
      onUpdate: onUpdate // Use onUpdate as callback
    }).to(".section--one--container", {
      opacity: 0,
      xPercent: -150,
      //y: 1,
      //z: 0.3,
      scrollTrigger: {
        trigger: ".second",
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
        immediateRender: false
      }
    }).to(
      target, {
      x: -1,
      y: 1,
      z: 0.3,
      scrollTrigger: {
        trigger: ".second",
        start: 'top bottom',
        end: 'top top',
        markers: true,
        scrub: true,
        immediateRender: false
      }
    });
  
    // Second section
    tl.to(position, {
      x: -4,
      y: -6,
      z: -6,
      scrollTrigger: {
        trigger: ".third",
        start: 'top bottom',
        end: 'top top',
        markers: true,
        scrub: true,
        immediateRender: false
      },
      onUpdate: onUpdate // Use onUpdate as callback
    }).to(
      target, {
      x: 1.20,
      y: 1,
      z: -1.40,
      scrollTrigger: {
        trigger: ".third",
        start: 'top bottom',
        end: 'top top',
        markers: true,
        scrub: true,
        immediateRender: false
        
      }
    }).to(
      ".section--two--container", {
      xPercent: 50,
      //y: 2,
      //z: -1.20,
      scrollTrigger: {
        trigger: ".third",
        start: 'top bottom',
        end: 'top top',
        markers: true,
        scrub: true,
        immediateRender: false,
      }
    });
  }
  
  function onUpdate() {
    needsUpdate = true;
    viewer.renderer.resetShadows();
  }
    setUpScrollAnimation();
  
    viewer.addEventListener('preFrame', () => {
      if (needsUpdate) {
        camera.positionUpdated(true);
        //camera.targetUpdated(true);
        needsUpdate = false;
      }
    });
     // KNOW MORE EVENT
	document.querySelector('.button--hero')?.addEventListener('click', () => {
		const element = document.querySelector('.second')
		window.scrollTo({ top: element?.getBoundingClientRect().top, left: 0, behavior: 'smooth' })
	})

	// SCROLL TO TOP
	document.querySelectorAll('.button--footer')?.forEach(item => {
		item.addEventListener('click', () => {
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
		})
	})
	// CUSTOMIZE
  const sections = document.querySelector('.container') as HTMLElement
  const mainContainer = document.getElementById('webgi-canvas-container') as HTMLElement
	document.querySelector('.button--customize')?.addEventListener('click',() => {
		viewer.scene.activeCamera.setCameraOptions({controlsEnabled: true})
    sections.style.display = 'none'
    document.body.style.cursor= 'grab'
		})
  
  }
  
  setupViewer();
  