// ===== CONSTANTS =====
const COLORS = {
    PLAYER: 0x00ffff,
    ENEMY_NORMAL: 0xff6600,
    ENEMY_ELITE: 0xffcc00,
    LASER: 0x00ffff,
    MISSILE: 0xffcc00,
    EXPLOSION: 0xffaa00,
    STAR: 0xFFFFFF
};

const PHYSICS = {
    MAX_SPEED: 1.2,
    ACCELERATION_RATE: 0.04,
    DECELERATION_RATE: 0.01,
    ROTATION_ACCELERATION: 0.008,  // Increased for more responsive roll
    ROTATION_DECELERATION: 0.92     // Increased for smoother rotation deceleration
};

const BATTLE_AREA = {
    SIZE: 300,
    ENEMY_SPAWN_DISTANCE_MIN: 50,
    ENEMY_COUNT: 10
};

const WEAPONS = {
    LASER_SPEED: 2,
    LASER_RANGE: 100,
    LASER_DAMAGE: 25,
    LASER_FIRE_RATE: 250,
    MISSILE_SPEED: 1.2,
    MISSILE_LIFETIME: 300,
    MISSILE_COUNT: 5,
    MISSILE_RELOAD_TIME: 5000,
    MISSILE_DAMAGE_NORMAL: 200,
    MISSILE_DAMAGE_ELITE: 100
};

// ===== GAME STATE =====
const gameState = {
    scene: null,
    camera: null,
    renderer: null,
    playerShip: null,
    enemies: [],
    explosions: [],
    lasers: [],
    missiles: [],
    score: 0,
    shields: 100,
    gameOver: false,

    // Movement and physics
    velocity: new THREE.Vector3(0, 0, 0),
    acceleration: new THREE.Vector3(0, 0, 0),
    rotationVelocity: new THREE.Vector3(0, 0, 0),
    currentSpeed: 0,
    isMoving: false,
    thrusterActive: false,

    // Missile system
    availableMissiles: WEAPONS.MISSILE_COUNT,
    missileTarget: null,
    missileTargetIndicator: null,
    missileTargetLocked: false,

    // Controls
    keys: {},
    mouseX: 0,
    mouseY: 0,
    targetRotationX: 0,
    targetRotationY: 0,

    // Effects
    thrusterParticles: null,

    // Object pools
    laserPool: [],
    missilePool: [],

    // Reusable objects (to avoid garbage collection)
    reusableVec3: new THREE.Vector3(),
    reusableVec3_2: new THREE.Vector3(),
    reusableQuat: new THREE.Quaternion()
};

// ===== GEOMETRY CACHE =====
const geometryCache = {
    laser: null,
    missile: null,
    initGeometries: function() {
        // Create reusable laser geometry
        this.laser = new THREE.BufferGeometry();
        this.laser.setAttribute('position', new THREE.Float32BufferAttribute([
            0, 0, 0,
            0, 0, -18
        ], 3));

        // Create reusable missile geometry
        this.missile = new THREE.BufferGeometry();
        const missileVertices = new Float32Array([
            0, 0, -1,  // Tip
            -0.2, 0, 0,
            0.2, 0, 0,
            0, 0.2, 0,
            0, -0.2, 0,
            0, 0, 0.5   // Rear
        ]);

        const missileIndices = [
            0, 1, 0, 2, 0, 3, 0, 4, // Front to middle
            5, 1, 5, 2, 5, 3, 5, 4  // Rear to middle
        ];

        this.missile.setAttribute('position', new THREE.BufferAttribute(missileVertices, 3));
        this.missile.setIndex(missileIndices);
    }
};

// ===== INITIALIZATION =====

// Initialize the game when the window loads
window.onload = init;

// Setup event listeners
function setupEventListeners() {
    // Movement controls
    document.addEventListener('keydown', (e) => { gameState.keys[e.key] = true; });
    document.addEventListener('keyup', (e) => {
        gameState.keys[e.key] = false;

        // Restart game when 'R' is pressed and game is over
        if (e.key === 'r' && gameState.gameOver) {
            restartGame();
        }
    });

    // Mouse controls for aiming
    document.addEventListener('mousemove', handleMouseMove);

    // Lock pointer for better FPS controls
    document.getElementById('gameCanvas').addEventListener('click', () => {
        document.getElementById('gameCanvas').requestPointerLock();
    });

    // Window resize handler
    window.addEventListener('resize', onWindowResize);
}

