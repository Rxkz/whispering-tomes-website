
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/use-mobile';

interface Hero3DBookProps {
  isHovered?: boolean;
  isOpened?: boolean;
  bookTitle?: string;
  bookAuthor?: string;
  coverImage?: string;
}

const Hero3DBook = ({ 
  isHovered = false, 
  isOpened = false, 
  bookTitle = "The Secret Library", 
  bookAuthor = "Author Name",
  coverImage = "/textures/book-cover.jpg" 
}: Hero3DBookProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const bookRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number>(0);
  const [mousePosition, setMousePosition] = useMousePosition();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      50, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(
      containerRef.current.clientWidth, 
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);
    
    // Subtle gold rim light for dark academia feel
    const rimLight = new THREE.DirectionalLight(0xBF8D4E, 0.6);
    rimLight.position.set(-5, 5, -10);
    scene.add(rimLight);
    
    // Create book group
    const book = new THREE.Group();
    bookRef.current = book;
    scene.add(book);
    
    // Create book cover material with texture
    const textureLoader = new THREE.TextureLoader();
    const coverTexture = textureLoader.load(coverImage);
    
    // Create book materials
    const coverMaterial = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.7,
      metalness: 0.1,
    });
    
    const pageMaterial = new THREE.MeshStandardMaterial({
      color: 0xf2eee2,
      roughness: 0.5,
    });
    
    const spineColor = 0x8B4513; // Brown spine
    const spineMaterial = new THREE.MeshStandardMaterial({
      color: spineColor,
      roughness: 0.7,
      metalness: 0.2,
    });
    
    // Book dimensions
    const width = 3;
    const height = 4.5;
    const depth = 0.75;
    const spineWidth = 0.15;
    
    // Create front cover
    const frontCoverGeometry = new THREE.BoxGeometry(width, height, 0.1);
    const frontCover = new THREE.Mesh(frontCoverGeometry, coverMaterial);
    frontCover.position.z = depth / 2 - 0.05;
    book.add(frontCover);
    
    // Create back cover
    const backCoverGeometry = new THREE.BoxGeometry(width, height, 0.1);
    const backCover = new THREE.Mesh(backCoverGeometry, spineMaterial);
    backCover.position.z = -depth / 2 + 0.05;
    book.add(backCover);
    
    // Create spine
    const spineGeometry = new THREE.BoxGeometry(spineWidth, height, depth);
    const spine = new THREE.Mesh(spineGeometry, spineMaterial);
    spine.position.x = -width / 2 - spineWidth / 2;
    book.add(spine);
    
    // Create pages
    const pagesGeometry = new THREE.BoxGeometry(width - 0.1, height - 0.1, depth - 0.2);
    const pages = new THREE.Mesh(pagesGeometry, pageMaterial);
    book.add(pages);
    
    // Gold title text (simplified for performance)
    const goldDecoration = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 0.6, height * 0.1),
      new THREE.MeshStandardMaterial({ color: 0xBF8D4E, metalness: 0.8, roughness: 0.1 })
    );
    goldDecoration.position.z = depth / 2 + 0.01;
    goldDecoration.position.y = height * 0.15;
    book.add(goldDecoration);
    
    // Position book
    book.rotation.x = -0.2;
    book.rotation.y = -0.4;
    book.position.y = -0.5;
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      if (!bookRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      // Update book rotation based on mouse position
      if (!isMobile) {
        const rotationXTarget = mousePosition.y * 0.05;
        const rotationYTarget = mousePosition.x * 0.1;
        
        bookRef.current.rotation.x += (rotationXTarget - bookRef.current.rotation.x) * 0.05;
        bookRef.current.rotation.y += (rotationYTarget - bookRef.current.rotation.y) * 0.05;
      } else {
        // For mobile, add a gentle floating animation
        const time = Date.now() * 0.001;
        bookRef.current.rotation.x = Math.sin(time * 0.5) * 0.1 - 0.2;
        bookRef.current.rotation.y = Math.cos(time * 0.3) * 0.1 - 0.4;
      }
      
      // Apply book opening animation if needed
      if (isOpened) {
        const openAngle = Math.PI * 0.2;
        frontCover.rotation.y += (openAngle - frontCover.rotation.y) * 0.1;
      } else if (isHovered) {
        const hoverAngle = Math.PI * 0.05;
        frontCover.rotation.y += (hoverAngle - frontCover.rotation.y) * 0.1;
      } else {
        frontCover.rotation.y += (0 - frontCover.rotation.y) * 0.1;
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose geometries and materials to prevent memory leaks
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      
      renderer.dispose();
    };
  }, [isMobile]);
  
  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-pointer" 
      />
      <div className="absolute bottom-10 left-0 right-0 text-center z-10 text-gold opacity-80 pointer-events-none">
        <div className="font-cormorant text-lg uppercase tracking-widest">{bookAuthor}</div>
        <div className="font-cormorant text-2xl font-semibold mt-2">{bookTitle}</div>
      </div>
    </div>
  );
};

// Custom hook for mouse position tracking
function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position between -1 and 1
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1)
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return [mousePosition, setMousePosition] as const;
}

export default Hero3DBook;