function handleMouseMove(e) {
    // Use pointer lock API for more consistent mouse control
    if (document.pointerLockElement === document.getElementById('gameCanvas')) {
        // Use movementX/Y for better control with improved sensitivity and smoothing
        // Negative movementX for yaw to make turning feel more natural
        gameState.rotationVelocity.y -= e.movementX * 0.0015;
        // Negative movementY for pitch to make looking up/down feel natural
        gameState.rotationVelocity.x -= e.movementY * 0.0015;
        
        // Clamp rotation velocity to prevent excessive spinning
        gameState.rotationVelocity.x = THREE.MathUtils.clamp(gameState.rotationVelocity.x, -0.5, 0.5);
        gameState.rotationVelocity.y = THREE.MathUtils.clamp(gameState.rotationVelocity.y, -0.5, 0.5);
    } else {
        // Fallback to traditional mouse position with improved sensitivity
        gameState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        gameState.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

        // Update target rotation based on mouse position with better sensitivity
        gameState.targetRotationX = gameState.mouseY * 2.0; // Pitch
        gameState.targetRotationY = gameState.mouseX * 2.0; // Yaw
    }
}

// Initialize the game
function init() {
    // Initialize scene, camera, and renderer
    initializeRenderer();

    // Initialize geometry cache
    geometryCache.initGeometries();

    // Add starfield
    createStarfield();

    // Create player ship
    gameState.playerShip = createPlayerShip();
    gameState.scene.add(gameState.playerShip);

    // Create initial enemies
    for (let i = 0; i < BATTLE_AREA.ENEMY_COUNT; i++) {
        createEnemy();
    }

    // Initialize missile target indicator
    gameState.missileTargetIndicator = document.querySelector('.target-indicator');

    // Setup event listeners
    setupEventListeners();

    // Initialize object pools
    initializeObjectPools();

    // Start game loop
    animate();
}

function initializeRenderer() {
    // Create scene
    gameState.scene = new THREE.Scene();

    // Create camera
    gameState.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

    // Create renderer
    gameState.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('gameCanvas'),
        antialias: true
    });
    gameState.renderer.setSize(window.innerWidth, window.innerHeight);
    gameState.renderer.setClearColor(0x000000);
}

function initializeObjectPools() {
    // Initialize laser pool
    for (let i = 0; i < 20; i++) {
        const laserMaterial = new THREE.LineBasicMaterial({ color: COLORS.LASER });
        const laser = new THREE.Line(geometryCache.laser.clone(), laserMaterial);
        laser.visible = false;
        laser.userData = { active: false, direction: new THREE.Vector3(), distance: 0 };
        gameState.scene.add(laser);
        gameState.laserPool.push(laser);
    }

    // Initialize missile pool
    for (let i = 0; i < WEAPONS.MISSILE_COUNT; i++) {
        const missileMaterial = new THREE.LineBasicMaterial({ color: COLORS.MISSILE });
        const missile = new THREE.LineSegments(geometryCache.missile.clone(), missileMaterial);
        missile.visible = false;
        missile.userData = {
            active: false,
            target: null,
            speed: WEAPONS.MISSILE_SPEED,
            lifeTime: 0,
            maxLifeTime: WEAPONS.MISSILE_LIFETIME
        };
        gameState.scene.add(missile);
        gameState.missilePool.push(missile);
    }
}

function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: COLORS.STAR,
        size: 1,
        sizeAttenuation: false
    });

    const starVertices = [];
    for (let i = 0; i < 3000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    gameState.scene.add(stars);
}

function createPlayerShip() {
    // Create geometry for a wireframe ship
    const geometry = new THREE.BufferGeometry();

    // Simple ship shape vertices
    const vertices = new Float32Array([
        // Front point
        0, 0, -3,

        // Wing points
        -2, 0, 1,
        2, 0, 1,

        // Rear points
        0, 1, 2,
        0, -1, 2,

        // Additional cockpit details for more retro look
        -0.5, 0.5, -1.5, // Cockpit frame
        0.5, 0.5, -1.5,
        0.5, -0.5, -1.5,
        -0.5, -0.5, -1.5
    ]);

    // Ship edges
    const indices = [
        0, 1, 0, 2, // Front to wings
        1, 3, 1, 4, // Left wing to rear
        2, 3, 2, 4, // Right wing to rear
        3, 4,          // Connect rear points
        5, 6, 6, 7, 7, 8, 8, 5 // Cockpit frame
    ];

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    // Use bright cyan for player ship - stands out from enemies
    const material = new THREE.LineBasicMaterial({
        color: COLORS.PLAYER,
        linewidth: 2 // Thicker lines for better visibility
    });

    return new THREE.LineSegments(geometry, material);
}

function createEnemy() {
    // Create geometry for a wireframe enemy ship
    const geometry = new THREE.BufferGeometry();

    // Simple enemy shape vertices - octahedron-inspired
    const vertices = new Float32Array([
        // Front point
        0, 0, -2,

        // Middle points
        -1, 1, 0,
        1, 1, 0,
        1, -1, 0,
        -1, -1, 0,

        // Rear point
        0, 0, 2
    ]);

    // Enemy ship edges
    const indices = [
        0, 1, 0, 2, 0, 3, 0, 4, // Front to middle
        5, 1, 5, 2, 5, 3, 5, 4, // Rear to middle
        1, 2, 2, 3, 3, 4, 4, 1  // Connect middle points
    ];

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    // Use retro color scheme - enemies are red/orange
    const material = new THREE.LineBasicMaterial({
        color: COLORS.ENEMY_NORMAL, // Orange-red color for enemies
        linewidth: 1.5 // Thicker lines for better visibility
    });
    const enemy = new THREE.LineSegments(geometry, material);

    // Ensure enemies don't spawn too close to player
    let validPosition = false;
    while (!validPosition) {
        // Position randomly in space but keep within a reasonable battle area
        enemy.position.set(
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 150 - 50 // Bias enemies to be in front of player
        );

        // Check distance from player
        const distanceToPlayer = enemy.position.distanceTo(gameState.playerShip.position);
        if (distanceToPlayer > BATTLE_AREA.ENEMY_SPAWN_DISTANCE_MIN) {
            validPosition = true;
        }
    }

    // Store velocity for movement and other properties
    enemy.userData = {
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3
        ),
        health: 100,
        type: Math.random() > 0.7 ? 'elite' : 'normal', // Add different enemy types
        lastRenderDistance: 0 // Track last render distance to prevent flickering
    };

    // Make elite enemies more challenging and visually distinct
    if (enemy.userData.type === 'elite') {
        enemy.userData.health = 200;
        material.color.set(COLORS.ENEMY_ELITE); // Yellow for elite enemies
        // Scale elite enemies to be slightly larger
        enemy.scale.set(1.5, 1.5, 1.5);
    }

    gameState.scene.add(enemy);
    gameState.enemies.push(enemy);

    // Add to radar
    updateRadar();
}

    function fireLaser() {
    // Get a laser from the pool
    const laser = getLaserFromPool();
    if (!laser) return; // No lasers available in pool

    // Make laser visible and active
    laser.visible = true;
    laser.userData.active = true;
    laser.userData.distance = 0;

    // Position at ship's front
    laser.position.copy(gameState.playerShip.position);
    laser.rotation.copy(gameState.playerShip.rotation);

    // Set laser direction based on ship's orientation
    gameState.reusableVec3.set(0, 0, -1);
    gameState.reusableVec3.applyQuaternion(gameState.playerShip.quaternion);
    laser.userData.direction.copy(gameState.reusableVec3);
}

function getLaserFromPool() {
    // Find an inactive laser in the pool
    for (let i = 0; i < gameState.laserPool.length; i++) {
        if (!gameState.laserPool[i].userData.active) {
            return gameState.laserPool[i];
        }
    }
    return null; // No inactive lasers available
}

function updateRadar() {
    // Clear previous blips
    const radar = document.getElementById('radar');
    const enemyBlips = document.querySelectorAll('.enemy-blip');
    enemyBlips.forEach(blip => blip.remove());

    // Add enemy blips
    gameState.enemies.forEach(enemy => {
        // Calculate relative position
        gameState.reusableVec3.copy(enemy.position).sub(gameState.playerShip.position);
        const distance = gameState.reusableVec3.length();

        // Get player's orientation vectors
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(gameState.playerShip.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(gameState.playerShip.quaternion);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(gameState.playerShip.quaternion);

        // Project enemy position onto player's local coordinate system
        const x = gameState.reusableVec3.dot(right);
        const z = gameState.reusableVec3.dot(forward);

        // Scale for radar display (smaller divisor = larger radar range)
        const radarScale = 60;
        const radarX = x / radarScale;
        const radarZ = z / radarScale;

        // Calculate 2D distance on radar
        const distance2D = Math.sqrt(radarX * radarX + radarZ * radarZ);
        
        // Only show if within radar range (1.0 = edge of radar)
        if (distance2D < 1.0) {
            const blip = document.createElement('div');
            blip.className = 'enemy-blip';
            
            // Position blip on radar (center = 50%)
            blip.style.left = `${50 + radarX * 50}%`;
            blip.style.top = `${50 - radarZ * 50}%`;
            
            // Adjust blip appearance based on distance
            const size = Math.max(3, 6 - (distance / 100));
            blip.style.width = `${size}px`;
            blip.style.height = `${size}px`;
            
            // Make blips fade with distance
            const opacity = Math.max(0.4, 1 - (distance / 300));
            blip.style.opacity = opacity;
            
            // Add blip to radar
            radar.appendChild(blip);
        }
    });
}

function onWindowResize() {
    gameState.camera.aspect = window.innerWidth / window.innerHeight;
    gameState.camera.updateProjectionMatrix();
    gameState.renderer.setSize(window.innerWidth, window.innerHeight);
}

function handleControls() {
    if (gameState.gameOver) return;

    gameState.isMoving = false;

    // Handle roll separately from pitch and yaw for better control
    // Only modify roll when Q or E is pressed, not affected by mouse
    if (gameState.keys['q']) gameState.rotationVelocity.z += PHYSICS.ROTATION_ACCELERATION; // Roll left
    if (gameState.keys['e']) gameState.rotationVelocity.z -= PHYSICS.ROTATION_ACCELERATION; // Roll right
    
    // Clamp roll velocity to prevent excessive rolling
    gameState.rotationVelocity.z = THREE.MathUtils.clamp(gameState.rotationVelocity.z, -0.5, 0.5);
    
    // Apply rotation with improved smoothing
    // Create a quaternion for each axis to prevent gimbal lock
    const pitchQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(gameState.rotationVelocity.x));
    const yawQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(gameState.rotationVelocity.y));
    const rollQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(gameState.rotationVelocity.z));
    
    // Apply rotations in the correct order to prevent unwanted interactions
    gameState.playerShip.quaternion.premultiply(yawQuat);
    gameState.playerShip.quaternion.premultiply(pitchQuat);
    gameState.playerShip.quaternion.premultiply(rollQuat);
    
    // Apply stronger deceleration for smoother stops
    gameState.rotationVelocity.multiplyScalar(PHYSICS.ROTATION_DECELERATION);


    // Reset acceleration
    gameState.acceleration.set(0, 0, 0);  //Use a temp vector

    // Targeting and missiles
    if (gameState.keys['t']) {
        findNearestTarget();
    }
    if (gameState.keys['m'] && gameState.missileTarget && gameState.availableMissiles > 0 && gameState.missileTargetLocked) {
        fireMissile();
        gameState.availableMissiles--;
        document.getElementById('missile-indicator').textContent = `MISSILES: ${gameState.availableMissiles}`;

        // Start missile reload timer
        setTimeout(() => {
            if (gameState.availableMissiles < WEAPONS.MISSILE_COUNT) {
                gameState.availableMissiles++;
                document.getElementById('missile-indicator').textContent = `MISSILES: ${gameState.availableMissiles}`;
            }
        }, WEAPONS.MISSILE_RELOAD_TIME);
    }
    updateMissileIndicator();  // Call the update function every frame

    // Thrust - using WASD for movement
    if (gameState.keys['w']) {
        gameState.reusableVec3.set(0, 0, -1).applyQuaternion(gameState.playerShip.quaternion);
        gameState.acceleration.addScaledVector(gameState.reusableVec3, PHYSICS.ACCELERATION_RATE);
        gameState.isMoving = true;
        gameState.thrusterActive = true;
    } else if (gameState.keys['s']) {
        gameState.reusableVec3.set(0, 0, 1).applyQuaternion(gameState.playerShip.quaternion);
        gameState.acceleration.addScaledVector(gameState.reusableVec3, PHYSICS.ACCELERATION_RATE);
        gameState.isMoving = true;
        gameState.thrusterActive = true;
    } else {
        gameState.thrusterActive = false;
    }

    if (gameState.keys['a']) {
        gameState.reusableVec3.set(-1, 0, 0).applyQuaternion(gameState.playerShip.quaternion);
        gameState.acceleration.addScaledVector(gameState.reusableVec3, PHYSICS.ACCELERATION_RATE);
        gameState.isMoving = true;
        gameState.thrusterActive = true;
    }
    if (gameState.keys['d']) {
        gameState.reusableVec3.set(1, 0, 0).applyQuaternion(gameState.playerShip.quaternion);
        gameState.acceleration.addScaledVector(gameState.reusableVec3, PHYSICS.ACCELERATION_RATE);
        gameState.isMoving = true;
        gameState.thrusterActive = true;
    }

    // Apply acceleration and deceleration
    gameState.velocity.add(gameState.acceleration);
    if (!gameState.isMoving) {
        gameState.velocity.multiplyScalar(1 - PHYSICS.DECELERATION_RATE);
    }

    // Limit speed
    const speed = gameState.velocity.length();
    if (speed > PHYSICS.MAX_SPEED) {
        gameState.velocity.multiplyScalar(PHYSICS.MAX_SPEED / speed);
    }
    gameState.currentSpeed = speed * 100;

    // Update HUD elements
    document.getElementById('speed-indicator').textContent = `SPEED: ${Math.round(gameState.currentSpeed)}`;

   // Add thruster visual effect
    if (gameState.thrusterActive) {
        // Create thruster particles if they don't exist
        if (!gameState.thrusterParticles) {
            const particleGeometry = new THREE.BufferGeometry();
            const particleVertices = [];

            // Create 50 particles for the thruster effect
            for (let i = 0; i < 50; i++) {
                particleVertices.push(0, 0, 0); // All start at origin
            }

            particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particleVertices, 3));
            const particleMaterial = new THREE.PointsMaterial({
                color: 0x00ffff,
                size: 0.5,
                transparent: true,
                opacity: 0.8
            });

            gameState.thrusterParticles = new THREE.Points(particleGeometry, particleMaterial);
            gameState.playerShip.add(gameState.thrusterParticles);
            gameState.thrusterParticles.position.z = 2; // Position at the back of the ship
        }

        // Animate thruster particles
        const positions = gameState.thrusterParticles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            // Move particles backward
            positions[i + 2] += 0.1;

            // Reset particles that go too far
            if (positions[i + 2] > 5) {
                positions[i] = (Math.random() - 0.5) * 0.5; // Random X
                positions[i + 1] = (Math.random() - 0.5) * 0.5; // Random Y
                positions[i + 2] = 0; // Reset Z
            }
        }
        gameState.thrusterParticles.geometry.attributes.position.needsUpdate = true;
        gameState.thrusterParticles.visible = true;
    } else if (gameState.thrusterParticles) {
        gameState.thrusterParticles.visible = false;
    }

    // Laser shooting with proper fire rate limiting
    if (gameState.keys[' ']) {
        // Initialize lastFired if it doesn't exist
        if (gameState.lastFired === undefined) {
            gameState.lastFired = 0;
        }
        
        // Check if enough time has passed since last fire
        const currentTime = performance.now();
        if (currentTime - gameState.lastFired > WEAPONS.LASER_FIRE_RATE) {
            fireLaser();
            gameState.lastFired = currentTime;
        }
    }
}

function updateMissileIndicator() {
    if (gameState.missileTarget) {
        const screenPosition = getScreenPosition(gameState.missileTarget.position, gameState.camera, gameState.renderer.domElement);
        gameState.missileTargetIndicator.style.display = 'block';
        gameState.missileTargetIndicator.style.left = `${screenPosition.x}px`;
        gameState.missileTargetIndicator.style.top = `${screenPosition.y}px`;

        // Calculate distance to target
        const distance = gameState.missileTarget.position.distanceTo(gameState.playerShip.position);

        // Lock target if close enough and in front of player
        gameState.reusableVec3.set(0, 0, -1).applyQuaternion(gameState.playerShip.quaternion); // Forward vector
        gameState.reusableVec3_2.copy(gameState.missileTarget.position).sub(gameState.playerShip.position).normalize(); // Vector to target
        const dotProduct = gameState.reusableVec3.dot(gameState.reusableVec3_2);

        if (distance < 150 && dotProduct > 0.7) {
            gameState.missileTargetLocked = true;
            gameState.missileTargetIndicator.classList.add('locked');
        } else {
            gameState.missileTargetLocked = false;
            gameState.missileTargetIndicator.classList.remove('locked');
        }
    } else {
        gameState.missileTargetIndicator.style.display = 'none';
        gameState.missileTargetLocked = false;
    }
}

function findNearestTarget() {
    gameState.missileTarget = null;
    gameState.missileTargetLocked = false;

    let nearestDistance = Infinity;
    gameState.reusableVec3.set(0, 0, -1).applyQuaternion(gameState.playerShip.quaternion); // Forward

    gameState.enemies.forEach(enemy => {
        gameState.reusableVec3_2.copy(enemy.position).sub(gameState.playerShip.position); // toEnemy
        const distance = gameState.reusableVec3_2.length();
        const dotProduct = gameState.reusableVec3.dot(gameState.reusableVec3_2.normalize());

        if (dotProduct > 0.5 && distance < 200 && distance < nearestDistance) {
            nearestDistance = distance;
            gameState.missileTarget = enemy;
        }
    });

    if (gameState.missileTarget) {
        gameState.missileTargetIndicator.style.display = 'block';
    } else {
        gameState.missileTargetIndicator.style.display = 'none';
    }
}


function fireMissile() {
  // Check if we have a valid target that's locked
  if (!gameState.missileTarget) {
    console.log("No missile target selected. Press T to target an enemy.");
    return;
  }
  
  if (!gameState.missileTargetLocked) {
    console.log("Target not locked. Get closer to target and keep it in view.");
    return;
  }

  // Get missile from the pool
  const missile = getMissileFromPool();
  if (!missile) {
    console.log("No missiles available in pool.");
    return; // No available missiles
  }

  // Activate missile
  missile.visible = true;
  missile.userData.active = true;
  missile.userData.target = gameState.missileTarget;
  missile.userData.lifeTime = 0;

  // Position and orient at ship
  missile.position.copy(gameState.playerShip.position);
  missile.quaternion.copy(gameState.playerShip.quaternion);
  
  // Add a small forward offset to prevent collisions with player ship
  const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(gameState.playerShip.quaternion);
  missile.position.addScaledVector(forwardVector, 3);

  // Reset target lock, since missile is fired
  gameState.missileTargetLocked = false;
  
  console.log("Missile fired!");
}


function getMissileFromPool() {
    for (let i = 0; i < gameState.missilePool.length; i++) {
        if (!gameState.missilePool[i].userData.active) {
            return gameState.missilePool[i];
        }
    }
    return null;
}

function getScreenPosition(position, camera, canvas) {
    gameState.reusableVec3.copy(position);
    gameState.reusableVec3.project(camera);

    const x = (gameState.reusableVec3.x * 0.5 + 0.5) * canvas.clientWidth;
    const y = (gameState.reusableVec3.y * -0.5 + 0.5) * canvas.clientHeight;

    return { x, y };
}

function updateMissiles() {
    for (let i = gameState.missiles.length - 1; i >= 0; i--) {
        const missile = gameState.missiles[i];
        const target = missile.userData.target;

        // Check if target still exists
        if (!target || !gameState.scene.children.includes(target)) {
            returnMissileToPool(missile);
            gameState.missiles.splice(i, 1);
            continue;
        }

        // Calculate direction to target
        gameState.reusableVec3.copy(target.position).sub(missile.position).normalize();

        // Gradually rotate missile towards target
        gameState.reusableVec3_2.set(0, 0, -1).applyQuaternion(missile.quaternion); // Current direction
        const newDirection = gameState.reusableVec3_2.lerp(gameState.reusableVec3, 0.05); // Smooth turning

        // Set new rotation
        missile.quaternion.setFromUnitVectors(gameState.reusableVec3_2.set(0,0,-1).normalize(), newDirection.normalize());

        // Move missile forward
        gameState.reusableVec3_2.set(0, 0, -1).applyQuaternion(missile.quaternion); // Use reusable vector
        missile.position.addScaledVector(gameState.reusableVec3_2, missile.userData.speed);

        // Increment lifetime
        missile.userData.lifeTime++;

        // Check for collision with target
        const distanceToTarget = missile.position.distanceTo(target.position);
        if (distanceToTarget < 2) {
            // Hit target
            const damage = target.userData.type === 'elite' ? WEAPONS.MISSILE_DAMAGE_ELITE : WEAPONS.MISSILE_DAMAGE_NORMAL;
            target.userData.health -= damage;

            // Return missile to pool
            returnMissileToPool(missile);
            gameState.missiles.splice(i, 1);

            // Create explosion effect
            createExplosion(target.position.clone());

            // Check if enemy destroyed
            if (target.userData.health <= 0) {
                // Remove enemy
                gameState.scene.remove(target);
                gameState.enemies.splice(gameState.enemies.indexOf(target), 1);

                // Update score
                gameState.score += target.userData.type === 'elite' ? 200 : 100;
                document.getElementById('score').textContent = `SCORE: ${gameState.score}`;

                // Create new enemy to replace destroyed one
                createEnemy();

                // Reset missile target if it was this enemy
                if (gameState.missileTarget === target) {
                    gameState.missileTarget = null;
                    gameState.missileTargetIndicator.style.display = 'none';
                }
            }
        }

        // Check if missile has exceeded its lifetime
        if (missile.userData.lifeTime > missile.userData.maxLifeTime) {
           returnMissileToPool(missile);
            gameState.missiles.splice(i, 1);
        }
    }
}

function returnMissileToPool(missile) {
    missile.visible = false;
    missile.userData.active = false;
    missile.userData.target = null; // Important: Clear the target
    missile.userData.lifeTime = 0;
}

function createExplosion(position) {
    const particleCount = 20;
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < particleCount; i++) {
        vertices.push(0, 0, 0);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
        color: 0xffaa00,
        size: 1.5,
        transparent: true,
        opacity: 1
    });

    const particles = new THREE.Points(geometry, material);
    particles.position.copy(position);

    particles.userData = {
        velocity: [],
        lifeTime: 0,
        maxLifeTime: 30
    };

    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3
        );
        particles.userData.velocity.push(velocity);
    }

    gameState.scene.add(particles);
    gameState.explosions.push(particles); // Use gameState.explosions
}

function updateExplosions() {
  if (!gameState.explosions) return;

  for (let i = gameState.explosions.length - 1; i >= 0; i--) {
    const explosion = gameState.explosions[i];
    const positions = explosion.geometry.attributes.position.array;

    for (let j = 0; j < positions.length; j += 3) {
      const velocityIndex = j / 3;
      positions[j] += explosion.userData.velocity[velocityIndex].x;
      positions[j + 1] += explosion.userData.velocity[velocityIndex].y;
      positions[j + 2] += explosion.userData.velocity[velocityIndex].z;
    }

    explosion.material.opacity -= 0.03; // Fade out
    explosion.userData.lifeTime++;
    explosion.geometry.attributes.position.needsUpdate = true;

    if (explosion.userData.lifeTime > explosion.userData.maxLifeTime) {
      gameState.scene.remove(explosion);
      gameState.explosions.splice(i, 1);
    }
  }
}

function updateLasers() {
    //Iterate through the lasers backwards so we can remove with .splice()
    for (let i = gameState.lasers.length - 1; i >= 0; i--) {
        const laser = gameState.lasers[i];

        // Move laser based on its direction
        laser.position.addScaledVector(laser.userData.direction, WEAPONS.LASER_SPEED);
        laser.userData.distance += WEAPONS.LASER_SPEED;

        // Check for collision with enemies
        for (let j = gameState.enemies.length - 1; j >= 0; j--) {
            const enemy = gameState.enemies[j];
            const distance = laser.position.distanceTo(enemy.position);

            if (distance < 2) {
                // Hit enemy - apply damage
                enemy.userData.health -= WEAPONS.LASER_DAMAGE;

                //Return laser to the pool
                returnLaserToPool(laser);
                gameState.lasers.splice(i, 1); //Remove the used laser

                // Create explosion effect
                createExplosion(enemy.position);

                // Check for enemy destroyed
                if (enemy.userData.health <= 0) {
                    gameState.scene.remove(enemy);
                    gameState.enemies.splice(j, 1);

                    // Update score
                    gameState.score += enemy.userData.type === 'elite' ? 200 : 100;
                    document.getElementById('score').textContent = `SCORE: ${gameState.score}`;
                    createEnemy();  //Maintain enemy count

                     // Reset missile target if it was this enemy
                    if (gameState.missileTarget === enemy) {
                        gameState.missileTarget = null;
                        gameState.missileTargetIndicator.style.display = 'none';
                    }
                }
                break; // Exit inner loop - laser can hit only one enemy
            }
        }

        // Remove laser if it goes out of range
        if (laser.userData.distance > WEAPONS.LASER_RANGE) {
            // Return to pool
            returnLaserToPool(laser);
            gameState.lasers.splice(i, 1);
        }
    }
}

function returnLaserToPool(laser) {
    laser.visible = false;
    laser.userData.active = false;
    laser.userData.distance = 0;
}

function updateEnemies() {
    for (const enemy of gameState.enemies) {
        // Move enemy based on its velocity
        enemy.position.add(enemy.userData.velocity);

        // Make enemies orient towards player, but slower
        gameState.reusableVec3.copy(gameState.playerShip.position).sub(enemy.position).normalize(); // To player.
        gameState.reusableVec3_2.set(0,0,-1).applyQuaternion(enemy.quaternion);  //Enemy's current forward vector
        gameState.reusableQuat.setFromUnitVectors(gameState.reusableVec3_2, gameState.reusableVec3); //Calc rotation
        
        // Slow down enemy rotation by using slerp with a small factor
        const slowRotation = new THREE.Quaternion();
        slowRotation.copy(enemy.quaternion);
        slowRotation.slerp(enemy.quaternion.clone().multiply(gameState.reusableQuat), 0.02); // Reduced rotation speed
        enemy.quaternion.copy(slowRotation);

        // Simple boundary check and reposition
        if (enemy.position.length() > BATTLE_AREA.SIZE) {
          enemy.position.setLength(BATTLE_AREA.SIZE);  // Bring back into radius
        }

        //Check distance, if too close, move away
        const distanceToPlayer = enemy.position.distanceTo(gameState.playerShip.position);

        // Simple enemy AI - avoid player
        if (distanceToPlayer < 20) {
            gameState.reusableVec3.copy(enemy.position).sub(gameState.playerShip.position).normalize().multiplyScalar(0.2);
            enemy.userData.velocity.add(gameState.reusableVec3);  //Add to existing
        }
    }
}

// Check for player collisions
function checkCollisions() {
  if (gameState.gameOver) return;

  for (const enemy of gameState.enemies) {
      const distance = gameState.playerShip.position.distanceTo(enemy.position);

      // Collision detection
      if (distance < 2.5) { // Collision!
          gameState.shields -= 20; // Reduce shield on collision
          document.getElementById('shields').textContent = `SHIELDS: ${gameState.shields}`;

            // Create explosion effect
            createExplosion(enemy.position);

          if (gameState.shields <= 0) {
              // Game over
              gameOver();
          } else {
             // Flash screen red
            document.getElementById('screen-flash').style.backgroundColor = 'red';
            document.getElementById('screen-flash').style.opacity = 0.8;
             // Fade out quickly
            setTimeout(() => {
                document.getElementById('screen-flash').style.opacity = 0;
            }, 150);
          }

          // Remove the colliding enemy
          gameState.scene.remove(enemy);
          gameState.enemies.splice(gameState.enemies.indexOf(enemy), 1);
          createEnemy(); // Add new enemy to maintain numbers

            // Reset missile target if it was this enemy
            if (gameState.missileTarget === enemy) {
                gameState.missileTarget = null;
                gameState.missileTargetIndicator.style.display = 'none';
            }
          break; // Check only one collision per frame
      }
  }
}

function gameOver() {
    gameState.gameOver = true;
    document.getElementById('game-over-overlay').style.display = 'flex';
    document.exitPointerLock();  //Release pointer lock

}

function restartGame() {
    // Reset game state
    gameState.score = 0;
    gameState.shields = 100;
    gameState.gameOver = false;
    gameState.availableMissiles = WEAPONS.MISSILE_COUNT;
    gameState.velocity.set(0, 0, 0);
    gameState.acceleration.set(0, 0, 0);
    gameState.rotationVelocity.set(0,0,0);
    gameState.currentSpeed = 0;
    gameState.isMoving = false;
    gameState.keys = {}; // Clear all keys
    gameState.missileTarget = null;
    gameState.missileTargetLocked = false;

    //Reset HUD
    document.getElementById('score').textContent = `SCORE: ${gameState.score}`;
    document.getElementById('shields').textContent = `SHIELDS: ${gameState.shields}`;
    document.getElementById('missile-indicator').textContent = `MISSILES: ${gameState.availableMissiles}`;

    // Reset ship position and rotation
    gameState.playerShip.position.set(0, 0, 0);
    gameState.playerShip.rotation.set(0, 0, 0);

    // Remove and clear enemies
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        gameState.scene.remove(gameState.enemies[i]);
    }
    gameState.enemies = [];

    //Remove all lasers
    for (let i = gameState.lasers.length-1; i>=0; i--){
        gameState.scene.remove(gameState.lasers[i]);
        returnLaserToPool(gameState.lasers[i]);
    }
    gameState.lasers = [];

    //Remove all missiles
    for (let i = gameState.missiles.length-1; i>=0; i--){
        gameState.scene.remove(gameState.missiles[i]);
        returnMissileToPool(gameState.missiles[i]);
    }
     gameState.missiles = [];

    // Remove all explosions
    for (let i = gameState.explosions.length - 1; i >= 0; i--) {
        gameState.scene.remove(gameState.explosions[i]);
    }
    gameState.explosions = [];

    // Recreate enemies
    for (let i = 0; i < BATTLE_AREA.ENEMY_COUNT; i++) {
        createEnemy();
    }

    // Hide game over overlay
    document.getElementById('game-over-overlay').style.display = 'none';

     // Hide missile indicator
    gameState.missileTargetIndicator.style.display = 'none';

    // Reset thruster
    if (gameState.thrusterParticles) {
      gameState.thrusterParticles.visible = false;
    }
}

// Main animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update game logic
    handleControls();

    // Apply movement to the ship
    gameState.playerShip.position.add(gameState.velocity);

    // Restrict player to battle area - simple sphere
    if(gameState.playerShip.position.length() > BATTLE_AREA.SIZE){
        gameState.playerShip.position.setLength(BATTLE_AREA.SIZE);
        gameState.velocity.multiplyScalar(-0.5); // Bounce back
    }

    updateEnemies();
    updateLasers();
    checkCollisions();  //Check collisions before updating the lasers
    updateMissiles();
    updateExplosions();
    updateRadar();

    // First-person view from inside the ship
    gameState.camera.position.copy(gameState.playerShip.position);
    
    // Set camera direction based on ship's orientation
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(gameState.playerShip.quaternion);
    
    // Position camera slightly above the ship's center for better view
    gameState.camera.position.y += 0.5;
    
    // Look in the direction the ship is facing
    gameState.camera.lookAt(gameState.playerShip.position.clone().add(forward));

    // Render
    gameState.renderer.render(gameState.scene, gameState.camera);

    //Add used lasers to the lasers array for updating.
    for (let i=0; i< gameState.laserPool.length; i++){
        if(gameState.laserPool[i].userData.active && !gameState.lasers.includes(gameState.laserPool[i])){
            gameState.lasers.push(gameState.laserPool[i]);
        }
    }

     //Add used missiles to the missiles array for updating.
    for (let i=0; i< gameState.missilePool.length; i++){
        if(gameState.missilePool[i].userData.active && !gameState.missiles.includes(gameState.missilePool[i])){
            gameState.missiles.push(gameState.missilePool[i]);
        }
    }
}